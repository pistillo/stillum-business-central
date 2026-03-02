# Bugs e Incongruenze Identificati

Questo documento descrive tutti i bug e le incongruenze identificati nell'analisi del codice, con le relative soluzioni proposte.

---

## 🔴 Bug Critici

### 1. ArtifactStatus non usato nell'entità Artifact

**Descrizione:**
Esiste un enum `ArtifactStatus` in `registry-api/src/main/java/com/stillum/registry/entity/enums/ArtifactStatus.java` con valori `DRAFT, REVIEW, APPROVED, PUBLISHED, RETIRED`.

Verifica attuale:
- In `registry-api` l'entità `Artifact` usa già `ArtifactStatus` con `@Enumerated(EnumType.STRING)`.
- La discrepanza era nel modulo `publisher`, dove l'entità `Artifact` aveva `status` di tipo `String`.

**Impatto:**
- Possibili errori di tipologia (typo negli stati)
- Mancanza di type safety sullo stato degli Artifact
- Il frontend (`portal-ui/src/api/types.ts`) definisce `ArtifactStatus` come type TypeScript e `registry-api` è allineato, ma `publisher` non lo era

**Codice attuale (publisher Artifact.java):**
```java
public class Artifact {
    // ...
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public ArtifactStatus status = ArtifactStatus.DRAFT;
    // ...
}
```

**Codice attuale (ArtifactStatus.java):**
```java
public enum ArtifactStatus {
    DRAFT, REVIEW, APPROVED, PUBLISHED, RETIRED
}
```

**Soluzione:**
Aggiornare l'entità `Artifact` (publisher) per usare l'enum `ArtifactStatus`:

```java
import com.stillum.publisher.entity.enums.ArtifactStatus;

public class Artifact {
    // ...
    @Column(name = "status", nullable = false)
    public ArtifactStatus status = ArtifactStatus.DRAFT;
    // ...
}
```

**Benefici:**
- Type safety compilazione
- Prevenzione di typo
- Coerenza con `VersionState` enum
- Allineamento con frontend TypeScript

---

### 2. Publisher non usa RLS Filter correttamente

**Descrizione:**
Nel modulo `publisher`, l'enforcement RLS è fatto tramite interceptor `@EnforceTenantRls` (non tramite `ContainerRequestFilter`). La sessione DB viene inizializzata in `RlsSessionInitializer`.

```java
@ApplicationScoped
@EnforceTenantRls
public class PublishService { ... }
```

Problemi individuati:
- `TenantContextFilter` ignorava `tenantId` non valido (UUID parse error) lasciando `TenantContext` non settato.
- `RlsSessionInitializer.propagate()` applicava `SET LOCAL ROLE` e `set_config('app.current_tenant', ...)` solo se `TenantContext` era settato; in caso contrario le query potevano girare senza RLS effettivo (bypass).
- Mancava una verifica che il tenant richiesto esistesse.

**Impatto:**
- Bypass RLS in caso di `tenantId` mancante/non valido (o chiamate al service fuori dal contesto HTTP).
- Possibile accesso cross-tenant se in futuro si introduce una fonte di tenant non verificata (header o parametri) senza autorizzazione applicativa.

**Codice attuale (TenantContextFilter.java):**
```java
try {
    tenantContext.set(UUID.fromString(values.get(0)));
} catch (IllegalArgumentException ignored) {
}
```

**Soluzione:**
- Non ignorare `tenantId` invalido: fallire la request con 400.
- Applicare sempre `SET LOCAL ROLE` (se configurato) e rendere `tenantId` obbligatorio quando si invoca `@EnforceTenantRls`.
- Verificare che il tenant esista prima di impostare `app.current_tenant`.

```java
if (!tenantContext.isSet()) {
    throw new IllegalArgumentException("tenantId is required");
}
// verifica tenant esiste
// set_config('app.current_tenant', ...)
```

**Benefici:**
- Validazione del tenant prima dell'operazione
- Prevenzione di accessi cross-tenant
- Messaggi di errore chiari

---

### 3. Publisher: Native Query senza filtro tenant

**Descrizione:**
In `PublishService.getPublication()` era presente una native query senza vincolo tenant esplicito. È stato aggiunto un filtro tenant per defense-in-depth.

