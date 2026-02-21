---
slug: phase-9
title: Fase 9 – Funzionalità avanzate e marketplace
---

## Obiettivo della fase

La **Fase 9** riguarda l’introduzione di funzionalità avanzate che trasformano la piattaforma in un ecosistema estensibile.  Si pone l’accento sull’arricchimento con template pronti all’uso, sull’assistenza intelligente alla modellazione e sulla possibilità per terze parti di estendere il sistema tramite plugin.

## Marketplace di template

* **Catalogo pubblico**: creare un marketplace dove i tenant possono cercare e importare processi, regole e moduli sviluppati da Stillum o da partner.  Ogni template deve essere versionato e descritto con metadati (categoria, livello di maturità, provider, licenza).
* **API per la pubblicazione**: consentire a partner e alla community di pubblicare i propri template dopo una fase di revisione.  Il sistema deve gestire diritti d’autore, verifica di qualità e rimozione di template in caso di problemi.
* **Installazione e aggiornamento**: implementare un meccanismo per installare un template nel proprio tenant (es. import automatico nel registry) e per ricevere aggiornamenti quando il provider rilascia una nuova versione.

## Assistente AI

* **Generazione assistita**: integrare un assistente basato su modelli di AI in grado di suggerire bozze di processi BPMN/DMN a partire da descrizioni testuali o esempi.  L’assistente può analizzare processi simili e proporre strutture, regole e moduli ricorrenti.
* **Ottimizzazione**: fornire strumenti per analizzare processi esistenti e individuare colli di bottiglia, regole che generano errori frequenti o task umani in ritardo.  L’AI suggerisce modifiche per ridurre i tempi o semplificare i flussi.
* **Codificazione delle best practice**: rendere disponibili modelli predefiniti (es. processo di onboarding, gestione fatture) che gli utenti possono adattare con l’aiuto dell’assistente.

## Sistema di plugin

* **SDK per estensioni**: progettare e documentare un SDK che permetta di sviluppare plugin che aggiungono funzionalità al portale (es. integrazioni CRM, connettori a sistemi esterni, report personalizzati).  I plugin devono essere isolati e autorizzati in modo sicuro.
* **Gestione dei plugin**: fornire UI e API per installare, aggiornare e rimuovere plugin.  Ogni plugin deve specificare le proprie dipendenze, la versione minima della piattaforma e gli scope di accesso (modelli di permessi).
* **Sandboxing**: garantire che i plugin non possano compromettere la sicurezza o la stabilità della piattaforma.  Valutare l’uso di container o WebAssembly per isolare l’esecuzione.

## Deliverable

* Marketplace integrato nel portale con browse, ricerca, installazione e aggiornamento dei template.
* Componente AI assistente accessibile via UI e API, con capacità di generazione e ottimizzazione dei processi.
* SDK, API e documentazione per sviluppare plugin, e pannello di gestione nel portale per amministratori.

## Considerazioni future

Con questa fase la piattaforma diventa un ecosistema estensibile.  Sarà possibile creare piani commerciali per l’accesso a determinate categorie di template o plugin, e implementare un meccanismo di fatturazione per gli sviluppatori terzi.  L’intelligenza artificiale potrà essere arricchita con modelli sempre più sofisticati e con integrazioni dirette con i sistemi di workflow. 