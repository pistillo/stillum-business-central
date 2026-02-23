import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ArtifactType } from '../api/types';
import { createArtifact, createVersion } from '../api/registry';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

const TYPES: ArtifactType[] = ['PROCESS', 'RULE', 'FORM', 'REQUEST'];

export function NewArtifactPage() {
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();
  const navigate = useNavigate();

  const [type, setType] = useState<ArtifactType>('PROCESS');
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [tags, setTags] = useState('');
  const [version, setVersion] = useState('1.0.0');

  const tagList = useMemo(
    () =>
      tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [tags]
  );

  const m = useMutation({
    mutationFn: async () => {
      if (!tenantId) throw new Error('Tenant not selected');
      const a = await createArtifact({
        token: getAccessToken(),
        tenantId,
        type,
        title,
        area: area || undefined,
        tags: tagList.length ? tagList : undefined,
      });
      const v = await createVersion({
        token: getAccessToken(),
        tenantId,
        artifactId: a.id,
        version,
      });
      return { artifactId: a.id, versionId: v.id };
    },
    onSuccess: (r) => navigate(`/editor/${r.artifactId}/${r.versionId}`),
  });

  return (
    <div>
      <h1>Nuovo artefatto</h1>
      <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
        <label>
          Type{' '}
          <select value={type} onChange={(e) => setType(e.target.value as ArtifactType)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label>
          Title <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Area <input value={area} onChange={(e) => setArea(e.target.value)} />
        </label>
        <label>
          Tags (comma-separated) <input value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
        <label>
          Version <input value={version} onChange={(e) => setVersion(e.target.value)} />
        </label>
        <button disabled={!title || m.isPending} onClick={() => m.mutate()}>
          Create
        </button>
        {m.isError ? <div>Error</div> : null}
      </div>
    </div>
  );
}
