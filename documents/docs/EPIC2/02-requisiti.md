---
id: epic2-requisiti
title: Requisiti Fase 2 – Portal UI (v0)
sidebar_label: Requisiti
---

## Requisiti funzionali

### Autenticazione (OIDC)

- La UI deve supportare login via provider OIDC (Keycloak) con redirect e callback.
- Il token deve essere usato per chiamare le API con header `Authorization: Bearer <token>`.
- Le rotte applicative devono essere protette: se non autenticato → redirect a `/login`.

### Selezione tenant

- Se il token contiene più tenant, la UI deve far scegliere il tenant su `/select-tenant`.
- Il tenant selezionato deve essere persistito localmente e propagato su tutte le chiamate (`/api/tenants/{tenantId}/...`).
- Se il token non contiene tenant, è accettabile un fallback (inserimento manuale del `tenantId`) per la v0.

### Catalogo e dettaglio

- `/catalogue` deve mostrare la lista paginata degli artefatti del tenant.
- Filtri richiesti in v0: type, status, area, tag.
- Navigazione al dettaglio `/artifact/:id` con metadati e lista versioni.

### Creazione e modifica bozza

- È possibile creare un nuovo artefatto dal portale e creare la prima versione in bozza.
- L’editor v0 deve consentire:
  - caricamento del payload via presigned download URL (se `payloadRef` è presente),
  - salvataggio tramite presigned upload URL e aggiornamento `payloadRef`.

### Pubblicazione

- `/publish/:id/:version` deve consentire la pubblicazione della versione su un environment.
- In v0 è accettabile una UX semplificata (form con `environmentId` e `notes`) e un feedback base di successo/fallimento.

---

## Requisiti non funzionali

- **Sicurezza**: nessun token deve essere loggato a console; usare storage di sessione per l’utente OIDC e localStorage solo per `tenantId`.
- **Affidabilità**: gestione errori e stati di loading per tutte le chiamate API.
- **Accessibilità**: v0 deve usare elementi semanticamente corretti (heading, label) e supportare navigazione base.
- **Configurabilità**: endpoint backend e parametri OIDC devono essere configurabili via variabili `VITE_*`.

---

## Note su ricerca full-text

- La strategia di ricerca full-text (Postgres FTS vs motore dedicato come Elastic/OpenSearch) è posticipata.
- In v0 è accettabile avere solo filtri e paginazione; una barra “q=” potrà essere aggiunta dopo la decisione architetturale.

