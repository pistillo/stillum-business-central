import { Link, useParams } from 'react-router-dom';
import { useArtifactDetail } from '../hooks/useArtifactDetail';

export function ArtifactDetailPage() {
  const params = useParams();
  const artifactId = params.id ?? '';
  const { artifact, versions } = useArtifactDetail(artifactId);

  return (
    <div>
      <h1>Artifact</h1>

      {artifact.isLoading ? <div>Loading…</div> : null}
      {artifact.data ? (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{artifact.data.title}</div>
          <div style={{ opacity: 0.8 }}>
            {artifact.data.type} · {artifact.data.status} · {artifact.data.area ?? ''}
          </div>
          <div style={{ marginTop: 8 }}>Tags: {(artifact.data.tags ?? []).join(', ')}</div>
        </div>
      ) : null}

      <h2>Versions</h2>
      {versions.isLoading ? <div>Loading…</div> : null}
      {versions.data ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Version</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>State</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {versions.data.map((v) => (
              <tr key={v.id}>
                <td style={{ padding: 6 }}>{v.version}</td>
                <td style={{ padding: 6 }}>{v.state}</td>
                <td style={{ padding: 6, display: 'flex', gap: 12 }}>
                  <Link to={`/editor/${artifactId}/${v.id}`}>Edit</Link>
                  <Link to={`/publish/${artifactId}/${v.id}`}>Publish</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <Link to="/catalogue">Back to catalogue</Link>
      </div>
    </div>
  );
}
