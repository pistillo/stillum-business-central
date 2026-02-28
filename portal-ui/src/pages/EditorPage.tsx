import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Editor, { type Monaco } from '@monaco-editor/react';
import * as yaml from 'js-yaml';
import { AlertCircle, ArrowLeft, Check, Loader2, Save } from 'lucide-react';
import { StillumFormsEditorTab } from '../form-editor';
import { useTranslation } from 'react-i18next';
import type { ArtifactType, ArtifactVersion } from '../api/types';
import {
  getArtifact,
  getVersion,
  listVersions,
  updateVersion,
  getPayloadUploadUrl,
  getPayloadDownloadUrl,
  updatePayloadRef,
} from '../api/registry';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';
import { useTheme } from '../theme/ThemeContext';
import { DependenciesPanel } from '../components/DependenciesPanel';

type EditorFormat = 'json' | 'yaml' | 'xml' | 'stillum-editor' | 'typescript';

function getDefaultContent(type: ArtifactType): string {
  if (type === 'FORM' || type === 'REQUEST') return '{}';
  if (type === 'MODULE')
    return 'export default function Module() {\n  return <div>Module</div>;\n}';
  if (type === 'COMPONENT')
    return 'export default function Component() {\n  return <div>Component</div>;\n}';
  if (type === 'PROCESS')
    return '<?xml version="1.0" encoding="UTF-8"?>\n<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"/>';
  if (type === 'RULE')
    return '<?xml version="1.0" encoding="UTF-8"?>\n<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/"/>';
  return '';
}

function getFormats(type: ArtifactType): EditorFormat[] {
  if (type === 'FORM') return ['stillum-editor', 'json', 'yaml'];
  if (type === 'REQUEST') return ['json', 'yaml'];
  if (type === 'MODULE' || type === 'COMPONENT') return ['typescript'];
  return ['xml'];
}

function getContentType(type: ArtifactType): string {
  if (type === 'FORM' || type === 'REQUEST' || type === 'MODULE' || type === 'COMPONENT')
    return 'application/json';
  return 'application/xml';
}

function jsonToYaml(json: string, errorMsg: string): string {
  try {
    return yaml.dump(JSON.parse(json), { indent: 2, lineWidth: 120 });
  } catch {
    return errorMsg;
  }
}

function yamlToJson(yamlStr: string): string {
  try {
    return JSON.stringify(yaml.load(yamlStr), null, 2);
  } catch {
    return '{}';
  }
}

const reactTypeDefinitions = `declare module 'react' {
  export * from 'react';
  export default React;
}
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface ElementClass extends React.Component<any> {}
  interface ElementAttributesProperty { props: {}; }
  interface ElementChildrenAttribute { children: {}; }
  interface IntrinsicAttributes { [elemName: string]: any; }
}`;

function configureMonacoForTypeScript(monaco: Monaco) {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    reactTypeDefinitions,
    'file:///node_modules/@types/react/index.d.ts'
  );
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
    typeRoots: ['node_modules/@types'],
  });
}

