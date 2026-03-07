# Sistema di Persistenza delle Dipendenze - Stillum Business Central

## Class Diagram - Architettura Completa

```mermaid
classDiagram
    %% Enums
    class ArtifactType {
        <<enumeration>>
        PROCESS
        RULE
        FORM
        REQUEST
        MODULE
        COMPONENT
    }

    class ArtifactStatus {
        <<enumeration>>
        DRAFT
        REVIEW
        APPROVED
        PUBLISHED
        RETIRED
    }

    class VersionState {
        <<enumeration>>
        DRAFT
        REVIEW
        APPROVED
        PUBLISHED
        RETIRED
    }

    %% Domain Entities
    class Artifact {
        <<Entity>>
        - UUID id
        - UUID tenantId
        - ArtifactType type
        - String title
        - String description
        - UUID ownerId
        - ArtifactStatus status
        - String area
        - String[] tags
        - UUID parentModuleId
        - OffsetDateTime createdAt
        - OffsetDateTime updatedAt
        + prePersist()
        + preUpdate()
    }

    class ArtifactVersion {
        <<Entity>>
        - UUID id
        - UUID artifactId
        - String version
        - VersionState state
        - UUID createdBy
        - OffsetDateTime createdAt
        - String metadata (JSONB)
        - String npmPackageRef
        + prePersist()
    }

    class Dependency {
        <<Entity>>
        - UUID id
        - UUID artifactVersionId
        - UUID dependsOnArtifactId
        - UUID dependsOnVersionId
    }

    %% Repositories
    class ArtifactRepository {
        <<Repository>>
        + findByIdAndTenant(artifactId, tenantId): Optional~Artifact~
        + findByType(type): List~Artifact~
        + findByParentModuleId(parentId): List~Artifact~
        + findByTenant(tenantId): List~Artifact~
    }

    class ArtifactVersionRepository {
        <<Repository>>
        + findByIdAndArtifact(versionId, artifactId): Optional~ArtifactVersion~
        + findByArtifact(artifactId): List~ArtifactVersion~
        + findByState(state): List~ArtifactVersion~
        + findByIdOptional(id): Optional~ArtifactVersion~
    }

    class DependencyRepository {
        <<Repository>>
        + findByVersion(artifactVersionId): List~Dependency~
        + findByVersionAndDependsOn(artifactVersionId, dependsOnVersionId): Optional~Dependency~
        + deleteByVersion(artifactVersionId): void
        + listAll(): List~Dependency~
    }

    %% Services
    class DependencyService {
        <<Service>>
        - DependencyRepository depRepo
        - ArtifactVersionRepository versionRepo
        - ArtifactRepository artifactRepo
        + list(tenantId, artifactId, versionId): List~DependencyResponse~
        + add(tenantId, artifactId, versionId, req): DependencyResponse
        + remove(tenantId, artifactId, versionId, dependencyId): void
        - detectCycle(versionId, newDepVersionId): void
        - dfs(node, graph, visited, inStack, originVersion): void
        - buildGraph(): Map~UUID, List~UUID~~
    }

    class ArtifactService {
        <<Service>>
        - ArtifactRepository artifactRepo
        - ArtifactVersionRepository versionRepo
        + create(tenantId, req): ArtifactResponse
        + update(tenantId, artifactId, req): ArtifactResponse
        + delete(tenantId, artifactId): void
        + list(tenantId, type, area, tags): List~ArtifactResponse~
    }

    %% REST Resources
    class DependencyResource {
        <<Resource>>
        - DependencyService service
        + list(tenantId, artifactId, versionId): Response
        + add(tenantId, artifactId, versionId, req): Response
        + remove(tenantId, artifactId, versionId, dependencyId): Response
    }

    class ArtifactResource {
        <<Resource>>
        - ArtifactService service
        + create(tenantId, req): Response
        + list(tenantId, type, area, tags): Response
        + get(tenantId, artifactId): Response
        + update(tenantId, artifactId, req): Response
        + delete(tenantId, artifactId): Response
    }

    %% DTOs
    class AddDependencyRequest {
        <<DTO>>
        - UUID dependsOnArtifactId
        - UUID dependsOnVersionId
    }

    class DependencyResponse {
        <<DTO>>
        - UUID id
        - UUID artifactVersionId
        - UUID dependsOnArtifactId
        - UUID dependsOnVersionId
        + from(dep): DependencyResponse
    }

    class CreateArtifactRequest {
        <<DTO>>
        - ArtifactType type
        - String title
        - String description
        - String area
        - String[] tags
    }

    class ArtifactResponse {
        <<DTO>>
        - UUID id
        - UUID tenantId
        - ArtifactType type
        - String title
        - String description
        - UUID ownerId
        - ArtifactStatus status
        - String area
        - String[] tags
        - UUID parentModuleId
        - OffsetDateTime createdAt
        - OffsetDateTime updatedAt
    }

    %% Security
    class EnforceTenantRls {
        <<Interceptor>>
        + intercept(ctx): Object
    }

    %% Domain Relationships
    Artifact "1" --> "*" ArtifactVersion : versioni
    Artifact "1" o-- "*" Artifact : parentModuleId (self-ref)
    ArtifactVersion "1" --> "*" Dependency : dipendenze source
    ArtifactVersion "1" o-- "*" Dependency : dipendenze target
    Dependency --> Artifact : dependsOnArtifactId
    Dependency --> ArtifactVersion : dependsOnVersionId

    %% Repository Relationships
    ArtifactRepository --> Artifact : gestisce
    ArtifactVersionRepository --> ArtifactVersion : gestisce
    DependencyRepository --> Dependency : gestisce

    %% Service Relationships
    DependencyService --> DependencyRepository : usa
    DependencyService --> ArtifactVersionRepository : usa
    DependencyService --> ArtifactRepository : usa
    DependencyService --> AddDependencyRequest : riceve
    DependencyService --> DependencyResponse : restituisce
    ArtifactService --> ArtifactRepository : usa
    ArtifactService --> ArtifactVersionRepository : usa

    %% Resource Relationships
    DependencyResource --> DependencyService : delega
    ArtifactResource --> ArtifactService : delega

    %% RLS Relationships
    DependencyService ..> EnforceTenantRls : annotato con
    ArtifactService ..> EnforceTenantRls : annotato con

    %% Type associations
    Artifact --> ArtifactType : type
    Artifact --> ArtifactStatus : status
    ArtifactVersion --> VersionState : state
```

