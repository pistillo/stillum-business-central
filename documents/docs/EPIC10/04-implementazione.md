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
- **Processo (worktree):** generazione progetto temporaneo → `npm install` (con `--ignore-scripts`) → bundling con esbuild (ESM) → `npm publish` su Nexus.
- **Output:** pacchetto npm pubblicato su registry interno (Nexus) + `npmPackageRef`.
- **Tecnologia (worktree):** Node.js + Fastify + esbuild; API REST `POST /api/build`.

### Registry NPM interno (Nexus)

- Nexus Repository Manager usato come registry npm interno:
  - repository hosted per publish
  - repository group per install (risoluzione dipendenze)
- Integrazione con Docker Compose (servizio `nexus`).

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
3. Scrive codice React nell'editor Theia (TypeScript)
4. Seleziona dipendenze npm
5. Salva come DRAFT nel Registry
6. Avvia pubblicazione → Publisher invoca NPM Build Service
7. Build Service:
   a. Installa dipendenze npm in sandbox
   b. Compila/bundla codice React con esbuild
   c. Pubblica su Nexus
8. Publisher salva npm_package_ref nella versione
9. Versione diventa PUBLISHED
10. Runtime carica il pacchetto npm come plugin UI
```

## Stack tecnologico aggiuntivo

| Componente | Tecnologia | Note |
|------------|------------|------|
| Editor codice | Stillum Theia (iframe) | IDE per TypeScript/React; Monaco resta per XML/JSON/YAML |
| Bundler | esbuild | Bundling ESM, externalize react/react-dom |
| Runtime Node.js | Node.js 20+ in container | Per il Build Service |
| Registry npm | Nexus | Registry privato npm |
| Plugin loading | Module Federation o Dynamic Import | Da valutare |

## Sicurezza

- La build npm avviene in container sandbox con risorse limitate (CPU, memoria, tempo).
- Installazione dipendenze con `npm install --ignore-scripts --no-fund --no-audit` per ridurre superficie d’attacco; verifiche di sicurezza (audit/SCA) sono da integrare in CI.
- Il registry npm interno e accessibile solo tramite autenticazione.
- I plugin caricati a runtime sono isolati tramite iframe sandbox o shadow DOM.

---

## US-10.1.1 – Implementazione completata

### Dettaglio tecnico

#### Entity aggiornate
- `ArtifactVersion`: campi `npmDependencies`, `npmPackageRef` e `sourceRef` (bundle sorgenti su MinIO)
- Campi DB principali: `npm_dependencies` (JSONB), `npm_package_ref`, `source_ref` (S3 key)
- Colonne `source_code`, `build_snapshot`, `source_files` restano mappate per compatibilità/migrazione

#### DTOs creati/modificati
- `CreateModuleRequest`: per creazione artefatti MODULE
- `CreateComponentRequest`: per creazione artefatti COMPONENT con `parentModuleId`
- `ArtifactVersionResponse`: esteso con i nuovi campi
- `CreateVersionRequest` e `UpdateVersionRequest`: estesi per supportare i nuovi campi

#### Services
- `ArtifactService.createModule()`: crea MODULE con versione iniziale "0.1.0"
- `ArtifactService.createComponent()`: crea COMPONENT con validazione MODULE padre
- `ArtifactVersionService`: gestisce creazione e aggiornamento versioni con i nuovi campi

#### Resources
- `POST /api/tenants/{tenantId}/artifacts/modules`: endpoint per creare MODULE
- `POST /api/tenants/{tenantId}/artifacts/components`: endpoint per creare COMPONENT

#### Validazioni implementate
1. **COMPONENT deve avere parent MODULE**: verificato in `ArtifactService.createComponent()`
2. **parentModuleId deve esistere nel tenant**: verifica esistenza e tipo MODULE
3. **Versioni auto-creazione**: sia MODULE che COMPONENT vengono creati con versione "0.1.0"

#### Test
- Test unitari estesi in `ArtifactResourceTest`: 4 nuovi test
- Tutti i 13 test passano
- Migrazione DB V10 applicata con successo

### File di riferimento
- Migrazione: `registry-api/src/main/resources/db/migration/V10__add_module_component_fields.sql`
- Entity: `registry-api/src/main/java/com/stillum/registry/entity/ArtifactVersion.java`
- DTOs: `registry-api/src/main/java/com/stillum/registry/dto/request/`
- Services: `registry-api/src/main/java/com/stillum/registry/service/`
- Resources: `registry-api/src/main/java/com/stillum/registry/resource/ArtifactResource.java`
- Test: `registry-api/src/test/java/com/stillum/registry/resource/ArtifactResourceTest.java`
