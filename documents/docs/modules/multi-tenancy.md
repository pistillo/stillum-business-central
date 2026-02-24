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

## Tenant Context (IAM/JWT)

- La Portal UI deriva i tenant disponibili dal token OIDC:
  - `tenantIds`: lista dei tenant assegnati all’utente.
  - `defaultTenantId` (opzionale): tenant predefinito quando l’utente è associato a più tenant.
- Se `defaultTenantId` è presente e fa parte di `tenantIds`, la UI seleziona automaticamente quel tenant; altrimenti richiede una scelta esplicita.
- Il `tenantId` selezionato viene salvato lato client e usato per costruire le chiamate alle API (`/api/tenants/{tenantId}/...`).

### Enforcement DB (RLS)

- L’isolamento non deve dipendere solo dai filtri applicativi: le tabelle multi-tenant usano Row-Level Security basata su `current_setting('app.current_tenant', true)`.
- Nei servizi Quarkus che accedono al DB, il `tenantId` estratto dalla path viene propagato al DB ad ogni transazione con `set_config('app.current_tenant', ..., true)`.
- In test (Dev Services) l’utente DB può essere superuser e bypassare RLS: si usa un ruolo applicativo senza bypass (`stillum_app`) con `SET LOCAL ROLE stillum_app` per rendere i test affidabili.

## Provisioning e Onboarding

- API per creare un nuovo tenant, preconfigurare gli ambienti (DEV, QA, PROD) e assegnare un amministratore.
- Funzioni per importare template di processi/regole/moduli all’avvio di un tenant.

## Scalabilità

- Il sistema deve poter supportare un numero elevato di tenant con carichi variabili.
- Strategia di sharding o scaling orizzontale del runtime e del database per mantenere le performance.
