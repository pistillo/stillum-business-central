# Dev Preview: webpack dev server in Theia

## Obiettivo
Permettere al developer di eseguire `npm install && npm run serve:mf` nel terminale Theia
per ottenere un preview live dei componenti con HMR, senza dover pubblicare.

## Stato attuale
Il template ha già il 90% dell'infrastruttura:
- `webpack.config.js.tpl`: Module Federation + HtmlWebpackPlugin + devServer con CORS
- `public/index.html.tpl`: shell HTML con `<div id="root">`
- `src/bootstrap.tsx.tpl` → render App a #root
- `src/App.tsx.tpl` → placeholder statico (inutile per preview)
- `package.json.tpl` → ha script `serve:mf` MA **mancano i devDependencies**

## Cosa manca

### 1. devDependencies in `package.json.tpl`
Senza webpack, ts-loader, etc., `npm run serve:mf` fallisce subito.

**File:** `registry-api/.../templates/module-project/files/package.json.tpl`

Aggiungere:
```json
"devDependencies": {
  "webpack": "^5.97.0",
  "webpack-cli": "^6.0.0",
  "webpack-dev-server": "^5.2.0",
  "html-webpack-plugin": "^5.6.0",
  "ts-loader": "^9.5.0",
  "style-loader": "^4.0.0",
  "css-loader": "^7.1.0",
  "typescript": "~5.6.2",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0"
}
```

### 2. `App.tsx.tpl` → dev harness che importa i componenti

Attualmente è un placeholder statico. Va migliorato per importare e renderizzare
i componenti dal barrel `./components`, così il dev server mostra qualcosa di utile.

**File:** `registry-api/.../templates/module-project/files/src/App.tsx.tpl`

Importare da `./components` e renderizzare una gallery/showcase dei componenti.

### 3. Barrel exports rigenerati durante materializzazione del workspace

Problema: i barrel files (`src/components/droplets/index.ts`, ecc.) vengono dal
buildSnapshot e contengono `export {};`. Quando si aggiungono componenti, i barrel
non vengono aggiornati.

**File:** `stillum-theia/.../stillum-workspace-manager-impl.ts`

Dopo aver scritto i file dei componenti, rigenerare i barrel per ogni area:
```typescript
// Per ogni area (droplets, pools, triggers), generare:
// export { default as Button } from './Button/Button';
// export { default as Input } from './Input/Input';
```

### 4. `.npmrc.tpl` per accesso al registry Azure DevOps

I package `@tecnosys/stillum-forms-core` e `@tecnosys/stillum-forms-react` sono
sul registry Azure DevOps. Serve un `.npmrc` che punti al registry corretto.

**File:** `registry-api/.../templates/module-project/files/.npmrc.tpl` (nuovo)

```
registry=https://pkgs.dev.azure.com/tecnosysitaliasrl/_packaging/npm-tecnosys/npm/registry/
always-auth=true
```

Nota: il token di autenticazione va configurato dal developer nella propria
configurazione npm globale (`~/.npmrc`), non nel template per motivi di sicurezza.

## Riepilogo modifiche

| File | Azione |
|------|--------|
| `package.json.tpl` | Aggiungere devDependencies per webpack toolchain |
| `App.tsx.tpl` | Importare componenti e renderizzare un dev showcase |
| `.npmrc.tpl` | Nuovo file per registry Azure DevOps |
| `template.json` | Aggiungere `.npmrc` alla lista dei file (se necessario) |
| `ProjectTemplateService.java` | Nessuna modifica (già processa tutti i .tpl) |
| `stillum-workspace-manager-impl.ts` | Rigenerare barrel exports dopo materializzazione componenti |

## Flusso risultante

1. Developer apre modulo in Theia
2. Workspace materializzato con tutti i file + barrel exports aggiornati
3. Developer apre terminale in Theia
4. `npm install` → installa webpack, react, dipendenze private
5. `npm run serve:mf` → webpack dev server su `http://localhost:{port}`
6. Browser apre la URL → vede i componenti renderizzati in App.tsx
7. Modifica codice → HMR aggiorna il preview in tempo reale
8. Debug con Chrome DevTools (sourcemaps incluse da ts-loader)
