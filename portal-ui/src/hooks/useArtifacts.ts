import { useQuery } from '@tanstack/react-query';
import type { ArtifactStatus, ArtifactType } from '../api/types';
import { listArtifacts } from '../api/registry';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

export function useArtifacts(filters: {
  type?: ArtifactType;
  status?: ArtifactStatus;
  area?: string;
  tag?: string;
  page?: number;
  size?: number;
}) {
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ['artifacts', tenantId, filters],
    enabled: Boolean(tenantId),
    queryFn: async () => {
      if (!tenantId) {
        throw new Error('Tenant not selected');
      }
      return listArtifacts({ token: getAccessToken(), tenantId, ...filters });
    },
  });
}
