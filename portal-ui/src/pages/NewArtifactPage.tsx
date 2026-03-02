import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ArtifactType } from '../api/types';
import {
  createArtifact,
  createComponent,
  createModule,
  createVersion,
  listArtifacts,
  listVersions,
} from '../api/registry';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

const TYPE_VALUES: ArtifactType[] = ['PROCESS', 'RULE', 'FORM', 'REQUEST', 'MODULE', 'COMPONENT'];

const TYPE_LABELS: Record<ArtifactType, string> = {
  PROCESS: 'BPMN Process',
  RULE: 'DMN Rule',
  FORM: 'Form',
  REQUEST: 'Request',
  MODULE: 'Module',
  COMPONENT: 'Component',
};

const TYPE_DESC_KEYS: Record<ArtifactType, string> = {
  PROCESS: 'newArtifact.typeProcessDesc',
  RULE: 'newArtifact.typeRuleDesc',
  FORM: 'newArtifact.typeFormDesc',
  REQUEST: 'newArtifact.typeRequestDesc',
  MODULE: 'newArtifact.typeModuleDesc',
  COMPONENT: 'newArtifact.typeComponentDesc',
};

export function NewArtifactPage() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();
  const navigate = useNavigate();

  const [type, setType] = useState<ArtifactType>('PROCESS');
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [tags, setTags] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [parentModuleId, setParentModuleId] = useState('');

  const tagList = useMemo(
    () =>
      tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [tags]
  );

  // Fetch available modules when COMPONENT is selected
  const modulesQuery = useQuery({
    queryKey: ['modules', tenantId],
    queryFn: () =>
      listArtifacts({
        token: getAccessToken(),
        tenantId: tenantId!,
        type: 'MODULE',
        size: 100,
      }),
    enabled: type === 'COMPONENT' && !!tenantId,
  });

  // Reset parent module when type changes away from COMPONENT
  useEffect(() => {
    if (type !== 'COMPONENT') setParentModuleId('');
  }, [type]);

  const m = useMutation({
    mutationFn: async () => {
      if (!tenantId) throw new Error('Tenant not selected');

      const commonParams = {
        token: getAccessToken(),
        tenantId,
        title,
        area: area || undefined,
        tags: tagList.length ? tagList : undefined,
      };

      // MODULE: use dedicated API (auto-creates v0.1.0)
      if (type === 'MODULE') {
        const a = await createModule(commonParams);
        const versions = await listVersions({
          token: getAccessToken(),
          tenantId,
          artifactId: a.id,
        });
        return { artifactId: a.id, versionId: versions[0].id };
      }

      // COMPONENT: use dedicated API with parent module (auto-creates v0.1.0 + dependency)
      if (type === 'COMPONENT') {
        if (!parentModuleId) throw new Error('Parent module is required for COMPONENT');
        const a = await createComponent({ ...commonParams, parentModuleId });
        const versions = await listVersions({
          token: getAccessToken(),
          tenantId,
          artifactId: a.id,
        });
        return { artifactId: a.id, versionId: versions[0].id };
      }

      // Other types: standard flow
      const a = await createArtifact({ ...commonParams, type });
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mb-4"
        >
          <ArrowLeft size={14} />
          {t('newArtifact.backToCatalogue')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('newArtifact.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          {t('newArtifact.subtitle')}
        </p>
      </div>

      <div className="card p-6 space-y-5">
        {/* Type selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {t('newArtifact.typeLabel')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TYPE_VALUES.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setType(val)}
                className={`rounded-lg border-2 p-3 text-left transition-all ${
                  type === val
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-400'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <div
                  className={`text-sm font-semibold ${
                    type === val
                      ? 'text-brand-700 dark:text-brand-400'
                      : 'text-gray-900 dark:text-slate-200'
                  }`}
                >
                  {TYPE_LABELS[val]}
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  {t(TYPE_DESC_KEYS[val])}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Parent module selector (only for COMPONENT) */}
        {type === 'COMPONENT' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('newArtifact.parentModuleLabel')}
            </label>
            <select
              className="select"
              value={parentModuleId}
              onChange={(e) => setParentModuleId(e.target.value)}
            >
              <option value="">{t('newArtifact.parentModuleNone')}</option>
              {modulesQuery.data?.items.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
              {t('newArtifact.parentModuleHint')}
            </p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {t('newArtifact.titleLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('newArtifact.titlePlaceholder')}
          />
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {t('newArtifact.areaLabel')}
          </label>
          <input
            className="input"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder={t('newArtifact.areaPlaceholder')}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {t('newArtifact.tagsLabel')}{' '}
            <span className="text-xs text-gray-400 dark:text-slate-500 font-normal">
              {t('newArtifact.tagsHint')}
            </span>
          </label>
          <input
            className="input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={t('newArtifact.tagsPlaceholder')}
          />
        </div>

        {/* Version (hidden for MODULE/COMPONENT as they auto-generate v0.1.0) */}
        {type !== 'MODULE' && type !== 'COMPONENT' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('newArtifact.versionLabel')}
            </label>
            <input
              className="input max-w-[200px]"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
            />
          </div>
        )}

        {/* Error */}
        {m.isError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-400">
              {t('newArtifact.createError')}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-slate-700/50">
          <Link to="/catalogue" className="btn-secondary">
            {t('common.cancel')}
          </Link>
          <button
            className="btn-primary"
            disabled={!title || m.isPending || (type === 'COMPONENT' && !parentModuleId)}
            onClick={() => m.mutate()}
          >
            {m.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <PlusCircle size={16} />
            )}
            {m.isPending ? t('newArtifact.creating') : t('newArtifact.createButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
