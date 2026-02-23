import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

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
    <div>
      <h1>Login</h1>
      <p>Accedi con il tuo provider OIDC (Keycloak).</p>
      <button
        onClick={() => {
          void login();
        }}
      >
        Login
      </button>
    </div>
  );
}