## Sequence Diagram - Creazione Dipendenza

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client / Frontend
    participant REST as DependencyResource
    participant Service as DependencyService
    participant ArtifactRepo as ArtifactRepository
    participant VersionRepo as ArtifactVersionRepository
    participant DepRepo as DependencyRepository
    participant DB as Database (PostgreSQL)

    Note over Client,DB: Creazione Nuova Dipendenza

    Client->>REST: POST /tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies
    Note right of Client: Payload:<br/>{<br/>  "dependsOnArtifactId": "uuid",<br/>  "dependsOnVersionId": "uuid"<br/>}

    REST->>Service: add(tenantId, artifactId, versionId, request)

    Service->>ArtifactRepo: findByIdAndTenant(artifactId, tenantId)
    ArtifactRepo-->>Service: Optional~Artifact~

    Service->>VersionRepo: findByIdAndArtifact(versionId, artifactId)
    VersionRepo-->>Service: Optional~ArtifactVersion~

    Service->>VersionRepo: findByIdOptional(request.dependsOnVersionId)
    VersionRepo-->>Service: Optional~ArtifactVersion~

    Service->>DepRepo: findByVersionAndDependsOn(versionId, dependsOnVersionId)
    DepRepo-->>Service: Optional~Dependency~ (check duplicato)

    rect rgb(255, 240, 240)
        Note over Service: Rilevamento Cicli (DFS)
        Service->>Service: buildGraph()
        Service->>Service: detectCycle(versionId, newDepVersionId)
        Note right of Service: DFS con colorazione<br/>(visited, inStack)<br/>Throw DependencyCycleException se ciclo
    end

    Service->>DepRepo: persist(dependency)
    DepRepo->>DB: INSERT INTO dependency
    Note over DB: RLS Filter attivo:<br/>WHERE tenant_id = current_setting('app.current_tenant')
    DB-->>DepRepo: success
    DepRepo-->>Service: dependency entity

    Service-->>REST: DependencyResponse
    REST-->>Client: 201 Created + DependencyResponse
