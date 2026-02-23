---
id: modules-runtime-gateway
title: Gateway Runtime
sidebar_label: Runtime Gateway
---

Il **Runtime Gateway** è il componente che mette in comunicazione la piattaforma con il motore di esecuzione Temporal.

## Responsabilità

- **Avvio istanze**: crea nuove istanze di processo a partire da un bundle pubblicato, impostando i metadati di tenant, versione, e chiavi di correlazione.
- **Monitoraggio**: espone API per recuperare lo stato corrente di un’istanza, inclusi step, tasks, log, variabili e errori.
- **Gestione eventi**: intercetta eventi dal runtime (es. completamento step, errori) e li propaga alla UI per l’aggiornamento in tempo reale.
- **Human tasks**: gestisce le interazioni manuali, assegnando tasks agli utenti o gruppi definiti.
- **Interruzione e ripresa**: fornisce funzioni per terminare, sospendere o riavviare istanze (dove consentito).

## Interfaccia verso Temporal

- Usa l’SDK Temporal per avviare workflow (startWorkflow).
- Identifica workflow e run con naming convention che include `tenantId` e `versione`.
- Permette di consultare il history log e le search attributes.
- Deve supportare la configurazione di namespace per tenant o uso di un namespace condiviso.