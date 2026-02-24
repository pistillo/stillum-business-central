import { Link } from 'react-router-dom';
import { useMyDrafts } from '../hooks/useMyDrafts';
import { useRecentPublications } from '../hooks/useRecentPublications';
import type { Artifact } from '../api/types';

function ArtifactList({
  data,
  isLoading,
  isError,
  emptyMessage,
}: {
  data: Artifact[] | undefined;
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
}) {
  if (isLoading) return <p>Caricamento…</p>;
  if (isError) return <p>Errore nel caricamento.</p>;
  if (!data || data.length === 0) return <p style={{ opacity: 0.6 }}>{emptyMessage}</p>;
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {data.map((artifact) => (
        <li key={artifact.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
          <Link to={`/artifact/${artifact.id}`}>{artifact.title}</Link>
          <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.6 }}>{artifact.type}</span>
        </li>
      ))}
    </ul>
  );
}

export function HomePage() {
  const drafts = useMyDrafts();
  const publications = useRecentPublications();

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Link to="/catalogue">Vai al catalogo</Link>
        <Link to="/catalogue/new">Nuovo artefatto</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section>
          <h2>Le mie bozze</h2>
          <ArtifactList
            data={drafts.data?.items}
            isLoading={drafts.isLoading}
            isError={drafts.isError}
            emptyMessage="Nessuna bozza presente."
          />
        </section>

        <section>
          <h2>Ultime pubblicazioni</h2>
          <ArtifactList
            data={publications.data?.items}
            isLoading={publications.isLoading}
            isError={publications.isError}
            emptyMessage="Nessuna pubblicazione recente."
          />
        </section>
      </div>
    </div>
  );
}
