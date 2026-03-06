---
id: architecture-overview
title: Panoramica Architetturale
sidebar_label: Panoramica
---

## Obiettivo

La piattaforma Stillum mira a offrire un portale centralizzato per utenti di business (analisti, process owners, operation managers) dove gestire, pubblicare ed eseguire artefatti di processo. Tutto è organizzato per tenant e versionato.

## Strati principali

- **Interfaccia utente (Portal UI)** – web app React (Vite) per login OIDC, selezione tenant, catalogo, editor e pubblicazione.
- **Editor avanzato (Stillum Theia)** – IDE Theia custom avviato separatamente e integrato nel Portal UI via iframe per l’editing di artefatti `MODULE`/`COMPONENT` (TypeScript/React).
- **Registry API** – servizio Quarkus che gestisce metadati, versioni, ambienti e dipendenze; espone API REST sotto prefisso `/api`.
- **Publisher** – servizio Quarkus che valida e pubblica versioni: costruisce bundle immutabili su MinIO, aggiorna lo stato a `PUBLISHED`, integra `npm-build-service` per `MODULE`/`COMPONENT`.
- **NPM Build Service** – servizio Node.js/Fastify che genera e pubblica pacchetti npm su Nexus a partire dal codice sorgente React.
- **Runtime Gateway** – nel worktree corrente è un gateway Quarkus usato come proxy verso Nexus (evita CORS dal browser). L’orchestrazione Temporal è pianificata ma non implementata qui.
- **Storage e database** – PostgreSQL per metadati (con RLS multi-tenant) e MinIO/S3 per payload e bundle; Keycloak per OIDC; Nexus come npm registry interno.

Ogni sezione della documentazione approfondisce i requisiti specifici di questi elementi.
