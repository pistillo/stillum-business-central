---
slug: phase-5
title: Fase 5 – Multi‑tenancy avanzata & sicurezza
---

## Obiettivo della fase

La **Fase 5** è dedicata al rafforzamento dell’isolamento tra tenant e alla definizione di un modello completo di ruoli e permessi.  In questa fase si verifica che l’architettura multi‑tenant sia sicura, si implementa un sistema RBAC esteso e si forniscono strumenti per il provisioning di nuovi tenant attraverso API e UI.

## Isolamento dei dati

* **Row‑Level Security (RLS)**: abilitare e collaudare policy di RLS su tutte le tabelle di Postgres in modo da limitare l’accesso in base al `tenantId`.  Ogni query deve includere automaticamente il filtro per il tenant, sia a livello di API che di DB.
* **Verifica end‑to‑end**: creare suite di test per assicurarsi che non sia possibile accedere ai dati di un altro tenant tramite bug o configurazioni errate.  Eseguire penetration test e auditing periodici.
* **Isolamento a livello storage**: se necessario, valutare l’opzione di bucket separati per tenant su MinIO/S3 o policy IAM più restrittive.

## Ruoli e permessi

* **Modello RBAC**: definire ruoli predefiniti (Analyst, Process Owner, Viewer, Admin, Developer) con permessi granulari (crea artefatti, modifica bozze, pubblica, ritira, gestisci utenti, avvia processi, ecc.).  Ogni utente può avere più ruoli.
* **ACL opzionali**: introdurre la possibilità di limitare l’accesso a un artefatto o a una versione a determinati ruoli o utenti specifici.  L’API deve controllare gli ACL in aggiunta al `tenantId`.
* **Gestione ruoli via UI**: implementare nella UI un pannello di amministrazione per visualizzare e modificare i ruoli degli utenti e per invitare nuovi utenti nel tenant.  L’interfaccia deve essere semplice e rispettare le linee guida di sicurezza (es. conferma via email).

## Onboarding dei tenant

* **API di provisioning**: creare endpoint per la creazione di nuovi tenant, la configurazione automatica degli ambienti standard (DEV, QA, PROD) e l’assegnazione del primo admin.  Questo permette l’onboarding self‑service o mediato da un operator.
* **UI di onboarding**: fornire una schermata dove l’admin può avviare la creazione di un nuovo tenant, inserire i dati necessari (nome, dominio, lingua) e generare un invito per l’amministratore.
* **Limitazioni e piani**: gestire parametri come numero massimo di artefatti, istanze attive o storage per tenant in base al piano commerciale.  Le limitazioni devono essere controllate a livello di API e comunicate nella UI.

## Deliverable

* Implementazione e test delle policy RLS e verifica dell’isolamento dei dati su database, storage e runtime.
* Schema RBAC completo con ruoli e permessi, supporto per ACL per artefatto/versione e API di gestione ruoli.
* Funzioni di onboarding e provisioning dei tenant con UI dedicata e API, compresa la configurazione degli ambienti predefiniti.
* Aggiornamento della documentazione di sicurezza e linee guida per l’implementazione.

## Considerazioni future

Questa fase rende la piattaforma conforme a requisiti enterprise.  In seguito sarà possibile integrare **autenticazione federata** con provider esterni (SAML, LDAP), abilitare logging centralizzato per la sicurezza e offrire supporto per piani di disaster recovery.