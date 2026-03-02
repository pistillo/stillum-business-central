---
id: phase0-dev-environment
title: Setup Ambiente di Sviluppo Fase 0
sidebar_label: Ambiente di sviluppo
---

## Introduzione

Questo documento descrive i passi necessari per allestire l’ambiente di sviluppo e test della piattaforma **Stillum Business Portal** nella Fase 0. L’obiettivo è fornire un ambiente funzionante su cui i team possono iniziare a sviluppare e validare le funzionalità delle fasi successive.

## Configurazione ambiente di sviluppo locale

### Docker Compose

Per lo sviluppo locale, il progetto utilizza **Docker Compose** per avviare i servizi infrastrutturali (PostgreSQL, MinIO, Temporal). Questo approccio semplifica il setup e permette di replicare facilmente l'ambiente.

Avviare i servizi:
```bash
docker compose up -d postgres minio minio-init temporal
```

Per i test backend, è sufficiente avviare solo PostgreSQL e MinIO:
```bash
docker compose up -d postgres minio minio-init
```

### Configurazione cluster Kubernetes (produzione)

Per il deployment in produzione, l'infrastruttura è basata su **Kubernetes/k3s**. I passi seguenti descrivono come configurare un cluster per il deployment.

#### Installazione k3s

1. **Installare k3s** su una macchina Linux o VM dedicata. k3s è una distribuzione leggera di Kubernetes adatta per ambienti di produzione e staging.
   Esempio (Ubuntu):
   ```bash
   curl -sfL https://get.k3s.io | sh -
   sudo k3s kubectl get node
   ```
2. **Verificare l’installazione** eseguendo comandi base con `kubectl` (`sudo k3s kubectl get nodes`).

#### Configurazione namespace

Creare un namespace dedicato per la piattaforma (es. `stillum-prod`):
```bash
sudo k3s kubectl create namespace stillum-prod
```

#### Installazione dei componenti base

1. **PostgreSQL**: utilizzare Helm per installare un database con persistenza. Esempio con la chart `bitnami/postgresql`:
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install stillum-postgres bitnami/postgresql --namespace stillum-prod \
     --set global.postgresql.auth.username=stillum \
     --set global.postgresql.auth.password=changeme \
     --set global.postgresql.auth.database=stillumdb
   ```
2. **MinIO**: installare lo storage S3‑compatibile:
   ```bash
   helm repo add minio https://charts.min.io/
   helm install stillum-minio minio/minio --namespace stillum-prod \
     --set rootUser=minioadmin,rootPassword=minioadmin
   ```
3. **Temporal**: installare Temporal server e UI tramite chart:
   ```bash
   helm repo add temporal https://helm.temporal.io
   helm install stillum-temporal temporal/temporal --namespace stillum-prod \
     --set server.config.persistence.default.store=postgresql \
     --set server.config.persistence.visibility.store=postgresql \
     --set postgresql.enabled=false \
     --set postgresql.external.host=stillum-postgres \
     --set postgresql.external.password=changeme \
     --set postgresql.external.user=stillum \
     --set postgresql.external.database=stillumdb
   ```

Assicurarsi che Temporal possa connettersi al database PostgreSQL e che MinIO sia accessibile come endpoint S3.

#### Configurazione di Keycloak (opzionale)

Per la gestione degli utenti e l’autenticazione OIDC, installare un Keycloak nel cluster:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install stillum-keycloak bitnami/keycloak --namespace stillum-prod \
  --set auth.adminUser=admin,auth.adminPassword=changeme
```

## Struttura del repository

Organizzare il codice in modo modulare:

```
stillum-business-central/
  portal-ui/           # codice frontend (React + Vite)
  registry-api/        # API per artefatti e versioni (Quarkus)
  publisher/           # servizio per la pubblicazione (Quarkus)
  runtime-gateway/     # interfaccia con Temporal (Quarkus)
  npm-build-service/   # servizio per build artefatti MODULE/COMPONENT (Node.js)
  documents/           # progetto Docusaurus con la documentazione
  charts/              # Helm charts per i deploy
  ci/                  # script e config per pipeline CI
```

## Pipeline CI e test

### Test backend con servizi esterni

I test backend (registry-api, publisher) utilizzano **PostgreSQL e MinIO esterni** tramite Docker Compose. Questo approccio:

- **Disabilita Quarkus DevServices** nel profilo test
- Garantisce consistenza tra ambiente locale e CI
- Permette di testare la configurazione reale di storage e database

Configurazione DevServices disabilitata:
```properties
%test.quarkus.datasource.devservices.enabled=false
%test.quarkus.s3.devservices.enabled=false
```

### Pipeline CI

La pipeline CI (`.github/workflows/ci.yml`) esegue:

1. **Linting**: ESLint per il frontend, Checkstyle per i backend Java.
2. **Build**: compilazione frontend (Vite) e backend (Maven).
3. **Test**: esecuzione test backend con PostgreSQL+MinIO esterni, test frontend (Vitest).
4. **Migrazioni DB**: Flyway applica le migrazioni automaticamente all'avvio dei servizi.

Workflow CI:
```yaml
# Avvia servizi infrastrutturali per i test
- name: Start postgres + minio
  run: |
    docker compose up -d postgres minio minio-init

# Esegue test backend (registry-api, publisher, runtime-gateway)
- name: Test backend
  run: mvn test

# Esegue test frontend
- name: Test frontend
  run: pnpm run test
```

## Note finali

L’ambiente di sviluppo configurato secondo questi passi consentirà al team di iniziare a sviluppare e verificare i componenti della piattaforma. Nelle fasi successive verranno introdotte ulteriori tool (monitoring, logging centralizzato, ecc.) e verranno affinati i chart Helm per supportare ambienti multipli e scalabilità.