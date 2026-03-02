---
id: roadmap
title: Roadmap di sviluppo
sidebar_label: Roadmap
---

La seguente roadmap delinea le fasi di sviluppo per arrivare a una piattaforma **Stillum Business Portal** completa.  Ogni fase individua il **cosa** va consegnato, senza dettare in che modo implementarlo.  Le fasi sono concepite per essere rilasciate in modo incrementale: le prime consentono di ottenere un prototipo funzionante, mentre le successive aggiungono funzionalità avanzate e consolidano il prodotto.

## 🌱 Fase 0 – Setup e fondamenta

1. **Analisi requisiti e modellazione entità**
   - Finalizzare il modello dati: Tenant, Artifact, ArtifactVersion, Publication, Instance e altre entità centrali.
   - Scegliere lo stack tecnologico di riferimento (PostgreSQL, S3/MinIO per il payload, Temporal come motore runtime, framework UI).
2. **Infrastruttura di base**
   - Preparare l’ambiente di sviluppo su un cluster Kubernetes (k3s o equivalente).
   - Predisporre un repository Git dedicato e pipeline di CI per build, lint e test.

## 🧱 Fase 1 – MVP backend

1. **Registry API**
   - CRUD per artefatti: processi BPMN, regole DMN, form StillumForms, definizioni di request, moduli UI React e componenti UI React.
   - Gestione versioning: stato bozza e pubblicato per ogni artefatto.
   - Metadati e ricerca base su titoli, tag e owner.
2. **Publisher Service**
   - Validazione dei modelli e risoluzione delle dipendenze fra artefatti.
   - Creazione di bundle immutabili contenenti l’artefatto e le versioni dipendenti.
3. **Storage payload**
   - Implementare l’accesso a MinIO (o S3) per salvare i payload (XML, JSON) separatamente dai metadati.
   - Allestire il database multi‑tenant per i metadati (PostgreSQL con `tenantId` e politiche di row‑level security).

## 🧑‍💻 Fase 2 – Portal UI (v0)

1. **Autenticazione e selezione tenant**
   - Integrare un provider IAM (Keycloak, Auth0 o simile) per gestire login e ruoli.
   - Fornire una UI per scegliere il tenant oppure derivarlo dal token.
2. **Catalogo**
   - Navigazione e ricerca degli artefatti con filtri per dominio, tipo e stato.
   - Visualizzazione di dettaglio con preview e lista delle versioni disponibili.
   - Creazione o modifica delle bozze con salvataggio nel registry.
3. **Designer integrati**
   - Incorporare gli editor BPMN, DMN e StillumForms all’interno della UI.
   - Consentire il salvataggio delle definizioni come bozze senza esporre la gestione file.

## 🚀 Fase 3 – Pubblicazione e ciclo di vita

1. **Workflow di approvazione**
   - Definire gli stati di lifecycle (bozza → revisione → approvato → pubblicato → ritirato).
   - Implementare la possibilità di assegnare revisori e tracciare le approvazioni.
2. **Wizard di pubblicazione**
   - Verificare automaticamente la validità e le dipendenze dell’artefatto.
   - Gestire la selezione dell’ambiente di destinazione (DEV, QA, PROD).
   - Permettere l’inserimento di note di rilascio e restituire l’esito dell’operazione.

## 🔧 Fase 4 – Runtime & orchestrazione

1. **Runtime Gateway**
   - Avviare istanze di processo tramite Temporal, passando i parametri iniziali e l’identificatore di versione.
   - Esporre API per interrogare lo stato e la cronologia degli eventi.
2. **Gestione task umani**
   - Fornire un sistema di assegnazione e completamento delle task di tipo umano (to‑do list, scadenze, riassegnazioni).
   - Collegare la gestione task con la UI affinché l’utente veda le attività assegnate.
3. **Monitor pratiche**
   - Implementare dashboard per le pratiche in corso con filtri per stato, data, utente.
   - Visualizzare il dettaglio di ogni istanza con log e timeline degli eventi.

## 🔐 Fase 5 – Multi‑tenancy avanzata & sicurezza

1. **Isolamento dei dati**
   - Verificare e rafforzare l’isolamento dei dati tramite politiche di row‑level security su PostgreSQL.
   - Assicurarsi che tutti i servizi propaghino e usino correttamente `tenantId`.
