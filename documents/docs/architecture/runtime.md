---
id: architecture-runtime
title: Runtime e Orchestrazione
sidebar_label: Runtime
---

### Stato nel worktree

Nel worktree corrente non è presente un runtime di orchestrazione basato su Temporal. Il servizio `runtime-gateway/` espone endpoint di utilità (proxy verso Nexus) e healthcheck; la parte di orchestrazione è pianificata nelle fasi successive.

### Motore di orchestrazione (pianificato)

- Il runtime della piattaforma è progettato per basarsi su **Temporal** (workflow engine).
- Le definizioni BPMN dovranno essere tradotte/mappate a workflow Temporal al momento della pubblicazione (o tramite una fase di build dedicata).
- Ogni tenant potrà usare namespace dedicato o namespace condiviso, con isolamento logico tramite naming e search attributes.

### Gestione istanze (pianificata)

- Le istanze (pratiche) vengono create con metadati: tenant, versione del processo, chiavi di correlazione.
- Devono essere tracciati eventi come avvio, completamento, errore, retry.
- L’utente deve poter visualizzare il percorso (timeline) e i task correnti.

### Task e human interaction (pianificata)

- Se il processo prevede human tasks, il Gateway deve integrarsi con un task manager per assegnazioni e completamenti.
- Ogni task è legato a un’istanza e a un utente/ruolo.

L’esecuzione dei workflow è separata dalla gestione del design e pubblicazione; questo permette di garantire la stabilità delle versioni pubblicate.
