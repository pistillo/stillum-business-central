---
id: modules-publisher
title: Servizio di Pubblicazione
sidebar_label: Publisher
---

Il **Publisher** svolge il ruolo di “gatekeeper” tra la fase di design e l’ambiente di esecuzione.

## Funzioni

- **Validazione payload (MVP)**: verifica sintassi XML/JSON per artefatti basati su `payloadRef` (PROCESS/RULE/FORM/REQUEST).
- **Risoluzione dipendenze**: carica le dipendenze dichiarate su `dependency` per la versione da pubblicare e impone che le dipendenze “standard” siano `PUBLISHED`.
- **Creazione bundle**: genera un bundle zip immutabile su MinIO/S3 con:
  - `manifest.json` (tenantId, artifactId, versionId, environmentId, file list con SHA-256, eventuale `npmPackageRef`)
  - file root dell’artefatto + file delle dipendenze
- **Build pacchetti npm (MODULE/COMPONENT)**: invoca `npm-build-service` per compilare e pubblicare su Nexus; salva `artifact_version.npm_package_ref`.
- **Registrazione pubblicazione**: persiste una `Publication` e aggiorna lo stato della versione a `PUBLISHED` nel DB; scrive audit log di successo/fallimento.

## Flusso di lavoro

1. L’utente lancia il wizard di pubblicazione dalla UI.
2. La UI invia `artifactId`, `versionId`, `environmentId` (e note) al Publisher.
3. Il Publisher legge metadati/versioni/dipendenze dal DB e scarica i payload da MinIO/S3 tramite `payloadRef` (oppure usa `sourceCode` per `MODULE`/`COMPONENT`).
4. Se `MODULE/COMPONENT`, invoca `npm-build-service` e registra `npm_package_ref` sulla versione.
5. Se tutto è corretto, crea il bundle (zip) e registra la pubblicazione (DB + storage).
6. La versione passa allo stato `PUBLISHED` ed è considerata immutabile.

## Vincoli (stato attuale)

- **Gatekeeping su PROD**: la pubblicazione verso un ambiente chiamato `PROD` è consentita solo se la versione è in stato `APPROVED`.
- **Pubblicazione singola per versione**: nel branch corrente una versione già `PUBLISHED` non può essere ripubblicata su un secondo ambiente (vincolo da rimuovere nella fase di lifecycle completo).
