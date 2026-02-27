---
id: modules-registry
title: Registry degli Artefatti
sidebar_label: Registry
---

Il **Registry degli Artefatti** è il cuore della persistenza e del versionamento degli artefatti.

## Responsabilità

- **Gestione artefatti**: creare, leggere, aggiornare, cancellare (soft delete) oggetti di tipo BPMN, DMN, Form, Request, Module e Component.
- **Versionamento**: ogni artefatto mantiene un log di versioni; ogni versione ha uno stato (`DRAFT`, `REVIEW`, `APPROVED`, `PUBLISHED`, `RETIRED`). L’immutabilità è garantita sulle versioni `PUBLISHED`.
- **Dipendenze**: memorizza la relazione tra versioni (es. un processo pubblicato V3 usa la regola DMN V7 e il modulo V2). I componenti di tipo `COMPONENT` vengono collegati al rispettivo modulo padre (`MODULE`) tramite la tabella dependency; il Registry gestisce la risoluzione del grafo completo Modulo→Componenti.
- **Codice sorgente e npm**: per artefatti `MODULE` e `COMPONENT`, il Registry memorizza il codice sorgente React (`source_code`), la mappa delle dipendenze npm (`npm_dependencies`) e il riferimento al pacchetto npm generato (`npm_package_ref`).
- **Metadata e tag**: permette di assegnare descrizioni, tag, area/modulo, owner e tenant.
- **Ricerca**: fornisce endpoint per cercare artefatti per testo libero, tag, tipo, stato e versioni.

## Tipi di artefatti

| Tipo | Formato | Descrizione |
|------|---------|-------------|
| `PROCESS` | XML/BPMN | Definizione di processo |
| `RULE` | XML/DMN | Regola decisionale |
| `FORM` | JSON | Definizione di form (StillumForms basato su JSON Schema – interfacce dichiarative) |
| `REQUEST` | JSON | Definizione di request (contratto di servizio) |
| `MODULE` | JSON + React | Modulo UI complesso composto da componenti: definisce pools, droplets e triggers tramite codice React effettivo con dipendenze npm |
| `COMPONENT` | JSON + React | Componente UI singolo (pool, droplet o trigger): collegabile a un modulo padre tramite la tabella dependency, con proprio codice sorgente React e dipendenze npm |

> **Distinzione FORM vs MODULE/COMPONENT:** gli artefatti `FORM` restano dedicati alla definizione di interfacce StillumForms basate su JSON Schema (approccio dichiarativo). Gli artefatti `MODULE` e `COMPONENT` introducono la possibilità di definire pools, droplets e triggers tramite codice React effettivo, importando librerie npm e producendo pacchetti npm riutilizzabili dal runtime come plugin caricabili.

### Struttura dati MODULE e COMPONENT

Per gli artefatti `MODULE` e `COMPONENT`, la versione contiene campi aggiuntivi:

- **`source_code`** (text): il codice sorgente React/TypeScript del pool, droplet o trigger.
- **`npm_dependencies`** (json): mappa `{ "react": "^18.0.0", "my-lib": "^1.2.0" }` delle librerie npm necessarie.
- **`npm_package_ref`** (string): puntatore al pacchetto npm generato dalla pipeline di build (es. path nel registry npm interno).

### Relazione Modulo→Componenti

Un artefatto `MODULE` aggrega N artefatti `COMPONENT` tramite la tabella `dependency`:

- Ogni `COMPONENT` dichiara una dipendenza verso il `MODULE` padre.
- Il Registry risolve il grafo delle dipendenze per restituire l'elenco completo dei componenti di un modulo.
- Il Publisher utilizza questo grafo per generare il pacchetto npm unificato del modulo.

## API da sviluppare

- Endpoints REST/GraphQL per CRUD dei diversi tipi di artefatti.
- Endpoints per ottenere la lista di versioni di un artefatto.
- Endpoint per risolvere il grafo delle dipendenze.
- Endpoints per promuovere lo stato (es. da Bozza a In Revisione).
- Autorizzazione basata su tenant e ruolo per ogni operazione.
