-- V3: Indici per performance – chiavi esterne e campi di ricerca frequente

-- artifact
CREATE INDEX idx_artifact_tenant  ON artifact(tenant_id);
CREATE INDEX idx_artifact_type    ON artifact(tenant_id, type);
CREATE INDEX idx_artifact_status  ON artifact(tenant_id, status);
CREATE INDEX idx_artifact_area    ON artifact(tenant_id, area);
CREATE INDEX idx_artifact_owner   ON artifact(owner_id);

-- GIN index per array tags
CREATE INDEX idx_artifact_tags ON artifact USING GIN(tags);

-- GIN index per ricerca full-text su titolo e descrizione (lingua italiana con unaccent)
CREATE INDEX idx_artifact_fts ON artifact USING GIN(
    to_tsvector(
        'simple',
        coalesce(title, '') || ' ' || coalesce(description, '')
    )
);

-- artifact_version
CREATE INDEX idx_av_artifact ON artifact_version(artifact_id);
CREATE INDEX idx_av_state    ON artifact_version(artifact_id, state);
CREATE INDEX idx_av_creator  ON artifact_version(created_by);

-- dependency
CREATE INDEX idx_dep_version    ON dependency(artifact_version_id);
CREATE INDEX idx_dep_depends_on ON dependency(depends_on_version_id);
CREATE INDEX idx_dep_artifact   ON dependency(depends_on_artifact_id);

-- environment
CREATE INDEX idx_env_tenant ON environment(tenant_id);

-- publication
CREATE INDEX idx_pub_version     ON publication(artifact_version_id);
CREATE INDEX idx_pub_environment ON publication(environment_id);
CREATE INDEX idx_pub_published   ON publication(published_at);

-- audit_log
CREATE INDEX idx_audit_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_entity ON audit_log(tenant_id, entity_type, entity_id);
CREATE INDEX idx_audit_actor  ON audit_log(actor_id);
CREATE INDEX idx_audit_time   ON audit_log(tenant_id, timestamp DESC);

-- app_user
CREATE INDEX idx_user_tenant ON app_user(tenant_id);
CREATE INDEX idx_user_role   ON app_user(role_id);
