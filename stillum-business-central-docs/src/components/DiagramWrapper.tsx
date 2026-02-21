import React from 'react';
import DiagramViewer from '../theme/DiagramViewer';

export default function DiagramWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DiagramViewer>
      {children}
    </DiagramViewer>
  );
}
