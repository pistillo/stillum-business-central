---
id: epic10-stato
title: Stato EPIC 10 – Artefatti UI React e Packaging NPM
sidebar_label: Stato EPIC 10
---

# Stato EPIC 10 – Artefatti UI React e Packaging NPM

**Obiettivo dell'EPIC:** Introdurre i tipi di artefatti `MODULE` e `COMPONENT` per consentire la definizione di pools, droplets e triggers tramite codice React effettivo, con editor dedicato, risoluzione dipendenze npm e generazione di pacchetti npm riutilizzabili dal runtime come plugin caricabili.

**Contesto:** Gli artefatti `FORM` restano dedicati alla definizione di interfacce StillumForms basate su JSON Schema. I nuovi artefatti `MODULE` e `COMPONENT` estendono la piattaforma con la possibilita di scrivere codice React, importare librerie npm e produrre pacchetti npm pubblicabili su un registry interno (Nexus).

**Dipendenze:** EPIC 2 (Portal UI) e EPIC 6 (Packaging & Distribuzione).

**Stato complessivo:** **In corso** (55%).

---

## Riepilogo per FEATURE

| FEATURE | Stato | Note |
|---------|-------|------|
| **10.1** Backend: Enum, DB e API per MODULE/COMPONENT | 🟢 Completato | Enum, migrazioni DB, entity, DTOs e API CRUD implementati |
| **10.2** Editor React (Theia + TypeScript) | 🟡 In corso (85%) | Integrazione Stillum Theia (iframe + postMessage), DependenciesPanel (Nexus proxy), NewArtifactPage con API dedicate |
| **10.3** Build e Packaging NPM | 🟡 In corso (80%) | NPM Build Service implementato, Nexus in docker-compose, integrazione Publisher |
| **10.4** Runtime: Caricamento Plugin UI | 🔴 Non iniziato | Definire architettura plugin loader |
| **10.5** Documentazione e Test | 🟡 In corso (40%) | Documentazione architetturale aggiornata, test da completare |

---

## Dettaglio per FEATURE e Task (EPIC 10)

### FEATURE 10.1 – Backend: Enum, DB e API per MODULE/COMPONENT

**Stato (worktree):** 🟢 Completato (100%) — Enum, migrazioni DB, entity, DTOs e API CRUD implementati.

#### US-10.1.1 – Estensione modello dati per artefatti React

| Task | Stato | Evidenza |
|------|-------|----------|
| T-10.1.1.1 Aggiungere valori MODULE e COMPONENT all'enum ArtifactType | 🟢 | Enum presente in `ArtifactType.java` |
| T-10.1.1.2 Creare migrazione DB: campi `source_code`, `npm_dependencies`, `npm_package_ref` su `artifact_version` | 🟢 | Migrazione V10 creata e applicata |
| T-10.1.1.3 Aggiornare entity JPA `ArtifactVersion` con i nuovi campi | 🟢 | Entity aggiornata con sourceCode, npmDependencies, npmPackageRef |
| T-10.1.1.4 Implementare API CRUD specifiche per MODULE e COMPONENT | 🟢 | Endpoint POST /modules e /components implementati |
| T-10.1.1.5 Gestire relazione Modulo→Componenti (workspace) | 🟢 | `artifact.parent_module_id` + endpoint `GET /artifacts/{moduleId}/workspace` |
| T-10.1.1.6 Scrivere test unitari e di integrazione per i nuovi endpoint | 🟢 | Test ArtifactResourceTest estesi (13 test, tutti passanti) |

---

### FEATURE 10.2 – Editor React (Theia + TypeScript)

**Stato (worktree):** 🟡 In corso (85%).

#### US-10.2.1 – Editor di codice React con supporto TypeScript

| Task | Stato | Evidenza |
|------|-------|----------|
| T-10.2.1.1 Integrare Stillum Theia come editor TypeScript/React | 🟢 | `TheiaEditor.tsx` (iframe + protocollo `stillum:*`) |
| T-10.2.1.2 Implementare load/save sorgenti via Registry API | 🟢 | Workspace da `GET /workspace`, save via `updateVersion()` mediato dal portale (postMessage) |
| T-10.2.1.3 Integrare campo per selezionare/installare dipendenze npm (autocomplete da registry) | 🟢 | `DependenciesPanel.tsx`: ricerca npm, add/remove dipendenze con persistenza |
| T-10.2.1.4 Sviluppare wizard di creazione "Nuovo Pool / Droplet / Trigger" | 🔴 | Da sviluppare |
| T-10.2.1.5 Aggiornare NewArtifactPage con opzioni MODULE e COMPONENT | 🟢 | `NewArtifactPage.tsx`: usa `createModule()`/`createComponent()` API dedicate |
| T-10.2.1.6 Aggiornare CataloguePage con filtri e vista aggregata per MODULE | 🟢 | `CataloguePage.tsx`: filtri per tutti i tipi incluso MODULE/COMPONENT |

