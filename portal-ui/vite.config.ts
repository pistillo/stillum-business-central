import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^hoist-non-react-statics$/,
        replacement: path.resolve(__dirname, 'src/hoist-non-react-statics.ts'),
      },
      {
        find: /^hoist-non-react-statics\/.+$/,
        replacement: path.resolve(__dirname, 'src/hoist-non-react-statics.ts'),
      },
    ],
  },
  optimizeDeps: {
    exclude: [
      '@tecnosys/erp-design-system',
      '@tecnosys/stillum-forms-core',
      '@tecnosys/stillum-forms-editor',
      '@tecnosys/stillum-forms-react',
    ],
  },
  server: {
    watch: {
      followSymlinks: true,
    },
  },
});
