---
id: piano-di-sviluppo
title: Piano di Sviluppo
sidebar_label: Piano di Sviluppo
---

# Stillum Business Portal – Piano di Sviluppo

Questo piano organizza lo sviluppo della piattaforma Stillum Business Portal secondo la gerarchia **EPIC → FEATURE → USER STORY → TASK**. Ogni EPIC corrisponde a una fase della roadmap.

> Struttura: **EPIC** > **FEATURE** > **USER STORY** > **TASK**
>
> Le User Story seguono il formato: *"Come [ruolo], voglio [azione], in modo da [beneficio]"*

---

## Stato attuale (worktree)

Riferimento sintetico rispetto all’implementazione presente nel repository.

| EPIC | Stato | % | Note | Evidenza |
|------|------|---:|------|----------|
| EPIC 0 | ✅ Completato | 90% | Deliverable documentali + Docker Compose/CI presenti; chart Helm è uno scaffold | [Stato EPIC 0](/docs/EPIC0/epic0-stato) |
| EPIC 1 | 🟡 Quasi completo (MVP) | 90% | Core completo; restano validazioni semantiche e hardening auth tenant | [Stato EPIC 1](/docs/EPIC1/epic1-stato) |
| EPIC 2 | 🟡 Parziale (v0) | 65% | UI v0 operativa con login/tenant/catalogo/dettaglio/editor Monaco, publish con ambienti (useEnvironments) e validazione PROD, i18n (i18next) completato, CI con pnpm; mancano editor BPMN/DMN integrati e wizard publish multi-step | [Stato EPIC 2](/docs/EPIC2/epic2-stato) |
| EPIC 3 | 🔴 Non iniziato | 0% | Workflow approvazione e ciclo di vita avanzato | |
| EPIC 4 | 🟡 In avvio | 10% | Servizio `runtime-gateway` minimale; Temporal disponibile in docker-compose, integrazione applicativa da implementare | |
| EPIC 5 | 🟡 In parte | 15% | Hardening multi-tenant già avviato (RLS); RBAC/ACL e onboarding tenant non implementati | |
| EPIC 6 | 🔴 Non iniziato | 5% | Chart Helm presente come scaffold, mancano Dockerfile e chart applicativi | |
| EPIC 7 | 🔴 Non iniziato | 0% | Export/import Git, webhook e diff versioni | |
| EPIC 8 | 🔴 Non iniziato | 0% | Analytics, SLA e audit consultabile | |
| EPIC 9 | 🔴 Non iniziato | 0% | Marketplace, assistente AI e plugin | |
| EPIC 10 | 🔴 Non iniziato | 0% | Artefatti UI React e Packaging NPM (fuori roadmap originale; dipende da EPIC 2 e EPIC 6) | [Stato EPIC 10](/docs/EPIC10/epic10-stato) |

Nota: nel worktree corrente i servizi Quarkus espongono le API sotto prefisso `/api`. Nei task dove il prefisso non è esplicitato, assumere `/api`.

## EPIC 0 – Setup e Fondamenta

**Obiettivo:** Preparare requisiti, modello dati, stack tecnologico e infrastruttura di sviluppo.

**Stato (worktree):** ✅ Completato (90%) — deliverable documentali e infrastruttura locale/CI presenti; Kubernetes/Helm sono uno scaffold.

### FEATURE 0.1 – Analisi Requisiti e Modellazione del Dominio

**Stato (worktree):** ✅ Completato (95%).

#### US-0.1.1 – Raccolta requisiti funzionali
*Come architetto, voglio documentare i requisiti funzionali con gli stakeholder, in modo da avere una base chiara per la progettazione.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-0.1.1.1 | Intervistare stakeholder su artefatti da gestire (BPMN, DMN, Forms, Request) | Verbale interviste |
| ✅ T-0.1.1.2 | Definire i flussi di pubblicazione e promozione (bozza → revisione → approvazione → pubblicazione) | Diagramma stati |
| ✅ T-0.1.1.3 | Raccogliere esigenze multi-tenant, RBAC, auditing e ambienti (DEV/QA/PROD) | Documento requisiti NFR |
| ✅ T-0.1.1.4 | Redigere e validare il documento dei requisiti finale | `phase0-requirements.md` approvato |

#### US-0.1.2 – Definizione del modello dati
*Come architetto, voglio definire il modello ER della piattaforma, in modo da avere uno schema condiviso per lo sviluppo dei servizi.*

**Stato (worktree):** 🟡 Quasi completo (90%) — `Instance/Task` marcati come “futuro”.

| # | Task | Output |
|---|------|--------|
| 🟡 T-0.1.2.1 | Identificare le entità principali: Tenant, User, Role, Artifact, ArtifactVersion, Environment, Publication, Instance, Task, AuditLog | Lista entità con attributi |
| ✅ T-0.1.2.2 | Definire le relazioni e le cardinalità (1:N, N:M) tra le entità | Diagramma ER (Mermaid) |
| 🟡 T-0.1.2.3 | Definire le enumerazioni: tipo artefatto, stato artefatto, stato istanza, tipo task | Documento enum |
| ✅ T-0.1.2.4 | Documentare il modello con diagramma ER e descrizione campi | `phase0-data-model.md` |

### FEATURE 0.2 – Scelta dello Stack Tecnologico

**Stato (worktree):** ✅ Completato (90%) — alcune scelte sono documentate più che formalizzate in ADR separati.

#### US-0.2.1 – Selezione delle tecnologie backend
*Come tech lead, voglio scegliere linguaggio, framework e infrastruttura backend, in modo da garantire coerenza e sostenibilità nel lungo termine.*

**Stato (worktree):** ✅ Completato (90%).

| # | Task | Output |
|---|------|--------|
| ✅ T-0.2.1.1 | Valutare Golang vs Java/Kotlin per i microservizi; scegliere in base a competenze team | ADR (Architecture Decision Record) |
| ✅ T-0.2.1.2 | Definire strategia API: REST per frontend, gRPC opzionale per comunicazione interna | Linee guida API |
| ✅ T-0.2.1.3 | Selezionare ORM (GORM / JPA-Hibernate) e tool di migrazione DB (Flyway/Liquibase) | ADR |
| ✅ T-0.2.1.4 | Confermare PostgreSQL con RLS, MinIO/S3 per storage, Temporal per orchestrazione | `phase0-tech-stack.md` |

#### US-0.2.2 – Selezione delle tecnologie frontend
*Come tech lead, voglio definire lo stack frontend, in modo da garantire un'esperienza utente moderna e manutenibile.*

**Stato (worktree):** 🟡 Parziale (75%) — editor integrati completi sono fuori scope v0.

| # | Task | Output |
|---|------|--------|
| ✅ T-0.2.2.1 | Confermare React + Next.js (opzionale) + shadcn/ui + Tailwind CSS | ADR |
| ✅ T-0.2.2.2 | Selezionare libreria state management (Redux Toolkit o Zustand) | ADR |
| 🟡 T-0.2.2.3 | Validare integrazione editor bpmn.io, dmn.io, StillumForms | Proof of concept |
| ✅ T-0.2.2.4 | Scegliere i18next per localizzazione e React Query/SWR per data fetching | ADR |

### FEATURE 0.3 – Infrastruttura di Sviluppo

**Stato (worktree):** 🟡 Quasi completo (80%) — compose/CI ok; install su k3s/Helm è documentato.

#### US-0.3.1 – Setup del cluster Kubernetes
*Come DevOps engineer, voglio configurare un cluster k3s con i servizi base, in modo da avere un ambiente di sviluppo operativo.*

**Stato (worktree):** 🟡 Documentato (30%) — ambiente equivalente disponibile via Docker Compose.

| # | Task | Output |
|---|------|--------|
| 🟡 T-0.3.1.1 | Installare k3s su macchina/VM dedicata e verificare il funzionamento | Cluster k3s attivo |
| 🟡 T-0.3.1.2 | Creare il namespace `stillum-dev` | Namespace configurato |
| 🟡 T-0.3.1.3 | Installare PostgreSQL via Helm (bitnami/postgresql) con persistenza | Pod PG attivo, credenziali |
| 🟡 T-0.3.1.4 | Installare MinIO via Helm con endpoint S3-compatibile | Pod MinIO attivo |
| 🟡 T-0.3.1.5 | Installare Temporal Server e UI via Helm con persistence su PostgreSQL | Temporal operativo |
| 🟡 T-0.3.1.6 | Installare Keycloak via Helm per gestione IAM (opzionale) | Keycloak operativo |
| 🟡 T-0.3.1.7 | Verificare connettività tra tutti i servizi nel namespace | Test di connessione superati |

#### US-0.3.2 – Struttura del repository e standard di codice
*Come sviluppatore, voglio un repository ben organizzato con standard di codice definiti, in modo da poter iniziare a lavorare con regole chiare.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-0.3.2.1 | Creare la struttura: `/portal-ui`, `/registry-api`, `/publisher`, `/runtime-gateway`, `/documents`, `/charts`, `/ci` | Repository strutturato |
| ✅ T-0.3.2.2 | Configurare ESLint + Prettier per il frontend | Config files |
| ✅ T-0.3.2.3 | Configurare linter per il backend (Checkstyle per servizi Java) | Config files |
| ✅ T-0.3.2.4 | Aggiungere pre-commit hooks (Husky o equivalente) | `.husky/` configurato |
| ✅ T-0.3.2.5 | Creare `.editorconfig`, `.gitignore`, `README.md` iniziali | File di progetto |

