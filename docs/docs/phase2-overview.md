---
slug: phase-2
title: Fase 2 – Portal UI (v0)
---

## Obiettivo della fase

La **Fase 2** è dedicata alla realizzazione della **prima interfaccia utente operativa** della piattaforma.  Dopo aver implementato il backend nella fase precedente, è ora necessario mettere a disposizione un portale web che consenta agli analisti e ai process owner di interagire con gli artefatti in maniera semplice e intuitiva.  Questa release (v0) non include ancora tutte le funzionalità avanzate, ma deve fornire un flusso end‑to‑end dalla creazione di un artefatto alla sua pubblicazione.

## Ambito principale

* **Autenticazione e selezione del tenant**: integrazione con il provider IAM (es. Keycloak) per login unico e selezione del tenant.  Una volta loggato, l’utente opera nel contesto del tenant scelto.
* **Dashboard iniziale**: una home page che mostra bozze in corso, ultime pubblicazioni, eventuali errori e link rapidi alle funzioni principali.
* **Catalogo artefatti**: una vista elenco/tabellare per navigare processi, regole, moduli e request.  Supporto a filtri per tipo, stato, area, tag e ricerca full‑text.
* **Dettaglio artefatto**: una pagina che visualizza i metadati di un artefatto e tutte le sue versioni, permettendo di aprire la versione in bozza nell’editor o di avviare la pubblicazione.
* **Editor integrati**: embed degli editor BPMN, DMN, StillumForms e request all’interno del portale, con salvataggio automatico delle bozze tramite la Registry API.
* **Pubblicazione guidata**: un flusso UI semplificato per richiamare il Publisher Service, visualizzando eventuali errori di validazione o lo stato di avanzamento della release.

## Deliverable

1. **Prototipo React** basato su un framework moderno (es. Next.js con React Router) e librerie di componenti (shadcn/ui).  Deve essere responsive e accessibile.
2. **Integrazione con Keycloak/OIDC** per l’autenticazione e recupero dei ruoli e dei tenant associati all’utente.
3. **Routing e navigazione**: definizione delle rotte principali (`/home`, `/catalogue`, `/artifact/:id`, `/editor/:id/:version`, `/publish`, ecc.) con gestione dello stato applicativo.
4. **Componenti UI** per:
   - Liste e tabelle (catalogo, versioni).
   - Form di creazione artefatti (titolo, tipo, descrizione, tag, area).
   - Dialog per selezione ambiente e conferma pubblicazione.
   - Notifiche e feedback utente (toast, banner).
5. **Chiamate API** verso la Registry API e il Publisher Service con gestione degli errori e visualizzazione degli stati (loading, successo, errore).

## Criteri di riuscita

* Un utente analista deve essere in grado di effettuare login, creare un nuovo artefatto in bozza, modificarlo nell’editor integrato, salvarlo come bozza, visualizzarlo nel catalogo e, come Process Owner, pubblicarlo con successo su un ambiente.
* Gli utenti di tenant diversi devono vedere solo i propri artefatti e versioni.
* La UI deve essere localizzabile (almeno inglese/italiano) e compatibile con i principali browser.
* Il design deve essere coerente con lo stile definito (utilizzo di shadcn/ui, Tailwind per il layout, componenti con ombre morbide e bordi arrotondati).

## Prossimi passi

La **Fase 2** costituisce la base per l’esperienza utente; nelle fasi successive saranno aggiunti:

* **Workflow di approvazione** con stati intermedi e notifiche.
* **Monitor runtime** integrato con le istanze Temporal e gestione dei task.
* **Gestione utenti e ruoli** dalla UI (in questa fase la gestione avviene via backend o IAM). 
* **Report e analytics** per fornire indicatori di performance dei processi e delle regole.