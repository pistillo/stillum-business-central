# Stillum Business Portal

Piattaforma per la gestione di artefatti (processi BPMN, regole DMN, moduli, request), pubblicazione su ambienti (DEV/QA/PROD) e orchestrazione con Temporal.

## Struttura del repository

- **portal-ui/** – frontend React (Vite, TypeScript)
- **registry-api/** – API artefatti e versioni (Java Quarkus)
- **publisher/** – servizio di pubblicazione (Java Quarkus)
- **runtime-gateway/** – interfaccia con Temporal (Java Quarkus)
- **documents/** – documentazione (Docusaurus)
- **charts/** – Helm chart per deploy su Kubernetes
- **scripts/** – script di inizializzazione (DB, MinIO)

## Avvio ambiente locale

Servizi base (PostgreSQL, MinIO, Temporal):

```bash
docker compose up -d
```

Verificare i servizi con `docker compose ps`. Credenziali e porte in [.env.example](.env.example) (copiare in `.env` se necessario).

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
