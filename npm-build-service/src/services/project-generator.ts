import fs from 'node:fs/promises';
import path from 'node:path';
import slugify from 'slugify';
import { config } from '../config.js';
import { generatePackageJson } from '../templates/package-json.js';
import { generateTsConfig } from '../templates/tsconfig-json.js';
import type { BuildRequest } from '../types/build.js';
import { BuildError } from '../types/build.js';

export async function generateProject(
  buildDir: string,
  req: BuildRequest,
): Promise<void> {
  try {
    await fs.mkdir(path.join(buildDir, 'src'), { recursive: true });

    // 1. package.json
    const packageJson = generatePackageJson(req);
    await fs.writeFile(
      path.join(buildDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
    );

    // 2. tsconfig.json
    const tsConfig = generateTsConfig();
    await fs.writeFile(
      path.join(buildDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2),
    );

    // 3. .npmrc pointing to Nexus
    const authToken = Buffer.from(
      `${config.nexus.username}:${config.nexus.password}`,
    ).toString('base64');
    const registryHost = extractRegistryHost(config.nexus.npmRegistryUrl);
    const groupHost = extractRegistryHost(config.nexus.npmGroupUrl);

    const npmrc = [
      `registry=${config.nexus.npmGroupUrl}`,
      `//${registryHost}:_auth=${authToken}`,
      `//${registryHost}:always-auth=true`,
      `//${groupHost}:_auth=${authToken}`,
      `//${groupHost}:always-auth=true`,
    ].join('\n');
    await fs.writeFile(path.join(buildDir, '.npmrc'), npmrc);

    // 4. Main source file
    await fs.writeFile(
      path.join(buildDir, 'src', 'index.tsx'),
      req.sourceCode,
    );

    // 5. Component source files
    if (req.components && req.components.length > 0) {
      for (const component of req.components) {
        const safeName = slugify(component.title, {
          lower: true,
          strict: true,
        });
        await fs.writeFile(
          path.join(buildDir, 'src', `${safeName}.tsx`),
          component.sourceCode,
        );
      }
    }

    // 6. Entry point that re-exports everything
    const entryLines: string[] = [
      "export * from './index.js';",
      "export { default } from './index.js';",
    ];
    if (req.components) {
      for (const component of req.components) {
        const safeName = slugify(component.title, {
          lower: true,
          strict: true,
        });
        entryLines.push(`export * from './${safeName}.js';`);
      }
    }
    await fs.writeFile(
      path.join(buildDir, 'src', 'entry.ts'),
      entryLines.join('\n') + '\n',
    );
  } catch (error) {
    if (error instanceof BuildError) throw error;
    throw new BuildError(
      'SETUP',
      'Failed to generate project structure',
      String(error),
    );
  }
}

function extractRegistryHost(url: string): string {
  const parsed = new URL(url);
  return parsed.host + parsed.pathname;
}
