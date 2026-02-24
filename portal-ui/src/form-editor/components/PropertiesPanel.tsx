import { AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useFormEditorStore } from '../store';
import type {
  DropletDefinition,
  FormDefinition,
  PoolDefinition,
  TriggerDefinition,
} from '../types';
import { DROPLET_TYPES, POOL_TYPES, TRIGGER_VARIANTS, TRIGGER_BUTTON_SIZES } from '../types';
import { findNodeByEditorId } from '../utils';

// ── Helpers ────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      className="input"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      placeholder={placeholder}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function CheckboxInput({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

// ── Pool options helper ────────────────────────────────────────────────────

function usePoolOptions() {
  const fd = useFormEditorStore((s) => s.formDefinition);
  return useMemo(
    () => [
      { value: '', label: '(root / nessuno)' },
      ...(fd.pools ?? []).map((p) => ({ value: p.name, label: p.title || p.name })),
    ],
    [fd.pools]
  );
}

// ── BaseElement shared fields ──────────────────────────────────────────────

function BaseElementFields({
  editorId,
  node,
}: {
  editorId: string;
  node: {
    name: string;
    pool?: string;
    visible?: boolean;
    enabled?: boolean;
    readonly?: boolean;
    order?: number;
    description?: string;
    customClass?: string;
  };
}) {
  const updateNode = useFormEditorStore((s) => s.updateNode);
  const poolOptions = usePoolOptions();

  return (
    <>
      <Field label="Nome">
        <TextInput value={node.name} onChange={(v) => updateNode(editorId, { name: v })} />
      </Field>
      <Field label="Pool (genitore)">
        <SelectInput
          value={node.pool ?? ''}
          onChange={(v) => updateNode(editorId, { pool: v || undefined })}
          options={poolOptions}
        />
      </Field>
      <Field label="Ordine">
        <NumberInput value={node.order} onChange={(v) => updateNode(editorId, { order: v })} />
      </Field>
      <CheckboxInput
        checked={node.visible !== false}
        onChange={(v) => updateNode(editorId, { visible: v })}
        label="Visibile"
      />
      <CheckboxInput
        checked={node.enabled !== false}
        onChange={(v) => updateNode(editorId, { enabled: v })}
        label="Abilitato"
      />
      <CheckboxInput
        checked={node.readonly === true}
        onChange={(v) => updateNode(editorId, { readonly: v })}
        label="Sola lettura"
      />
      <Field label="Descrizione">
        <TextInput
          value={node.description ?? ''}
          onChange={(v) => updateNode(editorId, { description: v || undefined })}
          placeholder="Descrizione opzionale"
        />
      </Field>
      <Field label="Classe CSS">
        <TextInput
          value={node.customClass ?? ''}
          onChange={(v) => updateNode(editorId, { customClass: v || undefined })}
          placeholder="es. my-class"
        />
      </Field>
    </>
  );
}

// ── Sub-panels ─────────────────────────────────────────────────────────────

function FormRootPanel({ fd }: { fd: FormDefinition }) {
  const updateNode = useFormEditorStore((s) => s.updateNode);

  return (
    <div className="space-y-3">
      <Field label="Nome">
        <TextInput value={fd.name} onChange={(v) => updateNode('form', { name: v })} />
      </Field>
      <Field label="Titolo">
        <TextInput
          value={fd.title ?? ''}
          onChange={(v) => updateNode('form', { title: v || undefined })}
          placeholder="Titolo del form"
        />
      </Field>
      <Field label="Tipo layout root">
        <SelectInput
          value={fd.type}
          onChange={(v) => updateNode('form', { type: v })}
          options={POOL_TYPES.map((t) => ({ value: t, label: t }))}
        />
      </Field>
      <Field label="Gap">
        <TextInput
          value={fd.gap ?? ''}
          onChange={(v) => updateNode('form', { gap: v || undefined })}
          placeholder="es. 16px"
        />
      </Field>
      <Field label="Padding">
        <TextInput
          value={fd.padding ?? ''}
          onChange={(v) => updateNode('form', { padding: v || undefined })}
          placeholder="es. 16px"
        />
      </Field>
    </div>
  );
}

