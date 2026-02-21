---
id: phase0-tech-stack
title: Scelta Tecnologica Fase 0
sidebar_label: Stack tecnologico
---

## Introduzione

Questo documento riassume le scelte tecnologiche adottate nella Fase 0 per il progetto **Stillum Business Portal**. L’obiettivo è fornire una base coerente e sostenibile che possa evolvere con le fasi successive dello sviluppo.

## Backend

### Linguaggi e framework

- **Golang** o **Java/Kotlin** per i microservizi di backend. Entrambi sono linguaggi compilati, con ampio supporto per concurrency e performance. La scelta finale potrà dipendere dalle competenze del team.  
- **gRPC/REST** per l’esposizione delle API. gRPC è particolarmente indicato per comunicazioni interne tra servizi; REST sarà usato per l’esposizione pubblica verso la UI.

### Database

- **PostgreSQL**: RDBMS robusto e ricco di funzionalità. Sarà utilizzato per memorizzare tutti i metadati (tenant, utenti, artefatti, versioni, pubblicazioni, istanze, task, audit). La funzionalità di **Row‑Level Security** permetterà l’isolamento dei dati per tenant.  
- **ORM**: Si prevede l’utilizzo di un ORM come GORM (Golang) o JPA/Hibernate (Java) per facilitare la gestione delle entità e migrazioni del database.

### Orchestrazione dei workflow

- **Temporal**: Scelto come motore di orchestrazione per la sua capacità di gestire workflow duraturi, resilienza a fault, supporto per retry e compensazioni. Temporal verrà installato con persistence su PostgreSQL e potrà essere eseguito nel cluster Kubernetes.  
- **SDK**: Verrà utilizzato l’SDK corrispondente al linguaggio backend per definire worker e attività.

### Storage dei payload

- **MinIO**: Implementazione compatibile S3 da eseguire in cluster per ambienti self‑host. Verrà usata per memorizzare i payload XML/JSON degli artefatti.  
- **Amazon S3**: In ambienti cloud, sarà possibile configurare l’endpoint verso un bucket S3 mantenendo inalterato il codice che accede allo storage.

### Messaging e eventi

- **NATS** o **Kafka** (opzionale): Potranno essere introdotti per eventuali flussi asincroni, notifiche o integrazione con sistemi esterni nelle fasi successive.

## Frontend

### Linguaggio e framework

- **React**: Libreria per la costruzione dell’interfaccia utente, per la sua diffusione e flessibilità.  
- **Next.js** (opzionale): Per semplificare routing, rendering lato server e ottimizzazioni.  
- **shadcn/ui**: Libreria di componenti React basata su Tailwind CSS che offre design coerente e modernità.  
- **Tailwind CSS**: Sistema di utility‑first CSS che permette di definire stili in maniera efficiente.

### Editor integrati

- **bpmn.io**: Editor BPMN 2.0 open‑source per la modellazione dei processi.  
- **dmn.io**: Editor DMN 1.3 per la definizione delle tabelle decisionali.  
- **StillumForms Editor**: Editor proprietario per la definizione di moduli (basato su JSON Schema e componenti React).  
- **Editor Request**: Editor per definire contratti di servizio (avrà interfaccia JSON/schema).

### Gestione dello stato

- **Redux Toolkit** o **Zustand**: Per la gestione centralizzata dello stato nel client. La scelta potrà essere rivalutata in base alle preferenze del team.

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