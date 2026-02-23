---
id: epic2-obiettivo
title: Obiettivo e deliverable della Fase 2 (EPIC 2)
sidebar_label: Obiettivo e deliverable
---

## Obiettivo della fase

La Fase 2 (EPIC 2 – Portal UI v0) realizza la **prima interfaccia web operativa** della piattaforma, con un flusso end‑to‑end:

1. login (OIDC/Keycloak),
2. selezione tenant,
3. navigazione catalogo e dettaglio,
4. creazione/modifica bozza,
5. pubblicazione tramite Publisher.

L’EPIC 2 abilita quindi un uso reale dei servizi sviluppati in EPIC 1 (Registry API, Storage, Publisher) da parte di analisti e process owner.

Restano esplicitamente fuori scope:

- editor BPMN/DMN/forms completi (vengono introdotti in iterazioni successive),
- wizard publish avanzato con dipendenze/validazioni dettagliate,
- workflow di approvazione e ciclo di vita completo (EPIC 3),
- runtime/task (EPIC 4),
- UI di gestione utenti/ruoli (EPIC 5).

---

## Componenti coinvolti

### Portal UI

Applicazione web React (Vite) con:

- routing e route guard (auth/tenant),
- pagine: home, catalogo, dettaglio, editor v0, publish v0,
- integrazione OIDC con Keycloak e gestione token in sessione.

### Registry API

Backend per:

- CRUD artefatti e versioni,
- storage payload tramite presigned URL,
- lista con filtri (type/status/area/tag) e paginazione.

### Publisher

Backend per:

- pubblicazione versione su environment (`POST /publish`),
- creazione bundle immutabile e audit.

---

## Deliverable della Fase 2

1. **Portal UI v0** (`portal-ui/`):
   - login OIDC e callback,
   - selezione tenant,
   - catalogo paginato con filtri base,
   - dettaglio artefatto e lista versioni,
   - editor v0 con caricamento/salvataggio payload via presigned URL,
   - publish v0 (invocazione Publisher e visualizzazione esito base).
2. **Integrazione con backend**:
   - chiamate a Registry API e Publisher con `Authorization: Bearer <token>`,
   - propagazione `tenantId` nel path per tutte le chiamate.
3. **Documentazione**:
   - pagine EPIC 2 (stato, requisiti, implementazione),
   - pagina di fase esistente (`phase2-*`) allineata alla v0.

---

## Stato rispetto ai deliverable

Per una fotografia aggiornata dell’implementazione in questo worktree vedi [Stato EPIC 2](epic2-stato).

Per la documentazione di fase vedi anche:

- `documents/docs/phase2-overview.md`
- `documents/docs/phase2-portal-ui.md`

