---
slug: phase-3
title: Fase 3 – Pubblicazione e ciclo di vita
---

## Obiettivo della fase

La **Fase 3** estende la piattaforma con il supporto al **ciclo di vita completo degli artefatti**.  Dopo aver realizzato la UI e il backend di base, è necessario introdurre un workflow di approvazione e definire gli stati formali che ogni artefatto attraversa prima di essere eseguito in produzione.  Inoltre si completa il processo di pubblicazione con la selezione dell’ambiente e con l’inserimento di note di rilascio.

## Workflow di approvazione

* **Stati del ciclo di vita**: si implementa la transizione tra i seguenti stati: `Bozza` → `In revisione` → `Approvato` → `Pubblicato` → `Ritirato`.  Solo le bozze possono essere modificate; le versioni pubblicate possono solo essere ritirate.
* **Revisori**: è possibile assegnare uno o più revisori a una bozza.  Quando un revisore approva, la versione passa allo stato successivo; se respinge, torna a bozza con commenti.  Tutte le azioni sono tracciate nell’audit log.
* **Task di approvazione**: le richieste di revisione generano task nel sistema di task (che sarà completato in Fase 4) e notifiche via email o integrazioni (Slack, Teams).

## Wizard di pubblicazione

Il processo di pubblicazione viene esteso con un wizard che guida l’utente attraverso:

1. **Validazione e dipendenze**: il sistema controlla automaticamente la validità dell’artefatto e la presenza delle dipendenze richieste.  Eventuali errori vengono mostrati e impediscono di procedere.
2. **Selezione dell’ambiente**: l’utente sceglie l’ambiente di destinazione (`DEV`, `QA`, `PROD` o personalizzati) tra quelli disponibili per il tenant.  È possibile pubblicare la stessa versione in più ambienti in momenti diversi.
3. **Note di rilascio**: l’utente può inserire commenti o changelog che saranno memorizzati con la `Publication` e consultabili successivamente.
4. **Conferma e esito**: una volta completati i passaggi precedenti, il publisher esegue l’operazione e restituisce l’esito (successo o fallimento con motivazione).  In caso positivo la versione viene marcata come `Published` nell’ambiente selezionato.

## Deliverable

* Implementazione del **workflow di revisione** all’interno della Registry API e nel frontend: endpoint per creare task di revisione, approvare o respingere versioni, cambiare stato e aggiungere commenti.
* Aggiornamento del Publisher Service per salvare le note di rilascio e legare ogni pubblicazione a un ambiente.
* Estensione della UI con un **wizard di pubblicazione** interattivo che includa pagine di validazione, selezione ambiente e note.
* Aggiornamento del modello dati con l’entità `Review` (revisioni effettuate), `ApprovalTask` e **stato avanzato** in `ArtifactVersion`.

## Considerazioni future

Questa fase prepara il terreno per l’integrazione con la gestione dei task (Fase 4) e per l’introduzione di regole di approvazione personalizzabili (es. numero minimo di approvatori, ruoli specifici).  Sarà anche possibile configurare la **policy di pubblicazione** per ciascun tenant (es. obbligatorietà di revisione o pubblicazione diretta).