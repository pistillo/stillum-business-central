import React from 'react';
import Head from '@docusaurus/Head';

interface RootProps {
  children?: React.ReactNode;
}

export default function Root({ children }: RootProps): React.ReactElement {
  return (
    <>
      {/* Zoom/pan per diagrammi Mermaid (modalità nativa: i diagrammi sono renderizzati da @docusaurus/theme-mermaid) */}
      <Head children={<script src="/js/diagram.js" />} />
      {children}
    </>
  );
}
