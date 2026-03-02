import slugify from 'slugify';
import type { BuildRequest } from '../types/build.js';

export function generatePackageJson(req: BuildRequest) {
  const scope = `@stillum-${req.tenantId.substring(0, 8)}`;
  const name = slugify(req.artifactTitle, { lower: true, strict: true });

  return {
    name: `${scope}/${name}`,
    version: req.version,
    type: 'module',
    main: './dist/index.js',
    module: './dist/index.js',
    types: './dist/index.d.ts',
    exports: {
      '.': {
        import: './dist/index.js',
        types: './dist/index.d.ts',
      },
    },
    files: ['dist'],
    peerDependencies: {
      react: '>=18.0.0',
      'react-dom': '>=18.0.0',
    },
    dependencies: req.npmDependencies,
    devDependencies: {
      typescript: '~5.6.2',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
    },
    stillum: {
      tenantId: req.tenantId,
      artifactId: req.artifactId,
      versionId: req.versionId,
      artifactType: req.artifactType,
    },
  };
}

export function getPackageName(req: BuildRequest): string {
  const scope = `@stillum-${req.tenantId.substring(0, 8)}`;
  const name = slugify(req.artifactTitle, { lower: true, strict: true });
  return `${scope}/${name}`;
}
