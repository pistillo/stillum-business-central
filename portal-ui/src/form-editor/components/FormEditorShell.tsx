import { AlertCircle, Check, Loader2, Redo2, Save, ShieldAlert, Undo2 } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useFormEditorStore } from '../store';
import { FormTree } from './FormTree';
import { Palette } from './Palette';
import { PropertiesPanel } from './PropertiesPanel';

interface FormEditorShellProps {
  initialContent: string;
  onSave: (json: string) => void;
  saving?: boolean;
  saveSuccess?: boolean;
  saveError?: boolean;
  readOnly?: boolean;
}

export function FormEditorShell({
  initialContent,
  onSave,
  saving,
  saveSuccess,
  saveError,
  readOnly,
}: FormEditorShellProps) {
  const loadFromString = useFormEditorStore((s) => s.loadFromString);
  const toJson = useFormEditorStore((s) => s.toJson);
  const undo = useFormEditorStore((s) => s.undo);
  const redo = useFormEditorStore((s) => s.redo);
  const canUndo = useFormEditorStore((s) => s.canUndo);
  const canRedo = useFormEditorStore((s) => s.canRedo);
  const validate = useFormEditorStore((s) => s.validate);
  const validationErrors = useFormEditorStore((s) => s.validationErrors);
  const dirty = useFormEditorStore((s) => s.dirty);

  // Load initial content
  useEffect(() => {
    if (initialContent) {
      loadFromString(initialContent);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (!readOnly) handleSave();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, readOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(() => {
    const errors = validate();
    if (errors.length > 0) return;
    onSave(toJson());
  }, [validate, onSave, toJson]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-1">
          <button
            className="btn-ghost btn-sm"
            disabled={!canUndo()}
            onClick={undo}
            title="Annulla (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            className="btn-ghost btn-sm"
            disabled={!canRedo()}
            onClick={redo}
            title="Ripeti (Ctrl+Y)"
          >
            <Redo2 size={14} />
          </button>

          {validationErrors.length > 0 && (
            <span className="flex items-center gap-1 ml-2 text-xs text-amber-600 dark:text-amber-400">
              <ShieldAlert size={13} />
              {validationErrors.length} errori
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {dirty && (
            <span className="text-[10px] text-gray-400 dark:text-slate-500">Non salvato</span>
          )}
          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Check size={14} />
              Salvato
            </span>
          )}
          {saveError && (
            <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
              <AlertCircle size={14} />
              Errore
            </span>
          )}
          <button className="btn-primary btn-sm" disabled={saving || readOnly} onClick={handleSave}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salva
          </button>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Palette */}
        <div className="w-52 shrink-0 border-r border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/30 overflow-y-auto">
          <Palette />
        </div>

        {/* Tree */}
        <div className="flex-1 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
          <FormTree />
        </div>

        {/* Properties */}
        <div className="w-72 shrink-0 overflow-y-auto">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
