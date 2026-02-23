---
id: epic0-stack-tecnologico
title: Scelta Tecnologica Fase 0
sidebar_label: Stack tecnologico
---

## Introduzione

Questo documento riassume le scelte tecnologiche adottate nella Fase 0 per il progetto **Stillum Business Portal**. L'obiettivo è fornire una base coerente e sostenibile che possa evolvere con le fasi successive dello sviluppo. Nel codebase la scelta effettiva è **Java (Quarkus)** per i microservizi backend.

## Backend

### Linguaggi e framework

- **Java (Quarkus)** per i microservizi: `registry-api`, `publisher`, `runtime-gateway` (Maven, JDK 21).
- **REST** per l'esposizione delle API verso la UI; gRPC per comunicazioni interne.

### Database

- **PostgreSQL**: RDBMS per metadati (tenant, utenti, artefatti, versioni, pubblicazioni, istanze, task, audit). **Row‑Level Security** per isolamento multi‑tenant.
- **JPA/Hibernate** e **Flyway** per entità e migrazioni (presenti in `registry-api`).

### Orchestrazione dei workflow

- **Temporal**: motore di orchestrazione per workflow duraturi, retry e compensazioni. Installato con persistence su PostgreSQL (Docker Compose e/o Helm).
- **Temporal SDK Typescript** per worker e attività (vedi `runtime-gateway`).

### Storage dei payload

- **MinIO**: S3‑compatibile per ambienti self‑host; bucket `stillum-bundles`, `stillum-artifacts`.
- **Amazon S3**: in cloud è possibile configurare l'endpoint mantenendo la stessa API.

### Messaging e eventi

- **NATS** o **Kafka** (opzionale) per flussi asincroni e notifiche nelle fasi successive.

## Frontend

### Linguaggio e framework

- **React** con **Vite** per l'interfaccia utente (`portal-ui`).
- **shadcn/ui** e **Tailwind CSS** per componenti e stili.
- **Next.js** opzionale per routing e SSR.

### Editor integrati

- **bpmn.io**: stillum-modeler BPMN 2.0.
- **dmn.io**: stillum-modeler DMN 1.3.
- **StillumForms Editor**: stillum-modeler (JSON Schema + React).
- **Editor Request**: stillum-bruno (JSON/schema).

### Gestione dello stato

- Stato gestito con hook React e context; Redux Toolkit o Zustand documentati come opzioni.

## DevOps e CI/CD

### Contenitori e orchestrazione

- **Kubernetes/k3s**: infrastruttura target; **Docker Compose** fornito per sviluppo locale.
- **Helm**: chart `stillum-platform` in `/charts` per UI, registry-api, publisher, runtime-gateway.

### Pipeline CI/CD

- **GitHub Actions**: workflow `ci.yml` (lint, build, test backend e frontend), `docker.yml`, `helm.yml`.
- **Migrazioni DB**: Flyway in `registry-api`; step migrazioni in CI da predisporre (vedi [Stato EPIC 0](epic0-stato)).

### Strumenti di gestione

- **Keycloak** (opzionale) per autenticazione e OIDC.
- **Cert Manager**, **Prometheus/Grafana** per TLS e monitoring in evoluzione.

## Considerazioni finali

Le tecnologie selezionate forniscono una base solida e moderna. La modularità dei servizi e la portabilità su Kubernetes consentono di evolvere la piattaforma nelle fasi successive.
