---
id: modules-portal-ui
title: Portale Utente
sidebar_label: Portale UI
---

Il **Portale UI** rappresenta il punto di accesso per gli utenti di business. Deve essere progettato per essere intuitivo, role-based e multi-tenant.

## Funzionalità

- **Home / Dashboard**: mostra pratiche attive, task assegnati, bozze in revisione e KPI dei processi.
- **Catalogo**: permette di navigare e filtrare artefatti per tipo, area, stato, tag e tenant.
- **Designer integrati**: apertura di editor BPMN, DMN, moduli e request in base al tipo di artefatto selezionato.
- **Pubblicazione guidata**: wizard che accompagnano l’utente nella validazione e nel rilascio delle versioni.
- **Monitor runtime**: visualizzazione di istanze, stato, timeline, logs ed errori.
- **Gestione utenti e ruoli**: funzioni di amministrazione per assegnare ruoli e invitare nuovi utenti all’interno di un tenant.

## Considerazioni

- Deve supportare la localizzazione (lingue) e l’accessibilità.
- Tutte le operazioni devono essere contestualizzate al tenant corrente.
- Deve essere responsivo e integrarsi con i sistemi di autenticazione esterni.