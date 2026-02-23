import { Navigate, Outlet } from 'react-router-dom';
import { useTenant } from '../tenancy/TenantContext';

export function RequireTenant() {
  const { tenantId, availableTenantIds } = useTenant();

  if (!tenantId) {
    if (availableTenantIds.length === 1) {
      return <Outlet />;
    }
    return <Navigate to="/select-tenant" replace />;
  }
  return <Outlet />;
}