```

## ER Diagram - Schema Database Completo

```mermaid
erDiagram
    TENANT ||--o{ ARTIFACT : "ha"
    TENANT ||--o{ APP_USER : "ha"
    TENANT ||--o{ ENVIRONMENT : "ha"
    TENANT ||--o{ AUDIT_LOG : "ha"

    ROLE ||--o{ APP_USER : "assegnato a"

    APP_USER ||--o{ ARTIFACT : "crea"
    APP_USER ||--o{ ARTIFACT_VERSION : "crea"
    APP_USER ||--o{ PUBLICATION : "pubblica"

    ARTIFACT ||--o{ ARTIFACT_VERSION : "versioni"
    ARTIFACT o--|| ARTIFACT : "parent_module_id (self-ref)"

    ARTIFACT_VERSION ||--o{ DEPENDENCY : "dipendenze source"
    ARTIFACT_VERSION ||--o{ DEPENDENCY : "dipendenze target"
    ARTIFACT_VERSION ||--o{ PUBLICATION : "pubblicazioni"

    DEPENDENCY }|--|| ARTIFACT : "dipende da (artifact)"
    DEPENDENCY }|--|| ARTIFACT_VERSION : "dipende da (version)"

    ENVIRONMENT ||--o{ PUBLICATION : "pubblicazioni in"

    TENANT {
        uuid id PK
        varchar name
        varchar domain
        timestamptz created_at
    }

    APP_USER {
        uuid id PK
        uuid tenant_id FK
        uuid role_id FK
        varchar name
        varchar email
        varchar password_hash
        timestamptz created_at
        timestamptz updated_at
    }

    ROLE {
        uuid id PK
        uuid tenant_id FK
        varchar name
        text description
    }

    ARTIFACT {
        uuid id PK
        uuid tenant_id FK
        varchar type
        varchar title
        text description
        uuid owner_id FK
        varchar status
        varchar area
        text[] tags
        uuid parent_module_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    ARTIFACT_VERSION {
        uuid id PK
        uuid artifact_id FK
        varchar version
        varchar state
        uuid created_by FK
        timestamptz created_at
        jsonb metadata
        varchar npm_package_ref
    }

    DEPENDENCY {
        uuid id PK
        uuid artifact_version_id FK
        uuid depends_on_artifact_id FK
        uuid depends_on_version_id FK
    }

    ENVIRONMENT {
        uuid id PK
        uuid tenant_id FK
        varchar name
        text description
    }

    PUBLICATION {
        uuid id PK
        uuid artifact_version_id FK
        uuid environment_id FK
        uuid published_by FK
        timestamptz published_at
        text notes
        varchar bundle_ref
    }

    AUDIT_LOG {
        uuid id PK
        uuid tenant_id FK
        varchar entity_type
        uuid entity_id
        varchar action
        uuid actor_id FK
        timestamptz timestamp
        jsonb details
    }
```

## Database Schema - Tabelle Dettagliate

### Tabella ARTIFACT
```sql
CREATE TABLE artifact (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID         NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    type        VARCHAR(20)  NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id    UUID         REFERENCES app_user(id) ON DELETE SET NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    area        VARCHAR(100),
    tags        TEXT[],
    parent_module_id UUID     REFERENCES artifact(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT artifact_type_check CHECK (type IN ('PROCESS', 'RULE', 'FORM', 'REQUEST', 'MODULE', 'COMPONENT')),
    CONSTRAINT artifact_status_check CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'RETIRED'))
);
```

### Tabella ARTIFACT_VERSION
```sql
CREATE TABLE artifact_version (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_id UUID         NOT NULL REFERENCES artifact(id) ON DELETE CASCADE,
    version     VARCHAR(50)  NOT NULL,
    state       VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    created_by  UUID         REFERENCES app_user(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    metadata    JSONB,
    npm_package_ref VARCHAR(500),
    UNIQUE (artifact_id, version),
    CONSTRAINT version_state_check CHECK (state IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'RETIRED'))
);
```

### Tabella DEPENDENCY
```sql
CREATE TABLE dependency (
    id                     UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    artifact_version_id    UUID NOT NULL REFERENCES artifact_version(id) ON DELETE CASCADE,
    depends_on_artifact_id UUID NOT NULL REFERENCES artifact(id),
    depends_on_version_id  UUID NOT NULL REFERENCES artifact_version(id),
    UNIQUE (artifact_version_id, depends_on_version_id)
);
```

## Note e Spiegazioni

### Rilevamento Cicli
Il sistema utilizza un algoritmo DFS (Depth-First Search) con colorazione per rilevare cicli nel grafo di dipendenze:
- **visited**: nodi già visitati completamente
- **inStack**: nodi nel path corrente della ricorsione
- Se un nodo è già in `inStack`, significa che è presente un ciclo

### Row-Level Security (RLS)
PostgreSQL RLS viene applicato automaticamente tramite l'interceptor `EnforceTenantRls`:
- Filtra tutte le query per tenant
- Previene accessi cross-tenant
- Attivo per tutti i repository

### Relazione Polimorfica
La tabella `dependency` gestisce due tipi di relazioni:
1. **Dipendenze tradizionali**: PROCESS → RULE, FORM → REQUEST
2. **Dipendenze di build/publish**: un MODULE può dichiarare dipendenze verso COMPONENT/versioni da includere nel bundle e nella build npm

La relazione strutturale Modulo→Componenti (workspace editor) è invece modellata su `artifact.parent_module_id`.

### Migrazioni Flyway
- **V1__schema.sql**: schema completo (tabelle, indici, RLS) che include MODULE/COMPONENT, `parent_module_id` e `npm_package_ref`
- **V2__seed_data.sql**: seed dev/demo idempotente (tenant, ruoli, utente demo, environments)

## API Endpoints

### Dipendenze
```
GET    /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies
POST   /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies
DELETE /api/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies/{dependencyId}
```

### Artefatti
```
GET    /api/tenants/{tenantId}/artifacts
POST   /api/tenants/{tenantId}/artifacts
GET    /api/tenants/{tenantId}/artifacts/{artifactId}
PUT    /api/tenants/{tenantId}/artifacts/{artifactId}
DELETE /api/tenants/{tenantId}/artifacts/{artifactId}
```

---

**Sviluppato per**: Stillum Business Central  
**Analisi completa**: Sistema di persistenza delle dipendenze tra artefatti  
**Versioni rilevanti**: V1__schema, V2__seed_data
