import { useMemo } from 'react';
import { useFormEditorStore } from '../store';
import { buildTree } from '../utils';
import type { TreeNode } from '../utils';
import type { DropletDefinition, PoolDefinition, TriggerDefinition } from '../types';

// ── Layout style builders ──────────────────────────────────────────────────

function poolLayoutStyle(pool: PoolDefinition): React.CSSProperties {
  const style: React.CSSProperties = {};

  if (pool.padding) style.padding = pool.padding;
  if (pool.gap) style.gap = pool.gap;
  if (pool.alignItems) style.alignItems = pool.alignItems as React.CSSProperties['alignItems'];
  if (pool.justifyContent)
    style.justifyContent = pool.justifyContent as React.CSSProperties['justifyContent'];
  if (pool.maxWidth) style.maxWidth = pool.maxWidth;
  if (pool.minWidth) style.minWidth = pool.minWidth;

  switch (pool.type) {
    case 'vertical':
      style.display = 'flex';
      style.flexDirection = 'column';
      if (!pool.gap) style.gap = '8px';
      break;
    case 'horizontal':
      style.display = 'flex';
      style.flexDirection = 'row';
      if (!pool.gap) style.gap = '8px';
      if (pool.wrap) style.flexWrap = 'wrap';
      break;
    case 'responsive-grid':
      style.display = 'grid';
      if (pool.columns) {
        style.gridTemplateColumns = `repeat(${pool.columns}, 1fr)`;
      } else if (pool.minColumnWidth) {
        style.gridTemplateColumns = `repeat(auto-fill, minmax(${pool.minColumnWidth}, 1fr))`;
      } else {
        style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
      }
      if (!pool.gap) style.gap = '8px';
      break;
    case 'grid':
      style.display = 'grid';
      if (pool.columnTemplate) style.gridTemplateColumns = pool.columnTemplate;
      if (pool.rowTemplate) style.gridTemplateRows = pool.rowTemplate;
      if (!pool.gap) style.gap = '8px';
      break;
    case 'flex':
      style.display = 'flex';
      if (pool.flexDirection)
        style.flexDirection = pool.flexDirection as React.CSSProperties['flexDirection'];
      if (pool.flexWrap) style.flexWrap = pool.flexWrap as React.CSSProperties['flexWrap'];
      if (!pool.gap) style.gap = '8px';
      break;
    case 'data-table':
    case 'data-iterator':
      style.display = 'flex';
      style.flexDirection = 'column';
      if (!pool.gap) style.gap = '4px';
      break;
    default:
      style.display = 'flex';
      style.flexDirection = 'column';
      if (!pool.gap) style.gap = '8px';
      break;
  }

  return style;
}

function placementStyle(node: {
  placement?: {
    area?: string;
    colSpan?: number;
    rowSpan?: number;
    width?: string | number;
    height?: string | number;
    justifySelf?: string;
    alignSelf?: string;
  };
}): React.CSSProperties {
  const style: React.CSSProperties = {};
  const p = node.placement;
  if (!p) return style;
  if (p.area) style.gridArea = p.area;
  if (p.colSpan) style.gridColumn = `span ${p.colSpan}`;
  if (p.rowSpan) style.gridRow = `span ${p.rowSpan}`;
  if (p.width) style.width = p.width;
  if (p.height) style.height = p.height;
  if (p.justifySelf) style.justifySelf = p.justifySelf as React.CSSProperties['justifySelf'];
  if (p.alignSelf) style.alignSelf = p.alignSelf as React.CSSProperties['alignSelf'];
  return style;
}

// ── Droplet preview ────────────────────────────────────────────────────────

