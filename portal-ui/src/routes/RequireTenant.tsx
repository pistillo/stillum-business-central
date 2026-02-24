import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTenant } from '../tenancy/TenantContext';
import { getLocationTarget } from '../utils/postLoginRedirect';

export function RequireTenant() {
  const { status, tenantId, availableTenantIds } = useTenant();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 size={32} className="animate-spin text-brand-600 dark:text-brand-400" />
      </div>
    );
  }

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
