import { create } from 'zustand';
import type {
  DropletDefinition,
  FormDefinition,
  PoolDefinition,
  TriggerDefinition,
  ValidationError,
} from './types';
import {
  emptyFormDefinition,
  findNodeByEditorId,
  getEditorId,
  parseFormDefinition,
  serializeFormDefinition,
  validateFormDefinition,
} from './utils';

// ── State shape ────────────────────────────────────────────────────────────

interface FormEditorState {
  formDefinition: FormDefinition;
  selectedNodeId: string | null;
  history: string[]; // serialized snapshots (JSON strings)
  historyIndex: number;
  validationErrors: ValidationError[];
  dirty: boolean;

  // Initialisation
  loadFromString: (raw: string) => void;
  reset: () => void;

  // Selection
  selectNode: (id: string | null) => void;

  // Node CRUD — all work on the flat arrays
  addPool: (parentPoolName?: string) => string;
  addDroplet: (poolName: string, type?: string) => string;
  addTrigger: (poolName?: string) => string;
  updateNode: (editorId: string, patch: Record<string, unknown>) => void;
  deleteNode: (editorId: string) => void;

  // Move: change pool parent
  moveNodeToPool: (editorId: string, targetPoolName: string | undefined) => void;
  reorderInArray: (editorId: string, direction: 'up' | 'down') => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Serialization
  toJson: () => string;

