---
id: epic1-stato
title: Stato EPIC 1 – MVP Backend
sidebar_label: Stato EPIC 1
---

# Stato EPIC 1 – MVP Backend

**Obiettivo dell'EPIC:** Realizzare i servizi backend minimi per gestione artefatti (Registry API), pubblicazione (Publisher) e storage payload/bundle in contesto multi-tenant.

**Contesto:** In questo worktree è già presente una base Quarkus per `registry-api` e `publisher`, oltre a Docker Compose, CI e documentazione di fase (es. `phase1-*`).

**Stato complessivo:** **Parzialmente implementato** — la **Registry API** è operativa per CRUD, versioni, dipendenze, search e presigned payload; il **Publisher** è ancora scaffolding (health). La base DB (Flyway, schema, indici, RLS) è presente e l’enforcement RLS per il `tenantId` è ora integrato in modo sistematico nel `registry-api` (impostazione `app.current_tenant` all’inizio delle transazioni + test DB-level).

---

## Riepilogo per FEATURE

| FEATURE | Stato | Note |
|--------|--------|------|
| **1.1** Registry API | 🟡 Parziale | CRUD artefatti/versioni, dipendenze, search e presigned payload presenti; mancano alcune parti (es. search full-text reale, filtro tag completo, environment API) |
| **1.2** Publisher Service | 🟡 Parziale | Endpoint publish/get presenti; validazione payload base (XML/JSON), check dipendenze Published, creazione bundle zip + upload su S3, persistenza Publication e AuditLog |
| **1.3** Storage (payload + bundle) | 🟡 Parziale | Presigned URL payload e update `payloadRef` presenti; presigned bundle con no-overwrite presente; resta creazione bundle (Publisher) |
| **1.4** Database multi-tenant (RLS) | 🟢 Completa (per registry-api) | Migrazioni, indici e RLS presenti; enforcement sistematico (`set_config` per transazione) + hardening `FORCE ROW LEVEL SECURITY` + test che verifica RLS a livello DB |

---

## Dettaglio per FEATURE e Task (EPIC 1)

### FEATURE 1.1 – Registry API

#### US-1.1.1 – CRUD Artefatti

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.1.1.1 | ✅ | Progetto Quarkus in `registry-api/` |
| T-1.1.1.2 | ✅ | Migrazioni core in `registry-api/src/main/resources/db/migration/` (in particolare `V2__create_core_tables.sql`) |
| T-1.1.1.3 | ✅ | `POST /api/tenants/{tenantId}/artifacts` in `com.stillum.registry.resource.ArtifactResource` |
| T-1.1.1.4 | ✅ | `GET /api/tenants/{tenantId}/artifacts` con filtri base incluso `tag` (applicato anche nel conteggio paginato) |
| T-1.1.1.5 | 🟡 | `GET /api/tenants/{tenantId}/artifacts/{artifactId}` presente; verificare che includa elenco versioni nella response (dipende dai DTO) |
| T-1.1.1.6 | ✅ | `PUT /api/tenants/{tenantId}/artifacts/{artifactId}` |
| T-1.1.1.7 | ✅ | `DELETE /api/tenants/{tenantId}/artifacts/{artifactId}` (soft delete, status `RETIRED`) |
| T-1.1.1.8 | ✅ | Tenant impostato in context e propagato automaticamente al DB (interceptor + `set_config('app.current_tenant', ...)`) |
| T-1.1.1.9 | ✅ | Test REST: `ArtifactResourceTest` |

#### US-1.1.2 – Gestione Versioni

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.1.2.1 | ✅ | `POST /api/tenants/{tenantId}/artifacts/{artifactId}/versions` |
| T-1.1.2.2 | ✅ | `GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}` |
| T-1.1.2.3 | ✅ | `PUT /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}` |
| T-1.1.2.4 | 🟡 | `DELETE` bozza implementato; verifica immutabilità `PUBLISHED` coperta da test |
| T-1.1.2.5 | ✅ | Immutabilità `PUBLISHED` enforceata con risposta `409` sui path di update/delete |
| T-1.1.2.6 | ✅ | `ArtifactVersionResourceTest` copre anche i casi `PUBLISHED` (update/delete vietati) |

#### US-1.1.3 – Gestione Dipendenze

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.1.3.1 | ✅ | Tabella `dependency` in migrazione core |
| T-1.1.3.2 | ✅ | `POST /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies` |
| T-1.1.3.3 | ✅ | `GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies` |
| T-1.1.3.4 | ✅ | Risoluzione grafo + cicli in `DependencyService` |
| T-1.1.3.5 | 🟡 | Test per cicli presenti (`DependencyServiceTest`); manca coverage end-to-end e casi “dipendenze mancanti” |

