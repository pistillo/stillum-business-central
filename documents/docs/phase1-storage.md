---
slug: phase1-storage
title: Storage dei Payload – Fase 1
---

L’**object storage** è la componente che ospita i file reali degli artefatti (processi, regole, moduli, request) e i bundle di pubblicazione.  In questa fase si definisce come integrare MinIO/S3 nella piattaforma in modo da garantire l’immutabilità dei payload e l’isolamento tra tenant.

## Motivazioni

* Separare i metadati dai file migliora la scalabilità: il database memorizza solo i metadati e i riferimenti di pubblicazione (es. `bundleRef` e, per MODULE/COMPONENT, `npmPackageRef`), mentre i contenuti vengono gestiti da uno storage oggetti che può crescere indipendentemente.
* Sia **MinIO** (per ambienti self‑host) che **Amazon S3** (per ambienti cloud) espongono un’API compatibile S3.  Ciò consente di mantenere il codice di accesso uguale e di passare da un backend all’altro semplicemente modificando endpoint e credenziali.
* Ogni file viene conservato in maniera immutabile: non esiste operazione di aggiornamento, ma solo di creazione.  Eventuali nuove versioni generano un nuovo percorso.

## Struttura dei percorsi

Nel worktree corrente i contenuti sono salvati con una **nomenclatura standard** che non richiede un `payloadRef` persistito nel DB: la chiave è deterministica e dipende da `tenantId`, `artifactType`, `artifactId`, `versionId` e dal path del file.

```
<artifacts-bucket>/
  └── tenant-<tenantId>/
        └── <artifactType>/<artifactId>/<versionId>/<filePath>

<bundles-bucket>/
  └── tenant-<tenantId>/bundles/<artifactType>/<artifactId>/<versionId>.zip
```

* `tenant-<tenantId>`: prefisso radice del tenant.
* `<artifactType>/<artifactId>/<versionId>/<filePath>`: contiene uno o più file della versione. Per PROCESS/RULE/FORM/REQUEST il file di default è rispettivamente `process.bpmn`, `rule.dmn`, `form.json`, `request.json`. Per MODULE/COMPONENT contiene anche `src/index.tsx`, `package.json`, ecc.
* `bundles/<artifactType>/<artifactId>/<versionId>.zip`: contiene il pacchetto generato dal Publisher, comprensivo del manifest e dei file root/dipendenze.

## Operazioni di base

### Upload del payload

1. Il client (frontend o API) effettua una richiesta di upload al servizio storage del portale.
2. Il servizio genera un **URL presignato** per caricare il file direttamente su MinIO/S3. La risposta include anche la chiave oggetto (deterministica) che verrà usata poi per il download.
3. Nel worktree corrente non è necessario registrare alcun `payloadRef` nel database: la chiave è già deducibile dalla convenzione.

### Download del payload

1. Per visualizzare o scaricare un file, l’API fornisce un URL presignato con scadenza breve oppure implementa un proxy che scarica il file dallo storage e lo inoltra al client.
2. In nessun caso si espongono le credenziali del bucket o la lista completa dei file.

### Upload del bundle

Durante la pubblicazione il Publisher carica il file zip nel bucket bundles seguendo la convenzione `tenant-<tenantId>/bundles/...`. La chiave (`bundleRef`) viene salvata nella tabella `Publication`.

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
