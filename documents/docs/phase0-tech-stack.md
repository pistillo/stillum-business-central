---
id: phase0-tech-stack
title: Scelta Tecnologica Fase 0
sidebar_label: Stack tecnologico
---

## Introduzione

Questo documento riassume le scelte tecnologiche adottate nella Fase 0 per il progetto **Stillum Business Portal**. L’obiettivo è fornire una base coerente e sostenibile che possa evolvere con le fasi successive dello sviluppo.

## Backend

### Linguaggi e framework

- **Quarkus (Java 21)**: Framework cloud-native scelto per i microservizi di backend. Quarkus offre avvio rapido, basso consumo di memoria, supporto nativo per Kubernetes e integrazione completa con Java EE/Jakarta. Tutti i microservizi (registry-api, publisher, runtime-gateway) sono implementati con Quarkus.
- **REST**: Le API sono esposte tramite REST (Quarkus RESTEasy Reactive) per l'integrazione con il frontend e sistemi esterni.

### Database

- **PostgreSQL**: RDBMS robusto e ricco di funzionalità. Sarà utilizzato per memorizzare tutti i metadati (tenant, utenti, artefatti, versioni, pubblicazioni, istanze, task, audit). La funzionalità di **Row‑Level Security** permette l’isolamento dei dati per tenant.  
- **ORM**: **Hibernate ORM Panache** (Quarkus) per facilitare la gestione delle entità e migrazioni del database. Le migrazioni sono gestite con **Flyway**.

### Orchestrazione dei workflow

- **Temporal**: Scelto come motore di orchestrazione per la sua capacità di gestire workflow duraturi, resilienza a fault, supporto per retry e compensazioni. Temporal verrà installato con persistence su PostgreSQL e potrà essere eseguito nel cluster Kubernetes.  
- **SDK**: Verrà utilizzato l’SDK corrispondente al linguaggio backend per definire worker e attività.

### Storage dei payload

- **MinIO**: Implementazione compatibile S3 da eseguire in cluster per ambienti self‑host. Verrà usata per memorizzare i payload XML/JSON degli artefatti.
- **Amazon S3**: In ambienti cloud, sarà possibile configurare l’endpoint verso un bucket S3 mantenendo inalterato il codice che accede allo storage.

### NPM Build Service

- **npm-build-service**: Servizio Node.js (Fastify) dedicato alla build di artefatti di tipo MODULE e COMPONENT. Questo servizio:
  - Risolve le dipendenze npm dichiarate nell'artefatto
  - Esegue la build tramite esbuild
  - Genera pacchetti npm riutilizzabili dal runtime
  - Espone REST API per Publisher e Registry API
  - Non utilizza npm workspaces nel repository (scelta architetturale per isolamento)

### Messaging e eventi

- **NATS** o **Kafka** (opzionale): Potranno essere introdotti per eventuali flussi asincroni, notifiche o integrazione con sistemi esterni nelle fasi successive.

## Frontend

### Linguaggio e framework

- **React (19.1.0)**: Libreria per la costruzione dell’interfaccia utente, per la sua diffusione e flessibilità.
- **Vite (5.4.10)**: Build tool per sviluppo rapido e ottimizzazione del bundle (HMR veloce, ottimizzazioni out-of-the-box).
- **React Router DOM (6.28.0)**: Routing client-side per la navigazione nell'applicazione SPA.
- **Tailwind CSS (3.4.19)**: Sistema di utility‑first CSS che permette di definire stili in maniera efficiente.

### Librerie UI

- **@tecnosys/erp-design-system (v1.4.0-alpha.4)**: Design system proprietario per componenti enterprise.
- **@ark-ui/react (5.32.0)**: Libreria di componenti React headless, accessibili e customizzabili.
- **@dnd-kit (core, sortable, utilities)**: Librerie per drag-and-drop (ordinamento, riordinamento).

### Editor integrati

- **@tecnosys/stillum-forms-editor**: Editor proprietario per la definizione di moduli (basato su JSON Schema e componenti React).
- **@tecnosys/stillum-forms-core**: Core library per StillumForms.
- **@tecnosys/stillum-forms-react**: Componenti React per StillumForms.
- **@monaco-editor/react (4.7.0)**: Editor Monaco per modifiche testuali (JSON, XML, YAML).
- **Editor Request**: Editor per definire contratti di servizio (avrà interfaccia JSON/schema).
- Nota: Gli editor BPMN/DMN verranno introdotti in fasi successive.

### Gestione dello stato

- **Zustand (5.0.11)**: Libreria leggera per la gestione centralizzata dello stato nel client (scelta definitiva).

## DevOps e CI/CD

### Contenitori e orchestrazione

- **Kubernetes/k3s**: L’infrastruttura sarà basata su Kubernetes per favorire scalabilità e portabilità. k3s verrà utilizzato per ambienti di sviluppo e test.  
- **Helm**: Tool per il packaging, la configurazione e il deploy delle applicazioni nel cluster. Ogni componente (UI, registry API, publisher, runtime gateway, DB, MinIO, Temporal) sarà pacchettizzato con Helm chart.

### Pipeline CI/CD

- **GitHub Actions** (o alternativa equivalente): Per automatizzare linting, build, test e pubblicazione di immagini Docker.  
- **Container registry**: Immagini Docker dei servizi verranno pubblicate in un registry (ad esempio GitHub Container Registry o un registry privato).  
- **Migrazioni DB**: Saranno gestite con strumenti come **Flyway** o **Liquibase** integrati nelle pipeline di deploy.

### Strumenti di gestione

- **Keycloak**: Per la gestione dell’autenticazione e l’integrazione OIDC (OpenID Connect) con la piattaforma.  
- **Cert Manager**: Per la gestione automatica dei certificati TLS nel cluster.  
- **Prometheus/Grafana**: Per metriche e monitoring dell’infrastruttura.

## Considerazioni finali

Le tecnologie selezionate forniscono una base solida e moderna per la piattaforma. La modularità dei servizi, l’utilizzo di standard affermati e la portabilità del deployment su Kubernetes permetteranno di evolvere la soluzione nelle fasi successive, introducendo nuove funzionalità (analytics, AI assistant, marketplace) senza stravolgere l’architettura.