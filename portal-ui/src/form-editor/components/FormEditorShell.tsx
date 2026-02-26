import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  AlertCircle,
  Ban,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Redo2,
  Save,
  ShieldAlert,
  Undo2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormEditorStore } from '../store';
import { buildTree, findNodeByEditorId } from '../utils';
import { DndIndicatorContext, type DndIndicatorState } from './DndIndicatorContext';
import { FormPreview } from './FormPreview';
import { FormTree } from './FormTree';
import { Palette } from './Palette';
import { PropertiesPanel } from './PropertiesPanel';

interface FormEditorShellProps {
  initialContent: string;
  onSave: (json: string) => void;
  saving?: boolean;
  saveSuccess?: boolean;
  saveError?: boolean;
  readOnly?: boolean;
}

export function FormEditorShell({
  initialContent,
  onSave,
  saving,
  saveSuccess,
  saveError,
  readOnly,
}: FormEditorShellProps) {
  const loadFromString = useFormEditorStore((s) => s.loadFromString);
  const toJson = useFormEditorStore((s) => s.toJson);
  const undo = useFormEditorStore((s) => s.undo);
  const redo = useFormEditorStore((s) => s.redo);
  const canUndo = useFormEditorStore((s) => s.canUndo);
  const canRedo = useFormEditorStore((s) => s.canRedo);
  const validate = useFormEditorStore((s) => s.validate);
  const validationErrors = useFormEditorStore((s) => s.validationErrors);
  const dirty = useFormEditorStore((s) => s.dirty);
  const formDefinition = useFormEditorStore((s) => s.formDefinition);
  const addPool = useFormEditorStore((s) => s.addPool);
  const addDroplet = useFormEditorStore((s) => s.addDroplet);
  const addTrigger = useFormEditorStore((s) => s.addTrigger);
  const moveNodeToIndex = useFormEditorStore((s) => s.moveNodeToIndex);
  const selectNode = useFormEditorStore((s) => s.selectNode);

  const [showPreview, setShowPreview] = useState(true);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [dndIndicator, setDndIndicator] = useState<DndIndicatorState>({
    activeId: null,
    overId: null,
    position: 'after',
    direction: 'vertical',
    forbidden: false,
  });
  // Keep a ref in sync so handleDragEnd always reads the latest position
  const dndIndicatorRef = useRef<DndIndicatorState>(dndIndicator);

  // Build tree for resolving drop targets
  const tree = useMemo(() => buildTree(formDefinition), [formDefinition]);

  // Load initial content
  useEffect(() => {
    if (initialContent) {
      loadFromString(initialContent);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (!readOnly) handleSave();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, readOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(() => {
    const errors = validate();
    if (errors.length > 0) return;
    onSave(toJson());
  }, [validate, onSave, toJson]);

  // ── DnD sensors & handlers ────────────────────────────────────────────

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function updateIndicator(state: DndIndicatorState) {
    dndIndicatorRef.current = state;
    setDndIndicator(state);
  }

  // Determine if a pool's layout direction is horizontal or vertical
  function getPoolDirection(poolType?: string, flexDir?: string): 'horizontal' | 'vertical' {
    if (poolType === 'horizontal') return 'horizontal';
    if (poolType === 'flex' && (flexDir === 'row' || flexDir === 'row-reverse'))
      return 'horizontal';
    return 'vertical';
  }

  // Find the layout direction of the parent pool for a given editor ID in the tree
  function findParentDirection(
    editorId: string,
    node: typeof tree,
    parentDir: 'horizontal' | 'vertical'
  ): 'horizontal' | 'vertical' | null {
    for (const child of node.children) {
      if (child.editorId === editorId) return parentDir;
      const childDir =
        child.kind === 'pool'
          ? getPoolDirection(
              (child.node as { type?: string }).type,
              (child.node as { flexDirection?: string }).flexDirection
            )
          : parentDir;
      const found = findParentDirection(editorId, child, childDir);
      if (found !== null) return found;
    }
    return null;
  }

  // Compute the valid index range [min, max] for a given kind among siblings.
  // Order rule: pools first, then droplets, then triggers.
  // min/max are inclusive insert positions (0..children.length).
  function kindIndexRange(
    activeKind: 'pool' | 'droplet' | 'trigger',
    siblings: typeof tree.children
  ): [number, number] {
    // Find boundary indices
    let lastPoolIdx = -1;
    let firstDropletIdx = siblings.length;
    let lastDropletIdx = -1;
    let firstTriggerIdx = siblings.length;

    siblings.forEach((c, i) => {
      if (c.kind === 'pool') lastPoolIdx = i;
      if (c.kind === 'droplet') {
        if (i < firstDropletIdx) firstDropletIdx = i;
        lastDropletIdx = i;
      }
      if (c.kind === 'trigger' && i < firstTriggerIdx) firstTriggerIdx = i;
    });

    switch (activeKind) {
      case 'pool':
        // Pools can go from 0 up to (but not after) the first droplet or trigger
        return [0, Math.min(firstDropletIdx, firstTriggerIdx)];
      case 'droplet':
        // Droplets: after last pool, before first trigger
        return [lastPoolIdx + 1, firstTriggerIdx];
      case 'trigger':
        // Triggers: after last pool and last droplet
        return [Math.max(lastPoolIdx + 1, lastDropletIdx + 1), siblings.length];
    }
  }

  // Find the tree node that is the parent of a given editor ID
  function findParentTreeNode(editorId: string, node: typeof tree): typeof tree | null {
    for (const child of node.children) {
      if (child.editorId === editorId) return node;
      const found = findParentTreeNode(editorId, child);
      if (found) return found;
    }
    return null;
  }

  // Check if nodeId is a descendant of ancestorId in the tree
  function isDescendantOf(ancestorId: string, nodeId: string, treeRoot: typeof tree): boolean {
    function findNode(node: typeof tree): typeof tree | null {
      if (node.editorId === ancestorId) return node;
      for (const child of node.children) {
        const found = findNode(child);
        if (found) return found;
      }
      return null;
    }
    function hasDescendant(node: typeof tree): boolean {
      if (node.editorId === nodeId) return true;
      return node.children.some(hasDescendant);
    }
    const ancestor = findNode(treeRoot);
    return ancestor ? hasDescendant(ancestor) : false;
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      updateIndicator({
        activeId: String(active.id),
        overId: null,
        position: 'after',
        direction: 'vertical',
        forbidden: false,
      });
      return;
    }

    const activeId = String(active.id);
    const activeData = active.data.current;

    // Resolve activeKind (used for multiple checks below)
    let activeKind: 'pool' | 'droplet' | 'trigger' | null = null;
    if (activeData?.fromPalette) {
      activeKind = activeData.kind as 'pool' | 'droplet' | 'trigger';
    } else if (activeData?.fromPreview) {
      const found = findNodeByEditorId(formDefinition, activeId);
      if (found && found.kind !== 'form') activeKind = found.kind;
    }

    // ── Droppable zone (pool or form root) ──────────────────────────
    if (String(over.id).startsWith('droppable::')) {
      // Dropping into a pool/form zone means appending at the end.
      // Check ordering constraint: would appending violate pool→droplet→trigger?
      if (activeKind) {
        const overData = over.data.current;
        const poolName = overData?.poolName as string | undefined;
        // Find the container tree node
        const findContainer = (node: typeof tree): typeof tree | null => {
          if (poolName === undefined && node.kind === 'form') return node;
          if (node.kind === 'pool' && (node.node as { name: string }).name === poolName)
            return node;
          for (const child of node.children) {
            const found = findContainer(child);
            if (found) return found;
          }
          return null;
        };
        const container = findContainer(tree);
        if (container) {
          const siblings = container.children.filter((c) => c.editorId !== activeId);
          const appendIdx = siblings.length;
          const [minIdx, maxIdx] = kindIndexRange(activeKind, siblings);
          if (appendIdx < minIdx || appendIdx > maxIdx) {
            updateIndicator({
              activeId,
              overId: null,
              position: 'after',
              direction: 'vertical',
              forbidden: true,
            });
            return;
          }
        }

        // Guard: cannot drop a pool into its own descendant (droppable zone inside it)
        if (
          activeData?.fromPreview &&
          isDescendantOf(activeId, String(over.id).replace('droppable::', ''), tree)
        ) {
          updateIndicator({
            activeId,
            overId: null,
            position: 'after',
            direction: 'vertical',
            forbidden: true,
          });
          return;
        }
      }

      updateIndicator({
        activeId,
        overId: null,
        position: 'after',
        direction: 'vertical',
        forbidden: false,
      });
      return;
    }

    const overId = String(over.id);

    // Guard: cannot drop on self
    if (overId === activeId) {
      updateIndicator({
        activeId,
        overId: null,
        position: 'after',
        direction: 'vertical',
        forbidden: true,
      });
      return;
    }

    // Guard: cannot drop a pool onto its own descendant
    if (isDescendantOf(activeId, overId, tree)) {
      updateIndicator({
        activeId,
        overId: null,
        position: 'after',
        direction: 'vertical',
        forbidden: true,
      });
      return;
    }

    // Determine the layout direction of the parent pool
    const rootDir = getPoolDirection(
      formDefinition.type,
      (formDefinition as { flexDirection?: string }).flexDirection
    );
    const direction = findParentDirection(overId, tree, rootDir) ?? 'vertical';

    // Determine before/after based on the correct axis
    let position: 'before' | 'after' = 'after';
    const overRect = over.rect;
    const translated = active.rect.current.translated;
    if (overRect && translated) {
      if (direction === 'horizontal') {
        const overMidX = overRect.left + overRect.width / 2;
        const activeMidX = translated.left + translated.width / 2;
        position = activeMidX < overMidX ? 'before' : 'after';
      } else {
        const overMidY = overRect.top + overRect.height / 2;
        const activeMidY = translated.top + translated.height / 2;
        position = activeMidY < overMidY ? 'before' : 'after';
      }
    }

    // Enforce ordering constraint: pool → droplet → trigger
    if (activeKind) {
      const parentNode = findParentTreeNode(overId, tree);
      if (parentNode) {
        // Exclude the active element itself from siblings when computing range
        const siblings = parentNode.children.filter((c) => c.editorId !== activeId);
        const overIdxInFiltered = siblings.findIndex((c) => c.editorId === overId);
        if (overIdxInFiltered !== -1) {
          const insertIdx = position === 'before' ? overIdxInFiltered : overIdxInFiltered + 1;
          const [minIdx, maxIdx] = kindIndexRange(activeKind, siblings);
          if (insertIdx < minIdx || insertIdx > maxIdx) {
            // Position violates ordering — show forbidden
            updateIndicator({
              activeId,
              overId: null,
              position: 'after',
              direction,
              forbidden: true,
            });
            return;
          }
        }
      }
    }

    updateIndicator({ activeId, overId, position, direction, forbidden: false });
  }

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.fromPalette) {
      setActiveLabel(data.label as string);
    } else if (data?.fromPreview) {
      // Existing node being dragged
      const found = findNodeByEditorId(formDefinition, String(event.active.id));
      if (found) {
        const name =
          (found.node as { label?: string }).label ||
          (found.node as { caption?: string }).caption ||
          (found.node as { name: string }).name;
        setActiveLabel(name);
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLabel(null);
    // Read the position from the ref (latest value, not stale closure)
    const lastIndicator = dndIndicatorRef.current;
    updateIndicator({
      activeId: null,
      overId: null,
      position: 'after',
      direction: 'vertical',
      forbidden: false,
    });
    const { active, over } = event;
    if (!over) return;

    // If the last indicator was forbidden, ignore the drop
    if (lastIndicator.forbidden) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    const overId = String(over.id);

    // ── Case 1: Palette → Preview (create new element) ──────────────
    if (activeData?.fromPalette) {
      // Determine target pool from drop zone
      let targetPoolName: string | undefined;

      if (overId.startsWith('droppable::')) {
        // Dropped on a droppable zone (pool or form root)
        targetPoolName = overData?.poolName as string | undefined;
      } else {
        // Dropped on a sortable item — find its pool
        const found = findNodeByEditorId(formDefinition, overId);
        if (found) {
          if (found.kind === 'pool') {
            targetPoolName = (found.node as { name: string }).name;
          } else {
            targetPoolName = (found.node as { pool?: string }).pool;
          }
        }
      }

      const kind = activeData.kind as string;
      const subType = activeData.subType as string | undefined;

      if (kind === 'pool') {
        addPool(targetPoolName);
      } else if (kind === 'droplet') {
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
        addDroplet(targetPoolName!, subType ?? 'text');
      } else if (kind === 'trigger') {
        addTrigger(targetPoolName);
      }
      return;
    }

    // ── Case 2: Preview → Preview (reorder / move between pools) ────
    if (activeData?.fromPreview) {
      const activeId = String(active.id);
      if (activeId === overId) return;

      // Determine target pool and index
      let targetPoolName: string | undefined;
      let targetIndex = 0;

      if (overId.startsWith('droppable::')) {
        // Dropped on a pool/form droppable zone → append
        targetPoolName = overData?.poolName as string | undefined;
        // Find how many children that pool already has
        const findPoolNode = (node: typeof tree): typeof tree | null => {
          if (targetPoolName === undefined && node.kind === 'form') return node;
          if (node.kind === 'pool' && (node.node as { name: string }).name === targetPoolName)
            return node;
          for (const child of node.children) {
            const found = findPoolNode(child);
            if (found) return found;
          }
          return null;
        };
        const poolNode = findPoolNode(tree);
        targetIndex = poolNode ? poolNode.children.length : 0;
      } else {
        // Dropped on another sortable item → insert at same level (sibling)
        // The target pool is the PARENT of the over item (its `pool` property),
        // because all elements define their hierarchy via their own `pool` prop.
        const overFound = findNodeByEditorId(formDefinition, overId);
        if (overFound) {
          targetPoolName = (overFound.node as { pool?: string }).pool;

          // Find index of the over item among its siblings in the tree
          const findParentNode = (node: typeof tree): typeof tree | null => {
            if (targetPoolName === undefined && node.kind === 'form') return node;
            if (node.kind === 'pool' && (node.node as { name: string }).name === targetPoolName)
              return node;
            for (const child of node.children) {
              const found = findParentNode(child);
              if (found) return found;
            }
            return null;
          };
          const parentNode = findParentNode(tree);
          if (parentNode) {
            const overIdx = parentNode.children.findIndex((c) => c.editorId === overId);
            if (overIdx === -1) {
              targetIndex = parentNode.children.length;
            } else {
              // Use position from indicator ref: 'before' → same index, 'after' → index + 1
              targetIndex = lastIndicator.position === 'before' ? overIdx : overIdx + 1;
            }
          }
        }
      }

      // Enforce ordering constraint: pool → droplet → trigger
      const activeFound = findNodeByEditorId(formDefinition, activeId);
      if (activeFound && activeFound.kind !== 'form') {
        const parentNode = findParentTreeNode(overId.startsWith('droppable::') ? '' : overId, tree);
        // For droppable zone targets, find the pool node itself
        const containerNode = overId.startsWith('droppable::')
          ? (() => {
              const findPool = (node: typeof tree): typeof tree | null => {
                if (targetPoolName === undefined && node.kind === 'form') return node;
                if (node.kind === 'pool' && (node.node as { name: string }).name === targetPoolName)
                  return node;
                for (const child of node.children) {
                  const found = findPool(child);
                  if (found) return found;
                }
                return null;
              };
              return findPool(tree);
            })()
          : parentNode;
        if (containerNode) {
          const siblings = containerNode.children.filter((c) => c.editorId !== activeId);
          const [minIdx, maxIdx] = kindIndexRange(activeFound.kind, siblings);
          targetIndex = Math.max(minIdx, Math.min(targetIndex, maxIdx));
        }
      }

      moveNodeToIndex(activeId, targetPoolName, targetIndex);
      selectNode(activeId);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DndIndicatorContext.Provider value={dndIndicator}>
        <div className="flex flex-col h-full">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-1">
              <button
                className="btn-ghost btn-sm"
                disabled={!canUndo()}
                onClick={undo}
                title="Annulla (Ctrl+Z)"
              >
                <Undo2 size={14} />
              </button>
              <button
                className="btn-ghost btn-sm"
                disabled={!canRedo()}
                onClick={redo}
                title="Ripeti (Ctrl+Y)"
              >
                <Redo2 size={14} />
              </button>

              <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1" />

              <button
                className={`btn-ghost btn-sm ${showPreview ? 'text-brand-600 dark:text-brand-400' : ''}`}
                onClick={() => setShowPreview((v) => !v)}
                title={showPreview ? 'Nascondi anteprima' : 'Mostra anteprima'}
              >
                {showPreview ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>

              {validationErrors.length > 0 && (
                <span className="flex items-center gap-1 ml-2 text-xs text-amber-600 dark:text-amber-400">
                  <ShieldAlert size={13} />
                  {validationErrors.length} errori
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {dirty && (
                <span className="text-[10px] text-gray-400 dark:text-slate-500">Non salvato</span>
              )}
              {saveSuccess && (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Check size={14} />
                  Salvato
                </span>
              )}
              {saveError && (
                <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                  <AlertCircle size={14} />
                  Errore
                </span>
              )}
              <button
                className="btn-primary btn-sm"
                disabled={saving || readOnly}
                onClick={handleSave}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Salva
              </button>
            </div>
          </div>

          {/* Main layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Palette */}
            <div className="w-52 shrink-0 border-r border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/30 overflow-y-auto">
              <Palette />
            </div>

            {/* Tree */}
            <div className="w-64 shrink-0 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
              <FormTree />
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="flex-1 border-r border-gray-200 dark:border-slate-700 overflow-hidden">
                <FormPreview />
              </div>
            )}

            {/* Properties */}
            <div className="w-72 shrink-0 overflow-y-auto">
              <PropertiesPanel />
            </div>
          </div>
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeLabel ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md shadow-lg text-sm font-medium border ${
                dndIndicator.forbidden
                  ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400'
                  : 'bg-white dark:bg-slate-700 border-brand-300 dark:border-brand-600 text-brand-700 dark:text-brand-300'
              }`}
            >
              {dndIndicator.forbidden && <Ban size={14} className="shrink-0" />}
              {activeLabel}
            </div>
          ) : null}
        </DragOverlay>
      </DndIndicatorContext.Provider>
    </DndContext>
  );
}