```java
UUID artifactId = (UUID) em.createNativeQuery(
        "SELECT a.id FROM publication p " +
        "JOIN artifact_version av ON av.id = p.artifact_version_id " +
        "JOIN artifact a ON a.id = av.artifact_id " +
        "JOIN environment e ON e.id = p.environment_id " +
        "WHERE p.id = :pid AND e.tenant_id = :tenantId")
    .setParameter("pid", publicationId)
    .setParameter("tenantId", tenantId)
    .getSingleResult();
```

La query ora filtra per tenant esplicitamente (SQL), oltre alle policy RLS.

**Impatto:**
- Violazione del principio multi-tenant
- Un utente potrebbe vedere pubblicazioni di altri tenant

**Benefici:**
- Isolamento tenant corretto
- Protezione da accessi cross-tenant

---

### 4. Runtime Gateway: Health Check Path Incoerente

**Descrizione:**
In `docker-compose.full.yml`:

```yaml
runtime-gateway:
  healthcheck:
    test: ["CMD-SHELL", "curl -sf http://localhost:8080/q/health/ready || exit 1"]
```

MA in `runtime-gateway/src/main/java/com/stillum/gateway/resource/HealthResource.java`:

```java
@Path("/health")
@Produces(MediaType.TEXT_PLAIN)
public class HealthResource {
    @GET
    public Response health() {
        return Response.ok("ok").build();
    }
}
```

Il path effettivo è `/api/health` (base path `@ApplicationPath("/api")`), non `/q/health/ready`. Inoltre il modulo non include SmallRye Health, quindi `/q/health/ready` non esiste.

**Impatto:**
- Il healthcheck in Docker Compose fallirà sempre
- Il container potrebbe essere marcato come unhealthy e riavviato

**Soluzione (Aggiornare docker-compose.full.yml):**
Allineare il healthcheck al path reale:

```yaml
runtime-gateway:
  healthcheck:
    test: ["CMD-SHELL", "curl -sf http://localhost:8080/api/health || exit 1"]
```

**Nota:** Se si vogliono usare gli endpoint Quarkus standard (`/q/health/live`, `/q/health/ready`), aggiungere la dipendenza `quarkus-smallrye-health` (più invasivo).

**Benefici:**
- Healthcheck funzionale
- Integrazione corretta con orchestration tools (Kubernetes)

---

## ⚠️ Incongruenze Medie

### 5. Extension per MODULE/COMPONENT: `.tsx` vs `.ts`

**Descrizione:**
Nel publisher, `StoragePathBuilder.extensionFor()` usa `.tsx` per `MODULE/COMPONENT`.

```java
case "MODULE", "COMPONENT" -> "tsx";
```

Nel frontend `EditorPage.tsx` il contenuto di default usa JSX (quindi TSX):

```typescript
if (type === 'MODULE')
    return 'export default function Module() {\n  return <div>Module</div>;\n}';
```

Inoltre, `registry-api` generava ancora estensione `.json` per `MODULE/COMPONENT` quando costruisce key S3/presigned URL, creando incoerenza fra moduli.

**Impatto:**
- I nomi dei file nel bundle S3 avranno estensione `.tsx`
- Incoerenza tra moduli su estensione (es. upload-url/payloadRef)
- NPM Build Service genera pacchetti `.tgz` senza estensione specifica
- Possibile confusione quando si recuperano i file dal bundle

**Soluzione:**
Standardizzare su `.tsx` per `MODULE/COMPONENT` in tutti i moduli backend.

```java
public static String extensionFor(String artifactType) {
    return switch (artifactType.toUpperCase()) {
        case "PROCESS", "RULE" -> "xml";
        case "FORM", "REQUEST" -> "json";
        case "MODULE", "COMPONENT" -> "tsx";
        default -> "bin";
    };
}
```

**Nota:** `.ts` è adatto solo se non si usa JSX. Il flusso editor/build corrente usa JSX, quindi TSX è l’opzione più coerente.

**Benefici:**
- Coerenza con l'uso reale
- Nomi file prevedibili
- Minor confusione

---

### 6. DependenciesPanel: npmDependencies Type Inconsistency

**Descrizione:**
In `DependenciesPanel.tsx`:

```typescript
const dependencies: NpmDependencies = version?.npmDependencies ?? {};
```

`npmDependencies` è una struttura JSON (colonna JSONB) e viene trattata come oggetto lato API/UI, evitando conversioni stringa ↔ JSON.

**Impatto:**
- Confusione sul tipo di dato (string vs oggetto)
- Parsing/stringify duplicati e fragili
- Contratto API meno chiaro

**Soluzione:**
Standardizzare il tipo come `Record<string, string>` nel frontend e `Map<String, String>` nel backend, serializzato come JSON object.

