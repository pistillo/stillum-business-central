import type { LucideIcon } from 'lucide-react';
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

export interface PaletteItemDef {
  kind: 'pool' | 'droplet' | 'trigger';
  subType?: string;
  label: string;
  icon: LucideIcon;
}

interface PaletteGroupDef {
  title: string;
  items: PaletteItemDef[];
}

export const PALETTE_GROUPS: PaletteGroupDef[] = [
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
