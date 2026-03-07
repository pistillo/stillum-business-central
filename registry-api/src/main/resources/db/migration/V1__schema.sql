-- Schema: tabelle, indici, RLS (nessun seed).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

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
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id         UUID         NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    type              VARCHAR(20)  NOT NULL,
    title             VARCHAR(255) NOT NULL,
    description       TEXT,
    owner_id          UUID         REFERENCES app_user(id) ON DELETE SET NULL,
    status            VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    area              VARCHAR(100),
    tags              TEXT[],
    parent_module_id  UUID         REFERENCES artifact(id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT artifact_type_check CHECK (type IN ('PROCESS', 'RULE', 'FORM', 'REQUEST', 'MODULE', 'COMPONENT')),
    CONSTRAINT artifact_status_check CHECK (
        status IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'RETIRED')
    )
);

CREATE TABLE artifact_version (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_id     UUID         NOT NULL REFERENCES artifact(id) ON DELETE CASCADE,
    version         VARCHAR(50)  NOT NULL,
    state           VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    created_by      UUID         REFERENCES app_user(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    metadata        JSONB,
    npm_package_ref VARCHAR(500),
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

CREATE INDEX idx_artifact_tenant  ON artifact(tenant_id);
CREATE INDEX idx_artifact_type    ON artifact(tenant_id, type);
CREATE INDEX idx_artifact_status  ON artifact(tenant_id, status);
CREATE INDEX idx_artifact_area    ON artifact(tenant_id, area);
CREATE INDEX idx_artifact_owner   ON artifact(owner_id);
CREATE INDEX idx_artifact_tags ON artifact USING GIN(tags);
CREATE INDEX idx_artifact_fts ON artifact USING GIN(
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
);

CREATE INDEX idx_av_artifact ON artifact_version(artifact_id);
CREATE INDEX idx_av_state    ON artifact_version(artifact_id, state);
CREATE INDEX idx_av_creator  ON artifact_version(created_by);

CREATE INDEX idx_dep_version    ON dependency(artifact_version_id);
CREATE INDEX idx_dep_depends_on ON dependency(depends_on_version_id);
CREATE INDEX idx_dep_artifact   ON dependency(depends_on_artifact_id);

CREATE INDEX idx_env_tenant ON environment(tenant_id);

CREATE INDEX idx_pub_version     ON publication(artifact_version_id);
CREATE INDEX idx_pub_environment ON publication(environment_id);
CREATE INDEX idx_pub_published   ON publication(published_at);

CREATE INDEX idx_audit_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_entity ON audit_log(tenant_id, entity_type, entity_id);
CREATE INDEX idx_audit_actor  ON audit_log(actor_id);
CREATE INDEX idx_audit_time   ON audit_log(tenant_id, timestamp DESC);

CREATE INDEX idx_user_tenant ON app_user(tenant_id);
CREATE INDEX idx_user_role   ON app_user(role_id);

ALTER TABLE artifact         ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifact_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment      ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication      ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependency       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log        ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_user         ENABLE ROW LEVEL SECURITY;
ALTER TABLE role             ENABLE ROW LEVEL SECURITY;

CREATE POLICY rls_artifact ON artifact
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

CREATE POLICY rls_artifact_version ON artifact_version
    USING (
        artifact_id IN (
            SELECT id FROM artifact
            WHERE tenant_id = current_setting('app.current_tenant', true)::UUID
        )
    );

CREATE POLICY rls_environment ON environment
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

CREATE POLICY rls_publication ON publication
    USING (
        artifact_version_id IN (
            SELECT av.id FROM artifact_version av
            JOIN artifact a ON a.id = av.artifact_id
            WHERE a.tenant_id = current_setting('app.current_tenant', true)::UUID
        )
    );

CREATE POLICY rls_dependency ON dependency
    USING (
        artifact_version_id IN (
            SELECT av.id FROM artifact_version av
            JOIN artifact a ON a.id = av.artifact_id
            WHERE a.tenant_id = current_setting('app.current_tenant', true)::UUID
        )
    );

CREATE POLICY rls_audit_log ON audit_log
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

CREATE POLICY rls_app_user ON app_user
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

CREATE POLICY rls_role ON role
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'stillum_app') THEN
        CREATE ROLE stillum_app NOLOGIN NOBYPASSRLS;
    END IF;
EXCEPTION WHEN insufficient_privilege THEN
    NULL;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'stillum_app') THEN
        EXECUTE 'GRANT USAGE ON SCHEMA public TO stillum_app';
        EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO stillum_app';
        EXECUTE 'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO stillum_app';
        EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO stillum_app';
        EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO stillum_app';
        EXECUTE format('GRANT stillum_app TO %I', current_user);
    END IF;
END $$;

ALTER TABLE artifact         FORCE ROW LEVEL SECURITY;
ALTER TABLE artifact_version FORCE ROW LEVEL SECURITY;
ALTER TABLE environment      FORCE ROW LEVEL SECURITY;
ALTER TABLE publication      FORCE ROW LEVEL SECURITY;
ALTER TABLE dependency       FORCE ROW LEVEL SECURITY;
ALTER TABLE audit_log        FORCE ROW LEVEL SECURITY;
ALTER TABLE app_user         FORCE ROW LEVEL SECURITY;
ALTER TABLE role             FORCE ROW LEVEL SECURITY;
