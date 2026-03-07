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
- **Dipendenze npm (MODULE/COMPONENT)**: pannello dipendenze con ricerca su Nexus tramite APISIX (proxy anti-CORS).
- **Pubblicazione (v0)**: form singolo step con selezione ambiente e vincolo PROD (solo versioni `APPROVED`).
- **i18n + tema**: localizzazione it/en (i18next) e toggle light/dark.

## Considerazioni

- Deve supportare la localizzazione (lingue) e l’accessibilità.
- Tutte le operazioni devono essere contestualizzate al tenant corrente.
- Deve essere responsivo e integrarsi con i sistemi di autenticazione esterni.

## Configurazione (worktree)

- `VITE_OIDC_CLIENT_ID`
- API e Theia usano path relativi instradati da APISIX (`/api/*`, `/theia`)
