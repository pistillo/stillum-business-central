import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // erp-design-system dichiara "module": "dist/index.mjs" ma il build produce solo index.js
      '@tecnosys/erp-design-system': path.resolve(
        __dirname,
        'node_modules/@tecnosys/erp-design-system/dist/index.js'
      ),
      // Shim i18n: il modulo stillum-forms-core/i18n è CJS e in bundle .default può non essere
      // l'istanza i18next, causando "i18n.exists is not a function" in ElementPropertiesEditor
      '@tecnosys/stillum-forms-core/i18n': path.resolve(__dirname, 'src/i18n.ts'),
    },
  },
});
