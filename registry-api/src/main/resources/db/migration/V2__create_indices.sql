-- Indices for performance
CREATE INDEX idx_artifacts_tenant_id ON artifacts(tenant_id);
CREATE INDEX idx_artifacts_owner_id ON artifacts(owner_id);
CREATE INDEX idx_artifacts_type_status ON artifacts(type, status);
CREATE INDEX idx_artifacts_deleted ON artifacts(deleted);

CREATE INDEX idx_artifact_versions_artifact_id ON artifact_versions(artifact_id);
CREATE INDEX idx_artifact_versions_created_by ON artifact_versions(created_by);
CREATE INDEX idx_artifact_versions_state ON artifact_versions(state);

CREATE INDEX idx_dependencies_artifact_version_id ON dependencies(artifact_version_id);
CREATE INDEX idx_dependencies_depends_on_artifact_id ON dependencies(depends_on_artifact_id);

CREATE INDEX idx_publications_artifact_version_id ON publications(artifact_version_id);
CREATE INDEX idx_publications_environment_id ON publications(environment_id);
CREATE INDEX idx_publications_published_by ON publications(published_by);

CREATE INDEX idx_instances_tenant_id ON instances(tenant_id);
CREATE INDEX idx_instances_artifact_version_id ON instances(artifact_version_id);
CREATE INDEX idx_instances_status ON instances(status);

CREATE INDEX idx_tasks_instance_id ON tasks(instance_id);
CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

CREATE INDEX idx_reviews_version_id ON reviews(version_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_status ON reviews(status);

CREATE INDEX idx_notifications_tenant_id ON notifications(tenant_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_role_id ON users(role_id);

CREATE INDEX idx_roles_tenant_id ON roles(tenant_id);
CREATE INDEX idx_environments_tenant_id ON environments(tenant_id);
