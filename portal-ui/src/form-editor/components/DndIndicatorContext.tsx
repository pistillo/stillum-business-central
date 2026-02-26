import { createContext, useContext } from 'react';

export interface DndIndicatorState {
  /** Editor ID of the element currently being dragged, or null */
  activeId: string | null;
  /** Editor ID of the element the drag is currently hovering over, or null */
  overId: string | null;
  /** Whether the indicator line should appear before or after the over element */
  position: 'before' | 'after';
  /** Layout direction of the parent container of the over element */
  direction: 'horizontal' | 'vertical';
  /** True when the current drop position is not allowed */
  forbidden: boolean;
}

const defaultState: DndIndicatorState = {
  activeId: null,
  overId: null,
  position: 'after',
  direction: 'vertical',
  forbidden: false,
};

export const DndIndicatorContext = createContext<DndIndicatorState>(defaultState);

export function useDndIndicator() {
  return useContext(DndIndicatorContext);
}
