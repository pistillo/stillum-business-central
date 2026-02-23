import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function OidcCallbackPage() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === 'authenticated') {
      navigate('/select-tenant', { replace: true });
      return;
    }
    state.userManager
      .signinRedirectCallback()
      .then(() => navigate('/select-tenant', { replace: true }))
      .catch((e) => {
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
      <div>
        <h1>Login error</h1>
        <pre>{error}</pre>
      </div>
    );
  }
  return <div>Completing login…</div>;
}
