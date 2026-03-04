{
  "name": "@tecnosys/{{kebabName}}",
  "version": "1.0.0",
  "description": "{{description}}",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "webpack --mode production",
    "build:dev": "tsup",
    "serve:mf": "webpack serve --mode development",
    "test": "vitest run --environment jsdom",
    "test:watch": "vitest --environment jsdom",
    "lint": "eslint src --ext .tsx,.ts",
    "format": "prettier --write src",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "generate-registry": "npx tsx scripts/generate-registry-functions.ts"
  },
  "keywords": [{{keywordsJson}}],
  "author": "Salvo Pistillo",
  "license": "UNLICENSED",
  "peerDependencies": {
    "react": ">=19",
    "react-dom": ">=19"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "publishConfig": {
    "registry": "https://pkgs.dev.azure.com/tecnosysitaliasrl/_packaging/npm-tecnosys/npm/registry/",
    "access": "restricted"
  }
}
