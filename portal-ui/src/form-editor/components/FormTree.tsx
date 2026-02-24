import { useMemo } from 'react';
import { useFormEditorStore } from '../store';
import { buildTree } from '../utils';
import { TreeNodeRecursive } from './TreeNode';

export function FormTree() {
  const formDefinition = useFormEditorStore((s) => s.formDefinition);
  const selectNode = useFormEditorStore((s) => s.selectNode);

  const tree = useMemo(() => buildTree(formDefinition), [formDefinition]);

  const isEmpty =
    (formDefinition.pools ?? []).length === 0 &&
    (formDefinition.droplets ?? []).length === 0 &&
    (formDefinition.triggers ?? []).length === 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto text-sm">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
        Struttura
      </div>

      <TreeNodeRecursive node={tree} depth={0} />

      {isEmpty && (
        <div className="px-4 py-6 text-center text-xs text-gray-400 dark:text-slate-500">
          Trascina un elemento dalla palette per iniziare.
        </div>
      )}

      {/* Click on empty area deselects */}
      <div className="flex-1 min-h-[40px]" onClick={() => selectNode(null)} />
    </div>
  );
}
