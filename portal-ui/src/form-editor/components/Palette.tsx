import {
  CalendarDays,
  CheckSquare,
  Clock,
  Code,
  Columns3,
  FormInput,
  Grid3X3,
  Hash,
  Layers,
  LayoutList,
  List,
  Mail,
  MousePointerClick,
  Rows3,
  Search,
  Table,
  TextCursorInput,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useFormEditorStore } from '../store';
import { findNodeByEditorId } from '../utils';

// ── Palette definitions ────────────────────────────────────────────────────

interface PaletteItemDef {
  kind: 'pool' | 'droplet' | 'trigger';
  subType?: string;
  label: string;
  icon: LucideIcon;
}

interface PaletteGroupDef {
  title: string;
  items: PaletteItemDef[];
}

const PALETTE_GROUPS: PaletteGroupDef[] = [
  {
    title: 'Pool',
    items: [
      { kind: 'pool', subType: 'vertical', label: 'Verticale', icon: Rows3 },
      { kind: 'pool', subType: 'horizontal', label: 'Orizzontale', icon: Columns3 },
      { kind: 'pool', subType: 'responsive-grid', label: 'Grid Responsive', icon: Grid3X3 },
      { kind: 'pool', subType: 'grid', label: 'Grid Areas', icon: LayoutList },
      { kind: 'pool', subType: 'flex', label: 'Flex', icon: Layers },
      { kind: 'pool', subType: 'data-table', label: 'Data Table', icon: Table },
    ],
  },
  {
    title: 'Campi base',
    items: [
      { kind: 'droplet', subType: 'text', label: 'Testo', icon: FormInput },
      { kind: 'droplet', subType: 'number', label: 'Numero', icon: Hash },
      { kind: 'droplet', subType: 'email', label: 'Email', icon: Mail },
      { kind: 'droplet', subType: 'textarea', label: 'Textarea', icon: TextCursorInput },
      { kind: 'droplet', subType: 'select', label: 'Select', icon: List },
      { kind: 'droplet', subType: 'checkbox', label: 'Checkbox', icon: CheckSquare },
      { kind: 'droplet', subType: 'date', label: 'Data', icon: CalendarDays },
      { kind: 'droplet', subType: 'time', label: 'Ora', icon: Clock },
    ],
  },
  {
    title: 'Campi avanzati',
    items: [
      { kind: 'droplet', subType: 'stillum-searchbar', label: 'Searchbar', icon: Search },
      { kind: 'droplet', subType: 'stillum-yaml-editor', label: 'YAML Editor', icon: Code },
      { kind: 'droplet', subType: 'stillum-table', label: 'Tabella', icon: Table },
    ],
  },
  {
    title: 'Trigger',
    items: [{ kind: 'trigger', subType: 'action', label: 'Azione', icon: MousePointerClick }],
  },
];

// ── Clickable palette item (click-to-add instead of drag) ──────────────────

function PaletteButton({ item }: { item: PaletteItemDef }) {
  const addPool = useFormEditorStore((s) => s.addPool);
  const addDroplet = useFormEditorStore((s) => s.addDroplet);
  const addTrigger = useFormEditorStore((s) => s.addTrigger);
  const selectedNodeId = useFormEditorStore((s) => s.selectedNodeId);
  const formDefinition = useFormEditorStore((s) => s.formDefinition);

  function handleClick() {
    // Determine target pool name from selection context
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
      // Droplets need a pool parent; if none selected, use first pool or create one
      if (!targetPoolName) {
        const pools = formDefinition.pools ?? [];
        if (pools.length > 0) {
          targetPoolName = pools[0].name;
        } else {
          // Create a pool first
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
    <button
      onClick={handleClick}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-left
        border border-gray-200 dark:border-slate-600
        bg-white dark:bg-slate-800
        hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-sm
        transition-all duration-150"
    >
      <Icon size={14} className="text-gray-500 dark:text-slate-400 shrink-0" />
      <span className="text-gray-700 dark:text-slate-300 font-medium">{item.label}</span>
    </button>
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
        {PALETTE_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item, ii) => (
                <PaletteButton key={ii} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
