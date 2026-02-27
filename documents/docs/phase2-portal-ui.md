---
slug: phase2-portal-ui
title: Progettazione del Portal UI – Fase 2
---

Questa pagina dettaglia la progettazione del **Portal UI** per la Fase 2, evidenziando le principali sezioni, i flussi di interazione e le integrazioni con i servizi di backend.  L’obiettivo è fornire una base solida su cui costruire le funzionalità nelle fasi successive.

## Architettura front‑end

### Framework e librerie

* **React + Vite**: utilizzato come libreria principale e toolchain (build/dev server) per la composizione dell’interfaccia.
* **React Router**: routing client‑side e protezione rotte.
* **TanStack Query**: gestione delle chiamate REST e cache dei dati provenienti da Registry API e Publisher.
* **OIDC (Keycloak)**: login tramite redirect OIDC (Authorization Code + PKCE) gestito da `oidc-client-ts`.
* **Monaco Editor**: editor testuale per payload XML/JSON, con supporto YAML per artefatti JSON-based (Forms/Requests).

### Stato implementazione (Portal UI v0)

Nel repository è presente una prima implementazione operativa (v0) che copre:

* Routing, layout e route guard (autenticazione e selezione tenant).
* Catalogo artefatti (lista con filtri base e paginazione).
* Dettaglio artefatto (metadati + lista versioni).
* Editor v0 (Monaco) con load/save tramite presigned URL e aggiornamento `payloadRef` (JSON/YAML o XML).
* Pubblicazione v0 (form semplice che invoca il Publisher, seleziona ambiente da Registry e torna al dettaglio artefatto a successo).

### Struttura delle pagine

| Percorso | Descrizione |
|---------|-------------|
| **`/login`** | Pagina di login che reindirizza al provider IAM (Keycloak). Preserva i deep link tramite `redirectTo` e, a login completato, riporta l’utente alla pagina richiesta. |
| **`/oidc/callback`** | Endpoint di callback tecnico per completare il flusso OIDC (gestito automaticamente dalla UI dopo il login). |
| **`/select-tenant`** | Pagina in cui l’utente sceglie tra i tenant a cui è assegnato. Se è presente un `defaultTenantId` nel token, o se esiste un solo tenant disponibile, la selezione è automatica. |
| **`/home`** | Dashboard con le bozze dell’utente, i processi recenti, i task assegnati (futuro) e i link rapidi (crea nuovo artefatto, vai al catalogo, vedi errori). |
| **`/catalogue`** | Lista paginata degli artefatti del tenant.  Possibilità di filtrare per tipo (processo, regola, modulo, request), stato (bozza, pubblicato), area e tag. |
| **`/catalogue/new`** | Pagina per la creazione di una nuova bozza di artefatto, con form iniziale (tipo, titolo, area, tag) che reindirizza poi all’editor. |
| **`/artifact/:id`** | Pagina dettaglio dell’artefatto con metadati, elenco versioni (bozze e pubblicate), pulsanti per modificare la bozza o avviare la pubblicazione. |
| **`/editor/:id/:version`** | Vista editor per una specifica versione. Carica il file dal `payloadRef` e permette il salvataggio solo se la versione non è `PUBLISHED` (sola lettura sulle versioni pubblicate). |
| **`/publish/:id/:version`** | Form di pubblicazione che consente di selezionare l’ambiente (lista dal Registry) e invoca il Publisher. A successo, torna automaticamente al dettaglio dell’artefatto. |

Le rotte devono essere protette: solo utenti autenticati possono accedervi.  L’assenza di un `tenantId` nell’applicazione reindirizza l’utente alla selezione del tenant.

### Gestione dello stato e API

* **Context Provider**: definire un contesto React che contenga il `tenantId`, le informazioni dell’utente loggato (ruoli, username) e le impostazioni globali (lingua).  Questo contesto verrà utilizzato nei componenti per passare automaticamente il `tenantId` alle API.
* **Hooks per la Registry API**: implementare hook personalizzati (`useArtifacts`, `useArtifactVersions`, `useCreateArtifact`, …) che incapsulino le chiamate alla Registry.  Questi hook usano React Query per caching, refetching e gestione degli errori.
* **Hook per il Publisher**: implementare `usePublish` che invoca l’endpoint di pubblicazione.  Gestisce lo stato di loading e restituisce eventuali errori di validazione.

