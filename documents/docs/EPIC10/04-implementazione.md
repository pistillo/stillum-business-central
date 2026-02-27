---
id: epic10-implementazione
title: EPIC 10 – Implementazione
sidebar_label: Implementazione
---

# Implementazione – Artefatti UI React e Packaging NPM

## Architettura dei componenti

### NPM Build Service

Servizio dedicato alla compilazione del codice React degli artefatti MODULE/COMPONENT:

- **Input:** codice sorgente React/TypeScript + mappa dipendenze npm.
- **Processo:** installazione dipendenze in sandbox → compilazione con Vite/Rollup → generazione pacchetto npm.
- **Output:** pacchetto npm pubblicato su registry interno.
- **Tecnologia suggerita:** container Node.js con Vite/Rollup; API REST per trigger build.

### Registry NPM interno (Verdaccio)

- Registry npm privato per ospitare i pacchetti generati.
- Autenticazione per tenant (token-based).
- Integrazione con Docker Compose e Helm chart.

### Plugin Loader

Meccanismo per caricare dinamicamente i pacchetti npm come plugin UI:

- **Opzione A:** Module Federation (Webpack/Vite) – caricamento remoto a build time.
- **Opzione B:** Dynamic Import con SystemJS – caricamento a runtime via URL.
- **Opzione C:** Script injection con contratto globale – approccio piu semplice.

La scelta sara determinata durante l'implementazione in base ai vincoli di compatibilita con la Portal UI esistente.

## Flusso end-to-end

```
1. Sviluppatore crea artefatto MODULE nella UI
2. Aggiunge COMPONENT collegati (pool, droplet, trigger)
3. Scrive codice React nell'editor Monaco (TypeScript)
4. Seleziona dipendenze npm
5. Salva come DRAFT nel Registry
6. Avvia pubblicazione → Publisher invoca NPM Build Service
7. Build Service:
   a. Installa dipendenze npm in sandbox
   b. Compila codice React con Vite/Rollup
   c. Genera pacchetto npm
   d. Pubblica su Verdaccio
8. Publisher salva npm_package_ref nella versione
9. Versione diventa PUBLISHED
10. Runtime carica il pacchetto npm come plugin UI
```

## Stack tecnologico aggiuntivo

| Componente | Tecnologia | Note |
|------------|------------|------|
| Editor codice | Monaco Editor (TypeScript/TSX) | Gia presente per XML/JSON; da estendere |
| Bundler | Vite o Rollup | Compilazione codice React |
| Runtime Node.js | Node.js 20+ in container | Per il Build Service |
| Registry npm | Verdaccio | Registry privato npm |
| Plugin loading | Module Federation o Dynamic Import | Da valutare |

## Sicurezza

- La build npm avviene in container sandbox con risorse limitate (CPU, memoria, tempo).
- Le dipendenze npm vengono verificate con `npm audit` prima della build.
- Il registry npm interno e accessibile solo tramite autenticazione.
- I plugin caricati a runtime sono isolati tramite iframe sandbox o shadow DOM.
