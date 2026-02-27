import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import { config } from '../config.js';
import { generateProject } from './project-generator.js';
import { installDependencies } from './dependency-installer.js';
import { bundleProject } from './bundler.js';
import { packAndPublish } from './packager.js';
import type { BuildRequest, BuildResponse } from '../types/build.js';

export async function executeBuild(
  req: BuildRequest,
): Promise<BuildResponse> {
  const buildId = randomUUID();
  const buildDir = path.join(config.build.tempDir, buildId);
  const startTime = Date.now();

  try {
    // Phase 1: SETUP - generate project structure in temp dir
    await generateProject(buildDir, req);

    // Phase 2: INSTALL - npm install dependencies
    await installDependencies(buildDir, config.build.timeoutMs);

    // Phase 3: BUNDLE - esbuild compile TypeScript/React to ESM
    const bundleResult = await bundleProject(buildDir);

    // Phase 4: PUBLISH - npm pack + publish to Nexus
    const publishResult = await packAndPublish(buildDir, req);

    return {
      success: true,
      npmPackageRef: publishResult.npmPackageRef,
      packageName: publishResult.packageName,
      packageVersion: publishResult.packageVersion,
      buildDurationMs: Date.now() - startTime,
      bundleSizeBytes: bundleResult.sizeBytes,
    };
  } finally {
    // Always cleanup temp directory
    await cleanupBuildDir(buildDir);
  }
}

async function cleanupBuildDir(buildDir: string): Promise<void> {
  try {
    await fs.rm(buildDir, { recursive: true, force: true });
  } catch {
    console.warn(`Failed to cleanup build dir: ${buildDir}`);
  }
}