### Flusso di creazione e modifica

1. **Nuovo artefatto**: dalla dashboard o dal catalogo l’utente clicca “Nuovo Artefatto”.  Si apre un form modale dove seleziona il tipo (processo/regola/modulo/request), inserisce titolo, area e tag.  Al submit viene invocato `POST /artifacts` e si viene reindirizzati all’editor (`/editor/<id>/<version>`).
2. **Modifica bozza**: nell’editor l’utente opera con lo strumento appropriato (bpmn, dmn, form builder, request JSON).  Al salvataggio, viene caricato il file su MinIO/S3 (tramite un presigned URL) e aggiornata la versione via `PUT /versions/{version}`.  I salvataggi parziali possono essere automatizzati a intervalli regolari.
3. **Gestione dipendenze**: per processi e regole, l’editor può consentire la selezione di altre versioni come dipendenze (es. inserimento di regole nel processo).  Al salvataggio, queste dipendenze vengono inviate con `POST /dependencies`.
4. **Pubblicazione**: dalla pagina del dettaglio o dall’editor, l’utente process owner può avviare il wizard di pubblicazione.  Dopo aver selezionato l’ambiente, viene chiamato `POST /publish` e mostrato lo stato (successo/fallimento) con eventuali messaggi di validazione.

### Stile e accessibilità

* **Responsive design**: usare griglie flessibili e componenti che si adattano a vari formati (desktop, tablet, mobile).  Evitare overflow orizzontali.
* **Accessibilità**: tutti i componenti devono avere etichette ARIA dove necessario, contrasto cromatico sufficiente e supporto alla navigazione via tastiera.
* **Localizzazione**: tutti i testi dell’interfaccia devono passare attraverso un sistema di traduzioni.  In questa fase si prevedono almeno italiano e inglese.

### Integrazione dell’autenticazione

Per la prima versione dell’UI si prevede una **single sign‑on** tramite Keycloak:

* Il portale è registrato come client OIDC in Keycloak.
* L’utente viene rediretto a Keycloak per il login; al ritorno riceve un JWT che contiene ruoli e tenant disponibili.
* La UI decodifica il JWT per ricavare i tenant (`tenantIds`) ed eventuale `defaultTenantId`. Se necessario propone `select-tenant`. Il token viene salvato in sessione e usato in ogni richiesta come header `Authorization: Bearer <token>`.
* Le route guard preservano il deep link iniziale tramite `redirectTo` e lo ripristinano dopo login e selezione tenant.

#### Configurazione runtime (env)

La Portal UI v0 usa variabili `VITE_*`:

* `VITE_REGISTRY_API_BASE_URL` (default `http://localhost:8081/api`)
* `VITE_PUBLISHER_API_BASE_URL` (default `http://localhost:8082/api`)
* `VITE_OIDC_AUTHORITY` (issuer/realm Keycloak)
* `VITE_OIDC_CLIENT_ID`
* `VITE_OIDC_SCOPE` (default `openid profile email`)
* `VITE_OIDC_REDIRECT_URI` (default `${window.location.origin}/oidc/callback`)
* `VITE_OIDC_POST_LOGOUT_REDIRECT_URI` (default `${window.location.origin}/login`)

Nota: l’estrazione dei tenant dal token è implementata in modo “tollerante” (supporta claim array come `tenants/tenantIds` o pattern in `groups`), con fallback a inserimento manuale del tenantId se assente. Il `defaultTenantId` (se presente) viene usato come selezione automatica quando l’utente ha più tenant.

## Considerazioni future

La Fase 2 fornisce una UI minima ma utilizzabile.  I prossimi miglioramenti includeranno:

* **Gestione completa dei task** (lista, assegnazione, completamento, scadenze), integrata con il runtime Temporal.
* **Sistema di notifiche in real time** (via WebSocket o SSE) per aggiornare la UI quando cambiano i dati (es. nuova pubblicazione, pratica in errore).
* **Personalizzazione e permessi granulari**: possibilità di mostrare/nascondere sezioni in base al ruolo e di configurare le viste per utente.
