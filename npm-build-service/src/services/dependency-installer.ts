import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { BuildError } from '../types/build.js';

const execFileAsync = promisify(execFile);

export async function installDependencies(
  buildDir: string,
  timeoutMs: number,
): Promise<void> {
  try {
    await execFileAsync(
      'npm',
      ['install', '--ignore-scripts', '--no-fund', '--no-audit'],
      {
        cwd: buildDir,
        timeout: timeoutMs,
        env: {
          ...process.env,
          HOME: buildDir,
          npm_config_cache: `${buildDir}/.npm-cache`,
        },
      },
    );
  } catch (error) {
    const err = error as { stderr?: string; message?: string };
    throw new BuildError(
      'INSTALL',
      'Dependency installation failed',
      err.stderr ?? err.message,
    );
  }
}
