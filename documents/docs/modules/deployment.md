---
id: modules-deployment
title: Deployment e Packaging
sidebar_label: Deployment
---

La piattaforma è distribuita come soluzione containerizzata. Nel worktree corrente sono disponibili Docker Compose (infra + full stack) e uno scaffold Helm per evoluzione su Kubernetes.

## Packaging

- **Docker Compose (worktree)**:
  - `docker-compose.yml`: PostgreSQL, MinIO, Keycloak, Nexus
  - `docker-compose.full.yml`: overlay con `registry-api`, `publisher`, `runtime-gateway`, `npm-build-service`, `portal-ui`
- **Helm charts (scaffold)**: chart `charts/stillum-platform/` presente come base; la parametrizzazione completa e i chart per ciascun componente sono ancora da consolidare.
- **Configurazione ambienti (pianificata)**: DEV/QA/PROD con parametri separati (DB, bucket, runtime).
- **Configurazione multi-tenant (parziale)**: isolamento dati via RLS su PostgreSQL; provisioning tenant/ambienti via seed/migrazioni e API.

## Requisiti di Deploy

- Supporto per deployment on-premise (self-host) e SaaS.
- Possibilità di scalare orizzontalmente i componenti di front-end, back-end e runtime.
- Logging e monitoring integrati (Prometheus, Grafana, ELK).

## Integrazione con Temporal

- Nel worktree corrente Temporal non è incluso nei compose e non è ancora integrato applicativamente.
- L’obiettivo di deploy è prevedere creazione o connessione a un cluster Temporal (in-cluster o esterno) e la configurazione di namespace per tenant o condivisi.