#### US-0.3.3 – Pipeline CI iniziale
*Come sviluppatore, voglio una pipeline CI che esegua lint, build e test ad ogni push, in modo da mantenere la qualità del codice.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-0.3.3.1 | Configurare workflow GitHub Actions per lint su ogni push/PR | `.github/workflows/ci.yml` |
| ✅ T-0.3.3.2 | Aggiungere step di build per i servizi backend | Step build nel workflow |
| ✅ T-0.3.3.3 | Aggiungere step di test unitari con report | Step test nel workflow |
| ✅ T-0.3.3.4 | Eseguire migrazioni DB in ambiente di test (Flyway all’avvio dei test) | Step migrazione |
| ✅ T-0.3.3.5 | Configurare step di build per il frontend (React) | Workflow frontend |

---

## EPIC 1 – MVP Backend

**Obiettivo:** Realizzare i servizi di base per CRUD artefatti, pubblicazione e storage payload.

**Stato (worktree):** 🟡 Quasi completo (90%) — core MVP completo; restano hardening auth tenant e validazioni semantiche.

### FEATURE 1.1 – Registry API

**Stato (worktree):** ✅ Completato (100%).

#### US-1.1.1 – CRUD Artefatti
*Come analista, voglio creare, leggere, aggiornare e ritirare artefatti nel Registry, in modo da gestire i processi e le regole della mia organizzazione.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-1.1.1.1 | Creare lo scaffolding del progetto registry-api (Java/Quarkus, struttura packages, config) | Progetto base |
| ✅ T-1.1.1.2 | Definire e applicare le migrazioni DB per le tabelle `tenant`, `artifact`, `artifact_version`, `environment`, `publication` | File migrazione SQL |
| ✅ T-1.1.1.3 | Implementare `POST /api/tenants/{tenantId}/artifacts` – creazione artefatto con tipo, titolo, descrizione, tag, area | Endpoint funzionante |
| ✅ T-1.1.1.4 | Implementare `GET /api/tenants/{tenantId}/artifacts` – lista artefatti con filtri (tipo, stato, tag, area) e paginazione | Endpoint funzionante |
| ✅ T-1.1.1.5 | Implementare `GET /api/tenants/{tenantId}/artifacts/{artifactId}` – dettaglio artefatto con elenco versioni | Endpoint funzionante |
| ✅ T-1.1.1.6 | Implementare `PUT /api/tenants/{tenantId}/artifacts/{artifactId}` – aggiornamento metadati | Endpoint funzionante |
| ✅ T-1.1.1.7 | Implementare `DELETE /api/tenants/{tenantId}/artifacts/{artifactId}` – soft delete (ritiro) | Endpoint funzionante |
| ✅ T-1.1.1.8 | Implementare filtro automatico per `tenantId` su tutte le query (middleware) | Middleware tenant |
| ✅ T-1.1.1.9 | Scrivere test unitari e di integrazione per tutti gli endpoint | Suite di test |

#### US-1.1.2 – Gestione Versioni
*Come analista, voglio creare e gestire versioni dei miei artefatti, in modo da poter iterare sulle bozze prima di pubblicare.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-1.1.2.1 | Implementare `POST /api/tenants/{tenantId}/artifacts/{artifactId}/versions` – creazione versione in bozza con payloadRef | Endpoint |
| ✅ T-1.1.2.2 | Implementare `GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}` – dettaglio versione | Endpoint |
| ✅ T-1.1.2.3 | Implementare `PUT /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}` – aggiornamento bozza | Endpoint |
| ✅ T-1.1.2.4 | Implementare `DELETE /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}` – cancellazione bozza (vietata per `PUBLISHED`) | Endpoint |
| ✅ T-1.1.2.5 | Implementare immutabilità: impedire modifiche a versioni in stato `PUBLISHED` | Logica di business |
| ✅ T-1.1.2.6 | Scrivere test per creazione, modifica e cancellazione versioni | Suite di test |

#### US-1.1.3 – Gestione Dipendenze
*Come analista, voglio dichiarare le dipendenze tra artefatti, in modo che il sistema possa verificare la coerenza prima della pubblicazione.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-1.1.3.1 | Creare tabella `dependency` (artifact_version_id, depends_on_artifact_id, depends_on_version_id) | Migrazione DB |
| ✅ T-1.1.3.2 | Implementare `POST /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies` | Endpoint |
| ✅ T-1.1.3.3 | Implementare `GET /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies` | Endpoint |
| ✅ T-1.1.3.4 | Implementare logica di risoluzione del grafo delle dipendenze (con rilevamento cicli) | Servizio dipendenze |
| ✅ T-1.1.3.5 | Scrivere test per dipendenze, inclusi casi di cicli e dipendenze mancanti | Suite di test |

#### US-1.1.4 – Ricerca e Discovery
*Come utente del portale, voglio cercare artefatti per testo, tipo, tag e stato, in modo da trovare rapidamente ciò di cui ho bisogno.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-1.1.4.1 | Implementare `GET /api/tenants/{tenantId}/search/artifacts` con ricerca full-text su titolo e descrizione | Endpoint |
| ✅ T-1.1.4.2 | Aggiungere filtri per tipo, tag, area, stato e supporto paginazione | Parametri query |
| ✅ T-1.1.4.3 | Configurare indici PostgreSQL per ottimizzare le ricerche (GIN/GiST per full-text) | Indici DB |
| ✅ T-1.1.4.4 | Scrivere test per i vari scenari di ricerca | Suite di test |

#### US-1.1.5 – Gestione Ambienti
*Come utente del portale, voglio gestire gli ambienti del tenant, in modo da poter pubblicare su target configurabili.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-1.1.5.1 | Implementare `GET /api/tenants/{tenantId}/environments` | Endpoint |
| ✅ T-1.1.5.2 | Implementare `POST /api/tenants/{tenantId}/environments` | Endpoint |
| ✅ T-1.1.5.3 | Implementare `GET /api/tenants/{tenantId}/environments/{environmentId}` | Endpoint |
| ✅ T-1.1.5.4 | Implementare `PUT /api/tenants/{tenantId}/environments/{environmentId}` | Endpoint |
| ✅ T-1.1.5.5 | Implementare `DELETE /api/tenants/{tenantId}/environments/{environmentId}` | Endpoint |

### FEATURE 1.2 – Publisher Service

**Stato (worktree):** 🟡 Quasi completo (90%) — validazioni semantiche/JSON Schema post-MVP non implementate.

#### US-1.2.1 – Validazione e pubblicazione artefatti
*Come process owner, voglio pubblicare una versione di un artefatto su un ambiente, in modo da renderla disponibile per l'esecuzione.*

**Stato (worktree):** 🟡 Parziale (85%) — validazioni “post-MVP” non implementate.

| # | Task | Output |
|---|------|--------|
| ✅ T-1.2.1.1 | Creare lo scaffolding del progetto publisher (Java/Quarkus, struttura packages) | Progetto base |
| ✅ T-1.2.1.2 | Implementare `POST /api/tenants/{tenantId}/publish` – endpoint di pubblicazione (artifactId, versionId, environmentId, notes) | Endpoint |
| ✅ T-1.2.1.3 | Implementare validazione payload (MVP): parsing XML e JSON sintattici | Modulo validazione |
| 🔴 T-1.2.1.4 | Integrare validazioni semantiche BPMN/DMN (post-MVP) | Modulo validazione |
| 🔴 T-1.2.1.5 | Integrare validazione Forms/Request via JSON Schema (post-MVP) | Modulo validazione |
| ✅ T-1.2.1.6 | Implementare risoluzione dipendenze: verifica che tutte le dipendenze siano in stato `PUBLISHED` | Logica dipendenze |
| ✅ T-1.2.1.7 | Implementare creazione bundle (zip con payload + manifest JSON con hash) | Generatore bundle |
| ✅ T-1.2.1.8 | Caricare il bundle su MinIO/S3 nel percorso `tenant-<tenantId>/bundles/<type>/<artifactId>/<versionId>.zip` | Upload storage |
| ✅ T-1.2.1.9 | Creare record `Publication` nel DB con environment, timestamp, autore, note, bundleRef | Persistenza |
| ✅ T-1.2.1.10 | Aggiornare stato `ArtifactVersion` a `PUBLISHED` e rendere immutabile | Aggiornamento stato |
| ✅ T-1.2.1.11 | Implementare `GET /api/tenants/{tenantId}/publish/{publicationId}` – dettaglio pubblicazione | Endpoint |
| ✅ T-1.2.1.12 | Gestire errori di validazione con messaggi chiari nella risposta | Error handling |
| ✅ T-1.2.1.13 | Scrivere test unitari e di integrazione per il flusso completo di pubblicazione | Suite di test |

#### US-1.2.2 – Audit della pubblicazione
*Come admin, voglio che ogni pubblicazione sia tracciata nell'audit log, in modo da garantire conformità e tracciabilità.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-1.2.2.1 | Creare tabella `audit_log` (id, tenant_id, entity_type, entity_id, action, actor_id, timestamp, details) | Migrazione DB |
| ✅ T-1.2.2.2 | Registrare automaticamente ogni pubblicazione (successo o fallimento) nell'audit log | Logica audit |
| ✅ T-1.2.2.3 | Scrivere test per la generazione degli audit record | Suite di test |

### FEATURE 1.3 – Storage dei Payload

**Stato (worktree):** 🟡 Quasi completo (90%) — manca enforcement “tenant autenticato” (auth fuori scope).

#### US-1.3.1 – Upload e download dei payload
*Come analista, voglio caricare e scaricare i file degli artefatti (XML/JSON), in modo da poterli modificare con gli editor integrati.*

**Stato (worktree):** 🟡 Quasi completo (85%) — manca enforcement “tenant autenticato” (auth fuori scope).

