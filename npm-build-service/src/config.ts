export const config = {
  port: parseInt(process.env.PORT ?? '8090', 10),
  nexus: {
    url: process.env.NEXUS_URL ?? 'http://localhost:8070',
    npmRegistryUrl:
      process.env.NEXUS_NPM_REGISTRY_URL ??
      'http://localhost:8070/repository/npm-hosted/',
    npmGroupUrl:
      process.env.NEXUS_NPM_GROUP_URL ??
      'http://localhost:8070/repository/npm-group/',
    username: process.env.NEXUS_USERNAME ?? 'admin',
    password: process.env.NEXUS_PASSWORD ?? 'admin123',
  },
  build: {
    tempDir: process.env.BUILD_TEMP_DIR ?? '/tmp/stillum-builds',
    timeoutMs: parseInt(process.env.BUILD_TIMEOUT_MS ?? '120000', 10),
    maxConcurrent: parseInt(process.env.BUILD_MAX_CONCURRENT ?? '4', 10),
  },
  /** Dependencies externalized from the bundle (provided by the host runtime) */
  externalDependencies: ['react', 'react-dom', 'react/jsx-runtime'],
} as const;
