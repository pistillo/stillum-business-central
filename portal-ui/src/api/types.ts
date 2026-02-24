export type ArtifactType = 'PROCESS' | 'RULE' | 'FORM' | 'REQUEST';
export type ArtifactStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'RETIRED';
export type VersionState = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'RETIRED';

export type Artifact = {
  id: string;
  tenantId: string;
  type: ArtifactType;
  title: string;
  description?: string | null;
  ownerId?: string | null;
  status: ArtifactStatus;
  area?: string | null;
  tags?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ArtifactVersion = {
  id: string;
  artifactId: string;
  version: string;
  state: VersionState;
  payloadRef?: string | null;
  createdBy?: string | null;
  createdAt?: string;
  metadata?: unknown;
};

export type PagedResponse<T> = {
  items: T[];
  page: number;
  size: number;
  total: number;
};

export type PresignedUrlResponse = {
  url: string;
  objectKey?: string;
  key?: string;
  expiresInSeconds?: number;
};

export type Publication = {
  id: string;
  tenantId: string;
  artifactId: string;
  versionId: string;
  environmentId: string;
  publishedAt: string;
  bundleRef: string;
  notes?: string | null;
};

export type Environment = {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
};
