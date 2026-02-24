---
id: epic0-ambiente-di-sviluppo
title: Setup Ambiente di Sviluppo Fase 0
sidebar_label: Ambiente di sviluppo
---

## Introduzione

Questo documento descrive i passi per allestire l'ambiente di sviluppo e test della piattaforma **Stillum Business Portal** (EPIC 0). Nel repository sono disponibili **Docker Compose** per lo sviluppo locale e **Helm** per il deploy su Kubernetes. Per lo stato di implementazione vedi [Stato EPIC 0](epic0-stato).

## Ambiente locale con Docker Compose

Il progetto fornisce un `docker-compose.yml` alla root con i servizi base:

- **PostgreSQL** (porta 5432): utente `stillum`, DB inizializzato con script in `scripts/init-db.sql`.
- **MinIO** (9000 API, 9001 Console): bucket `stillum-bundles` e `stillum-artifacts` creati all'avvio.
- **Temporal** (7233): con persistence su PostgreSQL.
- **Keycloak** (8080): avviato in modalità dev con import realm dalla cartella `keycloak/`.

Credenziali di default (override via `.env`):

- PostgreSQL: `POSTGRES_USER=stillum`, `POSTGRES_PASSWORD=stillum123`, `POSTGRES_DB=stillumdb`
- MinIO: `MINIO_ROOT_USER=minioadmin`, `MINIO_ROOT_PASSWORD=minioadmin`
- Keycloak: `KEYCLOAK_ADMIN=admin`, `KEYCLOAK_ADMIN_PASSWORD=admin`

Avvio:

```bash
docker compose up -d
```

Verificare i servizi con i rispettivi healthcheck. Le applicazioni (portal-ui, registry-api, publisher, runtime-gateway) vanno configurate con le URL/credenziali di questi servizi (es. variabili d'ambiente o `.env`).

## Configurazione del cluster Kubernetes (k3s)

Per un ambiente tipo k3s invece che Docker Compose:

### Installazione k3s

Esempio su Ubuntu:

```bash
curl -sfL https://get.k3s.io | sh -
sudo k3s kubectl get node
```

### Namespace

```bash
sudo k3s kubectl create namespace stillum-dev
```

### Installazione componenti base con Helm

1. **PostgreSQL** (bitnami/postgresql):

   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install stillum-postgres bitnami/postgresql --namespace stillum-dev \
     --set global.postgresql.auth.username=stillum \
     --set global.postgresql.auth.password=changeme \
     --set global.postgresql.auth.database=stillumdb
   ```

2. **MinIO**:

   ```bash
   helm repo add minio https://charts.min.io/
   helm install stillum-minio minio/minio --namespace stillum-dev \
     --set rootUser=minioadmin,rootPassword=minioadmin
   ```

3. **Temporal** (con PostgreSQL esterno):

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

Assicurarsi che Temporal e MinIO siano raggiungibili dalle applicazioni.

### Keycloak (opzionale)

Per IAM e OIDC:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install stillum-keycloak bitnami/keycloak --namespace stillum-dev \
  --set auth.adminUser=admin,auth.adminPassword=changeme
```

## Struttura del repository

Struttura attuale:

```
stillum-business-central/
  portal-ui/        # frontend React (Vite, shadcn, Tailwind)
  registry-api/     # API artefatti e versioni (Java/Quarkus)
  publisher/        # servizio di pubblicazione (Java/Quarkus)
  runtime-gateway/  # servizio gateway (Java/Quarkus)
  documents/        # documentazione Docusaurus (sito in documents/, non docs/)
  charts/           # Helm chart stillum-platform
  .github/workflows # CI (ci.yml, ecc.)
  ci/               # opzionale: script/config condivisi
```

La cartella della documentazione è **documents/** (Docusaurus). La CI è gestita da GitHub Actions.

## Pipeline CI di base

- **Lint**: ESLint + Prettier per `portal-ui`; eseguito in `.github/workflows/ci.yml`.
- **Build**: Maven per backend, `npm run build` per frontend.
- **Test**: test unitari backend (Maven) e frontend; report caricati come artefatti.
- **Migrazioni DB**: Flyway è configurato per eseguire migrazioni all’avvio dei servizi; in CI i test avviano PostgreSQL/MinIO e validano di fatto l’applicazione delle migrazioni.

## Note finali

Con Docker Compose si ha un ambiente locale completo; con k3s e Helm si replica l'ambiente target. Nelle fasi successive si possono introdurre monitoring, logging centralizzato e affinare i chart per ambienti multipli e scalabilità.
