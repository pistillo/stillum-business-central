-- V2: Schema principale – tutte le tabelle di dominio

CREATE TABLE tenant (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    domain     VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE role (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID         NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    UNIQUE (tenant_id, name)
);

CREATE TABLE app_user (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID         NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    role_id       UUID         REFERENCES role(id) ON DELETE SET NULL,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, email)
);

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
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT artifact_type_check CHECK (type IN ('PROCESS', 'RULE', 'FORM', 'REQUEST')),
    CONSTRAINT artifact_status_check CHECK (
        status IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'RETIRED')
    )
);

CREATE TABLE artifact_version (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_id UUID         NOT NULL REFERENCES artifact(id) ON DELETE CASCADE,
    version     VARCHAR(50)  NOT NULL,
    state       VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    payload_ref VARCHAR(500),
    created_by  UUID         REFERENCES app_user(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    metadata    JSONB,
    UNIQUE (artifact_id, version),
    CONSTRAINT version_state_check CHECK (
        state IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'RETIRED')
    )
);

CREATE TABLE environment (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID         NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    UNIQUE (tenant_id, name)
);

CREATE TABLE publication (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_version_id UUID        NOT NULL REFERENCES artifact_version(id),
    environment_id      UUID        NOT NULL REFERENCES environment(id),
    published_by        UUID        REFERENCES app_user(id) ON DELETE SET NULL,
    published_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes               TEXT,
    bundle_ref          VARCHAR(500)
);

CREATE TABLE dependency (
    id                     UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    artifact_version_id    UUID NOT NULL REFERENCES artifact_version(id) ON DELETE CASCADE,
    depends_on_artifact_id UUID NOT NULL REFERENCES artifact(id),
    depends_on_version_id  UUID NOT NULL REFERENCES artifact_version(id),
    UNIQUE (artifact_version_id, depends_on_version_id)
);

CREATE TABLE audit_log (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID         NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    entity_type VARCHAR(100) NOT NULL,
    entity_id   UUID,
    action      VARCHAR(100) NOT NULL,
    actor_id    UUID         REFERENCES app_user(id) ON DELETE SET NULL,
    timestamp   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    details     JSONB
);
