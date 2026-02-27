import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, BookOpen, FileText, Loader2, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMyDrafts } from '../hooks/useMyDrafts';
import { useRecentPublications } from '../hooks/useRecentPublications';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';
import type { Artifact } from '../api/types';

function ArtifactList({
  data,
  isLoading,
  isError,
  emptyMessage,
  emptyIcon: EmptyIcon,
}: {
  data: Artifact[] | undefined;
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
  emptyIcon: typeof FileText;
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gray-400 dark:text-slate-500" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500 dark:text-red-400 gap-2">
        <AlertCircle size={24} />
        <span className="text-sm">{t('common.loadError')}</span>
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <EmptyIcon size={32} className="text-gray-300 dark:text-slate-600" />
        <span className="text-sm text-gray-400 dark:text-slate-500">{emptyMessage}</span>
      </div>
    );
  }
  return (
    <div className="divide-y divide-gray-100 dark:divide-slate-700/50">
      {data.map((artifact) => (
        <Link
          key={artifact.id}
          to={`/artifact/${artifact.id}`}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
              {artifact.title}
            </div>
            {artifact.area && (
              <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                {artifact.area}
              </div>
            )}
          </div>
          <TypeBadge type={artifact.type} />
          <StatusBadge status={artifact.status} />
          <ArrowRight
            size={14}
            className="text-gray-300 dark:text-slate-600 group-hover:text-brand-500 transition-colors shrink-0"
          />
        </Link>
      ))}
    </div>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const drafts = useMyDrafts();
  const publications = useRecentPublications();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('home.title')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{t('home.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/catalogue" className="btn-secondary btn-sm">
            <BookOpen size={14} />
            {t('nav.catalogue')}
          </Link>
          <Link to="/catalogue/new" className="btn-primary btn-sm">
            <PlusCircle size={14} />
            {t('nav.newArtifact')}
          </Link>
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700/50">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {t('home.myDrafts')}
            </h2>
            <Link
              to="/catalogue?status=DRAFT"
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
            >
              {t('home.viewAll')}
            </Link>
          </div>
          <ArtifactList
            data={drafts.data?.items}
            isLoading={drafts.isLoading}
            isError={drafts.isError}
            emptyMessage={t('home.noDrafts')}
            emptyIcon={FileText}
          />
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700/50">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {t('home.recentPublications')}
            </h2>
            <Link
              to="/catalogue?status=PUBLISHED"
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
            >
              {t('home.viewAll')}
            </Link>
          </div>
          <ArtifactList
            data={publications.data?.items}
            isLoading={publications.isLoading}
            isError={publications.isError}
            emptyMessage={t('home.noPublications')}
            emptyIcon={BookOpen}
          />
        </section>
      </div>
    </div>
  );
}
