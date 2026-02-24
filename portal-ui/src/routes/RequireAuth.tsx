import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { getLocationTarget } from '../utils/postLoginRedirect';

export function RequireAuth() {
  const { state } = useAuth();
  const location = useLocation();

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 size={32} className="animate-spin text-brand-600 dark:text-brand-400" />
      </div>
    );
  }
  if (state.status !== 'authenticated') {
    const redirectTo = getLocationTarget(location);
    return (
      <Navigate
        to={`/login?auto=1&redirectTo=${encodeURIComponent(redirectTo)}`}
        replace
        state={{ redirectTo }}
      />
    );
  }
  return <Outlet />;
}