function PoolPanel({ pool, editorId }: { pool: PoolDefinition; editorId: string }) {
  const updateNode = useFormEditorStore((s) => s.updateNode);

  return (
    <div className="space-y-3">
      <BaseElementFields editorId={editorId} node={pool} />
      <Field label="Titolo">
        <TextInput
          value={pool.title ?? ''}
          onChange={(v) => updateNode(editorId, { title: v || undefined })}
          placeholder="Titolo pool"
        />
      </Field>
      <Field label="Tipo layout">
        <SelectInput
          value={pool.type}
          onChange={(v) => updateNode(editorId, { type: v })}
          options={POOL_TYPES.map((t) => ({ value: t, label: t }))}
        />
      </Field>
      <Field label="Gap">
        <TextInput
          value={pool.gap ?? ''}
          onChange={(v) => updateNode(editorId, { gap: v || undefined })}
          placeholder="es. 8px"
        />
      </Field>
      <Field label="Padding">
        <TextInput
          value={pool.padding ?? ''}
          onChange={(v) => updateNode(editorId, { padding: v || undefined })}
          placeholder="es. 8px"
        />
      </Field>
      <CheckboxInput
        checked={pool.collapsible === true}
        onChange={(v) => updateNode(editorId, { collapsible: v })}
        label="Collassabile"
      />
      <CheckboxInput
        checked={pool.scrollable === true}
        onChange={(v) => updateNode(editorId, { scrollable: v })}
        label="Scrollabile"
      />
      <CheckboxInput
        checked={pool.iterate === true}
        onChange={(v) => updateNode(editorId, { iterate: v })}
        label="Iteratore dati"
      />
      {pool.iterate && (
        <Field label="Context (array dati)">
          <TextInput
            value={pool.context ?? ''}
            onChange={(v) => updateNode(editorId, { context: v || undefined })}
            placeholder="es. items"
          />
        </Field>
      )}
      {(pool.type === 'responsive-grid' || pool.type === 'grid') && (
        <>
          <Field label="Colonne">
            <NumberInput
              value={pool.columns}
              onChange={(v) => updateNode(editorId, { columns: v })}
            />
          </Field>
          <Field label="Column Template">
            <TextInput
              value={pool.columnTemplate ?? ''}
              onChange={(v) => updateNode(editorId, { columnTemplate: v || undefined })}
              placeholder="es. 1fr 1fr 1fr"
            />
          </Field>
          <Field label="Row Template">
            <TextInput
              value={pool.rowTemplate ?? ''}
              onChange={(v) => updateNode(editorId, { rowTemplate: v || undefined })}
              placeholder="es. auto"
            />
          </Field>
        </>
      )}
      <Field label="Align Items">
        <TextInput
          value={pool.alignItems ?? ''}
          onChange={(v) => updateNode(editorId, { alignItems: v || undefined })}
          placeholder="es. center"
        />
      </Field>
      <Field label="Justify Content">
        <TextInput
          value={pool.justifyContent ?? ''}
          onChange={(v) => updateNode(editorId, { justifyContent: v || undefined })}
          placeholder="es. space-between"
        />
      </Field>
    </div>
  );
}

