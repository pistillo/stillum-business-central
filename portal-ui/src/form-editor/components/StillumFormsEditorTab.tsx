/**
 * Tab che integra l'editor StillumForms (@tecnosys/stillum-forms-editor).
 * Usato nella EditorPage come secondo tab visivo oltre all'editor custom (palette + albero).
 */

import '../styles/stillum-editor.css';
import '../styles/erp-design-system.css';

import type { ComponentType } from 'react';
import { useCallback, useMemo } from 'react';
import {
  Editor as StillumEditorComponent,
  type EditorProps,
  type ThemeMode,
} from '@tecnosys/stillum-forms-editor';
import type { FormDefinition } from '@tecnosys/stillum-forms-core';

// Cast per compatibilità React 18 (portal-ui) vs React 19 (stillum-forms-editor)
const Editor = StillumEditorComponent as ComponentType<EditorProps>;

export interface StillumFormsEditorTabProps {
  /** Contenuto JSON iniziale della FormDefinition */
  initialContent: string;
  /** Callback invocata quando la definizione cambia (JSON string) */
  onContentChange: (json: string) => void;
  /** Tema: 'light' | 'dark' | 'system' */
  theme?: ThemeMode;
  /** Altezza del contenitore (default: 100%) */
  height?: string;
}

function parseFormDefinition(json: string): FormDefinition | undefined {
  if (!json || json.trim() === '') return undefined;
  try {
    const parsed = JSON.parse(json) as FormDefinition;
    return parsed && typeof parsed === 'object' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function StillumFormsEditorTab({
  initialContent,
  onContentChange,
  theme = 'system',
}: StillumFormsEditorTabProps) {
  const initialDefinition = useMemo(
    () => parseFormDefinition(initialContent),
    [initialContent] // Solo al mount: il tab si smonta quando si cambia tab, quindi al re-mount avrà il nuovo initialContent
  );

  const handleChange = useCallback(
    (definition: FormDefinition) => {
      try {
        onContentChange(JSON.stringify(definition, null, 2));
      } catch {
        // ignore serialization errors
      }
    },
    [onContentChange]
  );

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col">
      <Editor
        initialDefinition={initialDefinition}
        onChange={handleChange}
        height="100%"
        theme={theme}
      />
    </div>
  );
}
