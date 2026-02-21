---
slug: phase2-portal-ui
title: Progettazione del Portal UI – Fase 2
---

Questa pagina dettaglia la progettazione del **Portal UI** per la Fase 2, evidenziando le principali sezioni, i flussi di interazione e le integrazioni con i servizi di backend.  L’obiettivo è fornire una base solida su cui costruire le funzionalità nelle fasi successive.

## Architettura front‑end

### Framework e librerie

* **React**: utilizzato come libreria principale per la composizione dell’interfaccia.  Si consiglia l’uso di **Next.js** o un altro framework che faciliti routing e server‑side rendering per migliori performance e SEO.
* **shadcn/ui**: libreria di componenti UI basata su Tailwind CSS.  Garantisce un look&feel moderno con componenti accessibili (bottoni, tabelle, modali, form, toast…).
* **React Query o SWR**: per la gestione delle chiamate REST e la cache dei dati provenienti da Registry API e Publisher.  Permette di gestire lo stato di loading, error e refreshing con semplicità.
* **bpmn-js / dmn-js / form editor**: i pacchetti bpmn.io e dmn.io vengono incapsulati in componenti React.  Per i form (StillumForms) e le request si utilizzeranno componenti custom basati su schemi JSON.
* **i18next**: per supportare la localizzazione in più lingue (italiano, inglese, etc.).

### Struttura delle pagine

| Percorso | Descrizione |
|---------|-------------|
| **`/login`** | Pagina di login che reindirizza al provider IAM (Keycloak).  Una volta autenticato, l’utente viene reindirizzato alla selezione del tenant o direttamente alla home se appartiene a un solo tenant. |
| **`/select-tenant`** | Pagina in cui l’utente sceglie tra i tenant a cui è assegnato.  Il `tenantId` selezionato viene salvato nel contesto dell’applicazione e usato in tutte le chiamate API. |
| **`/home`** | Dashboard con le bozze dell’utente, i processi recenti, i task assegnati (futuro) e i link rapidi (crea nuovo artefatto, vai al catalogo, vedi errori). |
| **`/catalogue`** | Lista paginata degli artefatti del tenant.  Possibilità di filtrare per tipo (processo, regola, modulo, request), stato (bozza, pubblicato), area e tag. |
| **`/artifact/:id`** | Pagina dettaglio dell’artefatto con metadati, elenco versioni (bozze e pubblicate), pulsanti per modificare la bozza o avviare la pubblicazione. |
| **`/editor/:id/:version`** | Vista editor per una specifica versione in bozza.  Carica il file dal `payloadRef`, apre l’editor corrispondente (BPMN, DMN, Modulo, Request) e permette il salvataggio della bozza. |
| **`/publish/:id/:version`** | Wizard di pubblicazione che mostra l’anteprima dei metadati, le dipendenze, gli errori di validazione restituiti dal Publisher e consente di selezionare l’ambiente. |

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
* La UI decodifica il JWT per ricavare i tenant e, se ce n’è più di uno, propone la pagina `select-tenant`.  Il token viene salvato in sessione e usato in ogni richiesta come header `Authorization: Bearer <token>`.

## Considerazioni future

La Fase 2 fornisce una UI minima ma utilizzabile.  I prossimi miglioramenti includeranno:

* **Gestione completa dei task** (lista, assegnazione, completamento, scadenze), integrata con il runtime Temporal.
* **Sistema di notifiche in real time** (via WebSocket o SSE) per aggiornare la UI quando cambiano i dati (es. nuova pubblicazione, pratica in errore).
* **Personalizzazione e permessi granulari**: possibilità di mostrare/nascondere sezioni in base al ruolo e di configurare le viste per utente.