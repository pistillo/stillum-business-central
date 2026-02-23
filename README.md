# Stillum Business Portal – Documentazione

Questo branch contiene **solo la documentazione** del progetto Stillum Business Portal.

## Contenuto

- **`documents/`** — sito documentazione (Docusaurus) con piano di sviluppo, EPIC, fasi, architettura e moduli.

## Avvio della documentazione

```bash
cd documents
pnpm install
pnpm start
```

Apri [http://localhost:3000](http://localhost:3000) per visualizzare la documentazione.

## Build per produzione

```bash
cd documents
pnpm build
```

L'output sarà in `documents/build/`.

---

Per il codice sorgente (portal-ui, registry-api, publisher, runtime-gateway) e l'infrastruttura, utilizzare il branch principale del repository.