| # | Task | Output |
|---|------|--------|
| ✅ T-1.3.1.1 | Configurare il client S3 (compatibile MinIO/AWS) con parametri esternalizzati (endpoint, bucket, credenziali, region) | Modulo S3 client |
| ✅ T-1.3.1.2 | Implementare endpoint per generare URL presignati per upload con path strutturato `tenant-<tenantId>/artifacts/<type>/<artifactId>/<versionId>.<ext>` | Endpoint presigned upload |
| ✅ T-1.3.1.3 | Implementare endpoint per generare URL presignati per download con scadenza breve | Endpoint presigned download |
| ✅ T-1.3.1.4 | Implementare `PUT /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/payload-ref` per aggiornare `payloadRef` nel DB dopo upload completato | Endpoint |
| 🔴 T-1.3.1.5 | Implementare validazione che il `tenantId` nel path corrisponda al tenant autenticato | Controllo sicurezza |
| ✅ T-1.3.1.6 | Scrivere test con MinIO locale per upload/download | Suite di test |

#### US-1.3.2 – Gestione bundle di pubblicazione
*Come publisher service, voglio salvare i bundle immutabili nello storage, in modo da garantire la riproducibilità delle release.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-1.3.2.1 | Implementare upload bundle nel path `tenant-<tenantId>/bundles/<type>/<artifactId>/<versionId>.zip` | Funzione upload bundle |
| ✅ T-1.3.2.2 | Implementare download bundle tramite `bundleRef` | Funzione download bundle |
| ✅ T-1.3.2.3 | Garantire immutabilità: nessun overwrite possibile sui percorsi bundle | Policy immutabilità |
| ✅ T-1.3.2.4 | Scrivere test per upload/download bundle | Suite di test |

### FEATURE 1.4 – Database Multi-tenant

**Stato (worktree):** ✅ Completato (100%).

#### US-1.4.1 – Schema DB e Row-Level Security
*Come DBA, voglio configurare il database multi-tenant con RLS, in modo da garantire l'isolamento dei dati tra tenant fin dalla prima fase.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-1.4.1.1 | Creare tutte le tabelle dello schema (tenant, user, role, artifact, artifact_version, environment, publication, dependency, audit_log) | Script migrazione completo |
| ✅ T-1.4.1.2 | Abilitare Row-Level Security su tutte le tabelle con policy basata su `tenant_id` | Policy RLS |
| ✅ T-1.4.1.3 | Configurare il ruolo applicativo con `SET app.current_tenant` per propagare il tenant nelle query | Configurazione ruolo |
| ✅ T-1.4.1.4 | Creare indici per le chiavi esterne e per i campi di ricerca frequente | Indici DB |
| ✅ T-1.4.1.5 | Scrivere test di isolamento: verificare che un tenant non possa leggere dati di un altro | Test di sicurezza |
| ✅ T-1.4.1.6 | Creare seed data per ambiente di sviluppo (tenant demo, utenti, artefatti) | Script seed |

---

## EPIC 2 – Portal UI (v0)

**Obiettivo:** Realizzare la prima interfaccia web operativa con autenticazione, catalogo, editor e pubblicazione.

**Stato (worktree):** 🟡 Parziale (65%) — login/tenant/catalogo/dettaglio/editor Monaco, publish con selezione ambienti (useEnvironments) e validazione PROD, i18n (i18next + LanguageSwitcher, it/en) completato, CI/build con pnpm; mancano editor BPMN/DMN integrati e wizard publish multi-step.

### FEATURE 2.1 – Autenticazione e Selezione Tenant

**Stato (worktree):** ✅ Completato (100%).

#### US-2.1.1 – Login con provider IAM
*Come utente, voglio effettuare il login tramite Keycloak/OIDC, in modo da accedere al portale in modo sicuro.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-2.1.1.1 | Creare lo scaffolding del progetto portal-ui (React + Vite + shadcn/ui + Tailwind) | Progetto base |
| ✅ T-2.1.1.2 | Registrare il portale come client OIDC in Keycloak | Configurazione Keycloak |
| ✅ T-2.1.1.3 | Implementare la pagina `/login` con redirect a Keycloak | Pagina login |
| ✅ T-2.1.1.4 | Implementare il callback OIDC: decodifica JWT, estrazione ruoli e tenant disponibili | Logica auth |
| ✅ T-2.1.1.5 | Implementare salvataggio token in sessione e header `Authorization: Bearer` su ogni richiesta API | Interceptor HTTP |
| ✅ T-2.1.1.6 | Implementare protezione rotte: redirect a login se non autenticato | Route guard |
| ✅ T-2.1.1.7 | Scrivere test per il flusso di autenticazione | Suite di test |

#### US-2.1.2 – Selezione tenant
*Come utente appartenente a più tenant, voglio scegliere il tenant con cui operare, in modo da visualizzare solo i dati pertinenti.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-2.1.2.1 | Implementare la pagina `/select-tenant` con lista dei tenant dall'JWT | Pagina selezione |
| ✅ T-2.1.2.2 | Creare il Context Provider React con `tenantId`, info utente, ruoli, lingua | TenantContext |
| ✅ T-2.1.2.3 | Tenant unico: selezione automatica e accesso diretto alle rotte protette | Logica tenant unico |
| ✅ T-2.1.2.3b | Tenant multipli: selezione automatica con claim `defaultTenantId` | Default tenant |
| ✅ T-2.1.2.4 | Propagare `tenantId` a tutte le chiamate API tramite context | Integrazione API |
| ✅ T-2.1.2.5 | Preservare deep link post-login (`redirectTo`) attraverso login e selezione tenant | Post-login redirect |

### FEATURE 2.2 – Dashboard

**Stato (worktree):** ✅ Completato (100%) — home v0 con sezioni dati e hook dedicati.

#### US-2.2.1 – Home page del portale
*Come utente, voglio vedere una dashboard con le informazioni principali al login, in modo da avere una panoramica immediata del mio lavoro.*

**Stato (worktree):** ✅ Completato (100%).

| # | Task | Output |
|---|------|--------|
| ✅ T-2.2.1.1 | Implementare la pagina `/home` con layout responsive | Pagina home |
| ✅ T-2.2.1.2 | Sezione "Le mie bozze": lista delle bozze dell'utente corrente | Componente bozze |
| ✅ T-2.2.1.3 | Sezione "Ultime pubblicazioni": lista delle pubblicazioni recenti del tenant | Componente pubblicazioni |
| ✅ T-2.2.1.4 | Link rapidi: "Nuovo Artefatto", "Vai al Catalogo" | Componente quick links |
| ✅ T-2.2.1.5 | Implementare hooks `useMyDrafts`, `useRecentPublications` con React Query | Custom hooks |

### FEATURE 2.3 – Catalogo Artefatti

**Stato (worktree):** 🟡 Quasi completo (85%) — full-text non incluso in v0.

#### US-2.3.1 – Navigazione e ricerca artefatti
*Come utente, voglio navigare il catalogo degli artefatti con filtri e ricerca, in modo da trovare facilmente processi, regole, moduli e request.*

**Stato (worktree):** ✅ Completato (90%).

| # | Task | Output |
|---|------|--------|
| ✅ T-2.3.1.1 | Implementare la pagina `/catalogue` con tabella/lista paginata | Pagina catalogo |
| ✅ T-2.3.1.2 | Implementare filtri per tipo (processo/regola/modulo/request), stato (bozza/pubblicato), area, tag | Componente filtri |
| ✅ T-2.3.1.3 | Posticipare barra di ricerca full-text; usare filtri + paginazione (eventuale `q=` successiva) | Decisione UX |
| ✅ T-2.3.1.4 | Implementare hook `useArtifacts` con parametri di filtro e paginazione | Custom hook |
| ✅ T-2.3.1.5 | Implementare navigazione al dettaglio artefatto al click | Routing |

#### US-2.3.2 – Dettaglio artefatto
*Come utente, voglio visualizzare i dettagli di un artefatto con tutte le sue versioni, in modo da decidere quali azioni intraprendere.*

**Stato (worktree):** 🟡 Quasi completo (80%) — metadati avanzati e hook separati non presenti.

| # | Task | Output |
|---|------|--------|
| ✅ T-2.3.2.1 | Implementare la pagina `/artifact/:id` con metadati e lista versioni | Pagina dettaglio |
| 🟡 T-2.3.2.2 | Mostrare stato, tipo, area, tag, owner, date di creazione/aggiornamento | Componente metadati |
| ✅ T-2.3.2.3 | Lista versioni con badge stato (`DRAFT`/`PUBLISHED`/`RETIRED`) | Componente versioni |
| ✅ T-2.3.2.4 | Pulsante "Modifica bozza" che apre l'editor | Action button |
| ✅ T-2.3.2.5 | Pulsante "Pubblica" per avviare il wizard di pubblicazione | Action button |
| 🟡 T-2.3.2.6 | Implementare hook `useArtifactDetail` e `useArtifactVersions` | Custom hooks |

### FEATURE 2.4 – Editor Integrati

**Stato (worktree):** 🔴 Non iniziato (10%) — presente editor v0 (Monaco), non gli editor integrati richiesti dai task.

#### US-2.4.1 – Editor BPMN
*Come analista, voglio modellare processi BPMN nell'editor integrato, in modo da creare e modificare definizioni di processo senza uscire dal portale.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| 🔴 T-2.4.1.1 | Integrare bpmn-js come componente React nella pagina `/editor/:id/:version` | Componente BpmnEditor |
| 🔴 T-2.4.1.2 | Caricare il payload XML dal `payloadRef` tramite URL presignato | Logica caricamento |
| 🔴 T-2.4.1.3 | Implementare salvataggio manuale: upload file su S3 e aggiornamento versione via API | Logica salvataggio |
| 🔴 T-2.4.1.4 | Implementare auto-save periodico (ogni N secondi) | Timer auto-save |
| 🔴 T-2.4.1.5 | Gestire stato di loading, errori e feedback (toast) | UX feedback |

