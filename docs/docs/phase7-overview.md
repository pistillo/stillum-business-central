---
slug: phase-7
title: Fase 7 – Modalità developer & integrazione Git
---

## Obiettivo della fase

La **Fase 7** introduce funzionalità rivolte agli sviluppatori e integratori della piattaforma.  Permette di esportare e importare artefatti verso repository Git, automatizzare la pubblicazione tramite pipeline esterne e fornire strumenti per confrontare versioni e gestire conflitti.

## Esportazione e importazione

* **Export di bundle**: consentire agli utenti con ruolo sviluppatore di esportare versioni pubblicate (o interi progetti) come bundle zip pronti per essere commitati in un repository Git.  L’export include i file XML/JSON, il manifest delle dipendenze e i metadati.
* **Import da Git**: introdurre la possibilità di importare artefatti nel Registry direttamente da un branch o tag Git.  Un utente può selezionare un repository autorizzato, scegliere la cartella e importare processi, regole, moduli e request come bozze o come versioni pubblicate.
* **CLI/Interfaccia web**: fornire una CLI ufficiale per esportare/importare e uno strumento web per importare definizioni offline caricando un file zip.

## Webhook e integrazione CI/CD

* **Webhook di pubblicazione**: configurare webhook che, al push di un nuovo tag o branch in Git, avvii in automatico la creazione di una nuova versione nel Registry e la pubblicazione in un ambiente.  Utile per integrazione con pipeline esistenti di DevOps.
* **Pipeline GitOps**: supportare flussi GitOps, in cui la configurazione dell’ambiente (processi e regole) è definita come codice nel repository e sincronizzata con il registry tramite operatori (es. Argo CD).  La piattaforma deve fornire gli artefatti in un formato compatibile.

## Confronto e gestione versioni

* **Diff visuali**: implementare uno strumento per confrontare due versioni di un artefatto, evidenziando le differenze tra file BPMN/DMN o tra JSON (moduli e request).  Il diff deve essere accessibile via UI e via CLI.
* **Rilevamento conflitti**: prima dell’import o della pubblicazione, il sistema deve verificare se esistono conflitti con versioni già presenti (stesso numero di versione ma contenuti diversi) e notificare l’utente con le possibili soluzioni (incrementare la versione, unire le modifiche, ecc.).
* **Storico dei commit**: per versioni importate da Git si mantiene un riferimento al commit SHA, consentendo di tracciare la provenienza della definizione e risalire alle modifiche nel repository.

## Deliverable

* API e comandi CLI per esportare bundle e importare definizioni da repository Git o da file zip.
* Sistema di webhook configurabile per integrare le pubblicazioni con pipeline esterne (GitHub Actions, GitLab, Jenkins).
* Tool di diff visuale integrato nella UI per BPMN/DMN e JSON.
* Meccanismo di validazione dei conflitti con suggerimenti per la risoluzione.

## Considerazioni future

L’integrazione con Git rende la piattaforma più flessibile per sviluppatori e devops.  In una fase successiva si potrà supportare repository privati, sistemi di controllo versione alternativi (Mercurial), gestione di secret per la connessione ai repo e una migliore integrazione con gli IDE (plugin per VS Code, IntelliJ). 