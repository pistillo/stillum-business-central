import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter, Loader2, PlusCircle, Search } from 'lucide-react';
import type { ArtifactStatus, ArtifactType } from '../api/types';
import { useArtifacts } from '../hooks/useArtifacts';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';

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

  const totalPages = q.data ? Math.max(1, Math.ceil(q.data.total / q.data.size)) : 1;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catalogo</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Cerca e gestisci tutti gli artefatti del tenant.
          </p>
        </div>
        <Link to="/catalogue/new" className="btn-primary">
          <PlusCircle size={16} />
          Nuovo Artefatto
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-gray-400 dark:text-slate-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Filtri</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
              Tipo
            </label>
            <select
              className="select"
              value={type ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) search.delete('type');
                else search.set('type', v);
                search.set('page', '0');
                setSearch(search);
              }}
            >
              <option value="">Tutti</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
              Stato
            </label>
            <select
              className="select"
              value={status ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) search.delete('status');
                else search.set('status', v);
                search.set('page', '0');
                setSearch(search);
              }}
            >
              <option value="">Tutti</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
              Area
            </label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="input pl-8"
                placeholder="Filtra per area…"
                value={area ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) search.delete('area');
                  else search.set('area', v);
                  search.set('page', '0');
                  setSearch(search);
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
              Tag
            </label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="input pl-8"
                placeholder="Filtra per tag…"
                value={tag ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) search.delete('tag');
                  else search.set('tag', v);
                  search.set('page', '0');
                  setSearch(search);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {q.isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-brand-600 dark:text-brand-400" />
        </div>
      )}

      {q.isError && (
        <div className="card p-8 text-center">
          <p className="text-sm text-red-500 dark:text-red-400">Errore nel caricamento dei dati.</p>
        </div>
      )}

      {q.data && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    Titolo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    Tipo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    Stato
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    Area
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                {q.data.items.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        to={`/artifact/${a.id}`}
                        className="text-sm font-medium text-gray-900 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        {a.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <TypeBadge type={a.type} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 dark:text-slate-400">
                      {a.area ?? '—'}
                    </td>
                  </tr>
                ))}
                {q.data.items.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-sm text-gray-400 dark:text-slate-500"
                    >
                      Nessun artefatto trovato con i filtri selezionati.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-slate-700 px-5 py-3">
            <div className="text-xs text-gray-500 dark:text-slate-400">
              {q.data.total} risultat{q.data.total === 1 ? 'o' : 'i'} — Pagina {page + 1} di{' '}
              {totalPages}
            </div>
            <div className="flex gap-1">
              <button
                className="btn-ghost btn-sm"
                disabled={page <= 0}
                onClick={() => {
                  search.set('page', String(Math.max(0, page - 1)));
                  setSearch(search);
                }}
              >
                <ChevronLeft size={14} />
                Prec.
              </button>
              <button
                className="btn-ghost btn-sm"
                disabled={(page + 1) * q.data.size >= q.data.total}
                onClick={() => {
                  search.set('page', String(page + 1));
                  setSearch(search);
                }}
              >
                Succ.
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
