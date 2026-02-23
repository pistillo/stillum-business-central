---
slug: phase-1
title: Fase 1 – MVP Backend
---

## Obiettivo della fase

La **Fase 1** si concentra sulla realizzazione del **minimo backend funzionante** che consenta agli utenti di creare, versionare e pubblicare artefatti.  Al termine di questa fase il portale potrà gestire processi BPMN, regole DMN, moduli e request in bozza e pubblicarli su un ambiente selezionato.  La fase getta le basi per le integrazioni successive (UI, runtime) implementando i servizi di base.

### Componenti di questa fase

Questa fase introduce tre componenti principali:

| Componente               | Descrizione |
|-------------------------|-------------|
| **Registry API**         | Espone operazioni CRUD per gli artefatti e le loro versioni, con gestione dei metadati e ricerche. |
| **Publisher Service**    | Si occupa di validare le definizioni, verificare le dipendenze e generare bundle immutabili al momento della pubblicazione. |
| **Storage dei payload** | Permette di memorizzare i file XML/JSON degli artefatti e i bundle delle release in uno storage oggetti (MinIO/S3). |

## Deliverable principali

* **Endpoint REST per la Registry API** che implementano le operazioni di creazione, aggiornamento, lettura e cancellazione di artefatti e versioni per ogni tenant.
* **Servizio di pubblicazione** che effettua le validazioni e crea i bundle, con un endpoint per avviare il processo di pubblicazione.
* **Integrazione con lo storage** per salvare i payload degli artefatti e i bundle delle release in un percorso strutturato per tenant e artefatto.
* **Scaffolding del database** per supportare le nuove operazioni, con tabelle per gli artefatti, le versioni, le dipendenze e le pubblicazioni.

## Scope e vincoli

* Tutti i servizi devono essere **multi‑tenant**: ogni operazione è limitata ai dati del tenant loggato tramite `tenantId`.
* Le versioni sono immutabili dopo la pubblicazione; soltanto le **bozze** possono essere modificate o cancellate.
* Il publisher non esegue ancora l’orchestrazione dei processi: si limita a preparare e registrare le release. L’integrazione con Temporal è demandata alle fasi successive.
* Non viene realizzata la UI in questa fase: l’accesso avviene via API REST.

## Prossimi passi

Con la Fase 1 completata si potrà procedere alla **Fase 2 – Portal UI**, che introdurrà un’interfaccia grafica per interagire con la Registry e sfruttare i servizi implementati.  Inoltre si prevede di estendere il publisher con un workflow di approvazione e di introdurre la gestione dei task di runtime.