#### US-2.4.2 – Editor DMN
*Come analista, voglio modellare regole DMN nell'editor integrato, in modo da definire tabelle decisionali in modo visuale.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| 🔴 T-2.4.2.1 | Integrare dmn-js come componente React | Componente DmnEditor |
| 🔴 T-2.4.2.2 | Implementare caricamento e salvataggio come per BPMN | Logica IO |
| 🔴 T-2.4.2.3 | Scrivere test di integrazione per l'editor DMN | Suite di test |

#### US-2.4.3 – Editor StillumForms
*Come analista, voglio disegnare moduli (form) nell'editor integrato, in modo da definire le interfacce di raccolta dati.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| 🔴 T-2.4.3.1 | Sviluppare componente React per l'editor StillumForms (basato su JSON Schema) | Componente FormEditor |
| 🔴 T-2.4.3.2 | Implementare caricamento/salvataggio JSON dal/verso lo storage | Logica IO |
| 🔴 T-2.4.3.3 | Implementare preview del modulo compilabile | Preview component |

#### US-2.4.4 – Editor Request
*Come analista, voglio definire contratti di servizio (request) tramite un editor JSON, in modo da descrivere le API invocabili dai processi.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| 🔴 T-2.4.4.1 | Sviluppare componente editor JSON/Schema per request | Componente RequestEditor |
| 🔴 T-2.4.4.2 | Implementare caricamento/salvataggio JSON | Logica IO |
| 🔴 T-2.4.4.3 | Implementare validazione schema in tempo reale | Validazione live |

#### US-2.4.5 – Creazione nuovo artefatto
*Come analista, voglio creare un nuovo artefatto dal portale, in modo da avviare il processo di modellazione.*

**Stato (worktree):** 🟡 Parziale (70%) — creazione e redirect presenti, UI diversa (pagina vs modale) e hook dedicato non introdotto.

| # | Task | Output |
|---|------|--------|
| 🟡 T-2.4.5.1 | Implementare dialog modale "Nuovo Artefatto" con selezione tipo, titolo, area, tag | Componente modale |
| ✅ T-2.4.5.2 | Al submit, invocare `POST /api/tenants/{tenantId}/artifacts` e creare prima versione in bozza | Logica creazione |
| ✅ T-2.4.5.3 | Redirect automatico all'editor corrispondente (`/editor/<id>/<version>`) | Routing |
| 🟡 T-2.4.5.4 | Implementare hook `useCreateArtifact` | Custom hook |

### FEATURE 2.5 – Pubblicazione Guidata

**Stato (worktree):** 🟡 Parziale (50%) — pagina publish v0 con dropdown ambienti (useEnvironments), auto-selezione DEV, validazione PROD per versioni non approvate; non è wizard multi-step.

#### US-2.5.1 – Wizard di pubblicazione dalla UI
*Come process owner, voglio pubblicare un artefatto tramite un wizard guidato, in modo da visualizzare errori di validazione e selezionare l'ambiente di destinazione.*

**Stato (worktree):** 🟡 Parziale (50%).

| # | Task | Output |
|---|------|--------|
| 🟡 T-2.5.1.1 | Implementare la pagina `/publish/:id/:version` con wizard multi-step | Pagina wizard (attuale: form singola) |
| 🔴 T-2.5.1.2 | Step 1 – Anteprima: mostrare metadati artefatto, versione e dipendenze | Step preview |
| 🔴 T-2.5.1.3 | Step 2 – Validazione: invocare il publisher e mostrare errori di validazione | Step validazione |
| ✅ T-2.5.1.4 | Step 3 – Selezione ambiente: dropdown con ambienti disponibili (da Registry) | Step ambiente (useEnvironments + auto-selezione DEV) |
| 🔴 T-2.5.1.5 | Step 4 – Conferma: riepilogo e pulsante "Pubblica" | Step conferma |
| ✅ T-2.5.1.6 | Mostrare esito (successo con dettagli pubblicazione / fallimento con errori) | Feedback UI |
| 🟡 T-2.5.1.7 | Implementare hook `usePublish` per invocare `POST /api/tenants/{tenantId}/publish` | Chiamata publish via useMutation presente; hook dedicato opzionale |

### FEATURE 2.6 – Infrastruttura UI

**Stato (worktree):** 🟡 Parziale (55%) — layout/router/guard e i18n completati; restano toast, error boundary e audit a11y.

#### US-2.6.1 – Layout, navigazione e localizzazione
*Come utente, voglio un'interfaccia coerente, accessibile e localizzata, in modo da usare il portale in modo efficiente.*

**Stato (worktree):** 🟡 Parziale (55%).

| # | Task | Output |
|---|------|--------|
| 🟡 T-2.6.1.1 | Implementare layout principale con sidebar/header di navigazione | Layout component |
| ✅ T-2.6.1.2 | Configurare routing con protezione rotte autenticate | Router config |
| ✅ T-2.6.1.3 | Configurare i18next con file di traduzione italiano/inglese | Setup i18n (LanguageSwitcher, locales it/en) |
| 🔴 T-2.6.1.4 | Implementare sistema di notifiche (toast/banner) con shadcn/ui | Componente notifiche |
| 🔴 T-2.6.1.5 | Implementare gestione errori globale con error boundary | Error handling |
| 🟡 T-2.6.1.6 | Verificare responsive design su desktop, tablet e mobile | Test responsiveness |
| 🔴 T-2.6.1.7 | Verificare accessibilità (ARIA labels, contrasto, navigazione tastiera) | Audit accessibilità |

---

## EPIC 3 – Pubblicazione e Ciclo di Vita

**Obiettivo:** Implementare il workflow di approvazione e il ciclo di vita completo degli artefatti.

**Stato (worktree):** 🔴 Non iniziato (0%) — stati DB presenti, ma mancano transizioni/permessi/review UI.

**Stato task:** 🔴 per tutti i task di questo EPIC (salvo marcatura esplicita).

### FEATURE 3.1 – Workflow di Approvazione

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-3.1.1 – Transizioni di stato del ciclo di vita
*Come process owner, voglio gestire le transizioni di stato degli artefatti (Bozza → In Revisione → Approvato → Pubblicato → Ritirato), in modo da controllare il processo di rilascio.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-3.1.1.1 | Verificare e utilizzare gli stati `DRAFT/REVIEW/APPROVED/PUBLISHED/RETIRED` su `ArtifactVersion` (già presenti nel modello) | Verifica modello |
| T-3.1.1.2 | Implementare endpoint `POST /versions/{versionId}/transition` per cambiare stato | Endpoint |
| T-3.1.1.3 | Implementare regole di transizione: chi può spostare da quale stato a quale stato (matrice ruolo/stato) | Logica di business |
| T-3.1.1.4 | Impedire modifiche a versioni non in stato `draft` | Vincolo |
| T-3.1.1.5 | Tracciare ogni transizione nell'audit log | Audit |
| T-3.1.1.6 | Scrivere test per tutte le transizioni valide e invalide | Suite di test |

#### US-3.1.2 – Assegnazione revisori e approvazione
*Come process owner, voglio assegnare revisori a una bozza, in modo da ottenere approvazione prima della pubblicazione.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-3.1.2.1 | Creare entità `Review` (id, version_id, reviewer_id, status, comment, created_at) | Migrazione DB |
| T-3.1.2.2 | Implementare endpoint per assegnare revisori a una versione | Endpoint |
| T-3.1.2.3 | Implementare endpoint per approvare/respingere una revisione con commento | Endpoint |
| T-3.1.2.4 | Implementare logica: se tutti i revisori approvano → stato passa a `approved`; se uno respinge → torna a `draft` | Logica approvazione |
| T-3.1.2.5 | Generare task di approvazione per ogni revisore assegnato | Integrazione task |
| T-3.1.2.6 | Aggiornare la UI con sezione revisione nel dettaglio versione | Componenti UI |
| T-3.1.2.7 | Scrivere test per il flusso completo di revisione | Suite di test |

### FEATURE 3.2 – Wizard di Pubblicazione Avanzato

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-3.2.1 – Note di rilascio e selezione ambiente
*Come process owner, voglio inserire note di rilascio e scegliere l'ambiente durante la pubblicazione, in modo da documentare il rilascio e controllare il deployment.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-3.2.1.1 | Aggiungere campo `release_notes` alla form di pubblicazione nel wizard | Campo UI |
| T-3.2.1.2 | Salvare le note nella tabella `publication` | Persistenza |
| T-3.2.1.3 | Verificare che la versione sia in stato `approved` prima di permettere la pubblicazione | Vincolo |
| T-3.2.1.4 | Permettere pubblicazione della stessa versione su ambienti diversi (record separati) | Logica multi-env |
| T-3.2.1.5 | Mostrare storico pubblicazioni per ambiente | Componente storico |

### FEATURE 3.3 – Notifiche di Ciclo di Vita

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-3.3.1 – Notifiche per richieste di revisione e approvazione
*Come revisore, voglio ricevere notifiche quando mi viene assegnata una revisione, in modo da non perdere richieste di approvazione.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-3.3.1.1 | Implementare sistema di notifiche in-app (tabella `notification`) | Modello notifiche |
| T-3.3.1.2 | Generare notifica quando un revisore viene assegnato | Trigger notifica |
| T-3.3.1.3 | Generare notifica quando una revisione viene approvata/respinta | Trigger notifica |
| T-3.3.1.4 | Generare notifica quando un artefatto viene pubblicato | Trigger notifica |
| T-3.3.1.5 | Implementare icona notifiche nel header della UI con badge contatore | Componente UI |
| T-3.3.1.6 | Predisporre integrazione email (opzionale, via SMTP) | Servizio email |

