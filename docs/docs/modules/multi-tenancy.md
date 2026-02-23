---
id: modules-multi-tenancy
title: Multi-tenancy
sidebar_label: Multi-tenant
---

La piattaforma è concepita per supportare più tenant (aziende) con isolamento dei dati e configurazioni separate.

## Modello di Tenancy

- **Tenant** come entità primaria: ogni tenant possiede artefatti, utenti, ambienti e istanze.
- Database condiviso con `tenantId` su ogni tabella e enforcement tramite Row Level Security.
- Possibilità di configurare namespace Temporal per tenant o utilizzare un namespace condiviso con `tenantId` nel workflowId.

## Isolamento

- Gli utenti di un tenant non devono poter vedere artefatti, istanze o configurazioni di altri tenant.
- Configurazioni (es. ambienti, S3 bucket, provider IAM) possono essere uniche per tenant.

## Provisioning e Onboarding

- API per creare un nuovo tenant, preconfigurare gli ambienti (DEV, QA, PROD) e assegnare un amministratore.
- Funzioni per importare template di processi/regole/moduli all’avvio di un tenant.

## Scalabilità

- Il sistema deve poter supportare un numero elevato di tenant con carichi variabili.
- Strategia di sharding o scaling orizzontale del runtime e del database per mantenere le performance.