```typescript
type NpmDependencies = Record<string, string>;

const dependencies: NpmDependencies = version?.npmDependencies ?? {};
```

Validazione lato backend:

```java
// UpdateVersionRequest: Map<String, String> npmDependencies
// ArtifactVersion: Map<String, String> npmDependencies (jsonb)
```

**Benefici:**
- Type safety migliorato
- Coerenza tra frontend e backend

---

## ℹ️ Incongruenze Minori / Note

### 7. NPM Build Service: BuildRequest Type Mismatch

**Descrizione:**
In `npm-build-service/src/types/build.ts`:

```typescript
artifactType: 'MODULE' | 'COMPONENT';
```

MA in `publisher/src/main/java/com/stillum/publisher/client/NpmBuildRequest.java`:

```java
String artifactType;
```

Il tipo Java è `String`, non un enum. Questo permette di passare tipi non validi.

**Impatto:**
- Possibile passare tipi non validi al NPM Build Service
- Errori a runtime invece di compile-time

**Soluzione:**
Aggiungere validazione nel Publisher prima di chiamare il NPM Build Service:

```java
// In PublishService.publish()
private void validateArtifactTypeForBuild(String artifactType) {
    if (!"MODULE".equalsIgnoreCase(artifactType) && !"COMPONENT".equalsIgnoreCase(artifactType)) {
        throw new IllegalArgumentException(
            "Artifact type must be MODULE or COMPONENT for npm build: " + artifactType
        );
    }
}

if (isSourceCodeBased) {
    validateArtifactTypeForBuild(artifact.type);
    // ... resto del codice
}
```

**Benefici:**
- Validazione anticipata
- Messaggi di errore chiari
- Prevenzione di errori a runtime

---

### 8. Docker Compose: Nexus Username/Password Defaults

**Descrizione:**
In `docker-compose.full.yml`:

```yaml
NEXUS_USERNAME: ${NEXUS_USERNAME:-admin}
NEXUS_PASSWORD: ${NEXUS_PASSWORD:-admin123}
```

Questi valori di default sono **non corretti** per Nexus. Nexus richiede:
- Username: `admin`
- Password: Generata al primo avvio nel container

**Impatto:**
- Il NPM Build Service fallirà quando tenta di pubblicare su Nexus
- Messaggi di errore confusi

**Soluzione:**
Aggiornare il docker-compose con i valori corretti:

```yaml
NEXUS_USERNAME: ${NEXUS_USERNAME:-admin}
# Rimuovere il default per la password, o spiegare come ottenerla
# NEXUS_PASSWORD: ${NEXUS_PASSWORD}
```

Aggiungere istruzioni nel README:

```markdown
### Configurazione Nexus

Al primo avvio, Nexus genera una password casuale per l'utente admin. Per ottenerla:

```bash
docker compose logs nexus | grep "Your admin user password is:"
```

Copia la password e usala per configurare le variabili d'ambiente:

```bash
export NEXUS_PASSWORD=<password_copiata>
```

Poi riavvia il servizio:

```bash
docker compose -f docker-compose.yml -f docker-compose.full.yml up -d npm-build-service
```
```

**Benefici:**
- Documentazione chiara
- Evita errori di configurazione
- Guida l'utente corretto

---

### 9. Portal UI: StillumFormsEditorTab Import Path

**Descrizione:**
In `EditorPage.tsx`:

```typescript
import { StillumFormsEditorTab } from '../form-editor';
```

Questo importa da un barrel export `form-editor/index.ts` che deve esportare `StillumFormsEditorTab`.

**Impatto:**
- Se l'export non è presente nel barrel, l'import fallirà
- Errore di build

**Soluzione:**
Verificare che l'export sia presente nel barrel:

```typescript
// form-editor/index.ts
export { StillumFormsEditorTab } from './components/StillumFormsEditorTab';
export { default as StillumFormsEditor } from './components/StillumFormsEditor';
// ... altri export
```

**Benefici:**
- Imports chiari e mantenibili
- Prevenzione di errori di build

---

### 10. EditorPage: TypeScript Definitions Not Complete

**Descrizione:**
In `EditorPage.tsx`:

```typescript
const reactTypeDefinitions = `declare module 'react' {
  export * from 'react';
  export default React;
}
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  ...
}`;
```

Queste definizioni sono incomplete e non includono tutti i tipi React necessari.