---

## EPIC 4 – Runtime & Orchestrazione

**Obiettivo:** Eseguire processi tramite Temporal, gestire task umani e monitorare le pratiche.

**Stato (worktree):** 🟡 In avvio (10%) — servizio `runtime-gateway` presente (health); Temporal disponibile in docker-compose, integrazione applicativa non presente.

**Stato task:** 🔴 per tutti i task di questo EPIC (salvo marcatura esplicita).

### FEATURE 4.1 – Runtime Gateway

**Stato (worktree):** 🟡 In avvio (10%).

#### US-4.1.1 – Avvio istanze di processo
*Come utente, voglio avviare una nuova pratica a partire da un processo pubblicato, in modo da eseguire il workflow definito.*

**Stato (worktree):** 🟡 In avvio (10%).

| # | Task | Output |
|---|------|--------|
| 🟡 T-4.1.1.1 | Consolidare scaffolding del progetto runtime-gateway (Java/Quarkus) | Progetto base |
| T-4.1.1.2 | Integrare l'SDK Temporal (Go SDK o Java SDK) | Dipendenza SDK |
| T-4.1.1.3 | Implementare `POST /api/tenants/{tenantId}/instances` – avvio workflow con processDefinitionId, versionId, parametri iniziali | Endpoint |
| T-4.1.1.4 | Tradurre processDefinitionId + versionId nel workflowId Temporal corretto | Logica mapping |
| T-4.1.1.5 | Passare `tenantId` come search attribute di Temporal | Configurazione |
| T-4.1.1.6 | Creare record `Instance` nel DB con metadati (tenant, versione, business_key, status) | Persistenza |
| T-4.1.1.7 | Scrivere test per l'avvio di istanze | Suite di test |

#### US-4.1.2 – Interrogazione stato istanze
*Come utente, voglio consultare lo stato delle pratiche in corso, in modo da monitorare l'avanzamento dei workflow.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-4.1.2.1 | Implementare `GET /api/tenants/{tenantId}/instances` – lista istanze con filtri (stato, processo, data, utente) e paginazione | Endpoint |
| T-4.1.2.2 | Implementare `GET /api/tenants/{tenantId}/instances/{instanceId}` – dettaglio istanza con stato, task correnti, timeline eventi | Endpoint |
| T-4.1.2.3 | Recuperare la cronologia eventi da Temporal e trasformarla in formato user-friendly | Logica mapping |
| T-4.1.2.4 | Implementare `GET /api/tenants/{tenantId}/instances/{instanceId}/history` – log eventi | Endpoint |
| T-4.1.2.5 | Scrivere test per interrogazione istanze | Suite di test |

### FEATURE 4.2 – Gestione Task Umani

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-4.2.1 – Assegnazione e completamento task
*Come utente, voglio visualizzare i task assegnati e completarli, in modo da far avanzare i processi.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-4.2.1.1 | Implementare tabella `task` e `task_assignment` con campi: instance_id, name, type, assignee_id, status, due_date | Migrazione DB |
| T-4.2.1.2 | Implementare `GET /tenants/{tenantId}/tasks` – lista task dell'utente con filtri (stato, scadenza, processo) | Endpoint |
| T-4.2.1.3 | Implementare `POST /tenants/{tenantId}/tasks/{taskId}/complete` – completamento task con output dati | Endpoint |
| T-4.2.1.4 | Implementare `POST /tenants/{tenantId}/tasks/{taskId}/reassign` – riassegnazione a un altro utente | Endpoint |
| T-4.2.1.5 | Al completamento, notificare Temporal per proseguire l'esecuzione del workflow | Signal Temporal |
| T-4.2.1.6 | Implementare logica di assegnazione automatica basata su ruoli/code | Logica assegnazione |
| T-4.2.1.7 | Scrivere test per assegnazione, completamento e riassegnazione | Suite di test |

### FEATURE 4.3 – Monitor Pratiche (UI)

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-4.3.1 – Dashboard pratiche
*Come utente, voglio una dashboard delle pratiche in corso, in modo da avere una visione d'insieme dello stato operativo.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-4.3.1.1 | Implementare pagina `/instances` con tabella pratiche filtrabili per stato, processo, data, utente | Pagina pratiche |
| T-4.3.1.2 | Implementare pagina `/instances/:id` con dettaglio pratica: timeline, task, variabili, log | Pagina dettaglio |
| T-4.3.1.3 | Mostrare azioni rapide: riassegnare task, terminare istanza | Action buttons |
| T-4.3.1.4 | Implementare hook `useInstances`, `useInstanceDetail`, `useInstanceHistory` | Custom hooks |

#### US-4.3.2 – My Tasks: lista task personale
*Come utente, voglio una vista "My Tasks" nella dashboard, in modo da vedere rapidamente le attività assegnate a me.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-4.3.2.1 | Aggiungere sezione "My Tasks" nella pagina home | Componente my tasks |
| T-4.3.2.2 | Implementare pagina dedicata `/tasks` con lista filtrata per l'utente corrente | Pagina tasks |
| T-4.3.2.3 | Mostrare scadenze con indicatori visivi (colore per urgenza) | UX scadenze |
| T-4.3.2.4 | Permettere completamento rapido task con form inline | Form completamento |
| T-4.3.2.5 | Implementare hook `useMyTasks` | Custom hook |

### FEATURE 4.4 – Worker Temporal

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-4.4.1 – Worker per l'esecuzione BPMN
*Come piattaforma, devo eseguire i processi BPMN tramite worker Temporal, in modo da orchestrare le attività definite.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-4.4.1.1 | Implementare worker Temporal che legge i bundle pubblicati e li esegue | Worker service |
| T-4.4.1.2 | Implementare mapping BPMN → attività Temporal (service task, user task, gateway, event) | Mapper BPMN |
| T-4.4.1.3 | Implementare gestione delle regole DMN invocate dai processi | Integrazione DMN |
| T-4.4.1.4 | Implementare gestione dei form (StillumForms) per task umani | Integrazione Forms |
| T-4.4.1.5 | Implementare gestione errori, retry e compensazioni | Error handling |
| T-4.4.1.6 | Scrivere test end-to-end per un processo BPMN completo | Suite di test |

---

## EPIC 5 – Multi-tenancy Avanzata & Sicurezza

**Obiettivo:** Rafforzare isolamento dati, implementare RBAC completo e onboarding tenant.

**Stato (worktree):** 🟡 In parte (15%) — RLS e hardening già presenti; RBAC/ACL e onboarding tenant non implementati.

**Stato task:** 🔴 per tutti i task di questo EPIC (salvo marcatura esplicita).

### FEATURE 5.1 – Isolamento dei Dati

**Stato (worktree):** 🟡 In parte (20%) — RLS già presente; audit end-to-end e hardening extra da fare.

#### US-5.1.1 – Verifica e hardening RLS
*Come security engineer, voglio verificare che l'isolamento multi-tenant sia completo e sicuro, in modo da prevenire accessi non autorizzati tra tenant.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-5.1.1.1 | Audit di tutte le tabelle: verificare che RLS sia attiva e corretta su ogni tabella | Report audit |
| T-5.1.1.2 | Verificare che tutti i servizi propaghino `tenantId` correttamente | Checklist servizi |
| T-5.1.1.3 | Creare suite di test end-to-end per l'isolamento (tentare accesso cross-tenant via API) | Test di sicurezza |
| T-5.1.1.4 | Valutare isolamento storage (bucket separati o policy IAM per tenant) | ADR |
| T-5.1.1.5 | Eseguire penetration test mirato su multi-tenancy | Report pentest |

### FEATURE 5.2 – RBAC e ACL

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-5.2.1 – Modello RBAC completo
*Come admin, voglio gestire ruoli e permessi granulari per gli utenti del mio tenant, in modo da controllare chi può fare cosa.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-5.2.1.1 | Definire matrice permessi per ruoli: Analyst, Process Owner, Viewer, Admin, Developer | Documento permessi |
| T-5.2.1.2 | Implementare middleware di autorizzazione che verifica ruolo + azione su ogni endpoint | Middleware RBAC |
| T-5.2.1.3 | Permettere assegnazione di ruoli multipli a un utente | Modello dati |
| T-5.2.1.4 | Implementare ACL opzionali su singoli artefatti e versioni | Tabella ACL + logica |
| T-5.2.1.5 | Scrivere test per ogni combinazione ruolo/azione | Suite di test |

#### US-5.2.2 – Gestione ruoli dalla UI
*Come admin del tenant, voglio gestire utenti e ruoli dal portale, in modo da amministrare il mio team senza intervento tecnico.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-5.2.2.1 | Implementare pagina `/admin/users` con lista utenti del tenant | Pagina utenti |
| T-5.2.2.2 | Implementare form per invitare nuovi utenti (email + ruolo) | Form invito |
| T-5.2.2.3 | Implementare modifica ruoli utente con dropdown multi-selezione | Form ruoli |
| T-5.2.2.4 | Implementare endpoint API per gestione utenti e ruoli | Endpoint CRUD |

### FEATURE 5.3 – Onboarding Tenant

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-5.3.1 – Provisioning di nuovi tenant
*Come operator, voglio creare nuovi tenant con ambienti preconfigurati, in modo da abilitare rapidamente nuove organizzazioni.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-5.3.1.1 | Implementare `POST /tenants` – creazione tenant con nome, dominio, lingua | Endpoint |
| T-5.3.1.2 | Auto-configurazione ambienti standard (DEV, QA, PROD) alla creazione | Logica auto-setup |
| T-5.3.1.3 | Assegnazione del primo admin e invio invito | Logica onboarding |
| T-5.3.1.4 | Implementare UI di onboarding per operator/superadmin | Pagina onboarding |
| T-5.3.1.5 | Implementare limiti per tenant (max artefatti, istanze, storage) in base al piano | Logica limiti |
| T-5.3.1.6 | Scrivere test per il provisioning completo | Suite di test |

