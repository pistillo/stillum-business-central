---
id: epic0-stato
title: Stato EPIC 0 – Setup e Fondamenta
sidebar_label: Stato EPIC 0
---

# Stato EPIC 0 – Setup e Fondamenta

**Obiettivo dell'EPIC:** Preparare requisiti, modello dati, stack tecnologico e infrastruttura di sviluppo.

**Contesto di questo branch:** In questo repository è presente **solo la documentazione**. Il codice (portal-ui, registry-api, publisher, runtime-gateway), l'infrastruttura (Docker Compose, Helm, CI) e gli script sono stati rimossi; restano i deliverable documentali dell'EPIC 0.

**Stato complessivo:** **Completato sul piano documentale** — Requisiti, modello dati, stack tecnologico e guida all'ambiente di sviluppo sono documentati in questa cartella. L'implementazione del codice e dell'infrastruttura (quando presente) è descritta nelle guide; in questo branch non è presente codice da verificare.

---

## Riepilogo per FEATURE

| FEATURE | Stato | Note |
|--------|--------|------|
| **0.1** Analisi Requisiti e Modellazione del Dominio | ✅ Completato | Requisiti e modello dati documentati in questa cartella |
| **0.2** Scelta dello Stack Tecnologico | ✅ Completato | Stack documentato (Java/Spring, React, PostgreSQL, MinIO, Temporal) |
| **0.3** Infrastruttura di Sviluppo | 📄 Documentato | Struttura repo, Docker Compose, Helm e CI sono descritte nelle guide; in questo branch non è presente codice né infrastruttura |

---

## Dettaglio per FEATURE e Task

### FEATURE 0.1 – Analisi Requisiti e Modellazione del Dominio

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.1.1.1 | ✅ | Requisiti su BPMN, DMN, Forms, Request in [Requisiti Fase 0](epic0-requisiti) |
| T-0.1.1.2 | ✅ | Ciclo di vita (bozza → revisione → approvazione → pubblicazione) in requisiti e modello dati |
| T-0.1.1.3 | ✅ | Multi-tenant, RBAC, auditing, ambienti DEV/QA/PROD in [Requisiti](epic0-requisiti) |
| T-0.1.1.4 | ✅ | Documento requisiti → [Requisiti](epic0-requisiti) |
| T-0.1.2.1 | ✅ | Entità definite in [Modello dati](epic0-modello-dati) |
| T-0.1.2.2 | ✅ | Diagramma ER e relazioni in [Modello dati](epic0-modello-dati) |
| T-0.1.2.3 | ✅ | Enum (tipo artefatto, stato artefatto, stato istanza, tipo task) in [Modello dati](epic0-modello-dati) |
| T-0.1.2.4 | ✅ | Documento modello dati → [Modello dati](epic0-modello-dati) |

---

### FEATURE 0.2 – Scelta dello Stack Tecnologico

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.2.1.1 | ✅ | Backend Java documentato in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.1.2 | ✅ | Strategia API REST in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.1.3 | ✅ | JPA/Hibernate e Flyway documentati in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.1.4 | ✅ | PostgreSQL, MinIO/S3, Temporal in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.2.1 | ✅ | React, shadcn/ui, Tailwind documentati in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.2.2 | ✅ | Gestione stato (Redux/Zustand) in [Stack tecnologico](epic0-stack-tecnologico) |
| T-0.2.2.3 | ✅ | Editor BPMN/DMN/StillumForms/Request: sviluppati nel progetto stillum-modeler |
| T-0.2.2.4 | ✅ | i18n e data fetching in [Stack tecnologico](epic0-stack-tecnologico) |

---

### FEATURE 0.3 – Infrastruttura di Sviluppo

In questo branch **non è presente codice né infrastruttura**. I task sotto sono considerati soddisfatti dalla **documentazione** che descrive come allestire ambiente, struttura repo e CI.

#### US-0.3.1 – Setup del cluster Kubernetes

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.3.1.1 | 📄 | k3s e Docker Compose descritti in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.1.2 | 📄 | Namespace e Helm in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.1.3 | 📄 | PostgreSQL in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.1.4 | 📄 | MinIO in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.1.5 | 📄 | Temporal in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.1.6 | 📄 | Keycloak (opzionale) in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.1.7 | 📄 | Connettività e healthcheck descritti in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |

#### US-0.3.2 – Struttura del repository e standard di codice

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.3.2.1 | 📄 | Struttura repo (portal-ui, registry-api, publisher, runtime-gateway, docs, charts) in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) — non presente in questo branch |
| T-0.3.2.2 | 📄 | ESLint e Prettier descritti in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.2.3 | 📄 | Linter backend e EditorConfig in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.2.4 | 📄 | Pre-commit (Husky) menzionato come azione consigliata in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.2.5 | 📄 | .editorconfig, .gitignore, README descritti in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) — in questo branch: solo `documents/`, .gitignore, README |

#### US-0.3.3 – Pipeline CI iniziale