#### US-1.1.4 – Ricerca e Discovery

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.1.4.1 | 🟡 | Endpoint `/api/tenants/{tenantId}/search/artifacts` presente; da verificare uso reale full-text Postgres |
| T-1.1.4.2 | 🟡 | Filtri base presenti; `tag` non risulta supportato sull’endpoint search |
| T-1.1.4.3 | ✅ | Indici GIN tags + FTS in `V3__create_indexes.sql` |
| T-1.1.4.4 | 🔴 | Test specifici search non presenti |

---

### FEATURE 1.2 – Publisher Service

#### US-1.2.1 – Validazione e pubblicazione artefatti

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.2.1.1 | ✅ | Progetto Quarkus in `publisher/` |
| T-1.2.1.2 | ✅ | `POST /api/tenants/{tenantId}/publish` e `GET /api/tenants/{tenantId}/publish/{publicationId}` |
| T-1.2.1.3 | ✅ | Validazione payload MVP (XML well-formed, JSON parse) |
| T-1.2.1.4 | ✅ | Check dipendenze: tutte le dipendenze devono essere `PUBLISHED` |
| T-1.2.1.5 | ✅ | Creazione bundle zip + manifest + SHA-256 e upload su bucket bundles |
| T-1.2.1.6 | ✅ | Persistenza `publication` e update `artifact_version.state = PUBLISHED` |
| T-1.2.1.7 | ✅ | Test integrazione publish (happy path + dependency not published) |

#### US-1.2.2 – Audit della pubblicazione

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.2.2.1 | ✅ | Tabella `audit_log` presente in migrazione core |
| T-1.2.2.2–T-1.2.2.3 | ✅ | Audit `PUBLISH_SUCCESS` e `PUBLISH_FAILURE` su transazione separata (test incluso) |

---

### FEATURE 1.3 – Storage dei Payload

#### US-1.3.1 – Upload e download dei payload

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.3.1.1 | ✅ | Client S3 configurato in `registry-api/src/main/resources/application.properties` |
| T-1.3.1.2 | ✅ | Presigned upload `GET /api/tenants/{tenantId}/storage/upload-url` |
| T-1.3.1.3 | ✅ | Presigned download `GET /api/tenants/{tenantId}/storage/download-url` |
| T-1.3.1.4 | ✅ | Registrazione `payloadRef` via `PUT .../versions/{versionId}/payload-ref` |
| T-1.3.1.5 | 🟡 | Controllo “tenant autenticato” non applicabile senza auth; path include `tenant-{tenantId}` |
| T-1.3.1.6 | 🟡 | Dev Services S3 attive in test; mancano test integrazione upload/download contro MinIO/LocalStack |

#### US-1.3.2 – Gestione bundle di pubblicazione

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.3.2.1–T-1.3.2.4 | 🟡 | Presigned upload/download bundle + no-overwrite + test presenti; resta integrazione col flusso publish (creazione zip + upload) |

---

### FEATURE 1.4 – Database Multi-tenant

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.4.1.1 | ✅ | Schema core in migrazioni Flyway |
| T-1.4.1.2 | ✅ | RLS in `V4__create_rls_policies.sql` |
| T-1.4.1.3 | ✅ | Propagazione `app.current_tenant` invocata sistematicamente per transazione (interceptor) |
| T-1.4.1.4 | ✅ | Indici in `V3__create_indexes.sql` |
| T-1.4.1.5 | ✅ | Test isolamento DB-level: verifica che la visibilità dipenda da `app.current_tenant` e non dai filtri applicativi |
| T-1.4.1.6 | ✅ | Seed dev data in `V5__seed_dev_data.sql` |

---

## Deliverable prodotti (in questo worktree)

| Deliverable EPIC 1 | Dove si trova |
|--------------------|---------------|
| Migrazioni DB + indici + RLS + seed | `registry-api/src/main/resources/db/migration/` |
| Registry API CRUD/versioni/dipendenze/search/presigned | `registry-api/src/main/java/com/stillum/registry/resource/` |
| Test base Registry API | `registry-api/src/test/java/com/stillum/registry/` |
| Enforcement RLS sistematico + test DB-level | `registry-api/src/main/java/com/stillum/registry/filter/` e `registry-api/src/test/java/com/stillum/registry/it/` |
| Presigned bundle + test (no-overwrite) | `registry-api/src/main/java/com/stillum/registry/resource/StorageResource` e `registry-api/src/test/java/com/stillum/registry/resource/StorageBundleResourceTest` |
| Docker Compose (PG + MinIO + Temporal) | `docker-compose.yml` |
| CI build/test | `.github/workflows/ci.yml` |

---

## Azioni consigliate per completare EPIC 1

1. Completare Publisher: endpoint publish, validazioni, bundle+upload, persistenza `Publication` e scrittura `AuditLog`.
2. Collegare lo Storage bundle al flusso publish (creazione zip + upload).
3. Allineare search all’indice full-text (Postgres) e completare filtri/tag e test.
4. Completare i task rimanenti Registry (filtro `tag` in list/search, immutabilità `published` con test dedicati, environment API se necessaria al publish).
