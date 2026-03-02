---
id: epic2-form-editor-blueprint
title: Editor Form StillumForms – Blueprint (custom a lungo termine)
sidebar_label: Editor Form – Blueprint
---

# Editor Form StillumForms – Blueprint (custom a lungo termine)

Questo documento descrive l’architettura e il piano per un **editor visivo custom** che lavora direttamente sulla **FormDefinition** StillumForms, senza adattare librerie esterne (form-js, SurveyJS, ecc.). L’editor è pensato per il lungo termine: supporto completo a pools, droplets, triggers, flows e tipi stillum-*.

---

## 1. Obiettivo e principio guida

- **Single source of truth**: lo stato dell’editor è un oggetto **FormDefinition** (o un wrapper minimo con metadati).
- **Nessun adapter**: nessuna conversione da un altro schema; load/save = serializzazione/deserializzazione FormDefinition (YAML/JSON).
- **Preview = FormEngine esistente**: riuso del componente **FormPreview** e del runtime StillumForms per l’anteprima live.

Riferimenti nel codebase:
- `StillumForms/packages/core/src/interfaces/FormDefinition.ts`, `PoolDefinition.ts`, `DropletDefinition.ts`, `TriggerDefinition.ts`
- `StillumForms/.cursor/rules/form-definition-schema.json` (campi e tipi)
- `stillum-modeler/src/ui/FormPreview` e `useFormPreview` (contratto preview)

---

## 2. Architettura a blocchi

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Form Definition Editor                            │
├──────────────┬────────────────────────────┬────────────────────────────┤
│   PALETTE    │     ALBERO / CANVAS         │    PROPERTIES PANEL         │
│              │                             │                            │
│ • Pool       │  form (root)                │  Nodo selezionato:         │
│ • Droplet    │  ├─ pool "Dati"             │  - name, type, label        │
│ • Trigger    │  │  ├─ droplet "Nome"       │  - validation, placement   │
│ (drag source)│  │  └─ droplet "Email"      │  - pool, visible, required  │
│              │  └─ trigger "Invia"         │  - ... (da FormDefinition)  │
│              │  (drag-drop, reorder)       │                            │
├──────────────┴────────────────────────────┴────────────────────────────┤
│  PREVIEW (FormPreview / FormEngine)  │  TOOLBAR: Undo, Redo, Save, ...   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Blocco | Ruolo |
|--------|--------|
| **Palette** | Blocchi trascinabili (Pool, Droplet per tipo, Trigger) che creano nodi nel modello. |
| **Albero** | Rappresentazione ad albero della FormDefinition (form → pools / droplets / triggers); drag-drop per spostare/annidare. |
| **Properties panel** | Form per le proprietà del nodo selezionato; i campi seguono le interfacce StillumForms (PoolDefinition, DropletDefinition, TriggerDefinition). |
| **Preview** | Componente `FormPreview` che riceve `formDefinition` dallo stato; aggiornamento live. |
| **Toolbar** | Azioni globali (undo/redo, salva, export YAML/JSON). |

---

## 3. Stack tecnologico consigliato

| Ruolo | Libreria | Motivo |
|--------|----------|--------|
| Drag & drop | **@dnd-kit/core** + **@dnd-kit/sortable** | Moderno, accessibile, supporta liste e alberi, compatibile React 18. |
| Albero UI | **react-complex-tree** (LukasBach) o **dnd-kit-sortable-tree** | Albero con drag-drop, selezione, icon per tipo; si adatta a struttura form → pools → children. |
| Stato editor | **Zustand** (o React useState + useReducer) | Un solo store “editor”: `formDefinition`, `selectedNodeId`, `history` per undo. |
| Serializzazione | **js-yaml** (già in stillum-modeler) | Load/save YAML; JSON per API. |
| Validazione schema | Tipi **FormDefinition** + eventuale JSON Schema StillumForms | Validazione a runtime sui nodi; in futuro validazione su file completo. |
| Preview | **FormPreview** / **FormEngine** esistenti | Nessun duplicato; stesso runtime StillumForms. |

Alternativa all’albero: un **canvas a “sezioni”** (ogni pool = card, dentro i droplet come blocchi). Richiede più UI ma può essere più intuitivo; il modello resta FormDefinition.

---

## 4. Modello dati nello stato

- **formDefinition: FormDefinition** — Radice; modificato da azioni (addPool, addDroplet, moveNode, updateNode, deleteNode, …).
- **selectedNodeId: string | null** — Id del nodo selezionato (form, pool, droplet, trigger) per il properties panel.
- **history: FormDefinition[]** (o struttura con cursor) — Per undo/redo; ogni modifica push + slice.

