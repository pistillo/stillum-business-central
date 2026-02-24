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

## Sviluppo applicativo

Oltre all'infrastruttura, la piattaforma include quattro servizi applicativi. Esistono **due modalità** di esecuzione:

### Modalità 1 – Dev mode (sviluppo quotidiano, hot-reload)

Avvia prima l'infrastruttura, poi ogni servizio nel proprio terminale:

```bash
# Terminale 1 – infrastruttura
docker compose up -d       # oppure: make infra

# Terminale 2 – registry-api (porta 8081)
cd registry-api && mvn quarkus:dev    # oppure: make dev-registry

# Terminale 3 – publisher (porta 8082)
cd publisher && mvn quarkus:dev       # oppure: make dev-publisher

# Terminale 4 – runtime-gateway (porta 8080)
cd runtime-gateway && mvn quarkus:dev # oppure: make dev-gateway

# Terminale 5 – portal-ui (porta 5173, Vite HMR)
cd portal-ui && npm run dev              # oppure: make dev-ui
```

Quarkus dev mode offre hot-reload automatico, testing continuo e la Dev UI su `http://localhost:<porta>/q/dev`. **È la modalità consigliata per lo sviluppo attivo.**

### Modalità 2 – Full-stack mode (smoke test e integrazione)

Costruisce e avvia **tutti** i container (infra + app) con un solo comando:

```bash
docker compose -f docker-compose.yml -f docker-compose.full.yml up --build
# oppure: make full-stack
```

**Porte esposte sull'host:**

| Servizio | Porta host | Note |
|---|---|---|
| PostgreSQL | `5432` | DB condiviso |
| MinIO API | `9000` | Object storage |
| MinIO Console | `9001` | UI web MinIO |
| Temporal | `7233` | Workflow engine |
| Keycloak | `8080` | OIDC / IAM |
| registry-api | `8081` | REST + Swagger UI su `/q/swagger-ui` |
| publisher | `8082` | REST + Swagger UI su `/q/swagger-ui` |
| runtime-gateway | `8083` | Gateway (porta interna 8080) |
| portal-ui | `3000` (full-stack) / `5173` (dev) | SPA nginx / Vite |

Per fermare tutto: `make down` oppure `docker compose -f docker-compose.yml -f docker-compose.full.yml down`.

### Makefile – comandi utili

Dalla root del repository è disponibile un `Makefile` con target predefiniti:

```bash
make help          # elenco di tutti i target disponibili
make infra         # solo infrastruttura (docker compose up -d)
make dev-registry  # registry-api in Quarkus dev mode
make dev-publisher # publisher in Quarkus dev mode
make dev-gateway   # runtime-gateway in Quarkus dev mode
make dev-ui        # portal-ui con Vite dev server
make full-stack    # stack completo (build + avvio)
make down          # ferma e rimuove tutti i container
make test-ui       # test frontend (vitest)
```

---

## Note finali

Il `docker-compose.yml` è intenzionalmente limitato ai servizi infrastrutturali: rimane leggero, riutilizzabile in CI e stabile tra ambienti. Il file `docker-compose.full.yml` estende quello base solo per uso locale (smoke test e integrazione). Con k3s e Helm si replica l'ambiente target di produzione. Nelle fasi successive si possono introdurre monitoring, logging centralizzato e affinare i chart per ambienti multipli e scalabilità.
