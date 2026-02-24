---
id: epic0-stato
title: Stato EPIC 0 – Setup e Fondamenta
sidebar_label: Stato EPIC 0
---

# Stato EPIC 0 – Setup e Fondamenta

**Obiettivo dell'EPIC:** Preparare requisiti, modello dati, stack tecnologico e infrastruttura di sviluppo.

**Contesto:** In questo repository sono presenti struttura repo, Docker Compose, CI, linter e pre-commit, oltre ai servizi Quarkus e alla UI.

**Stato complessivo:** **Completato** — Requisiti, modello dati e stack sono documentati; l'infrastruttura di sviluppo (FEATURE 0.3) è presente nel worktree (struttura, Docker, CI, Husky, Checkstyle, Keycloak in compose, chart Helm scaffold).

---

## Riepilogo per FEATURE

| FEATURE | Stato | Note |
|--------|--------|------|
| **0.1** Analisi Requisiti e Modellazione del Dominio | ✅ Completato | Requisiti e modello dati documentati in questa cartella |
| **0.2** Scelta dello Stack Tecnologico | ✅ Completato | Stack documentato (Java/Spring, React, PostgreSQL, MinIO, Temporal) |
| **0.3** Infrastruttura di Sviluppo | ✅ Completato | Struttura repo, Docker Compose, CI (ci.yml), ESLint/Prettier, Checkstyle, Husky; Keycloak incluso in compose; chart Helm presente come scaffold (senza manifest applicativi) |

---

## Dettaglio per FEATURE e Task

### FEATURE 0.1 – Analisi Requisiti e Modellazione del Dominio

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.1.1.1 | ✅ | Requisiti su BPMN, DMN, Forms, Request in [Requisiti Fase 0](epic0-requisiti) |
| T-0.1.1.2 | ✅ | Ciclo di vita (bozza → revisione → approvazione → pubblicazione) in requisiti e modello dati |
| T-0.1.1.3 | ✅ | Multi-tenant, RBAC, auditing, ambienti DEV/QA/PROD in [Requisiti](epic0-requisiti) |
| T-0.1.1.4 | ✅ | Documento requisiti → [Requisiti](epic0-requisiti) |
| T-0.1.2.1 | ✅ | Entità definite in [Modello dati](epic0-modello-dati) |
| T-0.1.2.2 | ✅ | Diagramma ER e relazioni in [Modello dati](epic0-modello-dati) |
| T-0.1.2.3 | ✅ | Enum (tipo artefatto, stato artefatto, stato istanza, tipo task) in [Modello dati](epic0-modello-dati) |
| T-0.1.2.4 | ✅ | Documento modello dati → [Modello dati](epic0-modello-dati) |

---

### FEATURE 0.2 – Scelta dello Stack Tecnologico

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.2.1.1 | ✅ | Backend Java documentato in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.1.2 | ✅ | Strategia API REST in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.1.3 | ✅ | JPA/Hibernate e Flyway documentati in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.1.4 | ✅ | PostgreSQL, MinIO/S3, Temporal in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.2.1 | ✅ | React, shadcn/ui, Tailwind documentati in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.2.2 | ✅ | Gestione stato (Redux/Zustand) in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.2.3 | ✅ | Editor BPMN/DMN/StillumForms/Request: sviluppati nel progetto stillum-modeler |
| T-0.2.2.4 | ✅ | i18n e data fetching in [Stack tecnologico](epic0-stack-tecnologico) |

---

### FEATURE 0.3 – Infrastruttura di Sviluppo

Ambiente locale via Docker Compose; la parte Kubernetes/Helm è presente come scaffold e viene completata nelle fasi successive.

