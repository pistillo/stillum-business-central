---
id: modules-developer-mode
title: Modalità Sviluppatore e Git
sidebar_label: Developer Mode
---

Oltre all’esperienza business, la piattaforma deve offrire una **Modalità Sviluppatore** per integrare i flussi di lavoro DevOps.

## Funzionalità

- **Esportazione su Git**: possibilità di esportare le versioni pubblicate (bundle) o l’intero artefatto in un repository Git per audit, backup o CI/CD.
- **Importazione da Git**: eventuale import di definizioni create offline; integrabile con pipeline di build.
- **Modalità offline**: gli sviluppatori possono clonare un repository, modificare file BPMN/DMN/JSON e re-importare nel Registry tramite API.
- Integrazione con sistemi CI/CD per promuovere automaticamente versioni su ambienti (DEV→QA→PROD).

## Scope

Queste funzionalità non sono destinate agli utenti business, ma a team tecnici che desiderano controllare il versionamento a livello di file. Devono essere progettate come opzioni, senza impattare l’esperienza utente del portale.