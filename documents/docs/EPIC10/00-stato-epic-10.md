---
id: epic10-stato
title: Stato EPIC 10 – Artefatti UI React e Packaging NPM
sidebar_label: Stato EPIC 10
---

# Stato EPIC 10 – Artefatti UI React e Packaging NPM

**Obiettivo dell'EPIC:** Introdurre i tipi di artefatti `MODULE` e `COMPONENT` per consentire la definizione di pools, droplets e triggers tramite codice React effettivo, con editor dedicato, risoluzione dipendenze npm e generazione di pacchetti npm riutilizzabili dal runtime come plugin caricabili.

**Contesto:** Gli artefatti `FORM` restano dedicati alla definizione di interfacce StillumForms basate su JSON Schema. I nuovi artefatti `MODULE` e `COMPONENT` estendono la piattaforma con la possibilità di scrivere codice React, importare librerie npm e produrre pacchetti npm pubblicabili su un registry interno.

**Dipendenze:** EPIC 2 (Portal UI) e EPIC 6 (Packaging & Distribuzione).

**Stato complessivo:** **In corso** (10%).

---

## Riepilogo per FEATURE

| FEATURE | Stato | Note |
|---------|-------|------|
| **10.1** Backend: Enum, DB e API per MODULE/COMPONENT | 🟢 Completato | Enum, migrazioni DB, entity, DTOs e API CRUD implementati |
| **10.2** Editor React (Monaco + TypeScript) | 🔴 Non iniziato | Editor Monaco presente per XML/JSON; estensione per React/TS da sviluppare |
| **10.3** Build e Packaging NPM | 🔴 Non iniziato | NPM Build Service e registry interno da progettare |
| **10.4** Runtime: Caricamento Plugin UI | 🔴 Non iniziato | Definire architettura plugin loader |
| **10.5** Documentazione e Test | 🔴 Non iniziato | Manuali, esempi e test da scrivere |

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
| T-10.1.1.5 Gestire relazione Modulo→Componenti via tabella `dependency` | 🟢 | Validazione COMPONENT→MODULE implementata in ArtifactService |
| T-10.1.1.6 Scrivere test unitari e di integrazione per i nuovi endpoint | 🟢 | Test ArtifactResourceTest estesi (13 test, tutti passanti) |

---

### FEATURE 10.2 – Editor React (Monaco + TypeScript)

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-10.2.1 – Editor di codice React con supporto TypeScript

| Task | Stato | Evidenza |
|------|-------|----------|
| T-10.2.1.1 Configurare Monaco Editor per linguaggio TypeScript/TSX con IntelliSense | 🔴 | |
| T-10.2.1.2 Implementare load/save del codice sorgente React da/verso Registry API | 🔴 | |
| T-10.2.1.3 Integrare campo per selezionare/installare dipendenze npm (autocomplete da registry) | 🔴 | |
| T-10.2.1.4 Sviluppare wizard di creazione "Nuovo Pool / Droplet / Trigger" | 🔴 | |
| T-10.2.1.5 Aggiornare NewArtifactPage con opzioni MODULE e COMPONENT | 🔴 | |
| T-10.2.1.6 Aggiornare CataloguePage con filtri e vista aggregata per MODULE | 🔴 | |

---

### FEATURE 10.3 – Build e Packaging NPM

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-10.3.1 – NPM Build Service

| Task | Stato | Evidenza |
|------|-------|----------|
| T-10.3.1.1 Progettare architettura del NPM Build Service (containerizzato, API REST) | 🔴 | |
| T-10.3.1.2 Implementare risoluzione dipendenze npm e installazione in sandbox | 🔴 | |
| T-10.3.1.3 Implementare bundling codice React con Vite o Rollup | 🔴 | |
| T-10.3.1.4 Generare pacchetto npm con manifest, types e bundle | 🔴 | |
| T-10.3.1.5 Configurare registry npm interno (Verdaccio) e pubblicazione automatica | 🔴 | |
| T-10.3.1.6 Integrare il Build Service nel flusso del Publisher | 🔴 | |
| T-10.3.1.7 Aggiornare il Publisher per includere npm_package_ref nel bundle di pubblicazione | 🔴 | |
| T-10.3.1.8 Scrivere test per il flusso completo di build e pubblicazione | 🔴 | |

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

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-10.5.1 – Documentazione e test end-to-end

| Task | Stato | Evidenza |
|------|-------|----------|
| T-10.5.1.1 Aggiornare documentazione architetturale con NPM Build Service e plugin loader | 🔴 | |
| T-10.5.1.2 Scrivere guida sviluppatore: come creare un modulo/componente React | 🔴 | |
| T-10.5.1.3 Aggiornare diagrammi ER, architetturali e roadmap | 🔴 | |
| T-10.5.1.4 Scrivere test end-to-end per il flusso completo (creazione → edit → build → publish → runtime load) | 🔴 | |
| T-10.5.1.5 Documentare come importare e usare le librerie npm generate | 🔴 | |

---

## Deliverable attesi (EPIC 10)

| Deliverable | Dove si troverà |
|-------------|-----------------|
| Migrazione DB per campi MODULE/COMPONENT | `registry-api/src/main/resources/db/migration/` |
| API CRUD per MODULE/COMPONENT | `registry-api/src/main/java/.../` |
| Editor React Monaco con TypeScript | `portal-ui/src/pages/` e `portal-ui/src/components/` |
| Wizard creazione pool/droplet/trigger | `portal-ui/src/components/` |
| NPM Build Service | `npm-build-service/` (nuovo progetto) |
| Configurazione Verdaccio | `charts/verdaccio/` o `docker-compose.yml` |
| Plugin loader runtime | `portal-ui/src/runtime/` |
| Documentazione | `documents/docs/` |
