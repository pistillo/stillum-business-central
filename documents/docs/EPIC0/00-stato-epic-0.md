---
id: epic0-stato
title: Stato EPIC 0 – Setup e Fondamenta
sidebar_label: Stato EPIC 0
---

# Stato EPIC 0 – Setup e Fondamenta

**Obiettivo dell'EPIC:** Preparare requisiti, modello dati, stack tecnologico e infrastruttura di sviluppo.

**Stato complessivo:** **Completato (con lievi eccezioni)** — Le fondamenta documentali e tecniche sono pronte; l'ambiente di sviluppo è disponibile via Docker Compose e Helm; la CI copre build e test. Restano opzionali: pre-commit hooks (Husky), step migrazioni DB in CI, Keycloak e cluster k3s dedicato.

---

## Riepilogo per FEATURE

| FEATURE | Stato | Note |
|--------|--------|------|
| **0.1** Analisi Requisiti e Modellazione del Dominio | ✅ Completato | Requisiti e modello dati documentati e allineati al codebase |
| **0.2** Scelta dello Stack Tecnologico | ✅ Completato | Stack documentato; backend Java/Spring, frontend React, DB PostgreSQL, MinIO, Temporal |
| **0.3** Infrastruttura di Sviluppo | 🟡 Parziale | Struttura repo, Docker Compose, Helm, CI presenti; mancano Husky, step migrazioni in CI, cartella `/ci`; k3s/Keycloak opzionali |

---

## Dettaglio per FEATURE e Task

### FEATURE 0.1 – Analisi Requisiti e Modellazione del Dominio

| Task | Stato | Evidenza nel codebase / docs |
|------|--------|------------------------------|
| T-0.1.1.1 | ✅ | Requisiti su BPMN, DMN, Forms, Request in [Requisiti Fase 0](./02-requisiti.md) |
| T-0.1.1.2 | ✅ | Ciclo di vita (bozza → revisione → approvazione → pubblicazione) in requisiti e modello dati |
| T-0.1.1.3 | ✅ | Multi-tenant, RBAC, auditing, ambienti DEV/QA/PROD in requisiti |
| T-0.1.1.4 | ✅ | Documento requisiti → [Requisiti](epic0-requisiti) |
| T-0.1.2.1 | ✅ | Entità in [Modello dati](epic0-modello-dati) e in `registry-api` (entity JPA) |
| T-0.1.2.2 | ✅ | Diagramma ER e relazioni in [Modello dati](epic0-modello-dati) |
| T-0.1.2.3 | ✅ | Enum tipo artefatto, stato artefatto, stato istanza, tipo task in modello e package `entity/enums` |
| T-0.1.2.4 | ✅ | Documento modello dati → [Modello dati](epic0-modello-dati) |

---

### FEATURE 0.2 – Scelta dello Stack Tecnologico

| Task | Stato | Evidenza nel codebase / docs |
|------|--------|------------------------------|
| T-0.2.1.1 | ✅ | Backend in **Java** (Spring Boot): `registry-api`, `publisher`, `runtime-gateway` (Maven) |
| T-0.2.1.2 | ✅ | API REST per frontend; linee guida in [Stack tecnologico](./04-stack-tecnologico.md) |
| T-0.2.1.3 | ✅ | JPA/Hibernate + Flyway in `registry-api` (`db/migration/`) |
| T-0.2.1.4 | ✅ | PostgreSQL, MinIO/S3, Temporal in [Stack tecnologico](epic0-stack-tecnologico) e in repo |
| T-0.2.2.1 | ✅ | React + shadcn/ui + Tailwind in `portal-ui` |
| T-0.2.2.2 | ✅ | Scelta in [Stack tecnologico](epic0-stack-tecnologico); stato con hook/context in portal-ui |
| T-0.2.2.3 | 🟡 | Editor bpmn.io/dmn.io/StillumForms: da validare in fase implementativa |
| T-0.2.2.4 | ✅ | i18n e data fetching (fetch/API) in portal-ui |

---

### FEATURE 0.3 – Infrastruttura di Sviluppo

#### US-0.3.1 – Setup del cluster Kubernetes

