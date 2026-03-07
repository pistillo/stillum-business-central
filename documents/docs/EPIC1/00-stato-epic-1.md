---
id: epic1-stato
title: Stato EPIC 1 – MVP Backend
sidebar_label: Stato EPIC 1
---

# Stato EPIC 1 – MVP Backend

**Obiettivo dell'EPIC:** Realizzare i servizi backend minimi per gestione artefatti (Registry API), pubblicazione (Publisher) e storage payload/bundle in contesto multi-tenant.

**Contesto:** In questo worktree è già presente una base Quarkus per `registry-api` e `publisher`, oltre a Docker Compose, CI e documentazione di fase (es. `phase1-*`).

**Stato complessivo:** **MVP completato** — la **Registry API** è operativa per CRUD, versioni, dipendenze, search (Postgres FTS + tag), presigned payload/bundle e gestione ambienti; il **Publisher** è operativo per publish (validazioni MVP, bundle immutabile, `Publication` e `AuditLog`). La base DB (Flyway, schema, indici, RLS) è presente e l’enforcement RLS per il `tenantId` è integrato in modo sistematico sia in `registry-api` che in `publisher` (impostazione `app.current_tenant` all’inizio delle transazioni + hardening role opzionale + test DB-level).

---

## Riepilogo per FEATURE

| FEATURE | Stato | Note |
|--------|--------|------|
| **1.1** Registry API | 🟢 Completa (MVP) | CRUD artefatti/versioni, dipendenze (con rilevamento cicli), search (FTS + tag), storage presigned (payload + bundle) e Environment API |
| **1.2** Publisher Service | 🟢 Completa (MVP) | Endpoint publish/get; validazione payload MVP (XML/JSON); check dipendenze `PUBLISHED`; bundle zip immutabile su storage; persistenza `Publication` e `AuditLog` |
| **1.3** Storage (payload + bundle) | 🟢 Completa (MVP) | Presigned URL payload (chiave convenzionale, nessun `payloadRef` in DB); presigned bundle no-overwrite; integrazione bundle nel flusso publish |
| **1.4** Database multi-tenant (RLS) | 🟢 Completa | Migrazioni, indici e RLS; enforcement sistematico (`set_config` per transazione) + hardening `FORCE ROW LEVEL SECURITY`; test che verifica RLS a livello DB |

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
| T-1.1.1.5 | ✅ | `GET /api/tenants/{tenantId}/artifacts/{artifactId}` ritorna dettaglio + elenco versioni |
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
| T-1.1.2.4 | ✅ | `DELETE` bozza implementato; immutabilità `PUBLISHED` coperta da test |
| T-1.1.2.5 | ✅ | Immutabilità `PUBLISHED` enforceata con risposta `409` sui path di update/delete |
| T-1.1.2.6 | ✅ | `ArtifactVersionResourceTest` copre anche i casi `PUBLISHED` (update/delete vietati) |

#### US-1.1.3 – Gestione Dipendenze

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.1.3.1 | ✅ | Tabella `dependency` in migrazione core |
| T-1.1.3.2 | ✅ | `POST /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies` |
| T-1.1.3.3 | ✅ | `GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies` |
| T-1.1.3.4 | ✅ | Risoluzione grafo + cicli in `DependencyService` |
| T-1.1.3.5 | ✅ | Test service + end-to-end su risorsa dependencies (`DependencyServiceTest`, `DependencyResourceTest`) |

#### US-1.1.4 – Ricerca e Discovery

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.1.4.1 | ✅ | Endpoint `/api/tenants/{tenantId}/search/artifacts` usa Postgres FTS (baseline); strategia alternativa (Elastic/OpenSearch/altro) valutabile in futuro |
| T-1.1.4.2 | ✅ | Filtri inclusi `tag` applicato su `tags` e coerente con conteggio/paginazione |
| T-1.1.4.3 | ✅ | Indici GIN tags + FTS in `V3__create_indexes.sql` |
| T-1.1.4.4 | ✅ | Test search end-to-end presenti (`SearchResourceTest`) |

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
| T-1.3.1.4 | ✅ | Nessuna registrazione DB necessaria: chiave oggetto deterministica per convenzione |
| T-1.3.1.5 | 🟡 | Controllo “tenant autenticato” non applicabile senza auth; path include `tenant-{tenantId}` |
| T-1.3.1.6 | ✅ | Test integrazione payload upload/download; in test i bucket sono creati automaticamente (MinIO esterno) |

#### US-1.3.2 – Gestione bundle di pubblicazione

| Task | Stato | Evidenza |
|------|--------|----------|
| T-1.3.2.1–T-1.3.2.4 | ✅ | Bundle implementato nel flusso publish (zip + manifest + upload su S3) e non sovrascrivibile |

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
| Registry API CRUD/versioni/dipendenze/search/storage/environments | `registry-api/src/main/java/com/stillum/registry/resource/` |
| Test Registry API (REST + RLS DB-level) | `registry-api/src/test/java/com/stillum/registry/` |
| Enforcement RLS sistematico (registry-api + publisher) | `*/src/main/java/**/filter/` |
| Storage payload/bundle + test | `registry-api/src/main/java/com/stillum/registry/service/StorageService` e `registry-api/src/test/java/com/stillum/registry/resource/Storage*Test` |
| Publisher publish/get + test (happy path + error path) | `publisher/src/main/java/com/stillum/publisher/resource/PublishResource` e `publisher/src/test/java/com/stillum/publisher/resource/` |
| Docker Compose infra (PG + MinIO + Keycloak + Nexus) | `docker-compose.yml` |
| Docker Compose full-stack overlay (aggiunge i servizi applicativi) | `docker-compose.full.yml` |
| CI build/test | `.github/workflows/ci.yml` |

---

## Azioni consigliate per completare EPIC 1

1. Consolidare le validazioni payload riusando quanto già presente nel progetto Editors (non ancora importato in questo repo) e allineare error reporting.
2. Integrare l’Environment API nel portale e definire strategia di provisioning ambienti (seed vs gestione runtime).
3. Valutare la strategia “full-text” definitiva (Postgres FTS vs Elastic/OpenSearch vs approcci multidimensionali/vettoriali) prima di investire in feature avanzate su Search.
