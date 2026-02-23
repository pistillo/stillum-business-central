import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

export function Layout() {
  const { state, logout } = useAuth();
  const { tenantId } = useTenant();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #e5e5e5', padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>
          <Link to="/home">Stillum</Link>
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16 }}>
          Tenant: {tenantId ?? '—'}
        </div>
        <nav style={{ display: 'grid', gap: 8 }}>
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/catalogue">Catalogo</NavLink>
        </nav>
        <div style={{ marginTop: 24 }}>
          {state.status === 'authenticated' ? (
            <button onClick={() => void logout()}>Logout</button>
          ) : null}
        </div>
      </aside>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
