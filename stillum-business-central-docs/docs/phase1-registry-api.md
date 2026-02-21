---
slug: phase1-registry-api
title: Registry API – Fase 1
---

La **Registry API** è il cuore del backend della piattaforma: gestisce la persistenza degli artefatti, delle loro versioni e delle relazioni di dipendenza.  In questa fase si progettano gli endpoint REST necessari per creare e consultare le definizioni di processi, regole, moduli e request, assicurando l’isolamento tra tenant.

## Modello dati riassuntivo

Nella Fase 0 sono state definite le entità `Tenant`, `Artifact`, `ArtifactVersion` e `Publication`.  In questa fase si utilizzano queste entità come base per l’API:

* **Artifact**: rappresenta un elemento di business (es. processo BPMN, regola DMN, modulo, request). Ha un identificativo stabile (`artifactId`), metadati (titolo, descrizione, tag, area/modulo) e uno stato (ad esempio attivo o ritirato).  Un artefatto appartiene sempre a un `Tenant`.
* **ArtifactVersion**: identifica una versione di un artefatto. Contiene un riferimento al file (payload), una versione numerica o semantica, lo stato della versione (`Draft` o `Published`), le dipendenze verso altre versioni e informazioni sul creatore.  Ogni versione appartiene a un artefatto.
* **Dependency**: relazione tra una versione di un artefatto e una versione di un altro artefatto (es. un processo BPMN che usa una regola DMN).  Le dipendenze sono opzionali ma devono essere risolte prima della pubblicazione.

## Principi API

* Tutti gli endpoint sono sotto il prefisso `/tenants/{tenantId}` per garantire il **scope multi‑tenant**.
* L’autenticazione restituisce un `tenantId` che viene usato per limitare la visibilità dei dati.
* Le operazioni di modifica si applicano solo alle bozze (`Draft`).  Una volta pubblicata una versione non può più essere modificata o cancellata.
* I payload (file BPMN/DMN/JSON) non vengono salvati nel database ma nello storage oggetti. L’API restituisce e accetta un `payloadRef` che rappresenta il percorso nel bucket.

## Endpoint principali

### Gestione degli artefatti

| Metodo e percorso | Descrizione |
|------------------|-------------|
| **`POST /tenants/{tenantId}/artifacts`** | Crea un nuovo artefatto. Richiede il tipo (`process`, `rule`, `form`, `request`), titolo, descrizione opzionale, tag e area. Restituisce `artifactId`. |
| **`GET /tenants/{tenantId}/artifacts`** | Restituisce la lista degli artefatti del tenant con filtri per tipo, stato, tag, area e ricerca testuale su titolo/descrizione. Supporta paginazione. |
| **`GET /tenants/{tenantId}/artifacts/{artifactId}`** | Ritorna i metadati dell’artefatto e l’elenco delle sue versioni. |
| **`PUT /tenants/{tenantId}/artifacts/{artifactId}`** | Aggiorna i metadati di un artefatto (titolo, descrizione, tag, area). Non modifica le versioni. |
| **`DELETE /tenants/{tenantId}/artifacts/{artifactId}`** | Marca un artefatto come ritirato. Non cancella le versioni esistenti. |

### Gestione delle versioni

| Metodo e percorso | Descrizione |
|------------------|-------------|
| **`POST /tenants/{tenantId}/artifacts/{artifactId}/versions`** | Crea una nuova versione in bozza. Accetta metadati e un riferimento al payload (file caricato su storage) e restituisce l’identificativo della versione. |
| **`GET /tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}`** | Restituisce i dettagli della versione, incluso stato, payloadRef e dipendenze. |
| **`PUT /tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}`** | Aggiorna una bozza: modifica metadati, aggiorna il payloadRef o aggiunge note. |
| **`DELETE /tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}`** | Elimina una versione in bozza. Non è permesso cancellare versioni pubblicate. |
| **`POST /tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies`** | Registra le dipendenze della bozza verso altre versioni (`artifactId` e `versionId` dei dipendenti). |
| **`GET /tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies`** | Elenca le dipendenze di una versione. |

### Ricerca e discovery

| Metodo e percorso | Descrizione |
|------------------|-------------|
| **`GET /tenants/{tenantId}/search/artifacts`** | Esegue una ricerca full‑text sugli artefatti del tenant utilizzando titolo, descrizione e tag. Accetta parametri di tipo, tag, area e stato. |

## Considerazioni di sicurezza

* L’API implementa **policy di row‑level security** a livello di database per garantire che un tenant non possa accedere ai dati di un altro.  Tutte le query devono filtrare per `tenantId`.
* Le operazioni di aggiornamento e cancellazione devono verificare che l’utente abbia il **ruolo appropriato** (es. solo gli Analyst o i Process Owner possono creare e modificare bozze; solo i Process Owner possono ritirare artefatti pubblicati).
* I payload devono essere caricati tramite un endpoint dedicato allo storage, che restituisce un `payloadRef` sicuro da salvare nel DB.  L’API non espone mai direttamente il contenuto del file, ma fornisce un URL presignato o un token temporaneo per il download.

## Evoluzioni future

Nelle fasi successive la Registry API sarà estesa con:

* Endpoint per import/export di pacchetti provenienti da Git o da altri ambienti.
* Supporto per **branch e merge** nelle versioni, per scenari più avanzati di collaborazione.
* API GraphQL (opzionale) per una maggiore flessibilità di query lato client.