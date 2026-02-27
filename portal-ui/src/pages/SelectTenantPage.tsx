import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  consumePostLoginRedirect,
  readPostLoginRedirect,
  sanitizeRedirectTo,
  setPostLoginRedirect,
} from '../utils/postLoginRedirect';

export function SelectTenantPage() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const { tenantId, availableTenantIds, setTenantId } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectFromSearch = sanitizeRedirectTo(
    new URLSearchParams(location.search).get('redirectTo')
  );
  const redirectTo = redirectFromSearch ?? readPostLoginRedirect();

  useEffect(() => {
    if (redirectFromSearch) {
      setPostLoginRedirect(redirectFromSearch);
    }
    if (state.status === 'authenticated' && availableTenantIds.length === 1) {
      setTenantId(availableTenantIds[0]);
      const target = redirectTo ?? '/home';
      consumePostLoginRedirect();
      navigate(target, { replace: true });
    }
  }, [state, availableTenantIds, setTenantId, navigate, redirectFromSearch, redirectTo]);

  if (state.status !== 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 size={32} className="animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/30">
            <Building2 size={28} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('selectTenant.title')}</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            {t('selectTenant.description')}
          </p>
        </div>

        {availableTenantIds.length === 0 ? (
          <div className="card p-6">
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
              {t('selectTenant.noTenantFound')}
            </p>
            <input
              className="input font-mono text-sm"
              value={tenantId ?? ''}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder={t('selectTenant.manualPlaceholder')}
            />
            <button
              className="btn-primary w-full mt-4"
              disabled={!tenantId}
              onClick={() => {
                const target = redirectTo ?? '/home';
                consumePostLoginRedirect();
                navigate(target, { replace: true });
              }}
            >
              {t('common.continue')}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {availableTenantIds.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setTenantId(id);
                  const target = redirectTo ?? '/home';
                  consumePostLoginRedirect();
                  navigate(target, { replace: true });
                }}
                className="card w-full flex items-center gap-4 p-4 hover:border-brand-300 dark:hover:border-brand-600
                           hover:shadow-md transition-all duration-150 group cursor-pointer text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700">
                  <Building2 size={20} className="text-gray-500 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono text-gray-900 dark:text-slate-200 truncate">
                    {id}
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
