---
id: modules-publisher
title: Servizio di Pubblicazione
sidebar_label: Publisher
---

Il **Publisher** svolge il ruolo di “gatekeeper” tra la fase di design e l’ambiente di esecuzione.

## Funzioni

- **Validazione**: controlla la sintassi e la coerenza degli artefatti (BPMN, DMN, moduli) e segnala errori prima della pubblicazione.
- **Risoluzione dipendenze**: assicura che tutte le versioni referenced siano nello stato corretto (pubblicato o approvato) e non contengano cicli.
- **Creazione bundle**: produce un pacchetto immutabile che comprende il processo e tutti i riferimenti alle versioni dipendenti.
- **Aggiornamento Registry**: al termine aggiorna il Registry segnando la versione come pubblicata e registrando l’ambiente (DEV, QA, PROD).
- **Notifiche**: notifica agli interessati l’avvenuta pubblicazione (via UI o email).

## Flusso di lavoro

1. L’utente lancia il wizard di pubblicazione dalla UI.
2. La UI invia la richiesta al Publisher con l’artefatto e la versione da rilasciare.
3. Il Publisher valida e risolve le dipendenze.
4. Se tutto è corretto, crea il bundle e registra la pubblicazione.
5. La versione passa allo stato “Pubblicato” ed è disponibile per il runtime.