---
slug: phase-8
title: Fase 8 – Analytics & reporting
---

## Obiettivo della fase

La **Fase 8** introduce strumenti di analisi e reporting per monitorare le performance dei processi e garantire il rispetto degli SLA.  Fornisce dashboard di KPI, meccanismi di alerting e un sistema di audit completo.

## KPI e dashboard

* **Throughput e tempi medi**: calcolare indicatori come il numero di processi completati per unità di tempo, il tempo medio di esecuzione, il tempo medio per task umano e la percentuale di casi in errore.
* **Tassi di errore**: monitorare quanti processi vanno in errore o vengono annullati e individuare pattern (es. un DMN che fallisce spesso).  I report devono essere filtrabili per processo, ambiente e periodo.
* **SLA**: permettere di definire SLA per processi e task (es. un processo deve completarsi in 24h).  Calcolare quanti casi superano la soglia e generare grafici di conformità.
* **Dashboard per tenant e per processo**: implementare viste riassuntive per ogni tenant e per ogni processo, accessibili via UI, con grafici interattivi e possibilità di esportare i dati (CSV, PDF).

## Alerting e SLA

* **Regole di notifica**: consentire ai process owner di definire regole di notifica (es. se un processo supera l’SLA, invia un’email al responsabile o un messaggio su Slack).  Le regole includono condizioni (errori, ritardi) e canali di notifica.
* **Monitoraggio proattivo**: implementare servizi che monitorano le istanze in tempo reale e scatenano notifiche appena si verifica una condizione (es. un task scaduto).  Integrazione con provider di messaggistica (SMTP, Slack, Teams, Webhook).
* **Integrazione con Runtime Gateway**: il servizio di monitoraggio sfrutta gli eventi generati in Fase 4 per aggiornare gli indicatori e scatenare alert.

## Auditing

* **Log attività**: conservare in una tabella `AuditLog` tutte le azioni compiute dagli utenti (creazione/modifica/versionamento di artefatti, approvazioni, pubblicazioni, assegnazioni e completamenti di task).  Ogni log deve includere timestamp, utente, tenant e un payload descrittivo.
* **Consultazione**: offrire API e UI per consultare l’audit log, con filtri per utente, data, operazione e artefatto.  È utile per verificare conformità, risolvere incidenti o indagare comportamenti sospetti.
* **Tracciamento dati**: per finalità normative, il sistema deve poter dimostrare chi ha creato o modificato un processo, chi lo ha approvato e quando è stato pubblicato.

## Deliverable

* Servizi di raccolta e aggregazione dati (job batch o streaming) che alimentano i KPI.
* API per accedere agli indicatori e esportare i report.  UI di reporting con grafici e tabelle.
* Motore di alerting con regole configurabili e integrazione con canali esterni.
* Implementazione dell’audit log e interfaccia di consultazione.

## Considerazioni future

In futuro sarà possibile incorporare funzioni di **machine learning** per identificare colli di bottiglia e suggerire ottimizzazioni di processo.  Inoltre si potrebbe integrare con sistemi esterni di business intelligence per analisi più avanzate e creazione di cruscotti personalizzati.