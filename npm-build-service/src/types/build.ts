export interface BuildRequest {
  tenantId: string;
  artifactId: string;
  versionId: string;
  artifactTitle: string;
  artifactType: 'MODULE' | 'COMPONENT';
  version: string;
  sourceCode: string;
  npmDependencies: Record<string, string>;
  components?: ComponentSource[];
}

export interface ComponentSource {
  artifactId: string;
  title: string;
  sourceCode: string;
}

export interface BuildResponse {
  success: true;
  npmPackageRef: string;
  packageName: string;
  packageVersion: string;
  buildDurationMs: number;
  bundleSizeBytes: number;
}

export interface BuildErrorResponse {
  success: false;
  error: string;
  phase: BuildPhase;
  details?: string;
}

export type BuildPhase = 'SETUP' | 'INSTALL' | 'COMPILE' | 'BUNDLE' | 'PUBLISH';

export class BuildError extends Error {
  constructor(
    public readonly phase: BuildPhase,
    message: string,
    public readonly details?: string,
  ) {
    super(message);
    this.name = 'BuildError';
  }
}
