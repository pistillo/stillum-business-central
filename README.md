# Stillum Business Portal

Piattaforma per la gestione di artefatti (processi BPMN, regole DMN, moduli, request), pubblicazione su ambienti (DEV/QA/PROD) e orchestrazione con Temporal.

## Struttura del repository

- **portal-ui/** – frontend React (Vite, TypeScript)
- **registry-api/** – API artefatti e versioni (Java Quarkus)
- **publisher/** – servizio di pubblicazione (Java Quarkus)
- **documents/** – documentazione (Docusaurus)
- **charts/** – Helm chart per deploy su Kubernetes
- **scripts/** – script di inizializzazione (DB, MinIO)

## Avvio ambiente locale

Servizi base (PostgreSQL, MinIO, Keycloak, Nexus, APISIX):

```bash
docker compose up -d
```

Verificare i servizi con `docker compose ps`. Credenziali e porte in [.env.example](.env.example) (copiare in `.env` se necessario).

## Full stack locale (con servizi applicativi)

Per avviare anche i servizi applicativi (registry-api, publisher, portal-ui, npm-build-service, stillum-theia):

```bash
docker compose up
```

Punto di accesso unico API/OIDC tramite APISIX: `http://localhost:9080`
Portal UI in dev mode: `http://localhost:9080/`
Stillum Theia in dev mode: `http://localhost:9080/theia`

### Configurazione Nexus (per npm-build-service)

Al primo avvio Nexus genera una password casuale per l'utente `admin`. Per ottenerla:

```bash
docker exec stillum-nexus cat /nexus-data/admin.password
```

Se la password è stata dimenticata, puoi resettarla a `admin123`:

```bash
./scripts/reset-nexus-admin-password.sh
```

Impostare poi la variabile d'ambiente e riavviare `npm-build-service`:

```bash
export NEXUS_PASSWORD=<password_copiata>
docker compose up -d npm-build-service
```

### Backup e ripristino Nexus

Creare un backup del volume Nexus (salvato in `backup/nexus/`):

```bash
./scripts/backup-nexus.sh
```

Ripristinare Nexus da backup (es. dopo un reset del DB):

```bash
./scripts/restore-nexus-from-backup.sh
# oppure specificando il file: ./scripts/restore-nexus-from-backup.sh backup/nexus/nexus-data-YYYYMMDD-HHMMSS.tar.gz
```

Via Docker Compose (Nexus deve essere fermo):

```bash
docker compose stop nexus
docker compose -f docker-compose.yml -f docker-compose.nexus-restore.yml run --rm nexus-restore
docker compose up -d nexus
```

## Documentazione

La documentazione (piano di sviluppo, EPIC 0, architettura, moduli) è in **documents/**:

```bash
cd documents
pnpm install
pnpm start
```

Apri [http://localhost:3000](http://localhost:3000). Per build di produzione: `pnpm build`.

## Link utili

- [Introduzione](documents/docs/intro.md)
- [Piano di Sviluppo](documents/docs/piano-di-sviluppo.md)
- [EPIC 0 – Setup e Fondamenta](documents/docs/EPIC0/00-stato-epic-0.md)
- [Ambiente di sviluppo](documents/docs/EPIC0/05-ambiente-di-sviluppo.md)
