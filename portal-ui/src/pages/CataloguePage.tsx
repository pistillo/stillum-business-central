import { Link, useSearchParams } from 'react-router-dom';
import type { ArtifactStatus, ArtifactType } from '../api/types';
import { useArtifacts } from '../hooks/useArtifacts';

const TYPES: ArtifactType[] = ['PROCESS', 'RULE', 'FORM', 'REQUEST'];
const STATUSES: ArtifactStatus[] = ['DRAFT', 'PUBLISHED', 'RETIRED', 'REVIEW', 'APPROVED'];

export function CataloguePage() {
  const [search, setSearch] = useSearchParams();

  const type = (search.get('type') as ArtifactType | null) ?? undefined;
  const status = (search.get('status') as ArtifactStatus | null) ?? undefined;
  const area = search.get('area') ?? undefined;
  const tag = search.get('tag') ?? undefined;
  const page = Number(search.get('page') ?? '0');

  const q = useArtifacts({ type, status, area, tag, page, size: 20 });

  return (
    <div>
      <h1>Catalogo</h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Type{' '}
          <select
            value={type ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) search.delete('type');
              else search.set('type', v);
              search.set('page', '0');
              setSearch(search);
            }}
          >
            <option value="">All</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status{' '}
          <select
            value={status ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) search.delete('status');
              else search.set('status', v);
              search.set('page', '0');
              setSearch(search);
            }}
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label>
          Area{' '}
          <input
            value={area ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) search.delete('area');
              else search.set('area', v);
              search.set('page', '0');
              setSearch(search);
            }}
          />
        </label>

        <label>
          Tag{' '}
          <input
            value={tag ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) search.delete('tag');
              else search.set('tag', v);
              search.set('page', '0');
              setSearch(search);
            }}
          />
        </label>

        <Link to="/catalogue/new">Nuovo artefatto</Link>
      </div>

      {q.isLoading ? <div>Loading…</div> : null}
      {q.isError ? <div>Error</div> : null}

      {q.data ? (
        <div style={{ marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Title</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Area</th>
              </tr>
            </thead>
            <tbody>
              {q.data.items.map((a) => (
                <tr key={a.id}>
                  <td style={{ padding: 6 }}>
                    <Link to={`/artifact/${a.id}`}>{a.title}</Link>
                  </td>
                  <td style={{ padding: 6 }}>{a.type}</td>
                  <td style={{ padding: 6 }}>{a.status}</td>
                  <td style={{ padding: 6 }}>{a.area ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button
              disabled={page <= 0}
              onClick={() => {
                search.set('page', String(Math.max(0, page - 1)));
                setSearch(search);
              }}
            >
              Prev
            </button>
            <div>
              Page {page + 1} / {Math.max(1, Math.ceil(q.data.total / q.data.size))}
            </div>
            <button
              disabled={(page + 1) * q.data.size >= q.data.total}
              onClick={() => {
                search.set('page', String(page + 1));
                setSearch(search);
              }}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