2. **Ruoli e permessi**
   - Definire un modello RBAC completo (Analyst, Process Owner, Viewer, Admin, Developer).
   - Introdurre ACL opzionali su artefatti e versioni.
3. **Onboarding dei tenant**
   - Sviluppare API e UI per creare nuovi tenant, configurare ambienti e assegnare l’amministratore.

## 📦 Fase 6 – Packaging & distribuzione

1. **Helm charts e immagini Docker**
   - Preparare chart Helm per tutti i componenti (UI, registry, publisher, runtime gateway, database, MinIO, Temporal, ecc.).
   - Rendere configurabili via valori Helm endpoint, credenziali e parametri di scalabilità.
2. **CI/CD e release**
   - Impostare pipeline per build, test, creazione artefatti e pubblicazione su registri di container.
   - Gestire le migrazioni del database in modo versionato.

## 🧑‍🔧 Fase 7 – Modalità developer & integrazione Git

1. **Esportazione/Importazione**
   - Prevedere l’esportazione di bundle pubblicati o singoli artefatti verso repository Git per uso developer, backup o audit.
   - Consentire l’import di definizioni preparate offline attraverso la CLI o interfaccia web.
2. **Webhook e CI**
   - Abilitare l’integrazione con pipeline di CI/CD per scatenare pubblicazioni automatiche a partire da branch o tag.
3. **Confronto versioni**
   - Introdurre strumenti per visualizzare differenze fra versioni (diff visuali).  
   - Notificare eventuali conflitti o incongruenze prima della pubblicazione.

## 📈 Fase 8 – Analytics & reporting

1. **KPI e dashboard**
   - Calcolare e rendere disponibili indicatori chiave: throughput, tempi medi di esecuzione, tassi di errore, SLAs.
   - Permettere la configurazione di report periodici per tenant o per processo.
2. **Alerting e SLA**
   - Definire regole di SLA e generare notifiche automatiche al superamento di soglie (via email, Slack, Teams).
3. **Auditing**
   - Conservare tracce delle operazioni di pubblicazione, promozione e accesso per fini di conformità e audit.

## 🌍 Fase 9 – Funzionalità avanzate e marketplace

1. **Marketplace di template**
   - Predisporre un catalogo di processi, regole e moduli pronti all’uso, importabili dai tenant.
   - Esporre API per la pubblicazione di template da parte della comunità o di partner.
2. **Assistente AI**
   - Offrire strumenti di generazione assistita di BPMN/DMN basati su storici, best practice o modelli intelligenti.
   - Individuare colli di bottiglia o possibilità di ottimizzazione tramite analisi automatizzata.
3. **Sistema di plugin**
   - Definire un SDK per estendere la piattaforma con moduli custom (es. integrazione CRM, analytics esterne).
   - Implementare la gestione di installazione e aggiornamento dei plugin.

## ⚛️ Fase 10 – Artefatti UI React e Packaging NPM

> *Fase fuori dalla roadmap originale, dipendente da Fase 2 (Portal UI) e Fase 6 (Packaging & distribuzione).*

1. **Backend: supporto MODULE e COMPONENT**
   - Estendere l’enum `ArtifactType` con `MODULE` e `COMPONENT`; aggiornare migrazioni DB con campi per codice sorgente React e dipendenze npm.
   - Implementare API CRUD specifiche e gestire la relazione Modulo→Componenti via tabella `dependency`.
2. **Editor UI React**
   - Sviluppare un editor di codice React basato su Monaco con supporto TypeScript e IntelliSense.
   - Wizard di creazione per pool, droplet e trigger con gestione dipendenze npm.
3. **Build e Packaging NPM**
   - NPM Build Service: compilazione codice React, risoluzione dipendenze npm, generazione pacchetto npm (Vite/Rollup).
   - Pubblicazione su registry npm interno (Verdaccio); integrazione con il Publisher.
4. **Runtime: caricamento plugin**
   - I pacchetti npm generati vengono consumati dal runtime come plugin caricabili a run‑time.
5. **Documentazione e test**
   - Aggiornare manuali, esempi e diagrammi; test unitari/integrativi.

---

Questa roadmap rappresenta un percorso possibile verso la realizzazione di Stillum Business Portal.  Alcune fasi possono sovrapporsi o essere anticipate in base alle priorità del team e ai feedback degli utenti.  L’obiettivo è costruire progressivamente una piattaforma robusta, multi‑tenant, orientata al dominio e pronta ad evolvere in un prodotto enterprise.