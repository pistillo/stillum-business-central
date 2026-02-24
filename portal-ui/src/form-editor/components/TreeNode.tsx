import {
  ChevronDown,
  ChevronRight,
  FormInput,
  Layers,
  MousePointerClick,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { EditorNodeKind } from '../types';
import { useFormEditorStore } from '../store';

interface TreeNodeItemProps {
  editorId: string;
  label: string;
  kind: EditorNodeKind;
  typeName?: string;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  onToggle: () => void;
}

const kindIcons: Record<EditorNodeKind, LucideIcon> = {
  form: Layers,
  pool: Layers,
  droplet: FormInput,
  trigger: MousePointerClick,
};

const kindColors: Record<EditorNodeKind, string> = {
  form: 'text-brand-600 dark:text-brand-400',
  pool: 'text-purple-600 dark:text-purple-400',
  droplet: 'text-emerald-600 dark:text-emerald-400',
  trigger: 'text-amber-600 dark:text-amber-400',
};

export function TreeNodeItem({
  editorId,
  label,
  kind,
  typeName,
  depth,
  hasChildren,
  expanded,
  onToggle,
}: TreeNodeItemProps) {
  const selectedNodeId = useFormEditorStore((s) => s.selectedNodeId);
  const selectNode = useFormEditorStore((s) => s.selectNode);
  const deleteNode = useFormEditorStore((s) => s.deleteNode);
  const isSelected = selectedNodeId === editorId;

  const Icon = kindIcons[kind];

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm transition-colors group
        ${
          isSelected
            ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
            : 'hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300'
        }`}
      style={{ paddingLeft: `${depth * 16 + 4}px` }}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(editorId);
      }}
    >
      {/* Expand/collapse */}
      {hasChildren ? (
        <button
          className="shrink-0 text-gray-400 dark:text-slate-500"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      ) : (
        <span className="w-[14px] shrink-0" />
      )}

      {/* Icon */}
      <Icon size={14} className={`shrink-0 ${kindColors[kind]}`} />

      {/* Label */}
      <span className="truncate flex-1 font-medium">{label || '(senza nome)'}</span>

      {/* Type badge */}
      {typeName && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 shrink-0">
          {typeName}
        </span>
      )}

      {/* Delete */}
      {kind !== 'form' && (
        <button
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            deleteNode(editorId);
          }}
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

// ── Recursive tree node with expand/collapse ───────────────────────────────

import type { TreeNode } from '../utils';

interface TreeNodeRecursiveProps {
  node: TreeNode;
  depth: number;
}

export function TreeNodeRecursive({ node, depth }: TreeNodeRecursiveProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <TreeNodeItem
        editorId={node.editorId}
        label={node.label || node.name}
        kind={node.kind}
        typeName={node.type}
        depth={depth}
        hasChildren={hasChildren}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <TreeNodeRecursive key={child.editorId} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
