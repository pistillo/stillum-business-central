---
slug: phase1-registry-api
title: Registry API – Fase 1
---

La **Registry API** è il cuore del backend della piattaforma: gestisce la persistenza degli artefatti, delle loro versioni e delle relazioni di dipendenza.  In questa fase si progettano gli endpoint REST necessari per creare e consultare le definizioni di processi, regole, moduli e request, assicurando l’isolamento tra tenant.

## Modello dati riassuntivo

Nella Fase 0 sono state definite le entità `Tenant`, `Artifact`, `ArtifactVersion` e `Publication`.  In questa fase si utilizzano queste entità come base per l’API:

* **Artifact**: rappresenta un elemento di business (es. processo BPMN, regola DMN, modulo, request). Ha un identificativo stabile (`artifactId`), metadati (titolo, descrizione, tag, area/modulo) e uno stato (ad esempio attivo o ritirato).  Un artefatto appartiene sempre a un `Tenant`.
* **ArtifactVersion**: identifica una versione di un artefatto. Contiene un riferimento al file (payload), una versione numerica o semantica, lo stato della versione (`Draft` o `Published`), le dipendenze verso altre versioni e informazioni sul creatore.  Ogni versione appartiene a un artefatto.
* **Dependency**: relazione tra una versione di un artefatto e una versione di un altro artefatto (es. un processo BPMN che usa una regola DMN).  Le dipendenze sono opzionali ma devono essere risolte prima della pubblicazione.

## Principi API

* Nel worktree corrente gli endpoint applicativi sono sotto prefisso `/api` e poi `/tenants/{tenantId}` per garantire lo **scope multi‑tenant**.
* L’autenticazione restituisce un `tenantId` che viene usato per limitare la visibilità dei dati.
* Le operazioni di modifica si applicano solo alle versioni mutabili. Una versione `PUBLISHED` non può più essere modificata o cancellata.
* I contenuti (payload e sorgenti) non vengono salvati nel database ma nello storage oggetti con chiavi convenzionali. Le API versioni espongono una mappa `files` (path → contenuto) caricata dallo storage; per upload/download “payload-based” è disponibile anche un set di endpoint presigned.

## Endpoint principali

### Gestione degli artefatti

| Metodo e percorso | Descrizione |
|------------------|-------------|
| **`POST /api/tenants/{tenantId}/artifacts`** | Crea un nuovo artefatto (PROCESS/RULE/FORM/REQUEST/MODULE/COMPONENT). Restituisce `artifactId`. |
| **`GET /api/tenants/{tenantId}/artifacts`** | Lista artefatti con filtri (`type`, `status`, `area`, `tag`, `parentModuleId`) e paginazione (`page`, `size`). |
| **`GET /api/tenants/{tenantId}/artifacts/{artifactId}`** | Dettaglio artefatto con elenco versioni. |
| **`PUT /api/tenants/{tenantId}/artifacts/{artifactId}`** | Aggiorna metadati artefatto. |
| **`DELETE /api/tenants/{tenantId}/artifacts/{artifactId}`** | Soft delete/ritiro artefatto. |
| **`POST /api/tenants/{tenantId}/artifacts/modules`** | Crea un artefatto `MODULE` e la prima versione `0.1.0` con template files. |
| **`POST /api/tenants/{tenantId}/artifacts/components`** | Crea un artefatto `COMPONENT` legato a `parentModuleId` e la prima versione `0.1.0`. |
| **`GET /api/tenants/{tenantId}/artifacts/{moduleId}/workspace`** | Ritorna workspace modulo + componenti (per integrazione editor Theia). |

### Gestione delle versioni

| Metodo e percorso | Descrizione |
|------------------|-------------|
| **`POST /api/tenants/{tenantId}/artifacts/{artifactId}/versions`** | Crea una versione (default `DRAFT`). Può includere `files` per creare subito contenuti nello storage. |
| **`GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions`** | Elenca le versioni dell’artefatto (include `files`). |
| **`GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}`** | Dettaglio versione (stato, metadata, `npmPackageRef`, `files`). |
| **`PUT /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}`** | Aggiorna una versione mutabile: `metadata`, `npmPackageRef` e/o file (merge per singolo file). |
| **`DELETE /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}`** | Elimina una versione mutabile. |
| **`POST /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies`** | Registra dipendenze verso altre versioni. |
| **`GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies`** | Elenca dipendenze. |

### Ricerca e discovery

| Metodo e percorso | Descrizione |
|------------------|-------------|
| **`GET /api/tenants/{tenantId}/search/artifacts`** | Ricerca per testo (`q`) e filtri (`type`, `status`, `area`, `tag`) con paginazione. |

### Storage presigned (payload/bundle)

| Metodo e percorso | Descrizione |
|------------------|-------------|
| **`GET /api/tenants/{tenantId}/storage/upload-url`** | URL presignato upload verso bucket artifacts (chiave convenzionale). |
| **`GET /api/tenants/{tenantId}/storage/download-url`** | URL presignato download da bucket artifacts. |
| **`GET /api/tenants/{tenantId}/storage/bundle-upload-url`** | URL presignato upload bundle verso bucket bundles. |
| **`GET /api/tenants/{tenantId}/storage/bundle-download-url`** | URL presignato download bundle da bucket bundles. |

## Considerazioni di sicurezza

* L’API implementa **policy di row‑level security** a livello di database per garantire che un tenant non possa accedere ai dati di un altro.  Tutte le query devono filtrare per `tenantId`.
* Le operazioni di aggiornamento e cancellazione devono verificare che l’utente abbia il **ruolo appropriato** (es. solo gli Analyst o i Process Owner possono creare e modificare bozze; solo i Process Owner possono ritirare artefatti pubblicati).
* I payload possono essere caricati tramite endpoint presigned dello storage. Nel worktree corrente non è previsto salvare un `payloadRef` in DB: l’API espone direttamente la chiave oggetto convenzionale e un URL presignato a scadenza breve.

## Evoluzioni future

Nelle fasi successive la Registry API sarà estesa con:

* Endpoint per import/export di pacchetti provenienti da Git o da altri ambienti.
* Supporto per **branch e merge** nelle versioni, per scenari più avanzati di collaborazione.
* API GraphQL (opzionale) per una maggiore flessibilità di query lato client.
