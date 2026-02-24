import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, PlusCircle } from 'lucide-react';
import type { ArtifactType } from '../api/types';
import { createArtifact, createVersion } from '../api/registry';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';

const TYPES: { value: ArtifactType; label: string; desc: string }[] = [
  { value: 'PROCESS', label: 'BPMN Process', desc: 'Definizione di processo in formato XML/BPMN' },
  { value: 'RULE', label: 'DMN Rule', desc: 'Regola decisionale in formato XML/DMN' },
  { value: 'FORM', label: 'Form', desc: 'Definizione di form in formato JSON' },
  { value: 'REQUEST', label: 'Request', desc: 'Definizione di request in formato JSON' },
];

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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mb-4"
        >
          <ArrowLeft size={14} />
          Torna al catalogo
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuovo Artefatto</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Crea un nuovo artefatto e la sua prima versione.
        </p>
      </div>

      <div className="card p-6 space-y-5">
        {/* Type selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Tipo di artefatto
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`rounded-lg border-2 p-3 text-left transition-all ${
                  type === t.value
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-400'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <div
                  className={`text-sm font-semibold ${
                    type === t.value
                      ? 'text-brand-700 dark:text-brand-400'
                      : 'text-gray-900 dark:text-slate-200'
                  }`}
                >
                  {t.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Titolo <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="es. Processo approvazione ordini"
          />
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Area
          </label>
          <input
            className="input"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="es. finance, hr, operations"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Tag{' '}
            <span className="text-xs text-gray-400 dark:text-slate-500 font-normal">
              (separati da virgola)
            </span>
          </label>
          <input
            className="input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="es. ordini, approvazione, fatturazione"
          />
        </div>

        {/* Version */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Versione iniziale
          </label>
          <input
            className="input max-w-[200px]"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.0"
          />
        </div>

        {/* Error */}
        {m.isError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-400">
              Errore nella creazione dell&apos;artefatto.
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-slate-700/50">
          <Link to="/catalogue" className="btn-secondary">
            Annulla
          </Link>
          <button
            className="btn-primary"
            disabled={!title || m.isPending}
            onClick={() => m.mutate()}
          >
            {m.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <PlusCircle size={16} />
            )}
            {m.isPending ? 'Creazione…' : 'Crea Artefatto'}
          </button>
        </div>
      </div>
    </div>
  );
}
