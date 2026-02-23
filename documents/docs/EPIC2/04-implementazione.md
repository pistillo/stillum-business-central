---
id: epic2-implementazione
title: Implementazione Fase 2 – Portal UI (v0)
sidebar_label: Implementazione
---

## Struttura del progetto

- App UI: `portal-ui/`
- Pagina root e routing: [App.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/App.tsx)
- Config runtime: [config.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/config.ts)

---

## Routing (v0)

| Rotta | Descrizione |
|------|-------------|
| `/login` | Avvia login OIDC |
| `/oidc/callback` | Completa callback OIDC |
| `/select-tenant` | Selezione tenant (o fallback manuale) |
| `/home` | Dashboard v0 (quick links) |
| `/catalogue` | Catalogo artefatti (filtri + paginazione) |
| `/catalogue/new` | Creazione artefatto + prima versione |
| `/artifact/:id` | Dettaglio artefatto + versioni |
| `/editor/:artifactId/:versionId` | Editor v0 (testuale) con load/save |
| `/publish/:artifactId/:versionId` | Publish v0 (form semplice) |

Route guards:

- autenticazione: [RequireAuth.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/routes/RequireAuth.tsx)
- tenant selection: [RequireTenant.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/routes/RequireTenant.tsx)

---

## Autenticazione OIDC (Keycloak)

- Provider OIDC: [AuthContext.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/auth/AuthContext.tsx)
- Login: [LoginPage.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/pages/LoginPage.tsx)
- Callback: [OidcCallbackPage.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/pages/OidcCallbackPage.tsx)

Variabili `VITE_*` rilevanti:

- `VITE_OIDC_AUTHORITY`
- `VITE_OIDC_CLIENT_ID`
- `VITE_OIDC_SCOPE`
- `VITE_OIDC_REDIRECT_URI`
- `VITE_OIDC_POST_LOGOUT_REDIRECT_URI`

---

## Multi-tenancy (tenant selection)

- Contesto tenant + persistenza: [TenantContext.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/tenancy/TenantContext.tsx)
- Decode/estrazione tenant da JWT: [jwt.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/utils/jwt.ts)
- UI selezione tenant: [SelectTenantPage.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/pages/SelectTenantPage.tsx)

---

## Integrazione con Registry API e Publisher

Client HTTP:

- wrapper `fetch` + error model: [http.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/api/http.ts)
- tipi API: [types.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/api/types.ts)

Registry API:

- query catalogo, dettaglio, versioni, presigned URL e `payloadRef`: [registry.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/api/registry.ts)

Publisher:

- publish + get publication: [publisher.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/api/publisher.ts)

Hooks (TanStack Query):

- catalogo: [useArtifacts.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/hooks/useArtifacts.ts)
- dettaglio: [useArtifactDetail.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/hooks/useArtifactDetail.ts)

---

## Editor v0 (testuale)

L’editor v0 implementa un flusso minimale:

1. carica `Artifact` e `ArtifactVersion`,
2. se `payloadRef` è presente, ottiene presigned download URL e scarica il contenuto,
3. al salvataggio, ottiene presigned upload URL e carica il payload,
4. aggiorna `payloadRef` della versione.

Implementazione: [EditorPage.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/pages/EditorPage.tsx)

---

## Pubblicazione v0

Publish v0 invoca il Publisher e mostra l’esito base (id + bundleRef):

- [PublishPage.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/pages/PublishPage.tsx)