**Impatto:**
- L'autocompletamento TypeScript in Monaco potrebbe non funzionare correttamente
- Possibili errori di tipo

**Soluzione:**
Aggiornare le definizioni:

```typescript
const reactTypeDefinitions = `
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface ElementClass extends React.Component<any> {}
  interface ElementAttributesProperty { props: {}; }
  interface ElementChildrenAttribute { children: {}; }
  interface IntrinsicAttributes { [elemName: string]: any; }
  interface IntrinsicElements { [elemName: string]: any; }
}

declare module 'react' {
  export * from 'react';
  export default React;
}
`;
```

In alternativa, caricare le definizioni reali da `@types/react`:

```typescript
import type * as ReactTypes from 'react';

function configureMonacoForTypeScript(monaco: Monaco) {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    ReactTypes,  // Usa i tipi reali
    'file:///node_modules/@types/react/index.d.ts'
  );
  // ...
}
```

**Benefici:**
- Autocompletamento completo
- Type checking corretto
- Esperienza developer migliore

---

### 11. CI: Nexus non avviato prima di test-registry-api

**Descrizione:**
In `.github/workflows/ci.yml`:

```yaml
- name: Start postgres + minio
  run: |
    docker compose up -d postgres minio minio-init
```

Nexus NON viene avviato, ma potrebbe essere necessario per i test di registry-api/publisher se questi includono test che pubblicano su Nexus.

**Nota:** Attualmente i test non includono Nexus, quindi non è un bug critico ma una nota per il futuro.

**Soluzione:**
Aggiungere Nexus se i test lo richiedono:

```yaml
- name: Start postgres + minio + nexus
  run: |
    docker compose up -d postgres minio minio-init nexus
    docker compose ps
```

**Benefici:**
- Pronti per test futuri
- Configurazione completa

---

## ✅ Elementi Corretti (per riferimento)

I seguenti elementi sono stati verificati e non presentano problemi:

- **RLS in registry-api**: Implementato correttamente con `EnforceTenantRls` filter e le native queries
- **DevServices disabilitati in test**: Corretto in `application.properties` del publisher e registry-api
- **Storage Path Builder**: Logica coerente per generare path S3
- **Artifact Types**: Coerenti tra backend (enum) e frontend (type TypeScript)
- **Version States**: Coerenti tra backend (`VersionState` enum) e frontend
- **API Paths**: Coerenti tra frontend e backend per la maggior parte degli endpoint

---

## 📊 Riepilogo Priorità

| Bug/Incongruenza | Priorità | Impatto | Stato |
|-------------------|----------|---------|-------|
| 1. ArtifactStatus non usato | 🔴 Alta | Type safety, possibili errori | ✅ Risolto |
| 2. Publisher RLS non completo | 🔴 Alta | Sicurezza multi-tenant | ✅ Risolto |
| 3. Publisher native query senza tenant | 🔴 Alta | Sicurezza multi-tenant | ✅ Risolto |
| 4. Runtime Gateway healthcheck path | 🔴 Alta | Healthcheck fallisce | ✅ Risolto |
| 5. Extension `.tsx` vs `.ts` | ⚠️ Media | Confusione, ma funzionale | ✅ Risolto |
| 6. DependenciesPanel type inconsistency | ⚠️ Media | Type safety, parsing | ✅ Risolto |
| 7. BuildRequest type | ℹ️ Bassa | Validazione aggiuntiva | 🔧 Opzionale |
| 8. Nexus defaults | ℹ️ Bassa | Solo docker-compose.full | 🔧 Da risolvere |
| 9. StillumFormsEditorTab import | ℹ️ Bassa | Verifica export | ✅ Verificare |
| 10. TypeScript definitions incomplete | ℹ️ Bassa | UX developer | 🔧 Da risolvere |
| 11. CI Nexus | ℹ️ Bassa | Solo per test futuri | 🔧 Opzionale |

---

## Come Affrontare i Problemi

Per affrontare i problemi in ordine di priorità:

1. **Prima i bug critici (🔴 Alta)**: Risolvere i problemi di sicurezza e funzionalità
2. **Poi le incongruenze medie (⚠️ Media)**: Migliorare type safety e coerenza
3. **Infine le minori (ℹ️ Bassa)**: Migliorare UX developer e documentazione

Per ogni problema:
1. Leggere la descrizione e l'impatto
2. Capire la soluzione proposta
3. Implementare la soluzione
4. Testare il codice
5. Aggiornare questo documento con lo stato (es. "Risolto")
