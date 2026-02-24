---
id: epic2-stato
title: Stato EPIC 2 – Portal UI (v0)
sidebar_label: Stato EPIC 2
---

# Stato EPIC 2 – Portal UI (v0)

**Obiettivo dell'EPIC:** Realizzare la prima interfaccia web operativa con autenticazione, selezione tenant, catalogo, editor e pubblicazione.

**Contesto:** La UI vive nel progetto `portal-ui/` e integra **Registry API** (`registry-api`) e **Publisher** (`publisher`) tramite chiamate REST con `Authorization: Bearer <token>`.

**Stato complessivo:** **Parzialmente implementato** — disponibili login OIDC, selezione tenant (con auto-select via `defaultTenantId`), home v0, catalogo, dettaglio artefatto, creazione bozza, editor v0 (Monaco) con presigned URL e pubblicazione v0 (scelta ambiente da Registry + redirect automatico al dettaglio). Restano da completare editor BPMN/DMN/forms “real”, wizard publish multi-step, i18n/toast/error boundary e decisione su ricerca full-text.

---

## Riepilogo per FEATURE

| FEATURE | Stato | Note |
|--------|--------|------|
| **2.1** Autenticazione e Selezione Tenant | ✅ Completato | OIDC + tenant selection + claim `tenantIds`/`defaultTenantId` (Keycloak) + deep-link `redirectTo` + test unitari completi |
| **2.2** Dashboard | ✅ Completato | Home con sezioni “Le mie bozze” e “Ultime pubblicazioni” + hook dedicati + test unitari |
| **2.3** Catalogo Artefatti | 🟡 Parziale | Lista paginata con filtri type/status/area/tag; full-text posticipata |
| **2.4** Editor Integrati | 🔴 Mancante (v0 testuale) | Editor v0 usa Monaco (XML/JSON) con load/save; mancano embed BPMN/DMN/forms e auto-save |
| **2.5** Pubblicazione Guidata | 🟡 Parziale | Publish v0 è form semplice con dropdown ambienti (da Registry) e redirect al dettaglio; mancano step e gestione errori validazione dettagliata |
| **2.6** Infrastruttura UI | 🟡 Parziale | Layout+router presenti; mancano i18n, toast, error boundary, audit a11y |

---

## Dettaglio per FEATURE e Task (EPIC 2)

### FEATURE 2.1 – Autenticazione e Selezione Tenant

**Stato (worktree):** ✅ Completato (100%).

#### US-2.1.1 – Login con provider IAM

| Task | Stato | Evidenza |
|------|--------|----------|
| T-2.1.1.1 | ✅ | Progetto `portal-ui/` basato su React+Vite |
| T-2.1.1.2 | ✅ | Client `portal-ui` importato nel realm `stillum` + claim `tenantIds` e `defaultTenantId` (vedi `keycloak/stillum-realm.json`) |
| T-2.1.1.3 | ✅ | Pagina `/login` con redirect OIDC |
| T-2.1.1.4 | ✅ | Callback OIDC e gestione sessione utente |
| T-2.1.1.5 | ✅ | Header `Authorization: Bearer` su chiamate API |
| T-2.1.1.6 | ✅ | Route guard autenticazione |
| T-2.1.1.7 | ✅ | Test unitari: jwt.ts (19 test) + TenantContext (10 test) + AuthFlow esistente |

#### US-2.1.2 – Selezione tenant

| Task | Stato | Evidenza |
|------|--------|----------|
| T-2.1.2.1 | ✅ | Pagina `/select-tenant` |
| T-2.1.2.2 | ✅ | Tenant context provider con persistenza locale |
| T-2.1.2.3 | ✅ | Tenant unico: accesso consentito e selezione automatica supportata |
| T-2.1.2.3b | ✅ | Tenant multipli: selezione automatica se `defaultTenantId` è presente nel token |
| T-2.1.2.4 | ✅ | Propagazione tenantId alle API (path) |

---

### FEATURE 2.2 – Dashboard

#### US-2.2.1 – Home page del portale

