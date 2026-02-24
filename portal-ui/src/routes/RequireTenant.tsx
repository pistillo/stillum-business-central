import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTenant } from '../tenancy/TenantContext';
import { getLocationTarget } from '../utils/postLoginRedirect';

export function RequireTenant() {
  const { tenantId, availableTenantIds } = useTenant();
  const location = useLocation();

  if (!tenantId) {
    if (availableTenantIds.length === 1) {
      return <Outlet />;
    }
    const redirectTo = getLocationTarget(location);
    return (
      <Navigate
        to={`/select-tenant?redirectTo=${encodeURIComponent(redirectTo)}`}
        replace
        state={{ redirectTo }}
      />
    );
  }
  return <Outlet />;
}
