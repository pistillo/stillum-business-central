{
  "name": "@tecnosys/{{kebabName}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack serve --mode development"
  },
  "keywords": [{{keywordsJson}}],
  "author": "Tecnosys Italia",
  "license": "UNLICENSED",
  "peerDependencies": {
    "react": ">=19",
    "react-dom": ">=19"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "css-loader": "^7.1.0",
    "html-webpack-plugin": "^5.6.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "style-loader": "^4.0.0",
    "ts-loader": "^9.5.0",
    "typescript": "^5.3.0",
    "webpack": "^5.97.0",
    "webpack-cli": "^6.0.0",
    "webpack-dev-server": "^5.2.0"
  }
}
