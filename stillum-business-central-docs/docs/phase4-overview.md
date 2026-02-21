---
slug: phase-4
title: Fase 4 – Runtime & orchestrazione
---

## Obiettivo della fase

La **Fase 4** porta la piattaforma ad eseguire realmente i processi e gestire i task umani.  Dopo aver creato, versionato e pubblicato gli artefatti, ora è il momento di **orchestrare le istanze di processo** tramite Temporal, esporre l’API per monitorarle e integrare la gestione dei task nella UI.

## Runtime Gateway

* **Avvio istanze**: implementare un servizio (Runtime Gateway) che riceve richieste di avvio di una pratica.  L’endpoint `POST /tenants/{tenantId}/instances` richiede `processDefinitionId`, `versionId` e parametri iniziali, e crea un nuovo workflow Temporal identificato dal `businessKey`.
* **Indirizzamento versione**: il gateway traduce `processDefinitionId + versionId` nel `workflowId` e `workflowVersion` di Temporal, assicurando di avviare la versione corretta pubblicata.  Il `tenantId` viene passato come attributo di ricerca.
* **API di interrogazione**: definire endpoint per ottenere lo stato (`Running`, `Completed`, `Failed`, etc.), i task correnti e la cronologia degli eventi (`/instances/{instanceId}`).  I dati devono provenire dalle API di Temporal e trasformati in un formato comprensibile all’utente.

## Gestione dei task umani

* **Task list**: sviluppare una struttura di dati e API per rappresentare task umani generati dai processi.  Ogni task è associato a un’istanza, contiene un identificatore, una descrizione, un assegnatario e una scadenza.
* **Assegnazione**: introdurre logica per l’assegnazione (automatica o manuale) dei task agli utenti, considerando i ruoli e eventuali code di lavorazione.  La UI deve prevedere una “To‑Do List” per l’utente loggato.
* **Completamento**: fornire endpoint e UI per completare un task, fornendo eventuali dati in output (moduli compilati).  Al completamento, il gateway notificherà Temporal per proseguire l’esecuzione.
* **Riassegnazione e delega**: permettere di riassegnare task a un altro utente o a un gruppo, con relativo tracciamento e notifiche.

## Monitor delle pratiche

* **Dashboard**: creare una pagina dedicata dove visualizzare tutte le istanze attive, filtrabili per stato, data di inizio, processo, assegnatario o parametro business.  La dashboard deve supportare l’ordinamento e la ricerca.
* **Dettaglio istanza**: visualizzare informazioni approfondite su ogni pratica: timeline degli eventi (start, task, completamenti, errori), variabili di contesto, link agli artefatti coinvolti e log.  La UI deve offrire azioni rapide come riassegnare un task o annullare un’istanza.

## Deliverable

* **Runtime Gateway** implementato come servizio separato, con connettore verso Temporal.  Tutte le chiamate includono il `tenantId` e limitano la visibilità ai dati del tenant.
* **Modello dati dei task** con tabelle `Task` e `TaskAssignment` in PostgreSQL e metodi per creare, aggiornare e completare task.
* **API REST** per avviare processi, interrogare istanze, gestire task umani e recuperare log.
* **UI per task** integrata nella dashboard: to‑do list personale, vista “My Tasks”, pulsanti per completare o delegare.

## Considerazioni future

In questa fase si crea la base per la gestione runtime.  Nelle fasi successive si estenderà con:

* **Notifiche in tempo reale** tramite WebSocket o Server Sent Events per aggiornare la UI non appena cambiano stato le istanze o i task.
* **Gestione di SLA** per task ed istanze (vedi Fase 8) con escalation automatica in caso di ritardi.
* **Integrazione con strumenti esterni** (es. Slack, Teams) per assegnare e completare task direttamente da altre piattaforme.