---
slug: phase1-storage
title: Storage dei Payload – Fase 1
---

L’**object storage** è la componente che ospita i file reali degli artefatti (processi, regole, moduli, request) e i bundle di pubblicazione.  In questa fase si definisce come integrare MinIO/S3 nella piattaforma in modo da garantire l’immutabilità dei payload e l’isolamento tra tenant.

## Motivazioni

* Separare i metadati dai file migliora la scalabilità: il database memorizza solo riferimenti (`payloadRef` o `bundleRef`), mentre i file vengono gestiti da uno storage oggetti che può crescere indipendentemente.
* Sia **MinIO** (per ambienti self‑host) che **Amazon S3** (per ambienti cloud) espongono un’API compatibile S3.  Ciò consente di mantenere il codice di accesso uguale e di passare da un backend all’altro semplicemente modificando endpoint e credenziali.
* Ogni file viene conservato in maniera immutabile: non esiste operazione di aggiornamento, ma solo di creazione.  Eventuali nuove versioni generano un nuovo percorso.

## Struttura dei percorsi

Per garantire l’isolamento tra tenant e facilitare la gestione, si propone una **nomenclatura standard** per i percorsi all’interno del bucket:

```
<bucket>/
  └── tenant-<tenantId>/
        ├── artifacts/
        │     └── <artifactType>/<artifactId>/<versionId>.xml|json|yaml
        └── bundles/
              └── <artifactType>/<artifactId>/<versionId>.zip
```

* `tenant-<tenantId>`: directory radice del tenant.  Permette di applicare policy di accesso a livello di cartella.
* `artifacts/<artifactType>/<artifactId>/<versionId>`: contiene il file originale dell’artefatto.  L’estensione dipende dal tipo (XML per BPMN e DMN, JSON per form e request).
* `bundles/<artifactType>/<artifactId>/<versionId>.zip`: contiene il pacchetto generato dal publisher, comprensivo del manifest e dei payload delle dipendenze.

## Operazioni di base

### Upload del payload

1. Il client (frontend o API) effettua una richiesta di upload al servizio storage del portale.
2. Il servizio genera un **URL presignato** o un token temporaneo per caricare il file direttamente su MinIO/S3.  Il percorso include `tenantId`, `artifactType`, `artifactId` e `versionId`.
3. Una volta completato l’upload, il servizio registra nel database il `payloadRef` per quella versione.

### Download del payload

1. Per visualizzare o scaricare un file, l’API fornisce un URL presignato con scadenza breve oppure implementa un proxy che scarica il file dallo storage e lo inoltra al client.
2. In nessun caso si espongono le credenziali del bucket o la lista completa dei file.

### Upload del bundle

Durante la pubblicazione il publisher carica il file zip nella cartella `bundles/` seguendo la stessa convenzione.  Viene restituito un `bundleRef` che viene salvato nella tabella `Publication`.

## Sicurezza e controllo accessi

* Ogni tenant ha il proprio prefisso di percorso (`tenant-<tenantId>`).  Si raccomanda di applicare **policy IAM** (per S3) o **bucket policy** (per MinIO) che limitino l’accesso a quel prefisso.
* Le chiamate ai servizi storage devono includere un controllo del `tenantId` per evitare accesso a dati di altri tenant.
* La gestione degli URL presignati deve prevedere **scadenze brevi** e utilizzo una tantum per ridurre il rischio di divulgazione.

## Abilitare la sostituzione MinIO/S3

Per rendere la piattaforma agnostica rispetto al provider, è necessario parametrizzare:

* **Endpoint**: indirizzo del servizio S3 (es. `http://minio:9000` o `https://s3.amazonaws.com`).
* **Bucket**: nome del bucket da utilizzare per tutti i tenant (o uno per tenant, se si preferisce).  La scelta deve avvenire in fase di installazione.
* **Credenziali**: access key e secret key (per MinIO o AWS).  Devono essere salvate in variabili d’ambiente o in un secret manager.
* **Region** (solo S3): regione del bucket.

Con questa parametrizzazione, passare da un’installazione MinIO ad S3 (o viceversa) non richiederà modifiche al codice: basterà aggiornare la configurazione e riavviare i servizi.

## Note operative

* Per ambienti self‑host si può optare per MinIO in modalità singolo nodo o in cluster; per production cloud è consigliato S3 con versioning abilitato.
* È opportuno definire politiche di **retention** per eliminare automaticamente file non più necessari (ad es. versioni ritirate o bundle obsoleti), ma solo dopo aver introdotto un archivio di backup, per evitare perdita di dati.