---
id: modules-deployment
title: Deployment e Packaging
sidebar_label: Deployment
---

La piattaforma deve essere distribuita come soluzione containerizzata, pronta a girare su un cluster Kubernetes (k3s o altri).

## Packaging

- **Helm charts**: creare chart che installano tutti i componenti (Portal UI, Registry API, Publisher, Runtime Gateway, Postgres, MinIO/S3, Temporal). Ogni componente deve essere configurabile tramite valori.
- **Configurazione ambienti**: supporto per ambienti DEV, QA, PROD con parametri separati (database, bucket, namespace).
- **Configurazione multi-tenant**: la chart deve prevedere la creazione e configurazione di tenant e degli ambienti associati.

## Requisiti di Deploy

- Supporto per deployment on-premise (self-host) e SaaS.
- Possibilità di scalare orizzontalmente i componenti di front-end, back-end e runtime.
- Logging e monitoring integrati (Prometheus, Grafana, ELK).

## Integrazione con Temporal

- Il chart deve prevedere la creazione o la connessione a un cluster Temporal (in-cluster o esterno).
- Deve essere possibile configurare namespace per tenant o un namespace condiviso.