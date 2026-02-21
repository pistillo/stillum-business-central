---
id: architecture-components
title: Componenti dell’Architettura
sidebar_label: Componenti
---

La piattaforma è composta da diversi componenti interconnessi. Ogni componente deve essere sviluppato con responsabilità chiare e interfacce ben definite.

### Portale UI

- Interfaccia basata su web che espone tutte le funzionalità di gestione e monitoraggio.
- Deve supportare autenticazione e autorizzazione multi-tenant.
- Include pagine per home, catalogo, design, pubblicazione e runtime.

### Registry API

- Fornisce CRUD per artefatti (processi BPMN, regole DMN, moduli, request).
- Mantiene lo **storico delle versioni**, lo stato (bozza, pubblicato, ritirato) e le dipendenze tra artefatti.
- Espone endpoint per la gestione del ciclo di vita e la ricerca nel catalogo.
- Protegge gli accessi per tenant e ruolo.

### Publisher

- Riceve artefatti in stato di bozza e produce versioni pubblicate.
- Valida la correttezza dei modelli e verifica che tutte le dipendenze siano presenti e pubblicate.
- Genera un “bundle” immutabile con i riferimenti alle versioni dipendenti.
- Scrive nella storage e aggiorna il Registry.

### Runtime Gateway

- Si occupa di avviare nuove istanze di processo sul runtime Temporal.
- Fornisce API per consultare stato, log ed eventi di istanze in esecuzione.
- Associa ogni istanza a un tenant e a una versione di processo.

### Altri Componenti

- **Identity & Access Management (IAM)** – integrazione con provider (es. Keycloak), ruoli (Analyst, Owner, Viewer), mapping dei tenant.
- **Database** – Postgres con schema multi-tenant; implementazione di Row Level Security o policy applicative.
- **Storage** – S3/MinIO per i file degli artefatti; i file devono essere immutabili e identificati da versioni.