import { apiFetch, registryUrl } from './http';
import type {
  Artifact,
  ArtifactStatus,
  ArtifactType,
  ArtifactVersion,
  Environment,
  PagedResponse,
  PresignedUrlResponse,
} from './types';

export async function listArtifacts(params: {
  token: string | null;
  tenantId: string;
  type?: ArtifactType;
  status?: ArtifactStatus;
  area?: string;
  tag?: string;
  page?: number;
  size?: number;
}): Promise<PagedResponse<Artifact>> {
  const q = new URLSearchParams();
  if (params.type) q.set('type', params.type);
  if (params.status) q.set('status', params.status);
  if (params.area) q.set('area', params.area);
  if (params.tag) q.set('tag', params.tag);
  q.set('page', String(params.page ?? 0));
  q.set('size', String(params.size ?? 20));
  return apiFetch(registryUrl(`/tenants/${params.tenantId}/artifacts?${q.toString()}`), {
    token: params.token,
  });
}

export async function getArtifact(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
}): Promise<Artifact> {
  return apiFetch(registryUrl(`/tenants/${params.tenantId}/artifacts/${params.artifactId}`), {
    token: params.token,
  });
}

export async function createArtifact(params: {
  token: string | null;
  tenantId: string;
  type: ArtifactType;
  title: string;
  description?: string;
  area?: string;
  tags?: string[];
}): Promise<Artifact> {
  return apiFetch(registryUrl(`/tenants/${params.tenantId}/artifacts`), {
    method: 'POST',
    token: params.token,
    body: JSON.stringify({
      type: params.type,
      title: params.title,
      description: params.description,
      area: params.area,
      tags: params.tags,
    }),
  });
}

export async function listVersions(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
}): Promise<ArtifactVersion[]> {
  return apiFetch(
    registryUrl(`/tenants/${params.tenantId}/artifacts/${params.artifactId}/versions`),
    { token: params.token }
  );
}

export async function getVersion(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
  versionId: string;
}): Promise<ArtifactVersion> {
  return apiFetch(
    registryUrl(
      `/tenants/${params.tenantId}/artifacts/${params.artifactId}/versions/${params.versionId}`
    ),
    { token: params.token }
  );
}

export async function createVersion(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
  version: string;
  payloadRef?: string;
  metadata?: unknown;
  sourceCode?: string;
  npmDependencies?: string;
  npmPackageRef?: string;
}): Promise<ArtifactVersion> {
  return apiFetch(
    registryUrl(`/tenants/${params.tenantId}/artifacts/${params.artifactId}/versions`),
    {
      method: 'POST',
      token: params.token,
      body: JSON.stringify({
        version: params.version,
        payloadRef: params.payloadRef,
        metadata: params.metadata,
        sourceCode: params.sourceCode,
        npmDependencies: params.npmDependencies,
        npmPackageRef: params.npmPackageRef,
      }),
    }
  );
}

export async function updatePayloadRef(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
  versionId: string;
  payloadRef: string;
}): Promise<ArtifactVersion> {
  return apiFetch(
    registryUrl(
      `/tenants/${params.tenantId}/artifacts/${params.artifactId}/versions/${params.versionId}/payload-ref`
    ),
    { method: 'PUT', token: params.token, body: JSON.stringify({ payloadRef: params.payloadRef }) }
  );
}

export async function getPayloadUploadUrl(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
  versionId: string;
  contentType: string;
}): Promise<PresignedUrlResponse> {
  const q = new URLSearchParams();
  q.set('artifactId', params.artifactId);
  q.set('versionId', params.versionId);
  q.set('contentType', params.contentType);
  return apiFetch(registryUrl(`/tenants/${params.tenantId}/storage/upload-url?${q.toString()}`), {
    token: params.token,
  });
}

export async function getPayloadDownloadUrl(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
  versionId: string;
}): Promise<PresignedUrlResponse> {
  const q = new URLSearchParams();
  q.set('artifactId', params.artifactId);
  q.set('versionId', params.versionId);
  return apiFetch(registryUrl(`/tenants/${params.tenantId}/storage/download-url?${q.toString()}`), {
    token: params.token,
  });
}

export async function listEnvironments(params: {
  token: string | null;
  tenantId: string;
}): Promise<Environment[]> {
  return apiFetch(registryUrl(`/tenants/${params.tenantId}/environments`), {
    token: params.token,
  });
}

export async function addDependency(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
  versionId: string;
  dependsOnArtifactId: string;
  dependsOnVersionId: string;
}): Promise<unknown> {
  return apiFetch(
    registryUrl(
      `/tenants/${params.tenantId}/artifacts/${params.artifactId}/versions/${params.versionId}/dependencies`
    ),
    {
      method: 'POST',
      token: params.token,
      body: JSON.stringify({
        dependsOnArtifactId: params.dependsOnArtifactId,
        dependsOnVersionId: params.dependsOnVersionId,
      }),
    }
  );
}

export async function updateVersion(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
  versionId: string;
  payloadRef?: string;
  metadata?: unknown;
  sourceCode?: string;
  npmDependencies?: string;
  npmPackageRef?: string;
}): Promise<ArtifactVersion> {
  return apiFetch(
    registryUrl(
      `/tenants/${params.tenantId}/artifacts/${params.artifactId}/versions/${params.versionId}`
    ),
    {
      method: 'PUT',
      token: params.token,
      body: JSON.stringify({
        payloadRef: params.payloadRef,
        metadata: params.metadata,
        sourceCode: params.sourceCode,
        npmDependencies: params.npmDependencies,
        npmPackageRef: params.npmPackageRef,
      }),
    }
  );
}

export async function createModule(params: {
  token: string | null;
  tenantId: string;
  title: string;
  description?: string;
  area?: string;
  tags?: string[];
}): Promise<Artifact> {
  return apiFetch(registryUrl(`/tenants/${params.tenantId}/artifacts/modules`), {
    method: 'POST',
    token: params.token,
    body: JSON.stringify({
      title: params.title,
      description: params.description,
      area: params.area,
      tags: params.tags,
    }),
  });
}

export async function createComponent(params: {
  token: string | null;
  tenantId: string;
  title: string;
  description?: string;
  area?: string;
  tags?: string[];
  parentModuleId: string;
}): Promise<Artifact> {
  return apiFetch(registryUrl(`/tenants/${params.tenantId}/artifacts/components`), {
    method: 'POST',
    token: params.token,
    body: JSON.stringify({
      title: params.title,
      description: params.description,
      area: params.area,
      tags: params.tags,
      parentModuleId: params.parentModuleId,
    }),
  });
}
