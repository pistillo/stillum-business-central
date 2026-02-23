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
- `availableTenantIds`: derivato dal JWT (claim array oppure pattern in `groups`/`roles`), con fallback a inserimento manuale.

---

## Tipi consumati dalla UI

La UI usa tipizzazioni TypeScript allineate ai DTO REST:

- `Artifact` (metadati)
- `ArtifactVersion` (versioni e `payloadRef`)
- `PresignedUrlResponse` (`url`, `key/objectKey`)
- `Publication` (esito publish)

Definizioni: `portal-ui/src/api/types.ts`.

