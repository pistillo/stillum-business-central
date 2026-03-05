# Piano: Migrazione sourceCode/sourceFiles/buildSnapshot da PostgreSQL a MinIO

## Obiettivo
Spostare i dati di codice sorgente (`sourceCode`, `sourceFiles`) e lo snapshot di build (`buildSnapshot`) dalla tabella `artifact_version` (PostgreSQL JSONB/TEXT) ad oggetti JSON su MinIO (S3-compatible). In PostgreSQL rimane solo un riferimento S3 (`source_ref`).

## Struttura S3 chiavi

```
stillum-artifacts/
  tenant-{tenantId}/
    sources/
      {artifactId}/
        {versionId}.json    ← un unico JSON con tutto il contenuto sorgente
```

**Contenuto del file `{versionId}.json`:**
```json
{
  "sourceCode": "...",
  "sourceFiles": { "file.tsx": "..." },
  "buildSnapshot": { "generatedAt": "...", "templateVersion": "...", "inputs": {...}, "files": {...} }
}
```

Un singolo oggetto per versione semplifica lettura/scrittura e garantisce atomicità.

## File da modificare

### 1. `S3StorageClient.java` — aggiungere `downloadBytes()`
- Nuovo metodo: `byte[] downloadBytes(String bucket, String key)` che legge l'oggetto S3 come byte array.

### 2. `StoragePathBuilder.java` — aggiungere `sourceKey()`
- Nuovo metodo statico: `sourceKey(tenantId, artifactId, versionId)` → `tenant-{tenantId}/sources/{artifactId}/{versionId}.json`

### 3. Nuovo `SourceStorageService.java`
- Service dedicato alla gestione del contenuto sorgente su MinIO.
- Metodi:
  - `save(tenantId, artifactId, versionId, sourceCode, sourceFiles, buildSnapshot)` → serializza in JSON, upload su MinIO, restituisce la chiave S3
  - `load(sourceRef)` → scarica JSON da MinIO, deserializza, restituisce un record `SourceBundle`
- Record `SourceBundle`: `sourceCode`, `sourceFiles`, `buildSnapshot`

### 4. `ArtifactVersion.java` (entity) — aggiungere `sourceRef`, rimuovere i campi inline
- Aggiungere: `String sourceRef` (VARCHAR) — chiave S3 che punta all'oggetto JSON in MinIO
- Rimuovere: `sourceCode` (TEXT), `sourceFiles` (JSONB), `buildSnapshot` (JSONB)
- Il campo `buildSnapshot` viene eliminato dalla entity — lo teniamo nel JSON su MinIO

### 5. Migrazione `V16__move_sources_to_minio.sql`
- `ALTER TABLE artifact_version ADD COLUMN source_ref VARCHAR(500);`
- Non droppiamo ancora le colonne vecchie per sicurezza (la migrazione dei dati si fa programmaticamente)

### 6. Migrazione dati: `SourceDataMigrator.java`
- `@Startup @Observes StartupEvent` — al primo avvio, legge tutte le versioni con `sourceCode/sourceFiles/buildSnapshot` non nulli, le salva su MinIO, imposta il `sourceRef`, e svuota i campi vecchi.
- Logga progresso. Idempotente (skip se `sourceRef` già presente).

### 7. `ArtifactVersionService.java` — aggiornare create/update
- **Create**: salva il contenuto su MinIO via `SourceStorageService.save()`, salva `sourceRef` nella entity (non più `sourceCode`/`sourceFiles`/`buildSnapshot` direttamente)
- **Update**: stessa logica — nuova versione del JSON su MinIO

### 8. `ArtifactVersionResponse.java` — mantiene gli stessi campi nel JSON di risposta
- Il record resta invariato (id, sourceCode, sourceFiles, buildSnapshot...)
- Il metodo `from()` cambia: riceve `ArtifactVersion` + `SourceBundle` (caricato da MinIO)
- Nuovo factory method `from(ArtifactVersion v, SourceBundle source)`

### 9. `ArtifactService.getWorkspace()` — carica contenuti da MinIO
- Per ogni versione (module + components), chiama `SourceStorageService.load(v.sourceRef)` per recuperare i sorgenti
- Compone la `WorkspaceResponse` con i dati scaricati da MinIO

### 10. `ArtifactService.createModule()` e `createComponent()` — salva su MinIO
- Dopo aver creato la versione, salva buildSnapshot/sourceFiles su MinIO e imposta `sourceRef`

### 11. Migrazione `V17__drop_source_columns.sql` (futura, non ora)
- Da eseguire quando la migrazione dati è consolidata
- `ALTER TABLE artifact_version DROP COLUMN source_code, source_files, build_snapshot;`
- Per ora NON implementiamo questo step — i campi restano nel DB ma vuoti

## Cosa NON cambia
- **Portal-UI**: nessuna modifica — l'API REST continua a restituire `sourceCode`, `sourceFiles`, `buildSnapshot` nella response JSON come prima
- **Theia extension**: nessuna modifica — il bridge e l'initializer ricevono lo stesso formato di workspace data
- **DTOs di request**: restano uguali — il backend gestisce il routing verso MinIO internamente
- **Il campo `payloadRef`** resta invariato — quello è per i binary payload (BPMN xml, form json, ecc.)

## Ordine di implementazione
1. `S3StorageClient.downloadBytes()`
2. `StoragePathBuilder.sourceKey()`
3. `SourceBundle` record + `SourceStorageService`
4. Migrazione V16
5. Entity `ArtifactVersion` — aggiungere `sourceRef`
6. `ArtifactVersionResponse.from()` con SourceBundle
7. `ArtifactVersionService` — create/update usano MinIO
8. `ArtifactService` — createModule/createComponent/getWorkspace usano MinIO
9. `SourceDataMigrator` per dati esistenti
10. Compilare e testare