---

### FEATURE 10.3 – Build e Packaging NPM

**Stato (worktree):** 🟡 In corso (80%).

#### US-10.3.1 – NPM Build Service

| Task | Stato | Evidenza |
|------|-------|----------|
| T-10.3.1.1 Progettare architettura del NPM Build Service (containerizzato, API REST) | 🟢 | `npm-build-service/`: Fastify server con endpoint POST /api/build |
| T-10.3.1.2 Implementare risoluzione dipendenze npm e installazione in sandbox | 🟢 | `dependency-installer.ts`: npm install --ignore-scripts in temp dir |
| T-10.3.1.3 Implementare bundling codice React con esbuild | 🟢 | `bundler.ts`: esbuild ESM bundle con externalize react/react-dom |
| T-10.3.1.4 Generare pacchetto npm con manifest, types e bundle | 🟢 | `project-generator.ts` + `packager.ts`: genera package.json, tsconfig, pubblica |
| T-10.3.1.5 Configurare registry npm (Nexus) e pubblicazione automatica | 🟢 | Nexus in docker-compose.yml, `.npmrc` generato per ogni build |
| T-10.3.1.6 Integrare il Build Service nel flusso del Publisher | 🟢 | `PublishService.java`: chiama npm-build-service via REST client |
| T-10.3.1.7 Aggiornare il Publisher per includere npm_package_ref nel bundle di pubblicazione | 🟢 | `PublishService.java`: manifest include npmPackageRef e npmDependencies |
| T-10.3.1.8 Scrivere test per il flusso completo di build e pubblicazione | 🔴 | Da scrivere |

---

### FEATURE 10.4 – Runtime: Caricamento Plugin UI

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-10.4.1 – Plugin loader per pacchetti npm

| Task | Stato | Evidenza |
|------|-------|----------|
| T-10.4.1.1 Progettare architettura plugin loader (module federation, dynamic import o SystemJS) | 🔴 | |
| T-10.4.1.2 Implementare caricamento dinamico dei pacchetti npm dal registry interno | 🔴 | |
| T-10.4.1.3 Definire interfaccia/contratto per plugin UI (pool, droplet, trigger) | 🔴 | |
| T-10.4.1.4 Implementare sandboxing e isolamento dei plugin | 🔴 | |
| T-10.4.1.5 Integrare il plugin loader nel Runtime Gateway / Portal UI | 🔴 | |
| T-10.4.1.6 Scrivere test per caricamento e isolamento plugin | 🔴 | |

---

### FEATURE 10.5 – Documentazione e Test

**Stato (worktree):** 🟡 In corso (40%).

#### US-10.5.1 – Documentazione e test end-to-end

| Task | Stato | Evidenza |
|------|-------|----------|
| T-10.5.1.1 Aggiornare documentazione architetturale con NPM Build Service e plugin loader | 🟢 | `04-implementazione.md` aggiornato |
| T-10.5.1.2 Scrivere guida sviluppatore: come creare un modulo/componente React | 🔴 | |
| T-10.5.1.3 Aggiornare diagrammi ER, architetturali e roadmap | 🔴 | |
| T-10.5.1.4 Scrivere test end-to-end per il flusso completo (creazione -> edit -> build -> publish -> runtime load) | 🔴 | |
| T-10.5.1.5 Documentare come importare e usare le librerie npm generate | 🔴 | |

---

## Deliverable attesi (EPIC 10)

| Deliverable | Dove si trova |
|-------------|---------------|
| Migrazione DB per campi MODULE/COMPONENT | `registry-api/src/main/resources/db/migration/V10__*.sql` |
| API CRUD per MODULE/COMPONENT | `registry-api/src/main/java/.../service/ArtifactService.java` |
| Editor React (Theia) + dipendenze npm | `portal-ui/src/components/TheiaEditor.tsx` e `portal-ui/src/components/DependenciesPanel.tsx` |
| NPM Build Service | `npm-build-service/` (Fastify + esbuild) |
| Configurazione Nexus | `docker-compose.yml` (servizio `nexus`) |
| Integrazione Publisher | `publisher/src/.../service/PublishService.java` + `publisher/src/.../client/NpmBuildClient.java` |
| Plugin loader runtime | Da definire (non presente nel worktree) |
| Documentazione | `documents/docs/EPIC10/` |