| Task | Stato | Evidenza |
|------|--------|----------|
| T-0.3.3.1 | 📄 | Lint e trigger CI descritti in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) — workflow non presenti in questo branch |
| T-0.3.3.2 | 📄 | Build backend documentata in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.3.3 | 📄 | Test unitari documentati in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.3.4 | 📄 | Step migrazioni DB indicato come azione consigliata in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| T-0.3.3.5 | 📄 | Build frontend documentata in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |

**Legenda:** 📄 = documentato (guida presente); in questo branch non è presente codice/infra da eseguire.

---

## Deliverable prodotti (in questo branch)

| Deliverable | Documento |
|-------------|-----------|
| Requisiti | [Requisiti](epic0-requisiti) |
| Modello dati | [Modello dati](epic0-modello-dati) |
| Stack tecnologico | [Stack tecnologico](epic0-stack-tecnologico) |
| Ambiente di sviluppo | [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) |
| Obiettivo e deliverable | [Obiettivo e deliverable](epic0-obiettivo) |
| Struttura repository | Descritta in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo); in questo branch è presente solo la cartella `documents/` |

---

## Azioni consigliate (in un branch con implementazione)

Quando il codice e l'infrastruttura saranno di nuovo presenti nel repository:

1. **Pre-commit hooks**: Aggiungere Husky (o equivalente) con lint frontend e, se possibile, check stile Java.
2. **CI – Migrazioni DB**: Aggiungere uno step in CI che esegua Flyway su un DB di test.
3. **Cartella `/ci`**: Creare `ci/` per script o config condivisi (opzionale se si usa solo GitHub Actions).
4. **Keycloak** (opzionale): Aggiungere servizio Keycloak a `docker-compose.yml` e documentarlo in [Ambiente di sviluppo](epic0-ambiente-di-sviluppo).

In questo branch (solo documentazione) l'EPIC 0 è considerato **completato sul piano dei deliverable documentali**.

---

## Checklist deliverable EPIC 0 (rispetto al piano)

Verifica che tutti gli output richiesti dal [Piano di Sviluppo](../piano-di-sviluppo#epic-0--setup-e-fondamenta) siano coperti:

| Output richiesto dal piano | Dove si trova | OK |
|----------------------------|---------------|-----|
| **FEATURE 0.1** | | |
| Verbale interviste / requisiti artefatti (T-0.1.1.1) | [Requisiti](epic0-requisiti) – sezione Artefatti, NFR | ✅ |
| Diagramma stati pubblicazione (T-0.1.1.2) | [Requisiti](epic0-requisiti) – diagramma stati + testo ciclo di vita | ✅ |
| Requisiti NFR multi-tenant, RBAC, audit, ambienti (T-0.1.1.3) | [Requisiti](epic0-requisiti) – sezioni dedicate + Non-functional | ✅ |
| Documento requisiti finale (T-0.1.1.4) | [Requisiti](epic0-requisiti) | ✅ |
| Lista entità con attributi (T-0.1.2.1) | [Modello dati](epic0-modello-dati) | ✅ |
| Diagramma ER e relazioni (T-0.1.2.2) | [Modello dati](epic0-modello-dati) | ✅ |
| Enumerazioni (T-0.1.2.3) | [Modello dati](epic0-modello-dati) – nelle entità | ✅ |
| Documento modello dati (T-0.1.2.4) | [Modello dati](epic0-modello-dati) | ✅ |
| **FEATURE 0.2** | | |
| Scelta backend / ADR (T-0.2.1.1) | [Stack tecnologico](epic0-stack-tecnologico) – Backend | ✅ |
| Strategia API REST (T-0.2.1.2) | [Stack tecnologico](epic0-stack-tecnologico) | ✅ |
| ORM e migrazioni (T-0.2.1.3) | [Stack tecnologico](epic0-stack-tecnologico) – JPA, Flyway | ✅ |
| PostgreSQL, MinIO, Temporal (T-0.2.1.4) | [Stack tecnologico](epic0-stack-tecnologico) | ✅ |
| React, shadcn, Tailwind (T-0.2.2.1) | [Stack tecnologico](epic0-stack-tecnologico) – Frontend | ✅ |
| State management (T-0.2.2.2) | [Stack tecnologico](epic0-stack-tecnologico) | ✅ |
| Editor bpmn.io, dmn.io, StillumForms (T-0.2.2.3) | [Stato](epic0-stato) – stillum-modeler; [Stack](epic0-stack-tecnologico) | ✅ |
| i18n e data fetching (T-0.2.2.4) | [Stack tecnologico](epic0-stack-tecnologico) | ✅ |
| **FEATURE 0.3** | | |
| Setup cluster / ambiente (T-0.3.1.x) | [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) – k3s, Docker Compose, Helm | ✅ |
| Struttura repo e standard (T-0.3.2.x) | [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) | ✅ |
| Pipeline CI (T-0.3.3.x) | [Ambiente di sviluppo](epic0-ambiente-di-sviluppo) | ✅ |

**Conclusione:** Sì, dell'EPIC 0 abbiamo tutto sul piano documentale. Tutti i deliverable indicati nel piano (requisiti, modello dati, stack, ambiente e CI) sono coperti dai documenti in questa cartella.
