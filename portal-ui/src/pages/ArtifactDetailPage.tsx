import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Code2, Loader2, Pencil, Send, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useArtifactDetail } from '../hooks/useArtifactDetail';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';

export function ArtifactDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const artifactId = params.id ?? '';
  const { artifact, versions } = useArtifactDetail(artifactId);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/catalogue"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
      >
        <ArrowLeft size={14} />
        {t('artifactDetail.backToCatalogue')}
      </Link>

      {/* Artifact header */}
      {artifact.isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-brand-600 dark:text-brand-400" />
        </div>
      )}

      {artifact.data && (
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {artifact.data.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type={artifact.data.type} />
                <StatusBadge status={artifact.data.status} />
                {artifact.data.area && (
                  <span className="badge bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                    {artifact.data.area}
                  </span>
                )}
              </div>
              {artifact.data.description && (
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                  {artifact.data.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-gray-400 dark:text-slate-500 hidden sm:block">
                {artifactId.slice(0, 8)}…
              </span>
            </div>
          </div>

          {/* Tags */}
          {artifact.data.tags && artifact.data.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50">
              <Tag size={14} className="text-gray-400 dark:text-slate-500" />
              <div className="flex flex-wrap gap-1.5">
                {artifact.data.tags.map((tg) => (
                  <span
                    key={tg}
                    className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                  >
                    {tg}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Versions */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <Code2 size={18} className="text-gray-400 dark:text-slate-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {t('artifactDetail.versions')}
          </h2>
        </div>

        {versions.isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-gray-400 dark:text-slate-500" />
          </div>
        )}

        {versions.data && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    {t('artifactDetail.versionCol')}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    {t('artifactDetail.statusCol')}
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    {t('artifactDetail.actionsCol')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                {versions.data.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-mono font-medium text-gray-900 dark:text-slate-200">
                        v{v.version}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={v.state} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {v.state === 'PUBLISHED' ? (
                          <Link
                            to={`/editor/${artifactId}/${v.id}`}
                            className="btn-secondary btn-sm"
                          >
                            <Pencil size={12} />
                            {t('artifactDetail.open')}
                          </Link>
                        ) : (
                          <>
                            <Link
                              to={`/editor/${artifactId}/${v.id}`}
                              className="btn-secondary btn-sm"
                            >
                              <Pencil size={12} />
                              {t('artifactDetail.edit')}
                            </Link>
                            <Link
                              to={`/publish/${artifactId}/${v.id}`}
                              className="btn-primary btn-sm"
                            >
                              <Send size={12} />
                              {t('artifactDetail.publish')}
                            </Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {versions.data.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-12 text-center text-sm text-gray-400 dark:text-slate-500"
                    >
                      {t('artifactDetail.noVersions')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
