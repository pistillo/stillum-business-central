import { useQuery } from '@tanstack/react-query';
import { listEnvironments } from '../api/registry';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

export function useEnvironments() {
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ['environments', tenantId],
    enabled: Boolean(tenantId),
    queryFn: async () => {
      if (!tenantId) {
        throw new Error('Tenant not selected');
      }
      return listEnvironments({ token: getAccessToken(), tenantId });
    },
  });
}
