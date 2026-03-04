import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';
import { useTheme } from '../theme/ThemeContext';
import { config } from '../config';
import { useTranslation } from 'react-i18next';

interface TheiaEditorProps {
  moduleArtifactId: string;
  moduleVersionId: string;
  openComponentId?: string;
  readOnly: boolean;
  onSaveNotification?: () => void;
}

export function TheiaEditor({
  moduleArtifactId,
  moduleVersionId,
  openComponentId,
  readOnly,
  onSaveNotification,
}: TheiaEditorProps) {
  const { t } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getAccessToken } = useAuth();
  const { tenantId } = useTenant();
  const { resolved: theme } = useTheme();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const sendInit = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow || !tenantId) return;

    iframe.contentWindow.postMessage(
      {
        type: 'stillum:init',
        token: getAccessToken(),
        tenantId,
        moduleArtifactId,
        moduleVersionId,
        theme: theme === 'dark' ? 'dark' : 'light',
        registryApiBaseUrl: config.registryApiBaseUrl,
        openComponentId,
        readOnly,
      },
      config.theiaBaseUrl
    );
  }, [
    getAccessToken,
    tenantId,
    moduleArtifactId,
    moduleVersionId,
    theme,
    openComponentId,
    readOnly,
  ]);

  // Listen for messages from Theia iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Validate origin
      try {
        const theiaOrigin = new URL(config.theiaBaseUrl).origin;
        if (event.origin !== theiaOrigin) return;
      } catch {
        return;
      }

      const data = event.data;
      if (!data || typeof data.type !== 'string') return;

      switch (data.type) {
        case 'stillum:ready':
          setStatus('ready');
          sendInit();
          break;
        case 'stillum:save-notification':
          onSaveNotification?.();
          break;
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [sendInit, onSaveNotification]);

  // Sync theme changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow || status !== 'ready') return;

    iframe.contentWindow.postMessage(
      {
        type: 'stillum:theme-change',
        theme: theme === 'dark' ? 'dark' : 'light',
      },
      config.theiaBaseUrl
    );
  }, [theme, status]);

  // Refresh auth token periodically
  useEffect(() => {
    if (status !== 'ready') return;

    const interval = setInterval(() => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;

      iframe.contentWindow.postMessage(
        {
          type: 'stillum:token-refresh',
          token: getAccessToken(),
        },
        config.theiaBaseUrl
      );
    }, 60_000);

    return () => clearInterval(interval);
  }, [getAccessToken, status]);

  // Timeout for loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus((prev) => (prev === 'loading' ? 'error' : prev));
    }, 30_000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full h-full">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-brand-600 dark:text-brand-400" />
            <span className="text-sm text-gray-500 dark:text-slate-400">
              {t('editor.theiaLoading')}
            </span>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900 z-10">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle size={28} className="text-red-500" />
            <span className="text-sm text-red-500 dark:text-red-400">
              {t('editor.theiaConnectionLost')}
            </span>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={config.theiaBaseUrl}
        className="w-full h-full border-0"
        allow="clipboard-read; clipboard-write"
        title="Stillum Editor"
      />
    </div>
  );
}
