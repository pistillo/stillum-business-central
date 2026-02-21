---
id: modules-registry
title: Registry degli Artefatti
sidebar_label: Registry
---

Il **Registry degli Artefatti** è il cuore della persistenza e del versionamento degli artefatti.

## Responsabilità

- **Gestione artefatti**: creare, leggere, aggiornare, cancellare (soft delete) oggetti di tipo BPMN, DMN, Modulo, Request.
- **Versionamento**: ogni artefatto mantiene un log di versioni; ogni versione ha uno stato (bozza, pubblicata, ritirata) e un payload immutabile.
- **Dipendenze**: memorizza la relazione tra versioni (es. un processo pubblicato V3 usa la regola DMN V7 e il modulo V2).
- **Metadata e tag**: permette di assegnare descrizioni, tag, area/modulo, owner e tenant.
- **Ricerca**: fornisce endpoint per cercare artefatti per testo libero, tag, tipo, stato e versioni.

## API da sviluppare

- Endpoints REST/GraphQL per CRUD dei diversi tipi di artefatti.
- Endpoints per ottenere la lista di versioni di un artefatto.
- Endpoint per risolvere il grafo delle dipendenze.
- Endpoints per promuovere lo stato (es. da Bozza a In Revisione).
- Autorizzazione basata su tenant e ruolo per ogni operazione.