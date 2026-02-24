---
id: epic2-modello-dati
title: Modello dati Fase 2 – Portal UI (v0)
sidebar_label: Modello dati
---

## Contesto

EPIC 2 non introduce nuove tabelle DB: la UI consuma i modelli esposti da Registry API e Publisher e mantiene solo stato locale minimo (tenant selezionato e sessione OIDC).

---

## Stato applicativo

### Autenticazione

- OIDC: gestito via `oidc-client-ts` con storage di sessione (sessionStorage).
- Token: usato per inviare `Authorization: Bearer <token>` verso le API.

### Tenant selection

- `tenantId`: persistito in `localStorage` con chiave `stillum.tenantId`.
- `availableTenantIds`: derivato dal JWT a partire da claim array top-level (`tenants`, `tenant_ids`, `tenantIds`, `stillum_tenants`) e/o pattern su array top-level (`groups`/`roles`), con fallback a inserimento manuale.
- `defaultTenantId` (opzionale): se presente nel JWT e incluso in `availableTenantIds`, viene usato per la selezione automatica quando l’utente ha più tenant.

### Post-login redirect

- `stillum.postLoginRedirect`: persistito in `sessionStorage` per preservare i deep link tra redirect a `/login`, callback OIDC e selezione tenant.

---

## Tipi consumati dalla UI

La UI usa tipizzazioni TypeScript allineate ai DTO REST:

- `Artifact` (metadati)
- `ArtifactVersion` (versioni e `payloadRef`)
- `PresignedUrlResponse` (`url`, `key/objectKey`)
- `Publication` (esito publish)
- `ArtifactStatus` e `VersionState` includono più stati oltre `DRAFT/PUBLISHED` (es. `REVIEW`, `APPROVED`, `RETIRED`), anche se la v0 ne usa solo una parte.

Definizioni: `portal-ui/src/api/types.ts`.
