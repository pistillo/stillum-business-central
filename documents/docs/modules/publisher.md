---
id: modules-publisher
title: Servizio di Pubblicazione
sidebar_label: Publisher
---

Il **Publisher** svolge il ruolo di “gatekeeper” tra la fase di design e l’ambiente di esecuzione.

## Funzioni

- **Validazione**: controlla la sintassi e la coerenza degli artefatti (BPMN, DMN, moduli) e segnala errori prima della pubblicazione.
- **Risoluzione dipendenze**: assicura che tutte le versioni referenziate siano nello stato corretto (tipicamente `PUBLISHED`) e segnala versioni mancanti/non pubblicate.
- **Creazione bundle**: produce un pacchetto immutabile che comprende il processo e tutti i riferimenti alle versioni dipendenti.
- **Registrazione pubblicazione**: persiste una `Publication` associata a `environmentId` e aggiorna lo stato della versione a `PUBLISHED` nel database.
- **Notifiche**: notifica agli interessati l’avvenuta pubblicazione (via UI o email).

## Flusso di lavoro

1. L’utente lancia il wizard di pubblicazione dalla UI.
2. La UI invia la richiesta al Publisher con l’artefatto e la versione da rilasciare.
3. Il Publisher valida il payload recuperandolo dallo storage oggetti tramite `payloadRef` e risolve le dipendenze.
4. Se tutto è corretto, crea il bundle (zip) e registra la pubblicazione (DB + storage).
5. La versione passa allo stato `PUBLISHED` ed è considerata immutabile.

## Vincoli (stato attuale)

- **Gatekeeping su PROD**: la pubblicazione verso un ambiente chiamato `PROD` è consentita solo se la versione è in stato `APPROVED`.
- **Pubblicazione singola per versione**: nel branch corrente una versione già `PUBLISHED` non può essere ripubblicata su un secondo ambiente (vincolo da rimuovere nella fase di lifecycle completo).
