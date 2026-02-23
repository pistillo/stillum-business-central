import React from 'react';
import Head from '@docusaurus/Head';

interface RootProps {
  children?: React.ReactNode;
}

export default function Root({ children }: RootProps): React.ReactElement {
  return (
    <>
      <Head children={<script src="/js/mermaid-init.js" />} />
      {children}
    </>
  );
}
