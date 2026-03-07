---
id: modules-registry
title: Registry degli Artefatti
sidebar_label: Registry
---

Il **Registry degli Artefatti** è il cuore della persistenza e del versionamento degli artefatti.

## Responsabilità

- **Gestione artefatti**: creare, leggere, aggiornare, ritirare (soft delete) artefatti di tipo PROCESS/RULE/FORM/REQUEST/MODULE/COMPONENT.
- **Versionamento**: ogni artefatto mantiene un log di versioni; ogni versione ha uno stato (`DRAFT`, `REVIEW`, `APPROVED`, `PUBLISHED`, `RETIRED`). Le versioni `PUBLISHED` sono immutabili.
- **Dipendenze tra versioni**: memorizza la relazione `artifact_version -> depends_on_version` usata dal Publisher per includere dipendenze nel bundle e per i flussi `MODULE`/`COMPONENT`.
- **Workspace Modulo→Componenti**: i `COMPONENT` sono associati a un `MODULE` tramite `artifact.parent_module_id` (relazione strutturale usata per comporre il workspace editor).
- **Contenuti (payload e sorgenti)**: il Registry salva i contenuti su MinIO/S3 come file sotto un prefisso convenzionale `tenant-<tenantId>/<type>/<artifactId>/<versionId>/...` (non esiste un campo `payloadRef/sourceRef` in DB). Le API versioni espongono una mappa `files` (path → contenuto) ottenuta dallo storage.
- **Metadata e tag**: permette di assegnare descrizioni, tag, area/modulo, owner e tenant.
- **Ricerca**: fornisce endpoint per cercare artefatti per testo libero, tag, tipo, stato e versioni.

## Tipi di artefatti

| Tipo | Formato | Descrizione |
|------|---------|-------------|
| `PROCESS` | XML/BPMN | Definizione di processo |
| `RULE` | XML/DMN | Regola decisionale |
| `FORM` | JSON | Definizione di form (StillumForms) |
| `REQUEST` | JSON | Definizione di request (contratto di servizio) |
| `MODULE` | TypeScript/React | Modulo UI composto da componenti; contiene progetto/snapshot e codice sorgente |
| `COMPONENT` | TypeScript/React | Componente UI singolo (POOL/DROPLET/TRIGGER) associato a un modulo padre |

> **Distinzione FORM vs MODULE/COMPONENT:** gli artefatti `FORM` restano dedicati alla definizione di interfacce StillumForms basate su JSON Schema (approccio dichiarativo). Gli artefatti `MODULE` e `COMPONENT` introducono la possibilità di definire pools, droplets e triggers tramite codice React effettivo, importando librerie npm e producendo pacchetti npm riutilizzabili dal runtime come plugin caricabili.

### Sorgenti MODULE e COMPONENT (worktree)

Per gli artefatti `MODULE` e `COMPONENT`, i sorgenti e i file di progetto sono gestiti come file nello storage e restituiti dall’API nella mappa `files` della versione (es. `src/index.tsx`, `package.json`, `tsconfig.json`).

Il campo `npmPackageRef` sulla versione viene valorizzato dal Publisher dopo la build/publicazione npm (Nexus) e rappresenta il riferimento al pacchetto pubblicato.

### Relazione Modulo→Componenti (workspace)

Un artefatto `MODULE` aggrega N artefatti `COMPONENT` tramite `artifact.parent_module_id`:

- Il Registry espone `GET /api/tenants/{tenantId}/artifacts/{moduleId}/workspace` che ritorna modulo + versione + componenti (con versioni).
- L’editor Theia usa questo workspace per materializzare il progetto locale e aprire i file.

## API (worktree)

- CRUD artefatti: `POST/GET/PUT/DELETE /api/tenants/{tenantId}/artifacts`
- Versioni: `POST/GET/PUT/DELETE /api/tenants/{tenantId}/artifacts/{artifactId}/versions`
- Dipendenze tra versioni: `POST/GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies`
- Ricerca: `GET /api/tenants/{tenantId}/search/artifacts`
- Ambienti: `POST/GET/PUT/DELETE /api/tenants/{tenantId}/environments`
- Workspace modulo: `GET /api/tenants/{tenantId}/artifacts/{moduleId}/workspace`
