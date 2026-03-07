---
id: modules-runtime-gateway
title: Gateway Runtime
sidebar_label: Runtime Gateway
---

Nel worktree corrente il **Runtime Gateway** è un servizio Quarkus che funge da **proxy HTTP verso Nexus** per evitare problemi di CORS dal browser. La parte di orchestrazione con Temporal è pianificata ma non è implementata in questo servizio.

## Responsabilità

- **Proxy npm search**: inoltra richieste di ricerca package al repository group npm di Nexus.
- **Proxy npm package**: inoltra richieste di fetch di un singolo package (lookup) a un repository proxy configurato in Nexus.
- **CORS boundary**: il Portal UI può chiamare il gateway (stessa origine/whitelist) invece di chiamare Nexus direttamente.

## API (worktree)

- `GET /api/health` → `ok`
- `GET /api/nexus/search?text=<q>&size=<n>` → proxy verso `.../repository/npm-group/-/v1/search`
- `GET /api/nexus/package/{name}` → proxy verso `.../repository/npm-group/{name}`

Configurazione: il target è controllato dalla property `nexus.base-url` del gateway.

## Evoluzione prevista (pianificata)

- **Orchestrazione Temporal**: avvio e monitoraggio istanze di processo a partire da bundle pubblicati.
- **Monitor istanze e task**: stato/timeline/log e gestione human task.
