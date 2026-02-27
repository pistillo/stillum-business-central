import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from '../config.js';
import { getPackageName } from '../templates/package-json.js';
import type { BuildRequest } from '../types/build.js';
import { BuildError } from '../types/build.js';

const execFileAsync = promisify(execFile);

export interface PublishResult {
  npmPackageRef: string;
  packageName: string;
  packageVersion: string;
}

export async function packAndPublish(
  buildDir: string,
  req: BuildRequest,
): Promise<PublishResult> {
  const packageName = getPackageName(req);

  try {
    await execFileAsync(
      'npm',
      [
        'publish',
        '--registry',
        config.nexus.npmRegistryUrl,
        '--access',
        'restricted',
      ],
      {
        cwd: buildDir,
        timeout: 60_000,
        env: {
          ...process.env,
          HOME: buildDir,
        },
      },
    );

    const npmPackageRef = `${packageName}@${req.version}`;

    return {
      npmPackageRef,
      packageName,
      packageVersion: req.version,
    };
  } catch (error) {
    const err = error as { stderr?: string; message?: string };
    throw new BuildError(
      'PUBLISH',
      'npm publish to Nexus failed',
      err.stderr ?? err.message,
    );
  }
}
