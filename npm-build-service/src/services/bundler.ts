import * as esbuild from 'esbuild';
import path from 'node:path';
import fs from 'node:fs/promises';
import { config } from '../config.js';
import { BuildError } from '../types/build.js';

export interface BundleResult {
  sizeBytes: number;
}

export async function bundleProject(buildDir: string): Promise<BundleResult> {
  const outdir = path.join(buildDir, 'dist');

  try {
    await esbuild.build({
      entryPoints: [path.join(buildDir, 'src', 'entry.ts')],
      outfile: path.join(outdir, 'index.js'),
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: ['es2020'],
      minify: true,
      sourcemap: true,
      external: [...config.externalDependencies],
      jsx: 'automatic',
      tsconfig: path.join(buildDir, 'tsconfig.json'),
      metafile: true,
      logLevel: 'warning',
    });

    // Try to generate type declarations via tsc (non-fatal if fails)
    await generateDeclarations(buildDir);

    const stat = await fs.stat(path.join(outdir, 'index.js'));

    return {
      sizeBytes: stat.size,
    };
  } catch (error) {
    const err = error as { errors?: esbuild.Message[]; message?: string };
    const details = err.errors?.map((e) => e.text).join('\n') ?? err.message;
    throw new BuildError('BUNDLE', 'Bundle compilation failed', details);
  }
}

async function generateDeclarations(buildDir: string): Promise<void> {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const execFileAsync = promisify(execFile);

  try {
    const tscPath = path.join(buildDir, 'node_modules', '.bin', 'tsc');
    await execFileAsync(
      tscPath,
      ['--emitDeclarationOnly', '--declaration', '--outDir', 'dist'],
      { cwd: buildDir, timeout: 30_000 },
    );
  } catch {
    // Declaration generation failure is non-fatal
    console.warn('Type declaration generation failed (non-fatal)');
  }
}