---

## EPIC 6 – Packaging & Distribuzione

**Obiettivo:** Dockerizzare i componenti, creare Helm charts e configurare pipeline CI/CD completa.

**Stato (worktree):** 🔴 Non iniziato (5%) — chart `charts/stillum-platform` presente come scaffold; mancano Dockerfile e chart applicativi.

**Stato task:** 🔴 per tutti i task di questo EPIC (salvo marcatura esplicita).

### FEATURE 6.1 – Dockerizzazione

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-6.1.1 – Immagini Docker per ogni componente
*Come DevOps, voglio immagini Docker ottimizzate per ogni servizio, in modo da poterli deployare su Kubernetes.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-6.1.1.1 | Creare Dockerfile multi-stage per Portal UI (build React + serve con Nginx) | `portal-ui/Dockerfile` |
| T-6.1.1.2 | Creare Dockerfile multi-stage per Registry API | `registry-api/Dockerfile` |
| T-6.1.1.3 | Creare Dockerfile multi-stage per Publisher Service | `publisher/Dockerfile` |
| T-6.1.1.4 | Creare Dockerfile multi-stage per Runtime Gateway | `runtime-gateway/Dockerfile` |
| T-6.1.1.5 | Configurare variabili d'ambiente per ogni immagine (DB, S3, Temporal, Keycloak) | Documentazione env vars |
| T-6.1.1.6 | Testare build e run locale di ogni immagine | Verifica funzionamento |

### FEATURE 6.2 – Helm Charts

**Stato (worktree):** 🟡 In avvio (10%) — presente chart umbrella scaffold.

#### US-6.2.1 – Chart Helm modulare
*Come DevOps, voglio chart Helm configurabili per installare la piattaforma su qualsiasi cluster Kubernetes, in modo da semplificare il deployment.*

**Stato (worktree):** 🟡 In avvio (10%).

| # | Task | Output |
|---|------|--------|
| T-6.2.1.1 | Creare chart Helm per Portal UI con valori: image, replicas, ingress, env | `charts/portal-ui/` |
| T-6.2.1.2 | Creare chart Helm per Registry API con valori: image, DB, S3, replicas | `charts/registry-api/` |
| T-6.2.1.3 | Creare chart Helm per Publisher Service | `charts/publisher/` |
| T-6.2.1.4 | Creare chart Helm per Runtime Gateway con config Temporal | `charts/runtime-gateway/` |
| 🟡 T-6.2.1.5 | Creare chart umbrella che include tutti i componenti + dipendenze (PG, MinIO, Temporal, Keycloak) | `charts/stillum-platform/` |
| T-6.2.1.6 | Documentare tutti i valori configurabili con descrizioni | `values.yaml` commentato |
| T-6.2.1.7 | Permettere switch tra componenti interni/esterni (es. DB esterno, S3 AWS) | Valori condizionali |
| T-6.2.1.8 | Testare install/upgrade su cluster k3s | Test deploy |

### FEATURE 6.3 – Pipeline CI/CD Completa

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-6.3.1 – Build, test e release automatizzati
*Come DevOps, voglio una pipeline CI/CD completa che automatizzi build, test e pubblicazione, in modo da garantire rilasci affidabili e frequenti.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-6.3.1.1 | Configurare pipeline per build + lint + test unitari su ogni PR | Workflow CI |
| T-6.3.1.2 | Aggiungere test end-to-end con stack completo (kind/minikube) | Workflow E2E |
| T-6.3.1.3 | Configurare build e push immagini Docker su container registry | Workflow Docker |
| T-6.3.1.4 | Configurare packaging e pubblicazione Helm chart su chart repository | Workflow Helm |
| T-6.3.1.5 | Implementare versioning semantico automatico (vMajor.Minor.Patch) | Strategia release |
| T-6.3.1.6 | Configurare migrazioni DB automatiche in pipeline di staging/prod (Flyway/Liquibase) | Step migrazione |
| T-6.3.1.7 | Documentare il processo di release | Documentazione |

---

## EPIC 7 – Modalità Developer & Integrazione Git

**Obiettivo:** Fornire strumenti per sviluppatori: export/import Git, webhook CI/CD e diff versioni.

**Stato (worktree):** 🟡 In corso (10%).
**Stato task:** 🟢 US-10.1.1 e US-10.1.2 completate, restanti 🔴.

### FEATURE 7.1 – Export / Import

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-7.1.1 – Esportazione artefatti su Git
*Come sviluppatore, voglio esportare versioni pubblicate come bundle, in modo da commitarle su un repository Git per audit o backup.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-7.1.1.1 | Implementare `GET /tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/export` – download bundle zip | Endpoint |
| T-7.1.1.2 | Includere nel bundle: payload, manifest, metadati e dipendenze | Formato export |
| T-7.1.1.3 | Implementare pulsante "Esporta" nella pagina dettaglio artefatto | Componente UI |
| T-7.1.1.4 | Sviluppare CLI per esportare in batch | CLI export |

#### US-7.1.2 – Importazione artefatti da Git/file
*Come sviluppatore, voglio importare definizioni da un repository Git o da file zip, in modo da portare nel Registry artefatti creati offline.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-7.1.2.1 | Implementare `POST /tenants/{tenantId}/import` – upload zip con manifest | Endpoint |
| T-7.1.2.2 | Parsing del manifest per creare artefatti e versioni (bozza o pubblicata) | Logica import |
| T-7.1.2.3 | Implementare import da repository Git (branch/tag) con autenticazione | Connettore Git |
| T-7.1.2.4 | Implementare pagina UI `/import` per upload file zip | Pagina UI |
| T-7.1.2.5 | Sviluppare CLI per importare da Git o file | CLI import |
| T-7.1.2.6 | Scrivere test per import con casi: conflitti, dipendenze mancanti | Suite di test |

### FEATURE 7.2 – Webhook e CI/CD

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-7.2.1 – Webhook per pubblicazione automatica
*Come DevOps, voglio configurare webhook che avviano pubblicazioni automatiche su push/tag Git, in modo da integrare il Registry con le pipeline esistenti.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-7.2.1.1 | Implementare endpoint di ricezione webhook (GitHub/GitLab compatible) | Endpoint webhook |
| T-7.2.1.2 | Configurare mapping: branch/tag → azione (import + publish su ambiente) | Configurazione regole |
| T-7.2.1.3 | Implementare UI per gestire i webhook configurati | Pagina gestione webhook |
| T-7.2.1.4 | Scrivere test per il flusso webhook → import → publish | Suite di test |

### FEATURE 7.3 – Confronto Versioni

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-7.3.1 – Diff visuale tra versioni
*Come analista, voglio confrontare due versioni di un artefatto, in modo da capire cosa è cambiato tra una versione e l'altra.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-7.3.1.1 | Implementare diff per file BPMN XML (differenze strutturali) | Modulo diff BPMN |
| T-7.3.1.2 | Implementare diff per file DMN XML | Modulo diff DMN |
| T-7.3.1.3 | Implementare diff per file JSON (Forms, Request) | Modulo diff JSON |
| T-7.3.1.4 | Implementare pagina UI `/diff/:id/:v1/:v2` con visualizzazione side-by-side | Pagina diff |
| T-7.3.1.5 | Implementare rilevamento conflitti su import (stessa versione, contenuti diversi) | Logica conflitti |
| T-7.3.1.6 | Mantenere riferimento commit SHA per versioni importate da Git | Campo metadata |

---

## EPIC 8 – Analytics & Reporting

**Obiettivo:** Fornire KPI, dashboard di monitoraggio, alerting su SLA e audit log consultabile.

**Stato (worktree):** 🔴 Non iniziato (0%).

**Stato task:** 🔴 per tutti i task di questo EPIC (salvo marcatura esplicita).

### FEATURE 8.1 – KPI e Dashboard

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-8.1.1 – Dashboard analytics per processi
*Come process owner, voglio visualizzare KPI dei miei processi (throughput, tempi, errori), in modo da monitorare le performance e intervenire su problemi.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-8.1.1.1 | Implementare servizio di aggregazione dati: raccolta metriche da istanze e task | Servizio analytics |
| T-8.1.1.2 | Calcolare KPI: throughput (processi completati/tempo), tempo medio esecuzione, tempo medio task umano | Logica KPI |
| T-8.1.1.3 | Calcolare tassi di errore e cancellazione per processo e ambiente | Logica KPI |
| T-8.1.1.4 | Implementare API per recuperare KPI con filtri (processo, ambiente, periodo) | Endpoint analytics |
| T-8.1.1.5 | Implementare pagina UI `/analytics` con grafici interattivi (chart.js o recharts) | Pagina analytics |
| T-8.1.1.6 | Implementare filtri per tenant, processo, ambiente e periodo temporale | Componente filtri |
| T-8.1.1.7 | Implementare export dati in CSV/PDF | Funzione export |

### FEATURE 8.2 – Alerting e SLA

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-8.2.1 – Regole SLA e notifiche proattive
*Come process owner, voglio definire SLA sui processi e ricevere alert al superamento delle soglie, in modo da reagire tempestivamente ai ritardi.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-8.2.1.1 | Creare modello dati per definizioni SLA (processo, soglia tempo, canale notifica) | Migrazione DB |
| T-8.2.1.2 | Implementare UI per configurare regole SLA per processo/task | Pagina SLA config |
| T-8.2.1.3 | Implementare servizio di monitoraggio che controlla le istanze in tempo reale | Servizio monitor |
| T-8.2.1.4 | Implementare integrazione canali notifica: email (SMTP), Slack, Teams, webhook | Connettori notifica |
| T-8.2.1.5 | Scrivere test per trigger SLA e invio notifiche | Suite di test |

