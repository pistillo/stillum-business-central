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
- **COMPONENT** (nuovo): singolo elemento UI (pool, droplet o trigger) con proprio codice React, associabile a un modulo padre (workspace) e referenziabile come dipendenza di versione.

## Deliverable principali

1. **Migrazioni DB** – Supporto `MODULE/COMPONENT`, `parent_module_id` e `npm_package_ref` (con persistenza sorgenti su MinIO/S3 come file con chiavi convenzionali, senza `source_ref` e senza `npm_dependencies` in DB).
2. **API CRUD** – Endpoint per creare, leggere, aggiornare e pubblicare artefatti MODULE e COMPONENT.
3. **Editor React** – Integrazione Stillum Theia (iframe) per TypeScript/React + gestione dipendenze npm.
4. **Wizard** – Wizard di creazione per pool, droplet e trigger con template iniziali.
5. **NPM Build Service** – Servizio che compila codice React, risolve dipendenze npm e genera pacchetto npm.
6. **Registry npm interno** – Nexus per ospitare i pacchetti generati.
7. **Plugin loader** – Meccanismo di caricamento dinamico dei pacchetti npm come plugin UI nel runtime.
8. **Documentazione** – Guide sviluppatore, diagrammi aggiornati e test end-to-end.

## Dipendenze

- **EPIC 2** (Portal UI) – L'editor React si basa sull'infrastruttura UI esistente (Monaco, routing, API client).
- **EPIC 6** (Packaging & Distribuzione) – La pipeline di build npm e il registry interno estendono l'infrastruttura di packaging.
