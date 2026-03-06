---
id: architecture-components
title: Componenti dell’Architettura
sidebar_label: Componenti
---

La piattaforma è composta da diversi componenti interconnessi. Ogni componente deve essere sviluppato con responsabilità chiare e interfacce ben definite.

### Portale UI

- Interfaccia basata su web che espone tutte le funzionalità di gestione e monitoraggio.
- Deve supportare autenticazione e autorizzazione multi-tenant.
- Include pagine per home, catalogo, design, pubblicazione e runtime.

### Stillum Theia (IDE)

- Distribuzione Theia con estensioni custom per Stillum (workspace generato dal Registry, salvataggio via portal bridge).
- Integrato nel Portal UI tramite iframe (`VITE_THEIA_BASE_URL`) e protocollo `postMessage` (`stillum:init`, `stillum:save-request`, `stillum:save-response`, `stillum:theme-change`, `stillum:token-refresh`).
- Usato per l’editing di artefatti `MODULE`/`COMPONENT` (TypeScript/React) con workspace materializzato (snapshot progetto + sorgenti).

### Registry API

- Fornisce CRUD per artefatti (processi BPMN, regole DMN, form StillumForms, request, moduli UI React, componenti UI React).
- Mantiene lo **storico delle versioni**, lo stato (bozza, pubblicato, ritirato) e le dipendenze tra artefatti.
- Per gli artefatti `MODULE` e `COMPONENT`, gestisce anche codice sorgente e file progetto (bundle JSON su MinIO referenziato da `artifact_version.source_ref`), dipendenze npm e riferimento al pacchetto npm generato.
- Espone endpoint per la gestione del ciclo di vita e la ricerca nel catalogo.
- Protegge gli accessi per tenant e ruolo.

### Publisher

- Riceve artefatti in stato di bozza e produce versioni pubblicate.
- Valida la correttezza dei modelli e verifica che tutte le dipendenze siano presenti e pubblicate.
- Genera un “bundle” immutabile con i riferimenti alle versioni dipendenti.
- Per artefatti `MODULE`/`COMPONENT`, invoca il NPM Build Service per compilare il codice React e generare/pubblicare il pacchetto npm su Nexus; salva `npm_package_ref` su `artifact_version`.
- Scrive nella storage (MinIO/S3) e aggiorna lo stato della versione nel DB.

### Runtime Gateway

- Nel worktree corrente espone un proxy HTTP verso Nexus per evitare CORS dal browser (ricerca e lookup package npm).
- L’integrazione con Temporal per avvio/monitoraggio istanze è pianificata (fase runtime) ma non è implementata in questo servizio.

### NPM Build Service (EPIC 10)

- Servizio dedicato alla compilazione del codice sorgente React degli artefatti `MODULE` e `COMPONENT`.
- Risolve le dipendenze npm, esegue il bundling (tramite Vite o Rollup) e genera pacchetti npm pubblicabili.
- Pubblica i pacchetti generati su un NPM Registry interno (Nexus).
- Invocato dal Publisher durante il flusso di pubblicazione degli artefatti MODULE/COMPONENT.

### Altri Componenti

- **Identity & Access Management (IAM)** – integrazione con provider (es. Keycloak), ruoli (Analyst, Owner, Viewer), mapping dei tenant.
- **Database** – Postgres con schema multi-tenant; implementazione di Row Level Security o policy applicative.
- **Storage** – S3/MinIO per i file degli artefatti; i file devono essere immutabili e identificati da versioni.
- **NPM Registry** (EPIC 10) – registry npm interno (Nexus) per i pacchetti generati dagli artefatti MODULE/COMPONENT; il gateway espone endpoint proxy per interrogare il registry dal browser.
