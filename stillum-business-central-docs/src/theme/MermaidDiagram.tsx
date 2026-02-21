import React from 'react';
import DiagramViewer from './DiagramViewer';

interface MermaidDiagramProps {
  code: string;
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  return (
    <DiagramViewer>
      <div className="mermaid">
        {code}
      </div>
    </DiagramViewer>
  );
}
