---
id: architecture-runtime
title: Runtime e Orchestrazione
sidebar_label: Runtime
---

### Motore di Orchestrazione

Il runtime della piattaforma è basato su **Temporal**, una soluzione per orchestrare flussi di lavoro distribuiti. Le definizioni BPMN vengono tradotte o mappate a workflow Temporal all’atto della pubblicazione.

### Integrazione con Temporal

- Ogni tenant può usare un namespace dedicato oppure condiviso, con `tenantId` e `workflowId` nel naming.
- Il Runtime Gateway deve invocare l’SDK Temporal per avviare workflow a partire da un “release bundle”.
- Deve essere possibile recuperare stato, output e logs per ogni istanza.

### Gestione Istanze

- Le istanze (pratiche) vengono create con metadati: tenant, versione del processo, chiavi di correlazione.
- Devono essere tracciati eventi come avvio, completamento, errore, retry.
- L’utente deve poter visualizzare il percorso (timeline) e i task correnti.

### Task e Human Interaction

- Se il processo prevede human tasks, il Gateway deve integrarsi con un task manager per assegnazioni e completamenti.
- Ogni task è legato a un’istanza e a un utente/ruolo.

L’esecuzione dei workflow è separata dalla gestione del design e pubblicazione; questo permette di garantire la stabilità delle versioni pubblicate.