function DropletPreview({
  droplet,
  isSelected,
  onSelect,
}: {
  droplet: DropletDefinition;
  isSelected: boolean;
  onSelect: () => void;
}) {
  if (droplet.visible === false) return null;

  const labelPos = droplet.labelPosition ?? 'top';
  const label = droplet.label || droplet.name;
  const isHorizontal = labelPos === 'left' || labelPos === 'right';

  const sizeClass =
    droplet.size === 'extraSmall'
      ? 'text-xs'
      : droplet.size === 'small'
        ? 'text-sm'
        : droplet.size === 'large'
          ? 'text-base'
          : 'text-sm';

  const renderInput = () => {
    const base = `w-full border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 ${sizeClass}`;

    switch (droplet.type) {
      case 'textarea':
        return (
          <textarea
            className={base}
            rows={3}
            placeholder={droplet.placeholder || label}
            disabled
            readOnly
          />
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
            <input type="checkbox" disabled className="rounded border-gray-300" />
            {label}
          </label>
        );
      case 'select':
        return (
          <select className={base} disabled>
            <option>{droplet.placeholder || `Seleziona ${label}...`}</option>
          </select>
        );
      case 'date':
        return <input type="date" className={base} disabled />;
      case 'time':
        return <input type="time" className={base} disabled />;
      case 'number':
        return (
          <input type="number" className={base} placeholder={droplet.placeholder || '0'} disabled />
        );
      case 'email':
        return (
          <input
            type="email"
            className={base}
            placeholder={droplet.placeholder || 'email@esempio.it'}
            disabled
          />
        );
      case 'stillum-searchbar':
        return (
          <div className={`${base} flex items-center gap-2`}>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-gray-400">{droplet.placeholder || 'Cerca...'}</span>
          </div>
        );
      case 'stillum-yaml-editor':
        return (
          <div
            className={`${base} font-mono bg-gray-50 dark:bg-slate-900`}
            style={{ minHeight: '60px' }}
          >
            <span className="text-gray-400 text-xs">YAML Editor</span>
          </div>
        );
      case 'stillum-table':
        return (
          <div className={`${base} bg-gray-50 dark:bg-slate-900`} style={{ minHeight: '60px' }}>
            <span className="text-gray-400 text-xs">Tabella</span>
          </div>
        );
      default:
        return (
          <input type="text" className={base} placeholder={droplet.placeholder || label} disabled />
        );
    }
  };

  return (
    <div
      className={`rounded transition-all ${isSelected ? 'ring-2 ring-brand-400 ring-offset-1' : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-slate-600'}`}
      style={placementStyle(droplet)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {droplet.type === 'checkbox' ? (
        renderInput()
      ) : (
        <div
          className={`flex ${isHorizontal ? 'flex-row items-center gap-3' : 'flex-col gap-1'} ${labelPos === 'right' ? 'flex-row-reverse' : ''} ${labelPos === 'bottom' ? 'flex-col-reverse' : ''}`}
        >
          {labelPos !== 'hidden' && (
            <label
              className={`block text-xs font-medium text-gray-600 dark:text-slate-400 ${isHorizontal ? 'shrink-0 w-28' : ''}`}
            >
              {label}
              {droplet.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
          {renderInput()}
        </div>
      )}
    </div>
  );
}

// ── Trigger preview ────────────────────────────────────────────────────────

function TriggerPreview({
  trigger,
  isSelected,
  onSelect,
}: {
  trigger: TriggerDefinition;
  isSelected: boolean;
  onSelect: () => void;
}) {
  if (trigger.visible === false) return null;

  const variantClasses: Record<string, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 border-brand-600',
    secondary:
      'bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-200 border-gray-300 dark:border-slate-500',
    outline:
      'bg-transparent text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-600',
    ghost:
      'bg-transparent text-gray-600 dark:text-slate-400 border-transparent hover:bg-gray-100 dark:hover:bg-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
  };

  const sizeClasses: Record<string, string> = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm',
    xl: 'px-5 py-2.5 text-base',
  };

  const variant = trigger.variant ?? 'primary';
  const size = trigger.buttonSize ?? 'md';
  const caption = trigger.caption || trigger.name;

  return (
    <div
      style={placementStyle(trigger)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <button
        type="button"
        disabled
        className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors
          ${variantClasses[variant] ?? variantClasses.primary}
          ${sizeClasses[size] ?? sizeClasses.md}
          ${isSelected ? 'ring-2 ring-brand-400 ring-offset-1' : ''}`}
      >
        {trigger.icon && trigger.iconPosition !== 'right' && (
          <span className="text-xs opacity-70">[{trigger.icon}]</span>
        )}
        {trigger.displayMode !== 'icon-only' && caption}
        {trigger.icon && trigger.iconPosition === 'right' && (
          <span className="text-xs opacity-70">[{trigger.icon}]</span>
        )}
      </button>
    </div>
  );
}

// ── Pool preview (recursive) ───────────────────────────────────────────────

function PoolPreview({
  treeNode,
  isSelected,
  onSelectNode,
  selectedNodeId,
}: {
  treeNode: TreeNode;
  isSelected: boolean;
  onSelectNode: (id: string) => void;
  selectedNodeId: string | null;
}) {
  const pool = treeNode.node as PoolDefinition;
  if (pool.visible === false) return null;

  const layoutStyle = poolLayoutStyle(pool);

  return (
    <div
      className={`rounded-md border transition-all ${
        isSelected
          ? 'border-purple-400 dark:border-purple-500 ring-2 ring-purple-300/50'
          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
      }`}
      style={{ ...placementStyle(pool), ...(layoutStyle.padding ? {} : { padding: '8px' }) }}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode(treeNode.editorId);
      }}
    >
      {/* Pool header */}
      {(pool.title || pool.showHeader) && (
        <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1 pb-1 border-b border-gray-100 dark:border-slate-700">
          {pool.icon && <span className="mr-1">[{pool.icon}]</span>}
          {pool.title || pool.name}
        </div>
      )}

      {/* Pool body */}
      <div style={layoutStyle}>
        {treeNode.children.map((child) => (
          <PreviewNode
            key={child.editorId}
            treeNode={child}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
          />
        ))}
        {treeNode.children.length === 0 && (
          <div className="text-[10px] text-gray-300 dark:text-slate-600 italic py-2 text-center">
            Pool vuoto
          </div>
        )}
      </div>
    </div>
  );
}

// ── Generic tree node dispatcher ───────────────────────────────────────────

function PreviewNode({
  treeNode,
  selectedNodeId,
  onSelectNode,
}: {
  treeNode: TreeNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}) {
  const isSelected = selectedNodeId === treeNode.editorId;

  switch (treeNode.kind) {
    case 'pool':
      return (
        <PoolPreview
          treeNode={treeNode}
          isSelected={isSelected}
          onSelectNode={onSelectNode}
          selectedNodeId={selectedNodeId}
        />
      );
    case 'droplet':
      return (
        <DropletPreview
          droplet={treeNode.node as DropletDefinition}
          isSelected={isSelected}
          onSelect={() => onSelectNode(treeNode.editorId)}
        />
      );
    case 'trigger':
      return (
        <TriggerPreview
          trigger={treeNode.node as TriggerDefinition}
          isSelected={isSelected}
          onSelect={() => onSelectNode(treeNode.editorId)}
        />
      );
    default:
      return null;
  }
}

// ── Main FormPreview ───────────────────────────────────────────────────────

export function FormPreview() {
  const formDefinition = useFormEditorStore((s) => s.formDefinition);
  const selectedNodeId = useFormEditorStore((s) => s.selectedNodeId);
  const selectNode = useFormEditorStore((s) => s.selectNode);

  const tree = useMemo(() => buildTree(formDefinition), [formDefinition]);

  const rootStyle = poolLayoutStyle(formDefinition);
  const isEmpty = tree.children.length === 0;

  return (
    <div className="h-full overflow-auto bg-white dark:bg-slate-900">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 border-b border-gray-100 dark:border-slate-800">
        Anteprima
      </div>
      <div className="p-4" onClick={() => selectNode('form')}>
        {/* Form title */}
        {formDefinition.title && (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-3">
            {formDefinition.title}
          </h2>
        )}

        {/* Form body with root layout */}
        <div
          style={rootStyle}
          className={`rounded-lg border border-dashed p-4 transition-all ${
            selectedNodeId === 'form'
              ? 'border-brand-400 dark:border-brand-500'
              : 'border-gray-200 dark:border-slate-700'
          }`}
        >
          {tree.children.map((child) => (
            <PreviewNode
              key={child.editorId}
              treeNode={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={selectNode}
            />
          ))}

          {isEmpty && (
            <div className="text-center text-sm text-gray-400 dark:text-slate-500 py-8">
              Il form è vuoto. Aggiungi elementi dalla palette.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