  // Validation
  validate: () => ValidationError[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

const MAX_HISTORY = 100;

function snapshot(fd: FormDefinition): string {
  return serializeFormDefinition(fd);
}

function pushHistory(history: string[], historyIndex: number, fd: FormDefinition) {
  const trimmed = history.slice(0, historyIndex + 1);
  const next = [...trimmed, snapshot(fd)];
  if (next.length > MAX_HISTORY) next.shift();
  return { history: next, historyIndex: next.length - 1 };
}

function countByPrefix(arr: { name: string }[], prefix: string): number {
  return arr.filter((x) => x.name.startsWith(prefix)).length;
}

// ── Store ──────────────────────────────────────────────────────────────────

export const useFormEditorStore = create<FormEditorState>((set, get) => ({
  formDefinition: emptyFormDefinition(),
  selectedNodeId: null,
  history: [snapshot(emptyFormDefinition())],
  historyIndex: 0,
  validationErrors: [],
  dirty: false,

  // ── Init ───────────────────────────────────────────────────────────────

  loadFromString: (raw: string) => {
    const fd = parseFormDefinition(raw);
    set({
      formDefinition: fd,
      selectedNodeId: null,
      history: [snapshot(fd)],
      historyIndex: 0,
      validationErrors: [],
      dirty: false,
    });
  },

  reset: () => {
    const fd = emptyFormDefinition();
    set({
      formDefinition: fd,
      selectedNodeId: null,
      history: [snapshot(fd)],
      historyIndex: 0,
      validationErrors: [],
      dirty: false,
    });
  },

  // ── Selection ──────────────────────────────────────────────────────────

  selectNode: (id) => set({ selectedNodeId: id }),

  // ── Add ────────────────────────────────────────────────────────────────

  addPool: (parentPoolName) => {
    const s = get();
    const fd = s.formDefinition;
    const pools = fd.pools ?? [];
    const n = countByPrefix(pools, 'pool_') + 1;
    const pool: PoolDefinition = {
      name: `pool_${n}`,
      type: 'vertical',
      title: `Pool ${n}`,
      pool: parentPoolName,
    };
    const eid = getEditorId(pool);
    fd.pools = [...pools, pool];
    set({
      formDefinition: { ...fd },
      selectedNodeId: eid,
      dirty: true,
      ...pushHistory(s.history, s.historyIndex, fd),
    });
    return eid;
  },

  addDroplet: (poolName, type = 'text') => {
    const s = get();
    const fd = s.formDefinition;
    const droplets = fd.droplets ?? [];
    const n = countByPrefix(droplets, 'field_') + 1;
    const droplet: DropletDefinition = {
      name: `field_${n}`,
      type,
      label: `Campo ${n}`,
      pool: poolName,
    };
    const eid = getEditorId(droplet);
    fd.droplets = [...droplets, droplet];
    set({
      formDefinition: { ...fd },
      selectedNodeId: eid,
      dirty: true,
      ...pushHistory(s.history, s.historyIndex, fd),
    });
    return eid;
  },

  addTrigger: (poolName) => {
    const s = get();
    const fd = s.formDefinition;
    const triggers = fd.triggers ?? [];
    const n = countByPrefix(triggers, 'trigger_') + 1;
    const trigger: TriggerDefinition = {
      name: `trigger_${n}`,
      type: 'action',
      caption: `Trigger ${n}`,
      variant: 'primary',
      pool: poolName,
    };
    const eid = getEditorId(trigger);
    fd.triggers = [...triggers, trigger];
    set({
      formDefinition: { ...fd },
      selectedNodeId: eid,
      dirty: true,
      ...pushHistory(s.history, s.historyIndex, fd),
    });
    return eid;
  },

  // ── Update ─────────────────────────────────────────────────────────────

  updateNode: (editorId, patch) => {
    const s = get();
    const fd = s.formDefinition;
    const found = findNodeByEditorId(fd, editorId);
    if (!found) return;

    // Apply patch to the actual object (mutate in place, then spread fd)
    Object.assign(found.node, patch);
    set({
      formDefinition: { ...fd },
      dirty: true,
      ...pushHistory(s.history, s.historyIndex, fd),
    });
  },

  // ── Delete ─────────────────────────────────────────────────────────────

  deleteNode: (editorId) => {
    const s = get();
    const fd = s.formDefinition;

    // Find which array contains it
    const poolIdx = (fd.pools ?? []).findIndex((p) => getEditorId(p) === editorId);
    if (poolIdx !== -1) {
      const deletedPoolName = fd.pools![poolIdx].name;
      fd.pools = fd.pools!.filter((_, i) => i !== poolIdx);
      // Also remove children that reference this pool
      fd.droplets = (fd.droplets ?? []).filter((d) => d.pool !== deletedPoolName);
      fd.triggers = (fd.triggers ?? []).filter((t) => t.pool !== deletedPoolName);
      // Also remove sub-pools
      fd.pools = fd.pools.filter((p) => p.pool !== deletedPoolName);
      set({
        formDefinition: { ...fd },
        selectedNodeId: s.selectedNodeId === editorId ? null : s.selectedNodeId,
        dirty: true,
        ...pushHistory(s.history, s.historyIndex, fd),
      });
      return;
    }

    const dropletIdx = (fd.droplets ?? []).findIndex((d) => getEditorId(d) === editorId);
    if (dropletIdx !== -1) {
      fd.droplets = fd.droplets!.filter((_, i) => i !== dropletIdx);
      set({
        formDefinition: { ...fd },
        selectedNodeId: s.selectedNodeId === editorId ? null : s.selectedNodeId,
        dirty: true,
        ...pushHistory(s.history, s.historyIndex, fd),
      });
      return;
    }

    const triggerIdx = (fd.triggers ?? []).findIndex((t) => getEditorId(t) === editorId);
    if (triggerIdx !== -1) {
      fd.triggers = fd.triggers!.filter((_, i) => i !== triggerIdx);
      set({
        formDefinition: { ...fd },
        selectedNodeId: s.selectedNodeId === editorId ? null : s.selectedNodeId,
        dirty: true,
        ...pushHistory(s.history, s.historyIndex, fd),
      });
      return;
    }
  },

  // ── Move / Reorder ─────────────────────────────────────────────────────

  moveNodeToPool: (editorId, targetPoolName) => {
    const s = get();
    const fd = s.formDefinition;
    const found = findNodeByEditorId(fd, editorId);
    if (!found || found.kind === 'form') return;

    (found.node as { pool?: string }).pool = targetPoolName;
    set({
      formDefinition: { ...fd },
      dirty: true,
      ...pushHistory(s.history, s.historyIndex, fd),
    });
  },

  reorderInArray: (editorId, direction) => {
    const s = get();
    const fd = s.formDefinition;

    function reorder<T extends object>(arr: T[]): T[] {
      const idx = arr.findIndex((x) => getEditorId(x) === editorId);
      if (idx === -1) return arr;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      const copy = [...arr];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    }

    fd.pools = reorder(fd.pools ?? []);
    fd.droplets = reorder(fd.droplets ?? []);
    fd.triggers = reorder(fd.triggers ?? []);

    set({
      formDefinition: { ...fd },
      dirty: true,
      ...pushHistory(s.history, s.historyIndex, fd),
    });
  },

  // ── History ────────────────────────────────────────────────────────────

  undo: () => {
    set((s) => {
      if (s.historyIndex <= 0) return s;
      const newIndex = s.historyIndex - 1;
      const fd = parseFormDefinition(s.history[newIndex]);
      return {
        formDefinition: fd,
        historyIndex: newIndex,
        dirty: true,
      };
    });
  },

  redo: () => {
    set((s) => {
      if (s.historyIndex >= s.history.length - 1) return s;
      const newIndex = s.historyIndex + 1;
      const fd = parseFormDefinition(s.history[newIndex]);
      return {
        formDefinition: fd,
        historyIndex: newIndex,
        dirty: true,
      };
    });
  },

  canUndo: () => {
    const s = get();
    return s.historyIndex > 0;
  },

  canRedo: () => {
    const s = get();
    return s.historyIndex < s.history.length - 1;
  },

  // ── Serialization ──────────────────────────────────────────────────────

  toJson: () => {
    return serializeFormDefinition(get().formDefinition);
  },

  // ── Validation ─────────────────────────────────────────────────────────

  validate: () => {
    const errors = validateFormDefinition(get().formDefinition);
    set({ validationErrors: errors });
    return errors;
  },
}));
