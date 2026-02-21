---
id: modules-lifecycle
title: Ciclo di Vita degli Artefatti
sidebar_label: Ciclo di Vita
---

Ogni artefatto (processo, regola, modulo, request) attraversa un ciclo di vita con stati distinti.

## Stati

- **Bozza (Draft)** – creato o modificato liberamente da analisti.
- **In Revisione (In Review)** – pronto per la verifica; non deve essere più modificato se non dal revisore.
- **Approvato (Approved)** – validato e pronto per la pubblicazione.
- **Pubblicato (Published)** – versione immutabile usata in runtime.
- **Ritirato (Retired)** – non più disponibile per nuove esecuzioni, ma conservato per audit.

## Regole di Transizione

- Solo un **Process Owner** può spostare un artefatto da In Revisione a Approvato o Pubblicato.
- Una versione pubblicata non può tornare in bozza; eventuali modifiche generano una nuova versione.
- Il ritiro di una versione pubblicata deve garantire che non vi siano istanze attive.

## Workflow di Revisione

- Opzionalmente, implementare flussi di approvazione multipli con firme digitali e commenti.
- Ogni transizione deve essere tracciata nel registro eventi per l’audit.