| Task | Stato | Evidenza nel codebase / docs |
|------|--------|------------------------------|
| T-0.3.1.1 | 🟡 | k3s non presente in repo; **Docker Compose** fornito per dev locale (PostgreSQL, MinIO, Temporal) |
| T-0.3.1.2 | 🟡 | Namespace configurabile nei chart Helm (`stillum-platform`, `values-dev.yaml`) |
| T-0.3.1.3 | ✅ | PostgreSQL in `docker-compose.yml` e in chart (bitnami/postgresql) |
| T-0.3.1.4 | ✅ | MinIO in `docker-compose.yml` e bucket init (`stillum-bundles`, `stillum-artifacts`) |
| T-0.3.1.5 | ✅ | Temporal in `docker-compose.yml` con persistence PostgreSQL |
| T-0.3.1.6 | ⚪ | Keycloak opzionale; non in docker-compose |
| T-0.3.1.7 | ✅ | Servizi collegati in stessa rete e healthcheck in docker-compose |

#### US-0.3.2 – Struttura del repository e standard di codice

| Task | Stato | Evidenza nel codebase / docs |
|------|--------|------------------------------|
| T-0.3.2.1 | 🟡 | Presenti: `/portal-ui`, `/registry-api`, `/publisher`, `/runtime-gateway`, `/docs`, `/charts`. Manca cartella `/ci` (CI in `.github/workflows/`) |
| T-0.3.2.2 | ✅ | ESLint (`.eslintrc.cjs`) e Prettier (`.prettierrc`) in `portal-ui` |
| T-0.3.2.3 | 🟡 | Backend Java: stile da `.editorconfig`; nessun linter esplicito (es. Checkstyle) in CI |
| T-0.3.2.4 | ❌ | Pre-commit hooks (Husky): **non presenti** |
| T-0.3.2.5 | ✅ | `.editorconfig`, `.gitignore`, `README.md` alla root del repository |

#### US-0.3.3 – Pipeline CI iniziale

| Task | Stato | Evidenza nel codebase / docs |
|------|--------|------------------------------|
| T-0.3.3.1 | ✅ | Workflow `.github/workflows/ci.yml`: lint frontend (`npm run lint`), trigger su push/PR su main e develop |
| T-0.3.3.2 | ✅ | Build backend per `registry-api`, `publisher`, `runtime-gateway` (Maven) |
| T-0.3.3.3 | ✅ | Test unitari backend e frontend con upload artefatti (surefire, coverage) |
| T-0.3.3.4 | ❌ | Step migrazioni DB in ambiente di test **non presente** in CI |
| T-0.3.3.5 | ✅ | Build frontend (portal-ui) in CI |

---

## Deliverable prodotti

| Deliverable | Documento / percorso |
|-------------|----------------------|
| Requisiti | [Requisiti](epic0-requisiti) |
| Modello dati | [Modello dati](epic0-modello-dati) |
| Stack tecnologico | [Stack tecnologico](epic0-stack-tecnologico) |
| Ambiente di sviluppo | [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| Obiettivo e deliverable | [Obiettivo e deliverable](epic0-obiettivo) |
| Struttura repository | `portal-ui/`, `registry-api/`, `publisher/`, `runtime-gateway/`, `docs/`, `charts/` |
| Pipeline CI | `.github/workflows/ci.yml`, `docker.yml`, `helm.yml` |
| Ambiente locale | `docker-compose.yml` (PostgreSQL, MinIO, Temporal) |

---

## Azioni consigliate per completare al 100%

1. **Pre-commit hooks**: Aggiungere Husky (o equivalente) con lint frontend e, se possibile, check stile Java.
2. **CI – Migrazioni DB**: Aggiungere uno step (es. in `ci.yml`) che esegua Flyway su un DB di test.
3. **Cartella `/ci`**: Creare `ci/` per script o config condivisi (opzionale se si usa solo GitHub Actions).
4. **Keycloak** (opzionale): Aggiungere servizio Keycloak a `docker-compose.yml` e documentarlo in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo).

Dopo queste integrazioni, l’EPIC 0 può essere considerato chiuso al 100% rispetto al piano di sviluppo.
