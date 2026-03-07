import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/registry': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/registry/, '/api'),
      },
      '/api/publisher': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/publisher/, '/api'),
      },
    },
  },
  resolve: {
    alias: {
      // Shim i18n: il modulo stillum-forms-core/i18n è CJS e in bundle .default può non essere
      // l'istanza i18next, causando "i18n.exists is not a function" in ElementPropertiesEditor
      '@tecnosys/stillum-forms-core/i18n': path.resolve(__dirname, 'src/i18n.ts'),
      // Risolvi /styles al CSS: il pacchetto espone solo styles.d.ts (export {}) e styles.js; puntiamo al CSS
      '@tecnosys/erp-design-system/styles': path.resolve(
        __dirname,
        'node_modules/@tecnosys/erp-design-system/dist/styles.css'
      ),
    },
  },
});
