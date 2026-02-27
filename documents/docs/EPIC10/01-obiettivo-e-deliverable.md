---
id: epic10-obiettivo
title: EPIC 10 – Obiettivo e Deliverable
sidebar_label: Obiettivo e Deliverable
---

# EPIC 10 – Artefatti UI React e Packaging NPM

## Obiettivo

Introdurre due nuovi tipi di artefatti, **MODULE** e **COMPONENT**, che consentano di definire pools, droplets e triggers tramite codice React effettivo, importando librerie npm e generando un pacchetto npm riutilizzabile dal sistema.

### Distinzione rispetto ai Form

- **FORM** (esistente): interfacce StillumForms basate su JSON Schema, approccio dichiarativo.
- **MODULE** (nuovo): modulo UI complesso composto da N componenti, definito tramite codice React/TypeScript.
- **COMPONENT** (nuovo): singolo elemento UI (pool, droplet o trigger) con proprio codice React, collegabile a un modulo padre via dipendenza.

## Deliverable principali

1. **Migrazioni DB** – Nuovi campi su `artifact_version`: `source_code`, `npm_dependencies`, `npm_package_ref`.
2. **API CRUD** – Endpoint per creare, leggere, aggiornare e pubblicare artefatti MODULE e COMPONENT.
3. **Editor React** – Editor Monaco con supporto TypeScript/TSX, IntelliSense e gestione dipendenze npm.
4. **Wizard** – Wizard di creazione per pool, droplet e trigger con template iniziali.
5. **NPM Build Service** – Servizio che compila codice React, risolve dipendenze npm e genera pacchetto npm.
6. **Registry npm interno** – Verdaccio (o equivalente) per ospitare i pacchetti generati.
7. **Plugin loader** – Meccanismo di caricamento dinamico dei pacchetti npm come plugin UI nel runtime.
8. **Documentazione** – Guide sviluppatore, diagrammi aggiornati e test end-to-end.

## Dipendenze

- **EPIC 2** (Portal UI) – L'editor React si basa sull'infrastruttura UI esistente (Monaco, routing, API client).
- **EPIC 6** (Packaging & Distribuzione) – La pipeline di build npm e il registry interno estendono l'infrastruttura di packaging.
