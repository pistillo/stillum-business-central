import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <p>Dashboard v0 (EPIC 2).</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Link to="/catalogue">Vai al catalogo</Link>
        <Link to="/catalogue?new=1">Nuovo artefatto</Link>
      </div>
    </div>
  );
}
