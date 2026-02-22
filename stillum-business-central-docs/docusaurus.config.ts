import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Stillum Business Central',
  tagline: 'Documentazione della piattaforma di orchestrazione multi-tenant',
  favicon: 'img/favicon.ico',

  url: 'http://localhost:3000',
  baseUrl: '/',

  organizationName: 'stillum',
  projectName: 'business-central',

  onBrokenLinks: 'warn',
  markdown: {
    mermaid: false, // false = blocchi come pre/code così mermaid-init.js li può trasformare
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  onBrokenAnchors: 'warn',

  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: [
            './src/css/custom.css',
            './src/css/diagram.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Stillum Business Central',
      logo: {
        alt: 'Stillum Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/docs/intro',
          position: 'left',
          label: 'Introduzione',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentazione',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Stillum. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['bash', 'typescript', 'javascript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
