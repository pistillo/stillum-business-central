import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { readPostLoginRedirect } from '../utils/postLoginRedirect';

let oidcCallbackInProgress = false;

export function OidcCallbackPage() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectTo = readPostLoginRedirect() ?? '/home';
    if (state.status === 'authenticated') {
      navigate(redirectTo, { replace: true });
      return;
    }
    if (oidcCallbackInProgress) return;
    oidcCallbackInProgress = true;

    state.userManager
      .signinRedirectCallback()
      .then(() => {
        oidcCallbackInProgress = false;
        navigate(redirectTo, { replace: true });
      })
      .catch((e) => {
        oidcCallbackInProgress = false;
        const msg = e instanceof Error ? e.message : String(e);
        const extra =
          typeof e === 'object' && e !== null && 'response' in e
            ? JSON.stringify((e as { response?: unknown }).response, null, 2)
            : '';
        setError(extra ? `${msg}\n\nRisposta server:\n${extra}` : msg);
      });
  }, [state, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
        <div className="card max-w-lg w-full p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Errore di autenticazione
          </h1>
          <pre className="mt-4 rounded-lg bg-gray-100 dark:bg-slate-700 p-4 text-left text-xs text-gray-700 dark:text-slate-300 overflow-auto max-h-48">
            {error}
          </pre>
          <a href="/login" className="btn-primary mt-6 inline-flex">
            Torna al login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={32} className="animate-spin text-brand-600 dark:text-brand-400" />
        <p className="text-sm text-gray-500 dark:text-slate-400">Completamento accesso in corso…</p>
      </div>
    </div>
  );
}