### FEATURE 8.3 – Audit Log Consultabile

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-8.3.1 – Interfaccia di audit
*Come admin, voglio consultare il log di audit con filtri avanzati, in modo da verificare la conformità e indagare su eventi specifici.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-8.3.1.1 | Implementare API `GET /tenants/{tenantId}/audit` con filtri: utente, data, operazione, entità | Endpoint audit |
| T-8.3.1.2 | Implementare pagina UI `/audit` con tabella paginata e filtri | Pagina audit |
| T-8.3.1.3 | Garantire che tutte le operazioni CRUD e transizioni di stato siano loggate | Verifica copertura |
| T-8.3.1.4 | Implementare export audit log in CSV per compliance | Funzione export |

---

## EPIC 9 – Funzionalità Avanzate e Marketplace

**Obiettivo:** Trasformare la piattaforma in un ecosistema con template, assistente AI e plugin.

**Stato (worktree):** 🔴 Non iniziato (0%).

**Stato task:** 🔴 per tutti i task di questo EPIC (salvo marcatura esplicita).

### FEATURE 9.1 – Marketplace di Template

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-9.1.1 – Catalogo template condivisi
*Come utente, voglio cercare e importare template di processi, regole e moduli dal marketplace, in modo da riutilizzare soluzioni già pronte.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-9.1.1.1 | Creare modello dati per template: categoria, provider, licenza, livello maturità, versioning | Migrazione DB |
| T-9.1.1.2 | Implementare API per browse e ricerca nel marketplace | Endpoint marketplace |
| T-9.1.1.3 | Implementare pagina UI `/marketplace` con catalogo navigabile | Pagina marketplace |
| T-9.1.1.4 | Implementare funzione "Installa nel mio tenant" (import automatico nel Registry) | Logica installazione |
| T-9.1.1.5 | Implementare notifiche di aggiornamento quando il provider rilascia nuove versioni | Sistema aggiornamenti |

#### US-9.1.2 – Pubblicazione template da partner
*Come partner, voglio pubblicare i miei template nel marketplace, in modo da renderli disponibili alla community.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-9.1.2.1 | Implementare API per la submission di template con processo di revisione | Endpoint submit |
| T-9.1.2.2 | Implementare workflow di revisione e approvazione template | Logica review |
| T-9.1.2.3 | Implementare gestione diritti d'autore e licenze | Modello licenze |
| T-9.1.2.4 | Implementare UI per i publisher partner per gestire i propri template | Pagina partner |

### FEATURE 9.2 – Assistente AI

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-9.2.1 – Generazione assistita di processi e regole
*Come analista, voglio che un assistente AI mi suggerisca bozze di processi e regole a partire da descrizioni testuali, in modo da accelerare la modellazione.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-9.2.1.1 | Progettare l'integrazione con modelli LLM per generazione BPMN/DMN | Architettura AI |
| T-9.2.1.2 | Implementare endpoint `POST /ai/generate` che accetta una descrizione e restituisce un BPMN/DMN draft | Endpoint AI |
| T-9.2.1.3 | Integrare l'assistente nell'editor: pulsante "Genera con AI" | Componente UI |
| T-9.2.1.4 | Implementare suggerimenti basati su best practice e template predefiniti | Logica suggerimenti |

#### US-9.2.2 – Analisi e ottimizzazione processi
*Come process owner, voglio che l'AI analizzi i miei processi e suggerisca ottimizzazioni, in modo da migliorare performance e ridurre errori.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-9.2.2.1 | Implementare analisi automatizzata dei processi basata su dati storici (tempi, errori, colli di bottiglia) | Servizio analisi |
| T-9.2.2.2 | Generare report di ottimizzazione con suggerimenti concreti | Report AI |
| T-9.2.2.3 | Implementare UI per visualizzare i suggerimenti con link alle aree del processo | Componente UI |

### FEATURE 9.3 – Sistema di Plugin

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-9.3.1 – SDK e gestione plugin
*Come sviluppatore terzo, voglio un SDK per creare plugin che estendano la piattaforma, in modo da integrare sistemi esterni e personalizzare il portale.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-9.3.1.1 | Progettare e documentare l'SDK per plugin (API, hook points, permessi, sandboxing) | Documentazione SDK |
| T-9.3.1.2 | Implementare runtime di esecuzione plugin (container o WebAssembly) | Plugin runtime |
| T-9.3.1.3 | Implementare API per installare, aggiornare e rimuovere plugin | Endpoint CRUD plugin |
| T-9.3.1.4 | Implementare UI `/admin/plugins` per gestione plugin installati | Pagina admin plugin |
| T-9.3.1.5 | Implementare modello di permessi per plugin (scope di accesso) | Modello sicurezza |
| T-9.3.1.6 | Creare 2-3 plugin esempio (es. connettore CRM, report personalizzato) | Plugin di esempio |
| T-9.3.1.7 | Scrivere test di sicurezza per il sandboxing | Suite di test |

---

## EPIC 10 – Artefatti UI React e Packaging NPM

**Obiettivo:** Introdurre i tipi di artefatti `MODULE` e `COMPONENT` per definire pools, droplets e triggers tramite codice React, con editor dedicato, risoluzione dipendenze npm e generazione di pacchetti npm riutilizzabili dal runtime.

**Stato (worktree):** 🟡 In corso (10%).

**Stato task:** 🟢 US-10.1.1 e US-10.1.2 completate, restanti 🔴.

**Dipendenze:** EPIC 2 (Portal UI) e EPIC 6 (Packaging & Distribuzione).
> **Nota:** questa EPIC è fuori dalla roadmap originale (Fasi 0–9). I Form StillumForms basati su JSON Schema restano artefatti FORM. I nuovi artefatti MODULE e COMPONENT sono destinati alla definizione di pools/droplets/triggers con codice React effettivo.

### FEATURE 10.1 – Backend: Enum, DB e API per MODULE/COMPONENT

**Stato (worktree):** 🟢 Completato (100%) — Enum, migrazioni DB, entity, DTOs e API CRUD implementati.

#### US-10.1.1 – Estensione modello dati per artefatti React
*Come architetto, voglio estendere il modello dati con campi per codice sorgente React e dipendenze npm, in modo da supportare i nuovi tipi di artefatti MODULE e COMPONENT.*

**Stato (worktree):** 🟢 Completato (100%).

| # | Task | Output |
|---|------|--------|
| 🟢 T-10.1.1.1 | Aggiungere valori MODULE e COMPONENT all'enum ArtifactType (già presenti) | Enum `ArtifactType.java` |
| 🟢 T-10.1.1.2 | Creare migrazione DB: aggiungere campi `source_code` (TEXT), `npm_dependencies` (JSONB), `npm_package_ref` (VARCHAR) alla tabella `artifact_version` | Migrazione V10 creata |
| 🟢 T-10.1.1.3 | Aggiornare entity JPA `ArtifactVersion` con i nuovi campi e annotazioni | Entity aggiornata |
| 🟢 T-10.1.1.4 | Aggiornare DTOs per supportare i nuovi campi | DTOs aggiornati |
| 🟢 T-10.1.1.5 | Scrivere test per i nuovi campi e la persistenza | Suite di test passanti |

#### US-10.1.2 – API CRUD per artefatti MODULE e COMPONENT
*Come sviluppatore, voglio API CRUD per creare e gestire artefatti MODULE e COMPONENT, in modo da utilizzarli nella UI.*

**Stato (worktree):** 🟢 Completato (100%).

| # | Task | Output |
|---|------|--------|
| 🟢 T-10.1.2.1 | Implementare `POST /api/tenants/{tenantId}/artifacts/modules` per creare MODULE | Endpoint implementato |
| 🟢 T-10.1.2.2 | Implementare `POST /api/tenants/{tenantId}/artifacts/components` per creare COMPONENT con dipendenza MODULE padre | Endpoint implementato |
| 🟢 T-10.1.2.3 | Implementare `GET /api/tenants/{tenantId}/artifacts/{artifactId}/components` – lista componenti di un MODULE | Endpoint disponibile via ArtifactDetailResponse |
| 🟢 T-10.1.2.4 | Implementare validazione: un COMPONENT deve avere dipendenza verso un MODULE esistente | Logica di business implementata |
| 🟢 T-10.1.2.5 | Aggiornare endpoint di ricerca per supportare filtri su MODULE e COMPONENT | Endpoint supporta filtri tipo |
| 🟢 T-10.1.2.6 | Scrivere test unitari e di integrazione per le API MODULE/COMPONENT | Suite di test passanti (13 test) |

### FEATURE 10.2 – Editor React (Monaco + TypeScript)

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-10.2.1 – Editor di codice React con supporto TypeScript
*Come sviluppatore, voglio un editor di codice React con IntelliSense e supporto TypeScript, in modo da scrivere pools, droplets e triggers con produttività.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-10.2.1.1 | Configurare Monaco Editor per linguaggio TypeScript/TSX con IntelliSense e type definitions React | Editor React |
| T-10.2.1.2 | Implementare load/save del codice sorgente React da/verso Registry API (campo `source_code`) | Integrazione API |
| T-10.2.1.3 | Implementare pannello laterale per gestire dipendenze npm: ricerca, aggiunta, rimozione | Componente npm deps |
| T-10.2.1.4 | Integrare validazione TypeScript in-editor con segnalazione errori in tempo reale | Diagnostica TS |
| T-10.2.1.5 | Implementare anteprima live del componente React (opzionale, sandbox iframe) | Preview component |

