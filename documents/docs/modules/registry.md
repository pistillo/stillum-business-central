---
id: modules-registry
title: Registry degli Artefatti
sidebar_label: Registry
---

Il **Registry degli Artefatti** è il cuore della persistenza e del versionamento degli artefatti.

## Responsabilità

- **Gestione artefatti**: creare, leggere, aggiornare, cancellare (soft delete) oggetti di tipo BPMN, DMN, Form, Request, Module e Component.
- **Versionamento**: ogni artefatto mantiene un log di versioni; ogni versione ha uno stato (`DRAFT`, `REVIEW`, `APPROVED`, `PUBLISHED`, `RETIRED`). L’immutabilità è garantita sulle versioni `PUBLISHED`.
- **Dipendenze**: memorizza la relazione tra versioni (es. un processo pubblicato V3 usa la regola DMN V7 e il modulo V2). I componenti possono essere collegati a un modulo padre tramite dipendenza.
- **Metadata e tag**: permette di assegnare descrizioni, tag, area/modulo, owner e tenant.
- **Ricerca**: fornisce endpoint per cercare artefatti per testo libero, tag, tipo, stato e versioni.

## Tipi di artefatti

| Tipo | Formato | Descrizione |
|------|---------|-------------|
| `PROCESS` | XML/BPMN | Definizione di processo |
| `RULE` | XML/DMN | Regola decisionale |
| `FORM` | JSON | Definizione di form |
| `REQUEST` | JSON | Definizione di request |
| `MODULE` | JSON | Modulo UI complesso composto da componenti |
| `COMPONENT` | JSON | Componente UI singolo, collegabile a un modulo tramite dipendenza |

## API da sviluppare

- Endpoints REST/GraphQL per CRUD dei diversi tipi di artefatti.
- Endpoints per ottenere la lista di versioni di un artefatto.
- Endpoint per risolvere il grafo delle dipendenze.
- Endpoints per promuovere lo stato (es. da Bozza a In Revisione).
- Autorizzazione basata su tenant e ruolo per ogni operazione.
