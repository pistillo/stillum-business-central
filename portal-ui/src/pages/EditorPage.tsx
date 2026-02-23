import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getArtifact,
  getPayloadDownloadUrl,
  getPayloadUploadUrl,
  getVersion,
  updatePayloadRef,
} from '../api/registry';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

export function EditorPage() {
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();
  const params = useParams();
  const artifactId = params.artifactId ?? '';
  const versionId = params.versionId ?? '';

  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [contentType, setContentType] = useState('application/octet-stream');

  useEffect(() => {
    if (!tenantId || !artifactId || !versionId) return;
    setStatus('loading');
    Promise.all([
      getArtifact({ token: getAccessToken(), tenantId, artifactId }),
      getVersion({ token: getAccessToken(), tenantId, artifactId, versionId }),
    ])
      .then(async ([a, v]) => {
        if (a.type === 'PROCESS' || a.type === 'RULE') {
          setContentType('application/xml');
        } else if (a.type === 'FORM' || a.type === 'REQUEST') {
          setContentType('application/json');
        } else {
          setContentType('application/octet-stream');
        }
        if (!v.payloadRef) {
          setContent(a.type === 'FORM' || a.type === 'REQUEST' ? '{}' : '<definitions/>');
          setStatus('ready');
          return;
        }
        const d = await getPayloadDownloadUrl({
          token: getAccessToken(),
          tenantId,
          artifactId,
          versionId,
        });
        const res = await fetch(d.url);
        const text = await res.text();
        setContent(text);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [tenantId, artifactId, versionId, getAccessToken]);

  const save = useMutation({
    mutationFn: async () => {
      if (!tenantId) throw new Error('Tenant not selected');
      const upload = await getPayloadUploadUrl({
        token: getAccessToken(),
        tenantId,
        artifactId,
        versionId,
        contentType,
      });
      const key = upload.key ?? upload.objectKey;
      if (!key) {
        throw new Error('Upload key missing');
      }
      await fetch(upload.url, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: content,
      });
      await updatePayloadRef({
        token: getAccessToken(),
        tenantId,
        artifactId,
        versionId,
        payloadRef: key,
      });
      return key;
    },
  });

  return (
    <div>
      <h1>Editor (v0)</h1>
      <div style={{ opacity: 0.7, marginBottom: 8 }}>
        Artifact {artifactId} · Version {versionId}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button disabled={save.isPending} onClick={() => save.mutate()}>
          Save
        </button>
        <Link to={`/artifact/${artifactId}`}>Back</Link>
      </div>

      {status === 'loading' ? <div>Loading…</div> : null}
      {status === 'error' ? <div>Error loading payload</div> : null}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: '100%', height: 520, fontFamily: 'monospace' }}
      />

      {save.isSuccess ? <div>Saved: {save.data}</div> : null}
      {save.isError ? <div>Error saving</div> : null}
    </div>
  );
}
