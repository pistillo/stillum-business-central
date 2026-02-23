import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publish } from '../api/publisher';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

export function PublishPage() {
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();
  const params = useParams();
  const artifactId = params.artifactId ?? '';
  const versionId = params.versionId ?? '';

  const [environmentId, setEnvironmentId] = useState('00000000-0000-0000-0000-000000000020');
  const [notes, setNotes] = useState('');

  const m = useMutation({
    mutationFn: async () => {
      if (!tenantId) throw new Error('Tenant not selected');
      return publish({
        token: getAccessToken(),
        tenantId,
        artifactId,
        versionId,
        environmentId,
        notes: notes || undefined,
      });
    },
  });

  return (
    <div>
      <h1>Publish</h1>
      <div style={{ opacity: 0.7, marginBottom: 12 }}>
        Artifact {artifactId} · Version {versionId}
      </div>
      <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
        <label>
          Environment ID{' '}
          <input
            value={environmentId}
            onChange={(e) => setEnvironmentId(e.target.value)}
            style={{ width: 420 }}
          />
        </label>
        <label>
          Notes <input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <button disabled={m.isPending} onClick={() => m.mutate()}>
          Publish
        </button>
      </div>

      {m.isSuccess ? (
        <div style={{ marginTop: 16 }}>
          <div>Publication ID: {m.data.id}</div>
          <div>Bundle ref: {m.data.bundleRef}</div>
        </div>
      ) : null}
      {m.isError ? <div style={{ marginTop: 16 }}>Publish failed</div> : null}

      <div style={{ marginTop: 16 }}>
        <Link to={`/artifact/${artifactId}`}>Back</Link>
      </div>
    </div>
  );
}
