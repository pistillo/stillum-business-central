---
id: epic1-requisiti
title: Requisiti Fase 1 (EPIC 1 – MVP Backend)
sidebar_label: Requisiti
---

## Scopo del documento

Questo documento esplicita i requisiti funzionali e non-funzionali necessari a chiudere la Fase 1 (EPIC 1 – MVP Backend). Il focus è sul backend: Registry API, Publisher, DB multi-tenant e storage S3/MinIO.

---

## Requisiti funzionali

### Multi-tenancy (tenantId)

- Tutte le API operative per EPIC 1 devono essere **scoped** per tenant tramite path `/api/tenants/{tenantId}`.
- L’isolamento deve essere garantito **a livello DB** (tenantId e RLS) e non solo a livello applicativo.

### Registry API

#### Artefatti

- Creare, leggere, aggiornare e ritirare un artefatto:
  - `POST /api/tenants/{tenantId}/artifacts`
  - `GET /api/tenants/{tenantId}/artifacts` (filtri: type, status, tag, area + paginazione)
  - `GET /api/tenants/{tenantId}/artifacts/{artifactId}` (dettaglio + versioni)
  - `PUT /api/tenants/{tenantId}/artifacts/{artifactId}`
  - `DELETE /api/tenants/{tenantId}/artifacts/{artifactId}` (soft delete / ritiro)

#### Versioni

- Creare e gestire versioni di un artefatto:
  - `POST /api/tenants/{tenantId}/artifacts/{artifactId}/versions` (creazione bozza)
  - `GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}`
  - `PUT /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}` (solo se non pubblicata)
  - `DELETE /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}` (vietato se pubblicata)
- Immutabilità: una versione in stato `PUBLISHED` non deve essere modificabile o cancellabile.

#### Dipendenze

- Un’artefatto-versione può dichiarare dipendenze verso altri artefatti/versioni:
  - `POST /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies`
  - `GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies`
- Il sistema deve rilevare e impedire cicli nelle dipendenze.

#### Ricerca e discovery

- Ricerca full-text su titolo/descrizione con filtri e paginazione:
  - `GET /api/tenants/{tenantId}/search/artifacts?q=...`
- Filtri richiesti: type, status, tag, area.
  - Nota: nel worktree corrente è presente una baseline su Postgres FTS; la scelta definitiva (Postgres vs motore dedicato come Elastic/OpenSearch, e/o approcci multidimensionali/vettoriali) resta in valutazione e può essere posticipata.

#### Ambienti

- Gestione ambienti per tenant (minimo necessario per il portale e per validare `environmentId` nel flusso di publish):
  - `GET /api/tenants/{tenantId}/environments`
  - `POST /api/tenants/{tenantId}/environments`
  - `GET /api/tenants/{tenantId}/environments/{environmentId}`
  - `PUT /api/tenants/{tenantId}/environments/{environmentId}`
  - `DELETE /api/tenants/{tenantId}/environments/{environmentId}`

### Storage (payload)

- Generazione presigned URL upload/download per payload (BPMN/DMN XML, Form/Request JSON) con path strutturato che includa il tenant:
  - `tenant-<tenantId>/artifacts/<type>/<artifactId>/<versionId>.<ext>`
- Registrazione `payloadRef` nel DB dopo upload completato (endpoint esplicito).
- Mapping estensioni (implementazione corrente): `PROCESS/RULE -> .xml`, `FORM/REQUEST -> .json` (default `.bin`).

### Publisher (pubblicazione)

- Endpoint:
  - `POST /api/tenants/{tenantId}/publish` con `artifactId`, `versionId`, `environmentId`, `notes`
  - `GET /api/tenants/{tenantId}/publish/{publicationId}`
- Flusso:
  1. Caricamento metadati artefatto + versione.
  2. Validazione payload (BPMN/DMN/Forms/Request).
     - Nota: in EPIC 1 è accettabile una validazione MVP (XML/JSON sintattici). Le validazioni semantiche e/o basate su schema vanno allineate con quelle del progetto Editors (non ancora importato qui).
  3. Verifica dipendenze: tutte devono essere `PUBLISHED`.
  4. Creazione bundle zip (payload + manifest con hash).
  5. Upload bundle su storage, percorso includa tenant:
     - `tenant-<tenantId>/bundles/<type>/<artifactId>/<versionId>.zip`
  6. Persistenza `Publication` e aggiornamento stato versione a `PUBLISHED`.
  7. Scrittura `AuditLog` per successo/fallimento.

---

## Requisiti non-funzionali (minimi per EPIC 1)

- **Sicurezza multi-tenant**: RLS attiva su tabelle e `app.current_tenant` impostato per request/transazione.
- **Tracciabilità**: ogni publish deve produrre audit record con dettagli diagnostici.
- **Immutabilità**: versioni pubblicate e bundle non sovrascrivibili.
- **Portabilità**: storage compatibile MinIO (on-prem) e S3 (cloud) con configurazione esterna.
- **Testabilità**: test integrazione con DB e storage S3-compatibile (es. MinIO) in CI.

---

## Assunzioni esplicite EPIC 1

- Autenticazione/IAM non è requisito di EPIC 1; `tenantId` viene passato in path e usato come contesto.
- Il lifecycle completo (draft/review/approved/...) è demandato a EPIC 3; in EPIC 1 è sufficiente distinguere almeno `DRAFT` vs `PUBLISHED` per i vincoli di immutabilità e pubblicazione.
