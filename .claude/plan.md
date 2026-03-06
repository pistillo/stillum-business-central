# Piano: Publisher MinIO + Rimozione npm_dependencies

## Contesto

1. **Publisher legge sourceCode dal DB** — ma il `SourceDataMigrator` svuota quelle colonne dopo la migrazione a MinIO. Il publisher va aggiornato per leggere da MinIO via `source_ref`.
2. **`npm_dependencies` è un campo generico** nella tabella `artifact_version` — le dipendenze npm appartengono al `package.json` del progetto (nel buildSnapshot), non a un campo DB separato.
3. **`npm_package_ref`** — rimandato a discussione futura.

---

## Fase 1: Publisher legge da MinIO

Il publisher ha già `S3StorageClient` con accesso al bucket `stillum-artifacts`. Serve aggiungere il supporto per deserializzare il `SourceBundle` JSON da MinIO.

### 1.1 Aggiungere `SourceBundle` e `BuildSnapshot` al publisher

Creare nel publisher i record per deserializzare il JSON da MinIO:

- **Nuovo** `publisher/.../storage/SourceBundle.java`
- **Nuovo** `publisher/.../storage/BuildSnapshot.java`

### 1.2 Aggiungere `SourceStorageService` al publisher

Servizio minimale che usa `S3StorageClient` + `ObjectMapper`:

- **Nuovo** `publisher/.../storage/SourceStorageService.java`
  - `load(String sourceRef) → SourceBundle`
  - Restituisce `SourceBundle.EMPTY` se sourceRef è null/blank

### 1.3 Aggiungere `sourceKey()` a `StoragePathBuilder` del publisher

- **Modifica** `publisher/.../storage/StoragePathBuilder.java`

### 1.4 Aggiungere `sourceRef` all'entity ArtifactVersion del publisher

- **Modifica** `publisher/.../entity/ArtifactVersion.java` — aggiungere campo `source_ref`

### 1.5 Aggiornare `PublishService.java`

- **Modifica** `publisher/.../service/PublishService.java`

Punti da cambiare:

| Riga attuale | Cosa fa ora | Cosa farà |
|---|---|---|
| 105-107 | `version.sourceCode == null` check | Caricare `SourceBundle` da `version.sourceRef`, controllare `bundle.sourceCode()` |
| 119 | `version.sourceCode.getBytes()` | `bundle.sourceCode().getBytes()` |
| 179-180 | `depVersion.sourceCode` per dependency | Caricare SourceBundle della dependency da `depVersion.sourceRef` |
| 207-211 | `depVersion.sourceCode` per ComponentSource | Usare `depBundle.sourceCode()` |
| 215-217 | `version.npmDependencies` | Estrarre dal package.json nel buildSnapshot (vedi Fase 2) |
| 226 | `version.sourceCode` passato a NpmBuildRequest | `bundle.sourceCode()` |

---

## Fase 2: Spostare npm_dependencies nel package.json

Le dipendenze npm devono vivere nel `package.json` del progetto (dentro il buildSnapshot), non in un campo DB separato.

### 2.1 Aggiornare il template package.json del buildSnapshot

- **Modifica** `registry-api/.../templates/module-project/files/package.json.tpl`
- Aggiungere `"dependencies": {}` (vuoto, verrà popolato via DependenciesPanel)

### 2.2 Modificare DependenciesPanel per operare sul buildSnapshot

- **Modifica** `portal-ui/src/components/DependenciesPanel.tsx`

Invece di leggere `version.npmDependencies` e salvare via `updateVersion({ npmDependencies })`:
- Leggere dal `buildSnapshot.files["package.json"]` → parsare JSON → `dependencies`
- Scrivere aggiornando il package.json nel buildSnapshot e salvare via `updateVersion({ buildSnapshot })`

### 2.3 Aggiornare il publisher per estrarre deps dal package.json

- **Modifica** `publisher/.../service/PublishService.java`
- Nuovo metodo privato `extractDependenciesFromPackageJson(SourceBundle)` che:
  - Legge `bundle.buildSnapshot().files().get("package.json")`
  - Parsa il JSON, estrae il campo `dependencies`
  - Restituisce `Map<String, String>`

### 2.4 Aggiornare npm-build-service (impatto minimo)

Il publisher continua a passare le dependencies al build service, ma le estrae dal package.json invece che dal campo DB. Il `NpmBuildRequest` e `package-json.ts` restano invariati per ora — il refactoring del build service può avvenire in un secondo momento.

### 2.5 Rimuovere `npmDependencies` (cleanup)

**registry-api:**
- Rimuovere da `CreateVersionRequest`, `UpdateVersionRequest`, `ArtifactVersionResponse`
- Rimuovere dall'entity `ArtifactVersion`
- Rimuovere logica in `ArtifactVersionService` (set/get npmDependencies)
- Nuova migrazione SQL: `ALTER TABLE artifact_version DROP COLUMN npm_dependencies;`

**publisher:**
- Rimuovere dall'entity `ArtifactVersion`
- Rimuovere dal manifest del bundle (linee 330-332 di PublishService)

**portal-ui:**
- Rimuovere `npmDependencies` dal tipo `ArtifactVersion`
- Rimuovere dai parametri di `createVersion()` e `updateVersion()`

---

## Ordine di esecuzione

1. **Fase 1** prima (publisher → MinIO): nessun breaking change, il publisher legge da MinIO
2. **Fase 2** dopo (npm_dependencies → package.json): richiede coordinamento tra 4 moduli

All'interno di ogni fase, l'ordine è sequenziale come numerato.

---

## File coinvolti — riepilogo

### Fase 1 — Nuovi file
- `publisher/.../storage/SourceBundle.java`
- `publisher/.../storage/BuildSnapshot.java`
- `publisher/.../storage/SourceStorageService.java`

### Fase 1 — Modifiche
- `publisher/.../storage/StoragePathBuilder.java`
- `publisher/.../entity/ArtifactVersion.java`
- `publisher/.../service/PublishService.java`

### Fase 2 — Modifiche
- `registry-api/.../templates/.../package.json.tpl`
- `portal-ui/src/components/DependenciesPanel.tsx`
- `publisher/.../service/PublishService.java`
- `registry-api/.../dto/request/CreateVersionRequest.java`
- `registry-api/.../dto/request/UpdateVersionRequest.java`
- `registry-api/.../dto/response/ArtifactVersionResponse.java`
- `registry-api/.../entity/ArtifactVersion.java`
- `registry-api/.../service/ArtifactVersionService.java`
- `portal-ui/src/api/types.ts`
- `portal-ui/src/api/registry.ts`
- Nuova migrazione SQL
