---
id: architecture-overview
title: Panoramica Architetturale
sidebar_label: Panoramica
---

## Obiettivo

La piattaforma Stillum mira a offrire un portale centralizzato per utenti di business (analisti, process owners, operation managers) dove gestire, pubblicare ed eseguire artefatti di processo. Tutto è organizzato per tenant e versionato.

## Strati principali

- **Interfaccia utente (Portal UI)** – un’applicazione web che funge da “Business Central” per navigare, modellare, pubblicare e monitorare.
- **Registry API** – il backend che gestisce i metadati, le versioni e il ciclo di vita degli artefatti.
- **Publisher** – servizio che valida, risolve dipendenze e produce versioni immutabili pronte per l’esecuzione.
- **Runtime Gateway** – la porta d’accesso al runtime basato su Temporal, responsabile dell’avvio e del monitoraggio delle istanze.
- **Storage e database** – Postgres per i metadati e MinIO/S3 per i payload degli artefatti.
- **Identità e multi-tenant** – gestione di tenant, utenti, ruoli e permessi con isolamento dei dati.

Ogni sezione della documentazione approfondisce i requisiti specifici di questi elementi.