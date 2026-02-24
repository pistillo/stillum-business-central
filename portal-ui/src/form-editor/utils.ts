import * as yaml from 'js-yaml';
import type {
  DropletDefinition,
  FormDefinition,
  PoolDefinition,
  TriggerDefinition,
  ValidationError,
} from './types';

// ── ID generation ──────────────────────────────────────────────────────────
// Used only inside the editor to give each node a stable key for React / DnD.
// These IDs are NOT serialized into the FormDefinition (name is the real key).

let counter = 0;

export function generateId(): string {
  counter += 1;
  return `_ed_${Date.now()}_${counter}`;
}

// ── Editor-internal ID map ─────────────────────────────────────────────────
// We keep a WeakMap-like mapping so we can assign stable editor IDs to nodes
// without polluting the serialized FormDefinition.

const nodeEditorIds = new WeakMap<object, string>();

export function getEditorId(node: object): string {
  let id = nodeEditorIds.get(node);
  if (!id) {
    id = generateId();
    nodeEditorIds.set(node, id);
  }
  return id;
}

export function setEditorId(node: object, id: string): void {
  nodeEditorIds.set(node, id);
}

// ── Parse / Serialize ──────────────────────────────────────────────────────

export function parseFormDefinition(raw: string): FormDefinition {
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    try {
      obj = yaml.load(raw) as Record<string, unknown>;
    } catch {
      return emptyFormDefinition();
    }
  }

  if (!obj || typeof obj !== 'object') {
    return emptyFormDefinition();
  }

  // FormDefinition is a PoolDefinition with flat arrays.
  // We preserve all properties as-is; the editor reads typed fields.
  const fd: FormDefinition = {
    name: String(obj.name ?? 'form'),
    type: String(obj.type ?? 'vertical'),
    ...(obj as Record<string, unknown>),
    // Ensure arrays exist
    pools: Array.isArray(obj.pools) ? (obj.pools as PoolDefinition[]) : [],
    droplets: Array.isArray(obj.droplets) ? (obj.droplets as DropletDefinition[]) : [],
    triggers: Array.isArray(obj.triggers) ? (obj.triggers as TriggerDefinition[]) : [],
    flows: Array.isArray(obj.flows) ? (obj.flows as FormDefinition['flows']) : undefined,
  };

  // Assign stable editor IDs to every node
  assignEditorIds(fd);

  return fd;
}

function assignEditorIds(fd: FormDefinition): void {
  setEditorId(fd, 'form');
  for (const pool of fd.pools ?? []) {
    getEditorId(pool); // auto-generates
  }
  for (const droplet of fd.droplets ?? []) {
    getEditorId(droplet);
  }
  for (const trigger of fd.triggers ?? []) {
    getEditorId(trigger);
  }
}

export function emptyFormDefinition(): FormDefinition {
  const fd: FormDefinition = {
    name: 'form',
    type: 'vertical',
    pools: [],
    droplets: [],
    triggers: [],
  };
  setEditorId(fd, 'form');
  return fd;
}

export function serializeFormDefinition(fd: FormDefinition): string {
  // Serialize without editor-internal data (WeakMap IDs are not enumerable)
  return JSON.stringify(fd, null, 2);
}

export function serializeFormDefinitionYaml(fd: FormDefinition): string {
  return yaml.dump(fd, { indent: 2, lineWidth: 120 });
}

// ── Tree helpers ───────────────────────────────────────────────────────────
// Build a virtual tree from the flat structure using the `pool` property.

export interface TreeNode {
  editorId: string;
  kind: 'form' | 'pool' | 'droplet' | 'trigger';
  name: string;
  type: string;
  label?: string;
  pool?: string;
  node: object; // reference to the actual definition object
  children: TreeNode[];
}

