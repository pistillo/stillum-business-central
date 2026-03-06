---
id: modules-portal-ui
title: Portale Utente
sidebar_label: Portale UI
---

Il **Portale UI** rappresenta il punto di accesso per gli utenti. Nel worktree corrente è una web app **React + Vite** con integrazione OIDC (Keycloak), contesto tenant, catalogo, editor e pubblicazione.

## Funzionalità

- **Login OIDC + selezione tenant**: flusso login/callback e selezione tenant (claim `tenantIds` e `defaultTenantId`).
- **Home (v0)**: sezioni “Le mie bozze” e “Ultime pubblicazioni”.
- **Catalogo**: lista filtrabile/paginata per tipo/stato/area/tag (include `MODULE` e `COMPONENT`).
- **Dettaglio artefatto**: metadati base e lista versioni con azioni (edit/publish).
- **Editor**:
  - XML (PROCESS/RULE): Monaco editor.
  - JSON/YAML (REQUEST): Monaco editor.
  - FORM: tab visuale StillumForms + tab JSON/YAML.
  - MODULE/COMPONENT: editor avanzato via **Stillum Theia** (iframe) con salvataggio mediato dal portale.
- **Dipendenze npm (MODULE/COMPONENT)**: pannello dipendenze con ricerca su Nexus tramite `runtime-gateway` (proxy anti-CORS).
- **Pubblicazione (v0)**: form singolo step con selezione ambiente e vincolo PROD (solo versioni `APPROVED`).
- **i18n + tema**: localizzazione it/en (i18next) e toggle light/dark.

## Considerazioni

- Deve supportare la localizzazione (lingue) e l’accessibilità.
- Tutte le operazioni devono essere contestualizzate al tenant corrente.
- Deve essere responsivo e integrarsi con i sistemi di autenticazione esterni.

## Configurazione (worktree)

- `VITE_OIDC_AUTHORITY`, `VITE_OIDC_CLIENT_ID`
- `VITE_REGISTRY_API_BASE_URL` (default `http://localhost:8081/api`)
- `VITE_PUBLISHER_API_BASE_URL` (default `http://localhost:8082/api`)
- `VITE_GATEWAY_API_BASE_URL` (default `http://localhost:8083/api`)
- `VITE_THEIA_BASE_URL` (URL dell’istanza Stillum Theia da embeddare nel portale)
