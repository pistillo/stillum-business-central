// ── Placement ──────────────────────────────────────────────────────────────

export interface Placement {
  columnStart?: number | string;
  columnEnd?: number | string;
  rowStart?: number | string;
  rowEnd?: number | string;
  column?: string;
  row?: string;
  area?: string;
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  alignSelf?: 'start' | 'end' | 'center' | 'stretch';
  colSpan?: number;
  rowSpan?: number;
  width?: string | number;
  height?: string | number;
  flex?: string | number;
}

// ── BaseElementDefinition ──────────────────────────────────────────────────
// Mirrors StillumForms BaseElementDefinition — all elements share these props.

export interface BaseElementDefinition {
  name: string;
  type: string;
  helperText?: string;
  visible?: boolean;
  enabled?: boolean;
  readonly?: boolean;
  pool?: string;
  order?: number;
  placement?: Placement;
  description?: string;
  customClass?: string;
  maxWidth?: string;
  minWidth?: string;
  flexBehavior?: 'grow' | 'shrink' | 'fixed' | 'none';
  selectable?: boolean;
  context?: string;
}

// ── Pool types ─────────────────────────────────────────────────────────────

export const POOL_TYPES = [
  'vertical',
  'horizontal',
  'responsive-grid',
  'grid',
  'flex',
  'data-table',
  'data-iterator',
] as const;

export type PoolType = (typeof POOL_TYPES)[number];

export interface PoolDefinition extends BaseElementDefinition {
  type: PoolType | string;
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  collapseDirection?: 'top-bottom' | 'bottom-up' | 'left-right' | 'right-left';
  padding?: string;
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
  scrollable?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  icon?: string;
  wrap?: boolean;
  iterate?: boolean;
  columns?: number;
  rows?: number;
  columnTemplate?: string;
  rowTemplate?: string;
  minColumnWidth?: string;
  areas?: string[];
  flexDirection?: string;
  flexWrap?: string;
}

// ── Droplet types ──────────────────────────────────────────────────────────

export const DROPLET_TYPES = [
  'text',
  'number',
  'email',
  'textarea',
  'select',
  'checkbox',
  'date',
  'time',
  'stillum-searchbar',
  'stillum-yaml-editor',
  'stillum-table',
] as const;

export type DropletType = (typeof DROPLET_TYPES)[number];

export interface DropletDefinition extends BaseElementDefinition {
  type: DropletType | string;
  label?: string;
  labelPosition?: 'left' | 'top' | 'right' | 'bottom' | 'hidden';
  placeholder?: string;
  variant?: 'default' | 'error' | 'success' | 'focus';
  size?: 'extraSmall' | 'small' | 'medium' | 'large';
  renderAs?: string;
  required?: boolean;
  defaultValue?: unknown;
  validation?: Record<string, unknown>;
  expression?: string;
}

// ── Trigger types ──────────────────────────────────────────────────────────

export const TRIGGER_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;

export type TriggerVariant = (typeof TRIGGER_VARIANTS)[number];

export const TRIGGER_BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export interface TriggerDefinition extends BaseElementDefinition {
  caption?: string;
  variant?: TriggerVariant;
  buttonSize?: (typeof TRIGGER_BUTTON_SIZES)[number];
  icon?: string;
  iconPosition?: 'left' | 'right';
  displayMode?: 'icon-only' | 'icon-and-text';
  signalName?: string;
  signalData?: unknown;
  includeLocalContext?: boolean;
  includeGlobalContext?: boolean;
  href?: string;
  target?: string;
  loading?: boolean;
  loadingText?: string;
  expression?: string;
  maxExecutions?: number;
  useXState?: boolean;
  actorName?: string;
}

// ── Flow Definition ────────────────────────────────────────────────────────

export type FlowDefinition = Record<string, unknown> & {
  id?: string;
  name?: string;
};

// ── Form Definition (root) ─────────────────────────────────────────────────
// FormDefinition = PoolDefinition (form IS a pool) + flat arrays of children.
// Hierarchy is established solely through the `pool` property on each element.

export interface FormDefinition extends PoolDefinition {
  droplets?: DropletDefinition[];
  triggers?: TriggerDefinition[];
  pools?: PoolDefinition[];
  flows?: FlowDefinition[];
  forms?: FormDefinition[];
  showingMode?: 'modal' | 'target';
}

// ── Editor node union (per selezione / properties) ─────────────────────────

export type EditorNodeKind = 'form' | 'pool' | 'droplet' | 'trigger';

// ── Validation ─────────────────────────────────────────────────────────────

export interface ValidationError {
  nodeId: string;
  field: string;
  message: string;
}

// ── Palette item ───────────────────────────────────────────────────────────

export interface PaletteItem {
  kind: 'pool' | 'droplet' | 'trigger';
  subType?: string;
  label: string;
}
