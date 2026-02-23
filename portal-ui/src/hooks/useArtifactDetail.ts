import { useQuery } from '@tanstack/react-query';
import { getArtifact, listVersions } from '../api/registry';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

export function useArtifactDetail(artifactId: string) {
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();

  const artifact = useQuery({
    queryKey: ['artifact', tenantId, artifactId],
    enabled: Boolean(tenantId && artifactId),
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant not selected');
      return getArtifact({ token: getAccessToken(), tenantId, artifactId });
    },
  });

  const versions = useQuery({
    queryKey: ['artifactVersions', tenantId, artifactId],
    enabled: Boolean(tenantId && artifactId),
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant not selected');
      return listVersions({ token: getAccessToken(), tenantId, artifactId });
    },
  });

  return { artifact, versions };
}
