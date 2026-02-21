---
slug: phase-6
title: Fase 6 – Packaging & distribuzione
---

## Obiettivo della fase

La **Fase 6** si concentra sulla preparazione della piattaforma per la distribuzione in ambienti diversi.  Si tratta di impacchettare tutti i componenti (UI, servizi backend, database, storage, engine Temporal) in artefatti distribuibili (Docker image, Helm charts) e di configurare pipeline di CI/CD per build, test e release.

## Helm charts e immagini Docker

* **Dockerizzazione**: assicurarsi che ogni componente (Portal UI, Registry API, Publisher, Runtime Gateway) disponga di un `Dockerfile` ottimizzato (dimensione ridotta, multi-stage build, variabili d’ambiente).  Preparare immagini per servizi esterni (Postgres, MinIO, Temporal) solo per ambiente di sviluppo.
* **Helm charts**: creare chart Helm modulari che permettano di installare e configurare il sistema su cluster Kubernetes.  Ogni chart deve avere valori predefiniti e parametri personalizzabili (es. image tag, replica count, risorse, endpoint, credenziali, ingress).  Prevedere un chart “umbrella” che includa tutti i componenti.
* **Configurabilità**: i valori Helm devono consentire di scegliere tra componenti interni ed esterni (es. utilizzare un database esterno invece di installare Postgres, o un bucket S3 invece di MinIO) e di configurare parametri come nomi di bucket, namespace Temporal, domini Keycloak.

## CI/CD e release

* **Pipeline di build**: configurare pipeline (GitHub Actions, GitLab CI o analoghe) che eseguano build, linting, test unitari e integrazione per ogni commit.  Le pipeline devono produrre immagini Docker versionate e pacchetti Helm.
* **Test automatici**: integrare test end‑to‑end che avviano l’intero stack in un ambiente di test (es. mediante kind o minikube) per verificare il funzionamento di API e UI prima del merge o della release.
* **Release**: definire una strategia di versioning semantico (es. `vMajor.Minor.Patch`) per rilasciare nuove versioni della piattaforma.  Pubblicare le immagini su un registry (Docker Hub, GitHub Packages) e i chart su un repository Helm (ad esempio GitHub Pages o un chart repository interno).
* **Migrazioni del database**: utilizzare strumenti come Flyway o Liquibase per gestire le migrazioni dello schema.  Le pipeline devono eseguire automaticamente le migrazioni su ambienti di staging/production al momento del deploy.

## Deliverable

* Dockerfile per ogni componente, ottimizzati e pronti per la produzione.
* Chart Helm modulare con valori documentati e un chart complessivo per l’intero sistema.
* Pipeline CI/CD configurata con build, test, publish di immagini e chart e deploy su ambienti di test.
* Documentazione di deploy che spieghi come installare la piattaforma su cluster self‑host (k3s) o su cloud provider (EKS, AKS, GKE).

## Considerazioni future

Questa fase abilita la distribuzione continua.  In seguito si potrà estendere con deployment canarini, rollback automatici, supporto multi‑architettura (arm64), verifica della compatibilità tra versioni (Helm diff) e gestione delle secret tramite operatori (es. HashiCorp Vault). 