export function buildTree(fd: FormDefinition): TreeNode {
  const root: TreeNode = {
    editorId: 'form',
    kind: 'form',
    name: fd.name,
    type: fd.type,
    label: fd.title,
    node: fd,
    children: [],
  };

  // Index pools by name for child lookup
  const poolNodesByName = new Map<string, TreeNode>();

  // Create TreeNode for each pool
  const poolTreeNodes: TreeNode[] = (fd.pools ?? []).map((p) => {
    const tn: TreeNode = {
      editorId: getEditorId(p),
      kind: 'pool',
      name: p.name,
      type: p.type,
      label: p.title,
      pool: p.pool,
      node: p,
      children: [],
    };
    poolNodesByName.set(p.name, tn);
    return tn;
  });

  // Create TreeNode for each droplet
  const dropletTreeNodes: TreeNode[] = (fd.droplets ?? []).map((d) => ({
    editorId: getEditorId(d),
    kind: 'droplet' as const,
    name: d.name,
    type: d.type,
    label: d.label,
    pool: d.pool,
    node: d,
    children: [],
  }));

  // Create TreeNode for each trigger
  const triggerTreeNodes: TreeNode[] = (fd.triggers ?? []).map((t) => ({
    editorId: getEditorId(t),
    kind: 'trigger' as const,
    name: t.name,
    type: t.type,
    label: t.caption,
    pool: t.pool,
    node: t,
    children: [],
  }));

  // Place pools into parent pools or root
  for (const ptn of poolTreeNodes) {
    if (ptn.pool && poolNodesByName.has(ptn.pool)) {
      poolNodesByName.get(ptn.pool)!.children.push(ptn);
    } else {
      root.children.push(ptn);
    }
  }

  // Place droplets into their pool or root
  for (const dtn of dropletTreeNodes) {
    if (dtn.pool && poolNodesByName.has(dtn.pool)) {
      poolNodesByName.get(dtn.pool)!.children.push(dtn);
    } else {
      root.children.push(dtn);
    }
  }

  // Place triggers into their pool or root
  for (const ttn of triggerTreeNodes) {
    if (ttn.pool && poolNodesByName.has(ttn.pool)) {
      poolNodesByName.get(ttn.pool)!.children.push(ttn);
    } else {
      root.children.push(ttn);
    }
  }

  // Sort children by order property
  const sortByOrder = (a: TreeNode, b: TreeNode) => {
    const ao = (a.node as { order?: number }).order ?? 0;
    const bo = (b.node as { order?: number }).order ?? 0;
    return ao - bo;
  };

  function sortRecursive(tn: TreeNode): void {
    tn.children.sort(sortByOrder);
    for (const child of tn.children) {
      sortRecursive(child);
    }
  }
  sortRecursive(root);

  return root;
}

// ── Lookup ─────────────────────────────────────────────────────────────────

export function findNodeByEditorId(
  fd: FormDefinition,
  editorId: string
): { kind: 'form' | 'pool' | 'droplet' | 'trigger'; node: object } | null {
  if (editorId === 'form') return { kind: 'form', node: fd };
  for (const p of fd.pools ?? []) {
    if (getEditorId(p) === editorId) return { kind: 'pool', node: p };
  }
  for (const d of fd.droplets ?? []) {
    if (getEditorId(d) === editorId) return { kind: 'droplet', node: d };
  }
  for (const t of fd.triggers ?? []) {
    if (getEditorId(t) === editorId) return { kind: 'trigger', node: t };
  }
  return null;
}

// ── Validation ─────────────────────────────────────────────────────────────

export function validateFormDefinition(fd: FormDefinition): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!fd.name) {
    errors.push({ nodeId: 'form', field: 'name', message: 'Il nome del form è obbligatorio.' });
  }

  const poolNames = new Set<string>([fd.name]); // form root is also a pool

  const poolDuplicates = new Set<string>();
  for (const pool of fd.pools ?? []) {
    const eid = getEditorId(pool);
    if (!pool.name) {
      errors.push({ nodeId: eid, field: 'name', message: 'Il nome del pool è obbligatorio.' });
    }
    if (!pool.type) {
      errors.push({ nodeId: eid, field: 'type', message: 'Il tipo del pool è obbligatorio.' });
    }
    if (pool.name && poolDuplicates.has(pool.name)) {
      errors.push({ nodeId: eid, field: 'name', message: `Nome pool duplicato: "${pool.name}".` });
    }
    poolDuplicates.add(pool.name);
    poolNames.add(pool.name);
  }

  for (const droplet of fd.droplets ?? []) {
    const eid = getEditorId(droplet);
    if (!droplet.name) {
      errors.push({ nodeId: eid, field: 'name', message: 'Il nome del droplet è obbligatorio.' });
    }
    if (!droplet.type) {
      errors.push({ nodeId: eid, field: 'type', message: 'Il tipo del droplet è obbligatorio.' });
    }
    if (droplet.pool && !poolNames.has(droplet.pool)) {
      errors.push({
        nodeId: eid,
        field: 'pool',
        message: `Riferimento pool non valido: "${droplet.pool}".`,
      });
    }
  }

  for (const trigger of fd.triggers ?? []) {
    const eid = getEditorId(trigger);
    if (!trigger.name) {
      errors.push({ nodeId: eid, field: 'name', message: 'Il nome del trigger è obbligatorio.' });
    }
    if (!trigger.type) {
      errors.push({ nodeId: eid, field: 'type', message: 'Il tipo del trigger è obbligatorio.' });
    }
    if (trigger.pool && !poolNames.has(trigger.pool)) {
      errors.push({
        nodeId: eid,
        field: 'pool',
        message: `Riferimento pool non valido: "${trigger.pool}".`,
      });
    }
  }

  return errors;
}
