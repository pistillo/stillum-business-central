import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LogIn, Shield } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

export function LoginPage() {
  const { state, login } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (state.status === 'authenticated') {
      return;
    }
    const auto = new URLSearchParams(location.search).get('auto') === '1';
    if (auto) {
      void login();
    }
  }, [state, login, location.search]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-600 dark:bg-brand-800 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/50 to-brand-800/50" />
        <div className="relative z-10 max-w-md text-center px-8">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Stillum Business Central</h2>
          <p className="text-brand-100 text-lg leading-relaxed">
            Gestisci processi, regole decisionali, form e request in un unico portale centralizzato.
          </p>
        </div>
        {/* Decorative shapes */}
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-400/20" />
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-300/20" />
      </div>

      {/* Right login panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white font-bold">
              S
            </div>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">Stillum</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Benvenuto</h1>
          <p className="text-gray-500 dark:text-slate-400 mb-8">
            Accedi con le tue credenziali per continuare.
          </p>

          <button
            onClick={() => {
              void login();
            }}
            className="btn-primary w-full py-3 text-base"
          >
            <LogIn size={18} />
            Accedi con SSO
          </button>

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-500">
            Autenticazione gestita tramite Keycloak (OpenID Connect)
          </p>
        </div>
      </div>
    </div>
  );
}