export function EditorPage() {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();
  const { resolved: theme } = useTheme();
  const queryClient = useQueryClient();
  const params = useParams();
  const artifactId = params.artifactId ?? '';
  const versionId = params.versionId ?? '';

  const [jsonContent, setJsonContent] = useState('');
  const [xmlContent, setXmlContent] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [artifactType, setArtifactType] = useState<ArtifactType>('PROCESS');
  const [activeTab, setActiveTab] = useState<EditorFormat>('json');
  const [dependenciesVersion, setDependenciesVersion] = useState<ArtifactVersion | null>(null);
  const [dependenciesArtifactId, setDependenciesArtifactId] = useState<string | null>(null);
  const [dependenciesVersionId, setDependenciesVersionId] = useState<string | null>(null);
  const [dependenciesReadOnly, setDependenciesReadOnly] = useState(false);
  const [dependenciesLoading, setDependenciesLoading] = useState(false);

  const artifactQuery = useQuery({
    queryKey: ['artifact', tenantId, artifactId],
    queryFn: () => getArtifact({ token: getAccessToken(), tenantId: tenantId!, artifactId }),
    enabled: !!tenantId && !!artifactId,
  });

  const versionQuery = useQuery({
    queryKey: ['version', tenantId, artifactId, versionId],
    queryFn: () =>
      getVersion({ token: getAccessToken(), tenantId: tenantId!, artifactId, versionId }),
    enabled: !!tenantId && !!artifactId && !!versionId,
  });

  const artifact = artifactQuery.data;
  const version = versionQuery.data;
  const isLoading = artifactQuery.isLoading || versionQuery.isLoading;
  const isError = artifactQuery.isError || versionQuery.isError;
  const status = isLoading ? 'loading' : isError ? 'error' : 'ready';

  const artifactTitle = artifact?.title ?? '';
  const versionLabel = version?.version ?? '';
  const versionState = version?.state ?? 'DRAFT';

  const isJsonBased = artifact?.type === 'FORM' || artifact?.type === 'REQUEST';
  const isTypeScriptBased = artifact?.type === 'MODULE' || artifact?.type === 'COMPONENT';

  // Initialize state from fetched data
  useEffect(() => {
    if (artifact) setArtifactType(artifact.type);
  }, [artifact]);

  useEffect(() => {
    if (version && isTypeScriptBased) {
      // Only update local state if it's empty to avoid overwriting user changes
      setSourceCode((prev) => prev || version.sourceCode || getDefaultContent(artifact!.type));
    }
  }, [version, isTypeScriptBased, artifact]);

  // Load payload for non-TS artifacts via presigned download URL
  useEffect(() => {
    if (!version || !artifact || isTypeScriptBased || !tenantId) return;

    if (!version.payloadRef) {
      const def = getDefaultContent(artifact.type);
      if (isJsonBased) setJsonContent(def);
      else setXmlContent(def);
      return;
    }

    getPayloadDownloadUrl({
      token: getAccessToken(),
      tenantId,
      artifactId,
      versionId,
    })
      .then(({ url }) => fetch(url))
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch payload');
        return res.text();
      })
      .then((text) => {
        if (isJsonBased) setJsonContent(text);
        else setXmlContent(text);
      })
      .catch((err) => console.error('Error loading payload:', err));
  }, [
    version,
    isTypeScriptBased,
    isJsonBased,
    tenantId,
    artifactId,
    versionId,
    artifact,
    getAccessToken,
  ]);

  // Load dependencies panel for MODULE/COMPONENT
  useEffect(() => {
    if (artifact?.type === 'MODULE' && version) {
      setDependenciesReadOnly(false);
      setDependenciesLoading(false);
      setDependenciesArtifactId(artifactId);
      setDependenciesVersionId(versionId);
      setDependenciesVersion(version);
      return;
    }

    if (artifact?.type === 'COMPONENT' && artifact.parentModuleId && tenantId) {
      setDependenciesLoading(true);
      setDependenciesReadOnly(true);

      listVersions({ token: getAccessToken(), tenantId, artifactId: artifact.parentModuleId })
        .then((versions) => {
          const parentVersion = versions[0];
          if (!parentVersion) return;
          setDependenciesArtifactId(artifact.parentModuleId!);
          setDependenciesVersionId(parentVersion.id);
          setDependenciesVersion(parentVersion);
        })
        .catch((err) => console.error('Error loading parent module:', err))
        .finally(() => setDependenciesLoading(false));
      return;
    }

    setDependenciesReadOnly(false);
    setDependenciesLoading(false);
    setDependenciesArtifactId(null);
    setDependenciesVersionId(null);
    setDependenciesVersion(null);
  }, [artifact, tenantId, artifactId, versionId, getAccessToken, version]);

  const formats = useMemo(() => (artifact ? getFormats(artifact.type) : []), [artifact]);

  useEffect(() => {
    if (formats.length > 0 && !formats.includes(activeTab)) {
      setActiveTab(formats[0]);
    }
  }, [formats, activeTab]);

  const editorValue = useMemo(() => {
    if (isTypeScriptBased) return sourceCode;
    if (!isJsonBased) return xmlContent;
    if (activeTab === 'yaml') return jsonToYaml(jsonContent, t('editor.conversionError'));
    return jsonContent;
  }, [isTypeScriptBased, isJsonBased, xmlContent, jsonContent, sourceCode, activeTab, t]);

  const editorLanguage = useMemo(() => {
    if (isTypeScriptBased) return 'typescript';
    if (!isJsonBased) return 'xml';
    return activeTab === 'yaml' ? 'yaml' : 'json';
  }, [isTypeScriptBased, isJsonBased, activeTab]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const v = value ?? '';
      if (isTypeScriptBased) {
        setSourceCode(v);
        return;
      }
      if (!isJsonBased) {
        setXmlContent(v);
        return;
      }
      if (activeTab === 'yaml') {
        setJsonContent(yamlToJson(v));
      } else {
        setJsonContent(v);
      }
    },
    [isTypeScriptBased, isJsonBased, activeTab]
  );

  const contentToSave = isTypeScriptBased ? sourceCode : isJsonBased ? jsonContent : xmlContent;

  const handleTabChange = useCallback((tab: EditorFormat) => {
    setActiveTab(tab);
  }, []);

  const save = useMutation({
    mutationFn: async () => {
      if (!tenantId) throw new Error('Tenant not selected');
      if (isTypeScriptBased) {
        return updateVersion({
          token: getAccessToken(),
          tenantId,
          artifactId,
          versionId,
          sourceCode: contentToSave,
        });
      }
      const contentType = getContentType(artifactType);
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
        body: contentToSave,
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['version', tenantId, artifactId, versionId],
      });
    },
  });

  const isReadOnly = versionState === 'PUBLISHED';

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/artifact/${artifactId}`} className="btn-ghost btn-sm shrink-0">
            <ArrowLeft size={14} />
            {t('editor.back')}
          </Link>
          <div className="h-5 w-px bg-gray-200 dark:bg-slate-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {artifactTitle || 'Editor'}
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              {t(`type.${artifactType}`)} · v{versionLabel}
              {isReadOnly ? ` · ${t('editor.readOnly')}` : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {save.isSuccess && (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Check size={14} />
              {t('editor.saved')}
            </span>
          )}
          {save.isError && (
            <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
              <AlertCircle size={14} />
              {t('editor.error')}
            </span>
          )}
          <button
            className="btn-primary btn-sm"
            disabled={save.isPending || status !== 'ready' || isReadOnly}
            onClick={() => save.mutate()}
          >
            {save.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {t('editor.save')}
          </button>
        </div>
      </div>

      {/* Format tabs (only for JSON-based types) */}
      {isJsonBased && (
        <div className="flex border-b border-gray-200 dark:border-slate-700 mb-0">
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleTabChange(fmt)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px
                ${
                  activeTab === fmt
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
            >
              {fmt === 'stillum-editor' ? 'Editor StillumForms' : fmt.toUpperCase()}
            </button>
          ))}
          <div className="flex-1" />
          <span className="self-center text-[10px] text-gray-400 dark:text-slate-500 pr-2">
            {t('editor.persistence')}
          </span>
        </div>
      )}

      {/* Editor area: min-h-0 so flex child can shrink and editor gets correct height */}
      <div className="flex-1 min-h-0 flex gap-4">
        <div className="flex-1 card overflow-hidden rounded-t-none border-t-0 flex flex-col">
          {status === 'loading' && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="animate-spin text-brand-600 dark:text-brand-400" />
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  {t('editor.loadingPayload')}
                </span>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <AlertCircle size={28} className="text-red-500" />
                <span className="text-sm text-red-500 dark:text-red-400">
                  {t('editor.loadError')}
                </span>
              </div>
            </div>
          )}

          {status === 'ready' && activeTab === 'stillum-editor' && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <StillumFormsEditorTab
                initialContent={jsonContent}
                onContentChange={setJsonContent}
                theme={theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'system'}
              />
            </div>
          )}

          {status === 'ready' && activeTab !== 'stillum-editor' && (
            <div className="flex-1 min-h-0 flex flex-col">
              <Editor
                height="100%"
                language={editorLanguage}
                value={editorValue}
                onChange={handleEditorChange}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                beforeMount={isTypeScriptBased ? configureMonacoForTypeScript : undefined}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  readOnly: isReadOnly,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 2,
                  automaticLayout: true,
                  padding: { top: 12 },
                }}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <Loader2 size={24} className="animate-spin text-gray-400" />
                  </div>
                }
              />
            </div>
          )}
        </div>

        {isTypeScriptBased && tenantId && (
          <div className="w-80 card overflow-hidden flex flex-col">
            <DependenciesPanel
              version={dependenciesVersion}
              tenantId={tenantId}
              artifactId={dependenciesArtifactId ?? artifactId}
              versionId={dependenciesVersionId ?? versionId}
              readOnly={artifactType === 'COMPONENT' || dependenciesReadOnly}
              loading={artifactType === 'COMPONENT' && dependenciesLoading}
              onVersionUpdated={(v) => {
                if (artifactType === 'MODULE') setDependenciesVersion(v);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