Per l’**id** dei nodi: usare un `id` stabile (es. generato alla creazione). FormDefinition oggi ha `name`; si può aggiungere un campo `id` opzionale nell’editor per i riferimenti interni (pools, droplet.pool, ecc.) e mantenere `name` come identificativo logico.

---

## 5. Flussi principali

| Azione | Comportamento |
|--------|----------------|
| **Aggiungere un pool** | Drag “Pool” dalla palette → drop sulla root o su un pool. Crea PoolDefinition con `name`, `type` (es. `vertical`); inserimento in `formDefinition.pools` (o nel pool padre se annidato). |
| **Aggiungere un droplet** | Drag “Droplet” (o “Text”, “Number”, …) → drop su un pool. Crea DropletDefinition con `name`, `type`, `pool` = id/nome del pool; append in `pool.droplets` o in `formDefinition.droplets` con riferimento `pool`. |
| **Aggiungere un trigger** | Drag “Trigger” → drop su form o pool. Crea TriggerDefinition; append in `formDefinition.triggers` (e opzionalmente `pool`). |
| **Modificare proprietà** | Dal properties panel, onChange aggiorna il nodo corrispondente dentro `formDefinition` (immutabile: clone del branch interessato e replace). |
| **Spostare nodo** | Drag nell’albero da una posizione a un’altra (altro pool, altro ordine). Aggiorna `formDefinition` (ordine in `pools`/`droplets`/`triggers`, o riferimento `pool`). |
| **Preview** | A ogni cambio di `formDefinition`, `<FormPreview schema={formDefinition} />` si aggiorna (stesso pattern di `useFormPreview` con oggetto invece che stringa). |

---

## 6. Collocazione nel repository

| Opzione | Pro | Contro |
|--------|-----|--------|
| **stillum-modeler** | Riuso di pattern UI e FormPreview; stesso contesto “artefatto” con BPMN/DMN. | Dipendenze a StillumForms e FormPreview già presenti. |
| **portal-ui** | Editor nella Business Central (pagina `/editor/:id/:version` per artefatti tipo form). | Dipendenze a StillumForms e FormPreview vanno esposte (package condiviso o build che include StillumForms). |

La scelta dipende da dove gli utenti devono editare i form (solo in portal-ui vs anche in stillum-modeler). L’architettura dell’editor (stato FormDefinition, palette, albero, properties, preview) resta la stessa.

---

## 7. Fasi di implementazione (MVP → completo)

### Fase 1 – Lettura + albero
- Caricare FormDefinition (da JSON/YAML string o da API).
- Renderizzare albero read-only (form → pools → droplets/triggers).
- Selezione nodo → properties panel in sola lettura (solo visualizzazione campi).

### Fase 2 – Modifica da properties
- Properties panel editabile; modifiche applicate in modo immutabile a `formDefinition`.
- Preview aggiornata a ogni modifica.

### Fase 3 – Drag & drop
- Palette con Pool, Droplet (tipi base), Trigger.
- Drop su root/pool che crea nodi e aggiorna `formDefinition`.
- Reorder e spostamento tra pool nell’albero (se il tree component lo supporta).

### Fase 4 – Persistenza
- Salva: FormDefinition → YAML/JSON string; in portal-ui chiamata a API (payloadRef / versione).
- Load: come già in stillum-modeler (YAML/JSON → FormDefinition).
- Undo/redo (history stack).

### Fase 5 – Arricchimento
- Tutti i tipi droplet (stillum-searchbar, stillum-yaml-editor, ecc.) in palette e in properties (campi specifici per tipo).
- Trigger con signalName, variant, pool.
- Validazione schema (required `name`/`type`, riferimenti `pool` validi).
- Flows: UI minimale (lista flow, edit JSON/YAML) o integrazione futura con designer XState.

---

## 8. Riepilogo

- **Editor custom a lungo termine** = stato = FormDefinition, UI = palette + albero + properties + preview (FormPreview), persistenza = YAML/JSON.
- Stack: **dnd-kit** (drag-drop), **react-complex-tree** (o simile) per l’albero, **Zustand** (o reducer) per lo stato, **js-yaml** e tipi StillumForms per load/save e validazione.
- Sviluppo per fasi: albero read-only → edit da properties → drag-drop da palette e nell’albero → save/load e undo → tipi avanzati e flows.

---

## Riferimenti

- Piano di sviluppo: [EPIC 2 – Portal UI (v0)](/docs/piano-di-sviluppo#epic-2--portal-ui-v0), FEATURE 2.4 – Editor integrati, US-2.4.3 – Editor StillumForms.
- StillumForms: `StillumForms/packages/core`, `StillumForms/.cursor/rules/form-definition-schema.json`.
- Preview esistente: `stillum-modeler/src/ui/FormPreview`, `useFormPreview.ts`.
