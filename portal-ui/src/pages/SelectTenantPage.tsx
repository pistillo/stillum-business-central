import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

export function SelectTenantPage() {
  const { state } = useAuth();
  const { tenantId, availableTenantIds, setTenantId } = useTenant();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.status === 'authenticated' && availableTenantIds.length === 1) {
      setTenantId(availableTenantIds[0]);
      navigate('/home', { replace: true });
    }
  }, [state, availableTenantIds, setTenantId, navigate]);

  if (state.status !== 'authenticated') {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Seleziona tenant</h1>
      {availableTenantIds.length === 0 ? (
        <div>
          <p>Nessun tenant trovato nel token.</p>
          <p>Inserisci manualmente un tenantId:</p>
          <input
            value={tenantId ?? ''}
            onChange={(e) => setTenantId(e.target.value)}
            placeholder="00000000-0000-0000-0000-000000000001"
            style={{ width: 420 }}
          />
        </div>
      ) : (
        <ul>
          {availableTenantIds.map((id) => (
            <li key={id} style={{ marginBottom: 8 }}>
              <button
                onClick={() => {
                  setTenantId(id);
                  navigate('/home', { replace: true });
                }}
              >
                {id}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
