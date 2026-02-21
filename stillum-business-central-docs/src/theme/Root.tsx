import React, { useEffect } from 'react';
import Head from '@docusaurus/Head';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <Head>
        <script src="/js/diagram.js" />
      </Head>
      {children}
    </>
  );
}
