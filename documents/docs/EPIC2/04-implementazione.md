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
| `/editor/:artifactId/:versionId` | Editor v0 (Monaco) con load/save; sola lettura su versioni pubblicate |
| `/publish/:artifactId/:versionId` | Publish v0 (form semplice) |

Route guards:

- autenticazione: [RequireAuth.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/routes/RequireAuth.tsx)
- tenant selection: [RequireTenant.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/routes/RequireTenant.tsx)
- fallback: utenti non autenticati → `/login`, utenti autenticati → `/home`
- post-login redirect: preserva deep link tramite `redirectTo` e storage in sessione: [postLoginRedirect.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/utils/postLoginRedirect.ts)

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

Nota: se il token espone un solo tenant, le route protette possono essere accessibili anche prima di una scelta esplicita del tenant.
Se il token espone più tenant e contiene `defaultTenantId`, la selezione può avvenire automaticamente.

---

## Integrazione con Registry API e Publisher

Client HTTP:

- wrapper `fetch` + error model: [http.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/api/http.ts)
- tipi API: [types.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/api/types.ts)

Registry API:

- query catalogo, dettaglio, versioni e presigned URL (chiavi convenzionali): [registry.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/api/registry.ts)

Publisher:

- publish + get publication: [publisher.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/api/publisher.ts)

Hooks (TanStack Query):

- catalogo: [useArtifacts.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/hooks/useArtifacts.ts)
- dettaglio: [useArtifactDetail.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/hooks/useArtifactDetail.ts)
- ambienti: [useEnvironments.ts](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/hooks/useEnvironments.ts)

---

## Editor v0

L’editor v0 implementa un flusso minimale:

1. carica `Artifact` e `ArtifactVersion`,
2. per PROCESS/RULE/FORM/REQUEST, ottiene un presigned download URL e scarica il contenuto (file di default per tipo),
3. al salvataggio, ottiene un presigned upload URL e carica il payload,
4. non è necessario aggiornare alcun `payloadRef` nel DB (la chiave è deterministica per convenzione).

### Editor Monaco (per payload testuali)

Per artefatti con payload testuali (JSON, XML, YAML), l'editor v0 utilizza **Monaco Editor**:

Implementazione: [EditorPage.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/pages/EditorPage.tsx)

### Editor StillumForms (per artefatti FORM)

Per artefatti di tipo **FORM**, l'implementazione include l'integrazione con **StillumForms Editor**, una libreria proprietaria per la definizione di moduli:

- Libreria: `@tecnosys/stillum-forms-editor` (v1.4.0-alpha.4)
- Librerie correlate:
  - `@tecnosys/stillum-forms-core`: Core library per StillumForms
  - `@tecnosys/stillum-forms-react`: Componenti React per StillumForms
- Implementazione: [StillumFormsEditorTab.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/form-editor/components/StillumFormsEditorTab.tsx)

Nota: L'implementazione v0 fornisce editazione base per i form. Validazioni avanzate e funzionalità complete verranno introdotte in iterazioni successive.

---

## Pubblicazione v0

Publish v0 carica la lista ambienti dal Registry (`GET /api/tenants/{tenantId}/environments`), invoca il Publisher e mostra l’esito base (id + bundleRef). A successo, ritorna automaticamente al dettaglio dell’artefatto:

- [PublishPage.tsx](file:///Users/spistillo/Documents/DEV/stillum-business-central/portal-ui/src/pages/PublishPage.tsx)
