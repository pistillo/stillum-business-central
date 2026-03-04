import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  framework: getAbsolutePath("@storybook/react-vite"),
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  refs: {},
  addons: [
    getAbsolutePath("@storybook/addon-links"), 
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y")
  ],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(config) {
    return {
      ...config,
      define: {
        ...config.define,
        global: 'globalThis',
        process: '{}',
        'process.env': '{}',
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
        },
      },
      plugins: [
        ...(config.plugins || []),
      ],
    };
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
