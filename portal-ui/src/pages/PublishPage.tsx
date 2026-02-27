import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { publish } from '../api/publisher';
import { useAuth } from '../auth/AuthContext';
import { useEnvironments } from '../hooks/useEnvironments';
import { useTenant } from '../tenancy/TenantContext';

export function PublishPage() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();
  const envs = useEnvironments();
  const navigate = useNavigate();
  const params = useParams();
  const artifactId = params.artifactId ?? '';
  const versionId = params.versionId ?? '';

  const [environmentId, setEnvironmentId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!envs.data || envs.data.length === 0) return;
    setEnvironmentId((prev) => {
      if (prev && envs.data.some((e) => e.id === prev)) return prev;
      const dev = envs.data.find((e) => e.name.toUpperCase() === 'DEV')?.id;
      return dev ?? envs.data[0].id;
    });
  }, [envs.data]);

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
    onSuccess: () => {
      navigate(`/artifact/${artifactId}`, { replace: true });
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/artifact/${artifactId}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mb-4"
        >
          <ArrowLeft size={14} />
          {t('publishPage.backToArtifact')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('publishPage.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          {t('publishPage.subtitle')}
        </p>
      </div>

      {/* Info bar */}
      <div className="card p-4 flex items-center gap-4">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">
              Artifact ID
            </div>
            <div className="text-xs font-mono text-gray-700 dark:text-slate-300 mt-0.5 truncate">
              {artifactId}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">
              Version ID
            </div>
            <div className="text-xs font-mono text-gray-700 dark:text-slate-300 mt-0.5 truncate">
              {versionId}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {t('publishPage.environmentLabel')} <span className="text-red-500">*</span>
          </label>
          {envs.isSuccess && envs.data.length > 0 ? (
            <select
              className="input text-sm"
              value={environmentId}
              onChange={(e) => setEnvironmentId(e.target.value)}
            >
              {envs.data.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="input font-mono text-sm"
              value={environmentId}
              onChange={(e) => setEnvironmentId(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000020"
            />
          )}
          {envs.isLoading && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
              <Loader2 size={14} className="animate-spin" />
              {t('publishPage.loadingEnvs')}
            </div>
          )}
          {envs.isError && (
            <div className="mt-2 text-xs text-amber-700 dark:text-amber-400">
              {t('publishPage.envsError')}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {t('publishPage.notesLabel')}
          </label>
          <textarea
            className="input min-h-[80px] resize-y"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('publishPage.notesPlaceholder')}
          />
        </div>

        {/* Error */}
        {m.isError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-400">
              {t('publishPage.publishError')}
            </span>
          </div>
        )}

        {/* Success */}
        {m.isSuccess && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                {t('publishPage.publishSuccess')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-green-600/70 dark:text-green-400/70 font-medium">
                  Publication ID
                </span>
                <div className="font-mono text-green-800 dark:text-green-300 mt-0.5 truncate">
                  {m.data.id}
                </div>
              </div>
              <div>
                <span className="text-green-600/70 dark:text-green-400/70 font-medium">
                  Bundle Ref
                </span>
                <div className="font-mono text-green-800 dark:text-green-300 mt-0.5 truncate">
                  {m.data.bundleRef}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-slate-700/50">
          <Link to={`/artifact/${artifactId}`} className="btn-secondary">
            {t('common.cancel')}
          </Link>
          <button
            className="btn-primary"
            disabled={!environmentId || m.isPending}
            onClick={() => m.mutate()}
          >
            {m.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {m.isPending ? t('publishPage.publishing') : t('publishPage.publishButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