#### US-0.3.1 – Setup del cluster Kubernetes

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.3.1.1 | 📄 | k3s documentato in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo); Docker Compose in repo |
| T-0.3.1.2 | 📄 | Namespace e Helm in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.1.3 | ✅ | PostgreSQL in `docker-compose.yml` e [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.1.4 | ✅ | MinIO in `docker-compose.yml`, bucket init (stillum-bundles, stillum-artifacts) |
| T-0.3.1.5 | ✅ | Temporal in `docker-compose.yml` con persistence PostgreSQL |
| T-0.3.1.6 | ✅ | Keycloak in `docker-compose.yml` con import realm (cartella `keycloak/`) |
| T-0.3.1.7 | ✅ | Rete e healthcheck in `docker-compose.yml` |

#### US-0.3.2 – Struttura del repository e standard di codice

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.3.2.1 | ✅ | `portal-ui/`, `registry-api/`, `publisher/`, `runtime-gateway/`, `documents/`, `charts/`, `ci/` |
| T-0.3.2.2 | ✅ | ESLint + Prettier in `portal-ui/` |
| T-0.3.2.3 | ✅ | Checkstyle (Maven) in registry-api, publisher, runtime-gateway; `.editorconfig` root |
| T-0.3.2.4 | ✅ | Husky + lint-staged alla root (`.husky/pre-commit`) |
| T-0.3.2.5 | ✅ | `.editorconfig`, `.gitignore`, `README.md` alla root |

#### US-0.3.3 – Pipeline CI iniziale

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.3.3.1 | ✅ | `.github/workflows/ci.yml`: lint frontend e backend (Checkstyle) su push/PR |
| T-0.3.3.2 | ✅ | Build backend (matrix registry-api, publisher, runtime-gateway) |
| T-0.3.3.3 | ✅ | Test unitari backend e frontend; upload artefatti |
| T-0.3.3.4 | ✅ | Migrazioni Flyway eseguite all’avvio nei servizi; in CI i test avviano Postgres/MinIO e applicano le migrazioni |
| T-0.3.3.5 | ✅ | Build frontend in CI |

---

## Deliverable prodotti

| Deliverable | Documento / percorso |
|-------------|----------------------|
| Requisiti | [Requisiti](epic0-requisiti) |
| Modello dati | [Modello dati](epic0-modello-dati) |
| Stack tecnologico | [Stack tecnologico](epic0-stack-tecnologico) |
| Ambiente di sviluppo | [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| Obiettivo e deliverable | [Obiettivo e deliverable](epic0-obiettivo) |
| Struttura repository | `portal-ui/`, `registry-api/`, `publisher/`, `runtime-gateway/`, `documents/`, `charts/`, `ci/` |
| Ambiente locale | `docker-compose.yml`, `scripts/init-db.sql` |
| Pipeline CI | `.github/workflows/ci.yml` |

---

## Azioni consigliate (post-EPIC0)

1. Completare il chart Helm con template di Deployment/Service/Ingress per i moduli (oggi è uno scaffold).
2. Chiarire la strategia Temporal: ambiente disponibile in locale, integrazione applicativa da implementare negli EPIC successivi.
3. Definire una matrice RBAC applicativa e l’enforcement lato API (oggi non è parte di EPIC0).

---

## Checklist deliverable EPIC 0 (rispetto al piano)

Verifica che tutti gli output richiesti dal [Piano di Sviluppo](../piano-di-sviluppo#epic-0--setup-e-fondamenta) siano coperti:

| Output richiesto dal piano | Dove si trova | OK |
|----------------------------|---------------|-----|
| **FEATURE 0.1** | | |
| Verbale interviste / requisiti artefatti (T-0.1.1.1) | [Requisiti](epic0-requisiti) – sezione Artefatti, NFR | ✅ |
| Diagramma stati pubblicazione (T-0.1.1.2) | [Requisiti](epic0-requisiti) – diagramma stati + testo ciclo di vita | ✅ |
| Requisiti NFR multi-tenant, RBAC, audit, ambienti (T-0.1.1.3) | [Requisiti](epic0-requisiti) – sezioni dedicate + Non-functional | ✅ |
| Documento requisiti finale (T-0.1.1.4) | [Requisiti](epic0-requisiti) | ✅ |
| Lista entità con attributi (T-0.1.2.1) | [Modello dati](epic0-modello-dati) | ✅ |
| Diagramma ER e relazioni (T-0.1.2.2) | [Modello dati](epic0-modello-dati) | ✅ |
| Enumerazioni (T-0.1.2.3) | [Modello dati](epic0-modello-dati) – nelle entità | ✅ |
| Documento modello dati (T-0.1.2.4) | [Modello dati](epic0-modello-dati) | ✅ |
| **FEATURE 0.2** | | |
| Scelta backend / ADR (T-0.2.1.1) | [Stack tecnologico](epic0-stack-tecnologico) – Backend | ✅ |
| Strategia API REST (T-0.2.1.2) | [Stack tecnologico](epic0-stack-tecnologico) | ✅ |
| ORM e migrazioni (T-0.2.1.3) | [Stack tecnologico](epic0-stack-tecnologico) – JPA, Flyway | ✅ |
| PostgreSQL, MinIO, Temporal (T-0.2.1.4) | [Stack tecnologico](epic0-stack-tecnologico) | ✅ |
| React, shadcn, Tailwind (T-0.2.2.1) | [Stack tecnologico](epic0-stack-tecnologico) – Frontend | ✅ |
| State management (T-0.2.2.2) | [Stack tecnologico](epic0-stack-tecnologico) | ✅ |
| Editor bpmn.io, dmn.io, StillumForms (T-0.2.2.3) | [Stato](epic0-stato) – stillum-modeler; [Stack](epic0-stack-tecnologico) | ✅ |
| i18n e data fetching (T-0.2.2.4) | [Stack tecnologico](epic0-stack-tecnologico) | ✅ |
| **FEATURE 0.3** | | |
| Setup cluster / ambiente (T-0.3.1.x) | [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) – k3s, Docker Compose, Helm | ✅ |
| Struttura repo e standard (T-0.3.2.x) | [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) | ✅ |
| Pipeline CI (T-0.3.3.x) | [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) | ✅ |

**Conclusione:** Sì, dell'EPIC 0 abbiamo tutto sul piano documentale. Tutti i deliverable indicati nel piano (requisiti, modello dati, stack, ambiente e CI) sono coperti dai documenti in questa cartella.
