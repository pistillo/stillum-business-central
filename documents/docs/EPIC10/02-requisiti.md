---
id: epic10-requisiti
title: EPIC 10 – Requisiti
sidebar_label: Requisiti
---

# Requisiti – Artefatti UI React e Packaging NPM

## Requisiti funzionali

### RF-10.1 – Nuovi tipi di artefatti

- Il sistema deve supportare artefatti di tipo `MODULE` e `COMPONENT` accanto ai tipi esistenti (`PROCESS`, `RULE`, `FORM`, `REQUEST`).
- Un `MODULE` rappresenta un modulo UI complesso, composto da uno o piu componenti.
- Un `COMPONENT` rappresenta un singolo elemento UI (pool, droplet o trigger) ed e collegato a un modulo padre tramite dipendenza.

### RF-10.2 – Codice sorgente React

- Ogni versione di un artefatto MODULE o COMPONENT deve poter memorizzare codice sorgente React/TypeScript.
- Il codice sorgente deve essere editabile tramite un editor Monaco con supporto TypeScript e IntelliSense.

### RF-10.3 – Dipendenze npm

- Ogni versione di un artefatto MODULE o COMPONENT deve poter dichiarare una lista di dipendenze npm (nome e versione).
- L'interfaccia deve consentire la ricerca e selezione di librerie npm da un registry.

### RF-10.4 – Build e generazione pacchetto npm

- Al momento della pubblicazione, il sistema deve compilare il codice React, risolvere le dipendenze npm e generare un pacchetto npm.
- Il pacchetto npm deve essere pubblicato su un registry npm interno (Verdaccio o equivalente).
- Il riferimento al pacchetto generato (`npm_package_ref`) deve essere memorizzato nella versione dell'artefatto.

### RF-10.5 – Relazione Modulo → Componenti

- Un `COMPONENT` deve dichiarare una dipendenza verso il `MODULE` padre tramite la tabella `dependency` esistente.
- Il sistema deve risolvere il grafo completo Modulo→Componenti e includere tutti i componenti nel pacchetto npm del modulo.

### RF-10.6 – Wizard di creazione

- La UI deve offrire un wizard guidato per creare nuovi pool, droplet e trigger con template di codice iniziale.
- Il wizard deve precompilare le dipendenze npm comuni e collegare automaticamente il componente al modulo padre.

### RF-10.7 – Caricamento plugin a runtime

- Il runtime deve poter caricare dinamicamente i pacchetti npm generati come plugin UI.
- I plugin devono rispettare un contratto/interfaccia definita per pool, droplet e trigger.
- I plugin devono essere isolati (sandboxing) per evitare interferenze con il sistema principale.

## Requisiti non funzionali

### RNF-10.1 – Sicurezza della build

- La pipeline di build npm deve eseguirsi in ambiente isolato (container sandbox) per prevenire esecuzione di codice malevolo.
- Le dipendenze npm devono essere verificate contro vulnerability database (audit).

### RNF-10.2 – Performance

- La build di un pacchetto npm non deve superare un tempo ragionevole (< 60 secondi per componenti semplici).
- Il caricamento dei plugin a runtime deve essere asincrono e non bloccare il rendering principale.

### RNF-10.3 – Compatibilita

- I pacchetti npm generati devono essere compatibili con le versioni di React e TypeScript utilizzate dalla Portal UI.
- Il registry npm interno deve supportare autenticazione e autorizzazione per tenant.
