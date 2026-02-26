import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { useFormEditorStore } from '../store';
import { findNodeByEditorId } from '../utils';
import { PALETTE_GROUPS, type PaletteItemDef } from './paletteDefinitions';

// ── Draggable + clickable palette item ──────────────────────────────────────

function PaletteItem({ item, id }: { item: PaletteItemDef; id: string }) {
  const addPool = useFormEditorStore((s) => s.addPool);
  const addDroplet = useFormEditorStore((s) => s.addDroplet);
  const addTrigger = useFormEditorStore((s) => s.addTrigger);
  const selectedNodeId = useFormEditorStore((s) => s.selectedNodeId);
  const formDefinition = useFormEditorStore((s) => s.formDefinition);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { fromPalette: true, kind: item.kind, subType: item.subType, label: item.label },
  });

  function handleClick() {
    let targetPoolName: string | undefined;

    if (selectedNodeId && selectedNodeId !== 'form') {
      const found = findNodeByEditorId(formDefinition, selectedNodeId);
      if (found) {
        if (found.kind === 'pool') {
          targetPoolName = (found.node as { name: string }).name;
        } else {
          targetPoolName = (found.node as { pool?: string }).pool;
        }
      }
    }

    if (item.kind === 'pool') {
      addPool(targetPoolName);
    } else if (item.kind === 'droplet') {
      if (!targetPoolName) {
        const pools = formDefinition.pools ?? [];
        if (pools.length > 0) {
          targetPoolName = pools[0].name;
        } else {
          addPool();
          const latestPools = useFormEditorStore.getState().formDefinition.pools ?? [];
          targetPoolName = latestPools[latestPools.length - 1]?.name;
        }
      }
      addDroplet(targetPoolName!, item.subType ?? 'text');
    } else if (item.kind === 'trigger') {
      addTrigger(targetPoolName);
    }
  }

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm
        border border-gray-200 dark:border-slate-600
        bg-white dark:bg-slate-800
        hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-sm
        transition-all duration-150
        ${isDragging ? 'opacity-40 shadow-md' : ''}`}
    >
      <span
        className="cursor-grab text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 shrink-0"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </span>
      <button onClick={handleClick} className="flex items-center gap-2 flex-1 text-left">
        <Icon size={14} className="text-gray-500 dark:text-slate-400 shrink-0" />
        <span className="text-gray-700 dark:text-slate-300 font-medium">{item.label}</span>
      </button>
    </div>
  );
}

// ── Palette component ──────────────────────────────────────────────────────

export function Palette() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
        Palette
      </div>
      <div className="px-2 space-y-4 pb-4">
        {PALETTE_GROUPS.map((group, gi) => (
          <div key={group.title}>
            <div className="px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item, ii) => (
                <PaletteItem key={ii} item={item} id={`palette::${gi}::${ii}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
