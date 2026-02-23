-- V4: Row-Level Security – isolamento dati per tenant

-- Abilita RLS su tutte le tabelle con tenant_id
ALTER TABLE artifact         ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifact_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment      ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication      ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependency       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log        ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_user         ENABLE ROW LEVEL SECURITY;
ALTER TABLE role             ENABLE ROW LEVEL SECURITY;

-- Policy: artifact – visibile solo se tenant_id corrisponde al tenant corrente
CREATE POLICY rls_artifact ON artifact
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

-- Policy: artifact_version – visibile solo se l'artifact padre è del tenant corrente
CREATE POLICY rls_artifact_version ON artifact_version
    USING (
        artifact_id IN (
            SELECT id FROM artifact
            WHERE tenant_id = current_setting('app.current_tenant', true)::UUID
        )
    );

-- Policy: environment
CREATE POLICY rls_environment ON environment
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

-- Policy: publication – via artifact_version → artifact → tenant
CREATE POLICY rls_publication ON publication
    USING (
        artifact_version_id IN (
            SELECT av.id FROM artifact_version av
            JOIN artifact a ON a.id = av.artifact_id
            WHERE a.tenant_id = current_setting('app.current_tenant', true)::UUID
        )
    );

-- Policy: dependency – via artifact_version → artifact → tenant
CREATE POLICY rls_dependency ON dependency
    USING (
        artifact_version_id IN (
            SELECT av.id FROM artifact_version av
            JOIN artifact a ON a.id = av.artifact_id
            WHERE a.tenant_id = current_setting('app.current_tenant', true)::UUID
        )
    );

-- Policy: audit_log
CREATE POLICY rls_audit_log ON audit_log
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

-- Policy: app_user
CREATE POLICY rls_app_user ON app_user
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

-- Policy: role
CREATE POLICY rls_role ON role
    USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

