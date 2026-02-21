import React from 'react';
import DiagramViewer from '../theme/DiagramViewer';

interface MermaidDiagramWithZoomProps {
  children: React.ReactNode;
}

export default function MermaidDiagramWithZoom({ children }: MermaidDiagramWithZoomProps) {
  return (
    <DiagramViewer>
      {children}
    </DiagramViewer>
  );
}