#### US-10.2.2 – Wizard di creazione pool/droplet/trigger
*Come analista, voglio un wizard guidato per creare nuovi pool, droplet e trigger con template iniziali, in modo da iniziare rapidamente.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-10.2.2.1 | Progettare template di codice React per pool, droplet e trigger | Template di codice |
| T-10.2.2.2 | Implementare wizard step-by-step: selezione tipo (pool/droplet/trigger) → nome → modulo padre → dipendenze npm → template | Wizard UI |
| T-10.2.2.3 | Implementare collegamento automatico COMPONENT→MODULE padre via dependency API | Logica di business |
| T-10.2.2.4 | Aggiornare NewArtifactPage con opzioni MODULE e COMPONENT nel selettore tipo | Pagina aggiornata |

#### US-10.2.3 – Aggiornamento catalogo per MODULE/COMPONENT
*Come utente del portale, voglio visualizzare moduli e componenti nel catalogo con vista aggregata, in modo da navigare facilmente la struttura pools/droplets/triggers.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-10.2.3.1 | Aggiornare CataloguePage con filtri per tipo MODULE e COMPONENT | Pagina aggiornata |
| T-10.2.3.2 | Implementare vista aggregata MODULE: mostrare modulo padre con elenco componenti figli | Componente UI |
| T-10.2.3.3 | Implementare pagina dettaglio MODULE con tab "Componenti" che lista pool/droplet/trigger collegati | Pagina dettaglio |
| T-10.2.3.4 | Aggiornare pagina dettaglio COMPONENT con link al MODULE padre | Pagina dettaglio |

### FEATURE 10.3 – Build e Packaging NPM

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-10.3.1 – NPM Build Service
*Come piattaforma, voglio compilare il codice React degli artefatti MODULE/COMPONENT e generare pacchetti npm, in modo da distribuirli come plugin riutilizzabili.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-10.3.1.1 | Progettare architettura NPM Build Service: API REST, container sandbox, input/output | Documento architettura |
| T-10.3.1.2 | Creare scaffolding progetto `npm-build-service` (Node.js) | Progetto base |
| T-10.3.1.3 | Implementare endpoint `POST /build` che riceve source_code e npm_dependencies | Endpoint build |
| T-10.3.1.4 | Implementare risoluzione e installazione dipendenze npm in directory sandbox isolata | Logica installazione |
| T-10.3.1.5 | Implementare compilazione codice React/TypeScript con Vite o Rollup → bundle JS | Logica bundling |
| T-10.3.1.6 | Implementare generazione manifest npm (`package.json`) con metadati dell'artefatto | Generatore manifest |
| T-10.3.1.7 | Implementare `npm audit` sulle dipendenze prima della build (sicurezza) | Verifica sicurezza |
| T-10.3.1.8 | Scrivere test per il flusso completo di build | Suite di test |

#### US-10.3.2 – Registry npm interno e integrazione Publisher
*Come piattaforma, voglio pubblicare i pacchetti npm generati su un registry interno e integrare il flusso nel Publisher, in modo da automatizzare la distribuzione.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-10.3.2.1 | Configurare Verdaccio (o equivalente) come registry npm interno | Docker Compose / Helm |
| T-10.3.2.2 | Implementare autenticazione per tenant sul registry npm | Configurazione auth |
| T-10.3.2.3 | Implementare pubblicazione automatica del pacchetto npm su Verdaccio dopo build | Logica publish |
| T-10.3.2.4 | Integrare il NPM Build Service nel flusso del Publisher: trigger build per artefatti MODULE/COMPONENT | Integrazione Publisher |
| T-10.3.2.5 | Aggiornare il Publisher per salvare `npm_package_ref` nella versione dopo la build | Logica Publisher |
| T-10.3.2.6 | Includere riferimento al pacchetto npm nel bundle di pubblicazione | Bundle aggiornato |
| T-10.3.2.7 | Scrivere test per il flusso Publisher→Build→Publish npm | Suite di test |

### FEATURE 10.4 – Runtime: Caricamento Plugin UI

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-10.4.1 – Plugin loader per pacchetti npm
*Come utente del portale, voglio che i pool, droplet e trigger definiti come MODULE/COMPONENT vengano caricati automaticamente dal runtime, in modo da utilizzarli nelle interfacce.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-10.4.1.1 | Progettare architettura plugin loader: module federation vs dynamic import vs script injection | ADR (Architecture Decision Record) |
| T-10.4.1.2 | Definire interfaccia/contratto TypeScript per plugin UI: `PoolPlugin`, `DropletPlugin`, `TriggerPlugin` | Interfaccia TypeScript |
| T-10.4.1.3 | Implementare caricamento dinamico dei pacchetti npm dal registry interno | Plugin loader |
| T-10.4.1.4 | Implementare sandboxing e isolamento dei plugin (iframe sandbox o shadow DOM) | Logica isolamento |
| T-10.4.1.5 | Implementare caching locale dei pacchetti caricati | Logica cache |
| T-10.4.1.6 | Integrare il plugin loader nella Portal UI e/o nel Runtime Gateway | Integrazione runtime |
| T-10.4.1.7 | Scrivere test per caricamento, isolamento e rendering dei plugin | Suite di test |

### FEATURE 10.5 – Documentazione e Test

**Stato (worktree):** 🔴 Non iniziato (0%).

#### US-10.5.1 – Documentazione e test end-to-end
*Come sviluppatore, voglio documentazione completa e test end-to-end per il flusso MODULE/COMPONENT, in modo da poter contribuire e verificare il funzionamento.*

**Stato (worktree):** 🔴 Non iniziato (0%).

| # | Task | Output |
|---|------|--------|
| T-10.5.1.1 | Aggiornare documentazione architetturale con NPM Build Service, plugin loader e registry npm | Documentazione |
| T-10.5.1.2 | Scrivere guida sviluppatore: come creare un modulo/componente React step-by-step | Guida |
| T-10.5.1.3 | Aggiornare diagrammi ER, architetturali e roadmap con i nuovi componenti | Diagrammi aggiornati |
| T-10.5.1.4 | Scrivere test end-to-end per il flusso completo: creazione → edit → build → publish → runtime load | Suite test e2e |
| T-10.5.1.5 | Documentare come importare e usare le librerie npm generate in progetti esterni | Guida uso librerie |
| T-10.5.1.6 | Aggiornare esempi e template nel repository con campioni MODULE/COMPONENT | Esempi |

---

## Riepilogo Epics e Priorità

| EPIC | Nome | Feature | User Story | Task | Priorità |
|------|------|---------|------------|------|----------|
| 0 | Setup e Fondamenta | 3 | 6 | 26 | Critica |
| 1 | MVP Backend | 4 | 8 | 36 | Critica |
| 2 | Portal UI (v0) | 6 | 10 | 38 | Alta |
| 3 | Pubblicazione e Ciclo di Vita | 3 | 4 | 17 | Alta |
| 4 | Runtime & Orchestrazione | 4 | 6 | 28 | Alta |
| 5 | Multi-tenancy & Sicurezza | 3 | 4 | 16 | Alta |
| 6 | Packaging & Distribuzione | 3 | 3 | 21 | Media |
| 7 | Developer Mode & Git | 3 | 4 | 16 | Media |
| 8 | Analytics & Reporting | 3 | 3 | 16 | Media |
| 9 | Funzionalità Avanzate | 3 | 5 | 18 | Bassa |
| 10 | Artefatti UI React e Packaging NPM | 5 | 7 | 38 | Media |
| **TOTALE** | | **40** | **60** | **270** | |

---

## Dipendenze tra EPIC

```
EPIC 0 ──→ EPIC 1 ──→ EPIC 2 ──→ EPIC 3
                │            │         │
                │            │         ▼
                │            │    EPIC 4
                │            │         │
                │            │    EPIC 5 ◄────────┐
                │            │         │          │
                │            │         ▼          │
                │            └──→ EPIC 6 ──→ EPIC 7
                │                  │  │          │
                │                  │  │    EPIC 8 ◄─┘
                │                  │  │         │
                │                  │  │         ▼
                │                  │  │    EPIC 9
                │                  │  │
                └──────────────────┘  │
                                      │
                  EPIC 2 ─────────────┤
                                      ▼
                                 EPIC 10
                              (React UI & NPM)
```

- **EPIC 0** è prerequisito per tutti
- **EPIC 1** (backend) è prerequisito per EPIC 2 (UI) e EPIC 4 (runtime)
- **EPIC 2** (UI) è prerequisito per EPIC 3 (lifecycle) e **EPIC 10** (React UI & NPM)
- **EPIC 3** e **EPIC 4** possono procedere in parallelo dopo EPIC 2
- **EPIC 5** (sicurezza) richiede EPIC 4 completata
- **EPIC 6** (packaging) può iniziare dopo EPIC 5; è prerequisito anche per **EPIC 10**
- **EPIC 7** (developer) richiede EPIC 6
- **EPIC 8** (analytics) richiede EPIC 4
- **EPIC 9** (marketplace/AI/plugin) è l'ultima fase della roadmap originale
- **EPIC 10** (artefatti UI React e packaging NPM) richiede EPIC 2 (UI) e EPIC 6 (packaging); è fuori dalla roadmap originale e può procedere in parallelo con EPIC 7–9

---

## Note

- Le fasi possono sovrapporsi parzialmente in base alla disponibilità del team.
- Ogni User Story dovrebbe essere stimata in Story Points dal team di sviluppo.
- Si consiglia di adottare Sprint di 2 settimane con review e retrospettiva.
- Le priorità all'interno di ogni EPIC possono essere riordinate in base al feedback utente.
