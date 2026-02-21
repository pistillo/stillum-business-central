---
id: modules-instances
title: Gestione delle Pratiche
sidebar_label: Pratiche
---

Le **Pratiche** rappresentano le istanze di processo eseguite nel runtime.

## Caratteristiche

- Ogni pratica ha un ID univoco, codice leggibile (es. `PRT-YYYY-NNNNN`), tenantId, chiave di correlazione e riferimento alla versione del processo.
- Lo stato della pratica può essere: In Esecuzione, Completata, Fallita, In Attesa, Sospesa.
- Tracciamento della timeline degli eventi con informazioni su step eseguiti, tempi e attori coinvolti.
- Accesso ai log di esecuzione, variabili e output della pratica.
- Possibilità di visualizzare i task correnti (human tasks) e completare o riassegnare tasks.
- Supporto per sospensione e ripresa, retry, termination dove consentito.

## Integrazione con il Portale

- La sezione “Pratiche” nel portale deve permettere di filtrare e cercare per stato, processo, utente, data di avvio e tag.
- La pagina di dettaglio mostra i dati della pratica e consente azioni (es. completare un task, terminare).