| Task | Stato | Evidenza |
|------|--------|----------|
| T-2.2.1.1 | ✅ | Pagina `/home` |
| T-2.2.1.2 | ✅ | Sezione “Le mie bozze” con lista artefatti DRAFT e link al dettaglio |
| T-2.2.1.3 | ✅ | Sezione “Ultime pubblicazioni” con lista artefatti PUBLISHED e link al dettaglio |
| T-2.2.1.4 | ✅ | Quick links: “Vai al catalogo” e “Nuovo artefatto” |
| T-2.2.1.5 | ✅ | Hook `useMyDrafts` e `useRecentPublications` in `portal-ui/src/hooks/` + test unitari |

---

### FEATURE 2.3 – Catalogo Artefatti

#### US-2.3.1 – Navigazione e ricerca artefatti

| Task | Stato | Evidenza |
|------|--------|----------|
| T-2.3.1.1 | ✅ | Pagina `/catalogue` con tabella e paginazione |
| T-2.3.1.2 | ✅ | Filtri type/status/area/tag |
| T-2.3.1.3 | 🟡 | Barra full-text: decisione tecnologia posticipata (UI non implementata) |
| T-2.3.1.4 | ✅ | Hook `useArtifacts` |
| T-2.3.1.5 | ✅ | Navigazione al dettaglio artefatto |

#### US-2.3.2 – Dettaglio artefatto

| Task | Stato | Evidenza |
|------|--------|----------|
| T-2.3.2.1 | ✅ | Pagina `/artifact/:id` con metadati e lista versioni |
| T-2.3.2.2 | 🟡 | Metadati base; owner/date da completare |
| T-2.3.2.3 | ✅ | Lista versioni e stato |
| T-2.3.2.4 | ✅ | Link a editor v0 |
| T-2.3.2.5 | ✅ | Link a publish v0 |
| T-2.3.2.6 | 🟡 | `useArtifactDetail` presente; `useArtifactVersions` separato da introdurre se utile |

---

### FEATURE 2.4 – Editor Integrati

| US | Stato | Note |
|----|------|------|
| US-2.4.1 BPMN | 🔴 | Non integrato (solo editor testuale v0) |
| US-2.4.2 DMN | 🔴 | Non integrato (solo editor testuale v0) |
| US-2.4.3 Forms | 🔴 | Non integrato (solo editor testuale v0) |
| US-2.4.4 Request | 🔴 | Non integrato (solo editor testuale v0) |
| US-2.4.5 Creazione nuovo artefatto | ✅ | Creazione artefatto + prima versione e redirect editor |

---

### FEATURE 2.5 – Pubblicazione Guidata

| Task | Stato | Evidenza |
|------|--------|----------|
| T-2.5.1.1 | 🟡 | Pagina `/publish/:id/:version` presente ma non è wizard multi-step |
| T-2.5.1.2–T-2.5.1.6 | 🔴 | Step preview/validazione/ambiente/conferma/esito dettagliato mancanti |
| T-2.5.1.7 | 🟡 | Chiamata `POST /api/tenants/{tenantId}/publish` presente; hook dedicato da introdurre |

---

### FEATURE 2.6 – Infrastruttura UI

| Task | Stato | Evidenza |
|------|--------|----------|
| T-2.6.1.1 | 🟡 | Layout base con sidebar; header e component library da completare |
| T-2.6.1.2 | ✅ | Router + protezione rotte |
| T-2.6.1.3 | 🔴 | i18next non configurato |
| T-2.6.1.4 | 🔴 | Toast/banner non implementati |
| T-2.6.1.5 | 🔴 | Error boundary globale non implementato |
| T-2.6.1.6–T-2.6.1.7 | 🔴 | Audit responsive/a11y da fare |

---

## Deliverable prodotti (in questo worktree)

| Deliverable EPIC 2 | Dove si trova |
|--------------------|---------------|
| App Portal UI (React+Vite) | `portal-ui/` |
| Routing, auth OIDC, tenant context | `portal-ui/src/App.tsx`, `portal-ui/src/auth/`, `portal-ui/src/tenancy/` |
| Catalogo/dettaglio/bozza/editor v0/publish v0 | `portal-ui/src/pages/` |
| Client API Registry/Publisher | `portal-ui/src/api/` |
