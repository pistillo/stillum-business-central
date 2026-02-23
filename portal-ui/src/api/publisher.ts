import { apiFetch, publisherUrl } from './http';
import type { Publication } from './types';

export async function publish(params: {
  token: string | null;
  tenantId: string;
  artifactId: string;
  versionId: string;
  environmentId: string;
  notes?: string;
}): Promise<Publication> {
  return apiFetch(publisherUrl(`/tenants/${params.tenantId}/publish`), {
    method: 'POST',
    token: params.token,
    body: JSON.stringify({
      artifactId: params.artifactId,
      versionId: params.versionId,
      environmentId: params.environmentId,
      notes: params.notes,
    }),
  });
}

export async function getPublication(params: {
  token: string | null;
  tenantId: string;
  publicationId: string;
}): Promise<Publication> {
  return apiFetch(publisherUrl(`/tenants/${params.tenantId}/publish/${params.publicationId}`), {
    token: params.token,
  });
}
