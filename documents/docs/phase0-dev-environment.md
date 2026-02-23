---
id: phase0-dev-environment
title: Setup Ambiente di Sviluppo Fase 0
sidebar_label: Ambiente di sviluppo
---

## Introduzione

Questo documento descrive i passi necessari per allestire l’ambiente di sviluppo e test della piattaforma **Stillum Business Portal** nella Fase 0. L’obiettivo è fornire un ambiente funzionante su cui i team possono iniziare a sviluppare e validare le funzionalità delle fasi successive.

## Configurazione del cluster Kubernetes

### Installazione k3s

1. **Installare k3s** su una macchina Linux o VM dedicata. k3s è una distribuzione leggera di Kubernetes adatta per ambienti di sviluppo.  
   Esempio (Ubuntu):
   ```bash
   curl -sfL https://get.k3s.io | sh -
   sudo k3s kubectl get node
   ```
2. **Verificare l’installazione** eseguendo comandi base con `kubectl` (`sudo k3s kubectl get nodes`).

### Configurazione namespace

Creare un namespace dedicato per la piattaforma (es. `stillum-dev`):
```bash
sudo k3s kubectl create namespace stillum-dev
```

### Installazione dei componenti base

1. **PostgreSQL**: utilizzare Helm per installare un database con persistenza. Esempio con la chart `bitnami/postgresql`:
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install stillum-postgres bitnami/postgresql --namespace stillum-dev \
     --set global.postgresql.auth.username=stillum \
     --set global.postgresql.auth.password=changeme \
     --set global.postgresql.auth.database=stillumdb
   ```
2. **MinIO**: installare lo storage S3‑compatibile:
   ```bash
   helm repo add minio https://charts.min.io/
   helm install stillum-minio minio/minio --namespace stillum-dev \
     --set rootUser=minioadmin,rootPassword=minioadmin
   ```
3. **Temporal**: installare Temporal server e UI tramite chart:
   ```bash
   helm repo add temporal https://helm.temporal.io
   helm install stillum-temporal temporal/temporal --namespace stillum-dev \
     --set server.config.persistence.default.store=postgresql \
     --set server.config.persistence.visibility.store=postgresql \
     --set postgresql.enabled=false \
     --set postgresql.external.host=stillum-postgres \
     --set postgresql.external.password=changeme \
     --set postgresql.external.user=stillum \
     --set postgresql.external.database=stillumdb
   ```

Assicurarsi che Temporal possa connettersi al database PostgreSQL e che MinIO sia accessibile come endpoint S3.

### Configurazione di Keycloak (opzionale)

Per la gestione degli utenti e l’autenticazione OIDC, installare un Keycloak nel cluster:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install stillum-keycloak bitnami/keycloak --namespace stillum-dev \
  --set auth.adminUser=admin,auth.adminPassword=changeme
```

## Struttura del repository

Organizzare il codice in modo modulare:

```
stillum-business-central/
  portal-ui/        # codice frontend (React)
  registry-api/     # API per artefatti e versioni
  publisher/        # servizio per la pubblicazione
  runtime-gateway/  # interfaccia con Temporal
  docs/             # documentazione Docusaurus
  charts/           # Helm charts per i deploy
  ci/               # script e config per pipeline CI
```

## Pipeline CI di base

1. **Linting**: configurare ESLint e Prettier per il frontend, `golangci-lint` o `ktlint` per i microservizi backend.  
2. **Test**: predisporre test unitari e di integrazione minimi per i componenti già presenti.  
3. **Build**: generare le immagini Docker per ogni servizio.  
4. **Migrazioni DB**: applicare le migrazioni al database in un ambiente di test (utilizzando Flyway o Liquibase).

Un esempio di workflow GitHub Actions (in pseudocodice) per un servizio potrebbe includere step di checkout, setup linguaggio (Go/Java), lint, test, build, push dell’immagine al registry.

## Note finali

L’ambiente di sviluppo configurato secondo questi passi consentirà al team di iniziare a sviluppare e verificare i componenti della piattaforma. Nelle fasi successive verranno introdotte ulteriori tool (monitoring, logging centralizzato, ecc.) e verranno affinati i chart Helm per supportare ambienti multipli e scalabilità.