function DropletPanel({ droplet, editorId }: { droplet: DropletDefinition; editorId: string }) {
  const updateNode = useFormEditorStore((s) => s.updateNode);

  return (
    <div className="space-y-3">
      <BaseElementFields editorId={editorId} node={droplet} />
      <Field label="Label">
        <TextInput
          value={droplet.label ?? ''}
          onChange={(v) => updateNode(editorId, { label: v || undefined })}
          placeholder="Etichetta"
        />
      </Field>
      <Field label="Tipo">
        <SelectInput
          value={droplet.type}
          onChange={(v) => updateNode(editorId, { type: v })}
          options={DROPLET_TYPES.map((t) => ({ value: t, label: t }))}
        />
      </Field>
      <Field label="Label Position">
        <SelectInput
          value={droplet.labelPosition ?? 'top'}
          onChange={(v) => updateNode(editorId, { labelPosition: v })}
          options={[
            { value: 'top', label: 'top' },
            { value: 'left', label: 'left' },
            { value: 'right', label: 'right' },
            { value: 'bottom', label: 'bottom' },
            { value: 'hidden', label: 'hidden' },
          ]}
        />
      </Field>
      <Field label="Placeholder">
        <TextInput
          value={droplet.placeholder ?? ''}
          onChange={(v) => updateNode(editorId, { placeholder: v || undefined })}
        />
      </Field>
      <Field label="Size">
        <SelectInput
          value={droplet.size ?? 'medium'}
          onChange={(v) => updateNode(editorId, { size: v })}
          options={[
            { value: 'extraSmall', label: 'Extra Small' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />
      </Field>
      <CheckboxInput
        checked={droplet.required === true}
        onChange={(v) => updateNode(editorId, { required: v })}
        label="Obbligatorio"
      />
      <Field label="Expression">
        <TextInput
          value={droplet.expression ?? ''}
          onChange={(v) => updateNode(editorId, { expression: v || undefined })}
          placeholder="Espressione dinamica"
        />
      </Field>

      {/* Validation rules inline */}
      {(droplet.type === 'text' || droplet.type === 'textarea' || droplet.type === 'email') && (
        <>
          <Field label="Min lunghezza">
            <NumberInput
              value={(droplet.validation as { minLength?: number } | undefined)?.minLength}
              onChange={(v) =>
                updateNode(editorId, { validation: { ...droplet.validation, minLength: v } })
              }
            />
          </Field>
          <Field label="Max lunghezza">
            <NumberInput
              value={(droplet.validation as { maxLength?: number } | undefined)?.maxLength}
              onChange={(v) =>
                updateNode(editorId, { validation: { ...droplet.validation, maxLength: v } })
              }
            />
          </Field>
        </>
      )}
      {droplet.type === 'number' && (
        <>
          <Field label="Min">
            <NumberInput
              value={(droplet.validation as { min?: number } | undefined)?.min}
              onChange={(v) =>
                updateNode(editorId, { validation: { ...droplet.validation, min: v } })
              }
            />
          </Field>
          <Field label="Max">
            <NumberInput
              value={(droplet.validation as { max?: number } | undefined)?.max}
              onChange={(v) =>
                updateNode(editorId, { validation: { ...droplet.validation, max: v } })
              }
            />
          </Field>
        </>
      )}
    </div>
  );
}

function TriggerPanel({ trigger, editorId }: { trigger: TriggerDefinition; editorId: string }) {
  const updateNode = useFormEditorStore((s) => s.updateNode);

  return (
    <div className="space-y-3">
      <BaseElementFields editorId={editorId} node={trigger} />
      <Field label="Caption">
        <TextInput
          value={trigger.caption ?? ''}
          onChange={(v) => updateNode(editorId, { caption: v || undefined })}
          placeholder="Testo bottone"
        />
      </Field>
      <Field label="Tipo">
        <TextInput value={trigger.type} onChange={(v) => updateNode(editorId, { type: v })} />
      </Field>
      <Field label="Variante">
        <SelectInput
          value={trigger.variant ?? 'primary'}
          onChange={(v) => updateNode(editorId, { variant: v })}
          options={TRIGGER_VARIANTS.map((t) => ({ value: t, label: t }))}
        />
      </Field>
      <Field label="Dimensione">
        <SelectInput
          value={trigger.buttonSize ?? 'md'}
          onChange={(v) => updateNode(editorId, { buttonSize: v })}
          options={TRIGGER_BUTTON_SIZES.map((s) => ({ value: s, label: s }))}
        />
      </Field>
      <Field label="Signal Name">
        <TextInput
          value={trigger.signalName ?? ''}
          onChange={(v) => updateNode(editorId, { signalName: v || undefined })}
          placeholder="es. onSubmit"
        />
      </Field>
      <Field label="Icona">
        <TextInput
          value={trigger.icon ?? ''}
          onChange={(v) => updateNode(editorId, { icon: v || undefined })}
          placeholder="Nome icona"
        />
      </Field>
      <Field label="Icon Position">
        <SelectInput
          value={trigger.iconPosition ?? 'left'}
          onChange={(v) => updateNode(editorId, { iconPosition: v })}
          options={[
            { value: 'left', label: 'left' },
            { value: 'right', label: 'right' },
          ]}
        />
      </Field>
      <Field label="Display Mode">
        <SelectInput
          value={trigger.displayMode ?? 'icon-and-text'}
          onChange={(v) => updateNode(editorId, { displayMode: v })}
          options={[
            { value: 'icon-and-text', label: 'Icona e testo' },
            { value: 'icon-only', label: 'Solo icona' },
          ]}
        />
      </Field>
      <Field label="Href (link)">
        <TextInput
          value={trigger.href ?? ''}
          onChange={(v) => updateNode(editorId, { href: v || undefined })}
          placeholder="URL destinazione"
        />
      </Field>
      <Field label="Max esecuzioni">
        <NumberInput
          value={trigger.maxExecutions}
          onChange={(v) => updateNode(editorId, { maxExecutions: v })}
        />
      </Field>
      <CheckboxInput
        checked={trigger.useXState === true}
        onChange={(v) => updateNode(editorId, { useXState: v })}
        label="Usa XState"
      />
      <Field label="Expression">
        <TextInput
          value={trigger.expression ?? ''}
          onChange={(v) => updateNode(editorId, { expression: v || undefined })}
          placeholder="Espressione dinamica"
        />
      </Field>
    </div>
  );
}

// ── Main PropertiesPanel ───────────────────────────────────────────────────

export function PropertiesPanel() {
  const selectedNodeId = useFormEditorStore((s) => s.selectedNodeId);
  const fd = useFormEditorStore((s) => s.formDefinition);
  const validationErrors = useFormEditorStore((s) => s.validationErrors);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    const found = findNodeByEditorId(fd, selectedNodeId);
    if (!found) return null;
    return { ...found, editorId: selectedNodeId };
  }, [selectedNodeId, fd]);

  const nodeErrors = useMemo(
    () => validationErrors.filter((e) => e.nodeId === selectedNodeId),
    [validationErrors, selectedNodeId]
  );

  const kindLabel: Record<string, string> = {
    form: 'Form',
    pool: 'Pool',
    droplet: 'Droplet',
    trigger: 'Trigger',
  };

  if (!selectedNode) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Proprietà
        </div>
        <div className="flex-1 flex items-center justify-center text-xs text-gray-400 dark:text-slate-500 px-4 text-center">
          Seleziona un nodo nell'albero per visualizzarne le proprietà.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
        Proprietà — {kindLabel[selectedNode.kind] ?? selectedNode.kind}
      </div>

      {nodeErrors.length > 0 && (
        <div className="mx-2 mb-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          {nodeErrors.map((err, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400"
            >
              <AlertCircle size={12} className="shrink-0 mt-0.5" />
              <span>
                <strong>{err.field}</strong>: {err.message}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="px-3 pb-4 space-y-3">
        {selectedNode.kind === 'form' && <FormRootPanel fd={selectedNode.node as FormDefinition} />}
        {selectedNode.kind === 'pool' && (
          <PoolPanel pool={selectedNode.node as PoolDefinition} editorId={selectedNode.editorId} />
        )}
        {selectedNode.kind === 'droplet' && (
          <DropletPanel
            droplet={selectedNode.node as DropletDefinition}
            editorId={selectedNode.editorId}
          />
        )}
        {selectedNode.kind === 'trigger' && (
          <TriggerPanel
            trigger={selectedNode.node as TriggerDefinition}
            editorId={selectedNode.editorId}
          />
        )}
      </div>
    </div>
  );
}
