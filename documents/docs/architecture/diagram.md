---
id: architecture-diagram
title: Diagramma Architetturale
sidebar_label: Diagramma
---

Questo diagramma illustra i principali componenti della piattaforma Stillum Business Portal e i flussi tra loro.

```mermaid
graph TD
    subgraph "Frontend Layer"
        UI["Portal UI<br>(Business Central)"]
    end

    subgraph "Core Services"
        REG["Registry API<br>(Metadata & CRUD)"]
        PUB["Publisher Service<br>(Validation & Bundling)"]
        GW["Runtime Gateway<br>(Orchestration Interface)"]
        NPM["NPM Build Service<br>(React Build & Packaging)"]
    end

    subgraph "Infrastructure & Persistence"
        DB[("Postgres<br>(Multi-tenant Schema)")]
        S3[("MinIO/S3<br>(Artifact Storage)")]
        TEMP[("Temporal Cluster<br>(Workflow Engine)")]
        NPMREG[("NPM Registry<br>(Verdaccio/Internal)")]
    end

    %% Flows
    UI -- "Manage Artifacts" --> REG
    UI -- "Monitor Instances" --> GW
    REG -- "Persist Metadata" --> DB
    REG -- "Store Drafts" --> S3
    PUB -- "Fetch Drafts" --> REG
    PUB -- "Publish Bundles" --> S3
    PUB -- "Trigger Build<br>(MODULE/COMPONENT)" --> NPM
    NPM -- "Resolve Dependencies" --> NPMREG
    NPM -- "Publish Package" --> NPMREG
    GW -- "Start Workflow" --> TEMP
    GW -- "Query State" --> TEMP
    GW -. "Load UI Plugins" .-> NPMREG

    classDef new fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef future fill:#fff3e0,stroke:#e65100,stroke-width:2px,stroke-dasharray: 5 5;
    class UI,REG,PUB,GW,DB,S3,TEMP new;
    class NPM,NPMREG future;
```

> **Nota:** i componenti `NPM Build Service` e `NPM Registry` (tratteggiati) fanno parte della EPIC 10 – Artefatti UI React e Packaging NPM. Il Build Service compila il codice React degli artefatti MODULE/COMPONENT, risolve le dipendenze npm e pubblica il pacchetto risultante sul registry npm interno. Il Runtime Gateway carica i pacchetti npm come plugin UI a run-time.