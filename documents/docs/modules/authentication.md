---
id: modules-authentication
title: Autenticazione e Autorizzazione
sidebar_label: Autenticazione e Autorizzazione
---

La piattaforma deve garantire che solo gli utenti autorizzati possano accedere alle funzioni appropriate per il proprio ruolo e tenant.

## Autenticazione

- Integrazione con un provider esterno (es. Keycloak, Auth0, Azure AD) tramite OIDC.
- Supporto per single sign-on e multi-tenant: il token deve contenere ruoli e contesto di tenancy:
  - `tenantIds`: lista dei tenant a cui l’utente può accedere.
  - `defaultTenantId` (opzionale): tenant predefinito da usare quando `tenantIds` contiene più valori.
- Supporto per inviti utente e reset password.

## Autorizzazione

- **Ruoli predefiniti**:
  - **Analyst**: può creare e modificare artefatti in bozza.
  - **Process Owner**: può approvare e pubblicare artefatti.
  - **Viewer**: può leggere artefatti e istanze, ma non modificarli.
  - Altri ruoli specifici (es. Developer) possono essere aggiunti.
- **Scope tenant**: ogni azione è limitata al tenant attuale.
- **ACL sui singoli artefatti**: opzionalmente, restrizioni più granulari sul singolo asset.

## Gestione Utenti

- Funzionalità per invitare nuovi utenti, assegnare ruoli e gestire gruppi.
- Supporto per l’amministrazione del tenant da parte di un superuser.
