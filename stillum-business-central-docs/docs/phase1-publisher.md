---
slug: phase1-publisher
title: Publisher Service – Fase 1
---

Il **Publisher Service** è responsabile della transizione delle versioni di artefatto dallo stato di bozza (`Draft`) allo stato di pubblicato (`Published`).  In questa fase si definisce l’architettura e i flussi di questo servizio, incaricato di garantire l’integrità e l’immutabilità delle release.

## Obiettivi del Publisher

* **Validazione**: controllare che i payload degli artefatti siano conformi allo schema previsto (BPMN valido, DMN coerente, JSON corretti per moduli e request) e che le dipendenze siano presenti e compatibili.
* **Risoluzione delle dipendenze**: costruire il grafo delle versioni dipendenti e assicurare che tutte siano pubblicate o pronte per la pubblicazione.  Impedire la pubblicazione se esistono cicli o versioni mancanti.
* **Creazione del bundle**: generare un pacchetto immutabile che contenga il payload della versione da pubblicare e, se necessario, i payload delle sue dipendenze, insieme a un manifest descrittivo.
* **Persistenza**: salvare il bundle nello storage oggetti e registrare l’operazione nel database come entità `Publication` (versione, ambiente, timestamp, utente, note).
* **Aggiornamento stato**: marcare la versione come `Published` e registrare la versione nelle tabelle di dipendenza per la runtime.

## Flusso di pubblicazione

1. **Invocazione**: un utente (solitamente un Process Owner) invia una richiesta al publisher tramite l’endpoint `POST /tenants/{tenantId}/publish` specificando `artifactId`, `versionId` e `environmentId`.  Opzionalmente può includere note di release.
2. **Recupero e controllo**: il servizio legge dai metadati la versione richiesta, verifica che sia in stato `Draft` e recupera il payload dall’object storage usando `payloadRef`.
3. **Validazione schema**:
   - **BPMN**: eseguire una validazione sintattica del file XML e verificare la correttezza dei riferimenti a variabili e task.
   - **DMN**: assicurarsi che le tabelle decisionali siano corrette e seguano lo standard DMN.
   - **Forms/Requests**: convalidare la conformità ai rispettivi schemi JSON.
4. **Risoluzione dipendenze**: per ogni dipendenza registrata, recuperare la versione indicata e verificare che sia già pubblicata.  Se non lo è, bloccare la pubblicazione segnalando l’errore all’utente.
5. **Costruzione bundle**: aggregare il payload dell’artefatto e opzionalmente i payload delle dipendenze in un singolo file (ad esempio un archivio zip) e generare un manifest (un file JSON) con i metadati: `artifactId`, `versionId`, lista dipendenze e hash dei file.
6. **Persistenza bundle**: caricare il bundle nello storage in un percorso strutturato (vedi sezione Storage) e ottenere un riferimento (bundleRef).  Salvare su DB una nuova entità `Publication` con l’ambiente selezionato (`DEV`, `QA`, `PROD`), la data, l’autore e eventuali note.
7. **Aggiornamento stato**: aggiornare la riga di `ArtifactVersion` impostando `state = Published`, memorizzare il riferimento al bundle (`bundleRef`) e rendere la versione non più modificabile.
8. **Risposta**: restituire al client un esito positivo con le informazioni della pubblicazione (id, timestamp, bundleRef) oppure un errore con le cause della validazione fallita.

## Endpoint di pubblicazione

| Metodo e percorso | Descrizione |
|------------------|-------------|
| **`POST /tenants/{tenantId}/publish`** | Avvia la procedura di pubblicazione. Nel corpo della richiesta sono richiesti `artifactId`, `versionId` e `environmentId`.  Restituisce l’esito della validazione e, in caso positivo, i dettagli della `Publication`. |
| **`GET /tenants/{tenantId}/publish/{publicationId}`** | Recupera i dettagli di una pubblicazione (stato, bundleRef, note, data, autore). |

## Gestione degli ambienti

Ogni `Publication` è legata a un ambiente, definito da `Environment` (es. `dev`, `qa`, `stage`, `prod`).  Il publisher deve:

* Verificare che l’ambiente esista per il tenant.
* Consente la pubblicazione di una versione su più ambienti (ogni pubblicazione è un record separato).
* Mantenere uno storico: eventuali nuove pubblicazioni dello stesso artefatto in un ambiente aggiornano l’ambiente alla nuova versione.

## Logging e auditing

Il servizio deve registrare tutte le operazioni di pubblicazione in una tabella `AuditLog`, con informazioni su chi ha eseguito l’azione, quando, su quale artefatto/versione e con quale esito.  Questi dati saranno utilizzati per audit futuri e per la risoluzione di incidenti.

## Considerazioni future

Nelle fasi successive il Publisher sarà esteso con:

* Integrazione con un **motore di workflow di approvazione**: la pubblicazione potrà essere soggetta a un processo di revisione multi‑livello con notifiche e approvazioni.
* **Differenziazione per tipo di artefatto**: regole DMN o moduli potrebbero richiedere validazioni specifiche (es. linting di decision tables o compilazione di schemi).
* Creazione di **changelog** automatici basati sulle differenze tra versioni, per fornire all’utente un riepilogo delle modifiche. 