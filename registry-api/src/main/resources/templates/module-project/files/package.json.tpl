{
  "name": "@tecnosys/{{kebabName}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "build:mf": "webpack --mode production",
    "serve:mf": "webpack serve --mode development",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "lint": "eslint src --ext .tsx,.ts",
    "format": "prettier --write src"
  },
  "keywords": [{{keywordsJson}}],
  "author": "Tecnosys Italia",
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
    },
    "./styles": "./dist/theme/index.css"
  },
  "publishConfig": {
    "registry": "https://pkgs.dev.azure.com/tecnosysitaliasrl/_packaging/npm-tecnosys/npm/registry/",
    "access": "restricted"
  },
  "dependencies": {},
  "devDependencies": {
    "@storybook/addon-essentials": "^8.4.0",
    "@storybook/addon-interactions": "^8.4.0",
    "@storybook/addon-links": "^8.4.0",
    "@storybook/react": "^8.4.0",
    "@storybook/react-vite": "^8.4.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.16",
    "css-loader": "^7.1.0",
    "html-webpack-plugin": "^5.6.0",
    "postcss": "^8.4.49",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "storybook": "^8.4.0",
    "style-loader": "^4.0.0",
    "ts-loader": "^9.5.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vite": "^6.0.0",
    "webpack": "^5.97.0",
    "webpack-cli": "^6.0.0",
    "webpack-dev-server": "^5.2.0"
  }
}
