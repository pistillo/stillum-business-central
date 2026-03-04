package com.stillum.registry.repository;

import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ArtifactRepository implements PanacheRepositoryBase<Artifact, UUID> {

    @Inject
    EntityManager em;

    public List<Artifact> findByTenant(
            UUID tenantId,
            ArtifactType type,
            ArtifactStatus status,
            String area,
            String tag,
            UUID parentModuleId,
            int page,
            int pageSize) {
        if (tag != null && !tag.isBlank()) {
            return findByTenantWithTagNative(tenantId, type, status, area, tag, parentModuleId, page, pageSize);
        }

        StringBuilder query = new StringBuilder("tenantId = :tid");
        Parameters params = Parameters.with("tid", tenantId);
        List<String> conditions = new ArrayList<>();

        if (type != null) {
            conditions.add("type = :type");
            params.and("type", type);
        }
        if (status != null) {
            conditions.add("status = :status");
            params.and("status", status);
        }
        if (area != null && !area.isBlank()) {
            conditions.add("area = :area");
            params.and("area", area);
        }
        if (parentModuleId != null) {
            conditions.add("parentModuleId = :pmid");
            params.and("pmid", parentModuleId);
        }

        for (String cond : conditions) {
            query.append(" and ").append(cond);
        }

        return find(query + " order by updatedAt desc", params)
                .page(Page.of(page, pageSize))
                .list();
    }

    public long countByTenant(
            UUID tenantId,
            ArtifactType type,
            ArtifactStatus status,
            String area,
            String tag,
            UUID parentModuleId) {
        if (tag != null && !tag.isBlank()) {
            return countByTenantWithTagNative(tenantId, type, status, area, tag);
        }

        StringBuilder query = new StringBuilder("tenantId = :tid");
        Parameters params = Parameters.with("tid", tenantId);

        if (type != null) {
            query.append(" and type = :type");
            params.and("type", type);
        }
        if (status != null) {
            query.append(" and status = :status");
            params.and("status", status);
        }
        if (area != null && !area.isBlank()) {
            query.append(" and area = :area");
            params.and("area", area);
        }
        if (parentModuleId != null) {
            query.append(" and parentModuleId = :pmid");
            params.and("pmid", parentModuleId);
        }

        return count(query.toString(), params);
    }

    public List<Artifact> findByParentModule(UUID tenantId, UUID parentModuleId) {
        return list("tenantId = :tid and parentModuleId = :pmid order by title asc",
                Parameters.with("tid", tenantId).and("pmid", parentModuleId));
    }

    public Optional<Artifact> findByIdAndTenant(UUID id, UUID tenantId) {
        return find("id = :id and tenantId = :tid",
                Parameters.with("id", id).and("tid", tenantId))
                .firstResultOptional();
    }

    private List<Artifact> findByTenantWithTagNative(
            UUID tenantId,
            ArtifactType type,
            ArtifactStatus status,
            String area,
            String tag,
            UUID parentModuleId,
            int page,
            int pageSize) {
        StringBuilder sql = new StringBuilder("SELECT * FROM artifact WHERE tenant_id = :tid");
        Map<String, Object> params = new HashMap<>();
        params.put("tid", tenantId);

        if (type != null) {
            sql.append(" AND type = :type");
            params.put("type", type.name());
        }
        if (status != null) {
            sql.append(" AND status = :status");
            params.put("status", status.name());
        }
        if (area != null && !area.isBlank()) {
            sql.append(" AND area = :area");
            params.put("area", area);
        }
        if (parentModuleId != null) {
            sql.append(" AND parent_module_id = :pmid");
            params.put("pmid", parentModuleId);
        }

        sql.append(" AND :tag = ANY(tags)");
        params.put("tag", tag);

        sql.append(" ORDER BY updated_at DESC LIMIT :limit OFFSET :offset");
        Query q = em.createNativeQuery(sql.toString(), Artifact.class);
        for (Map.Entry<String, Object> e : params.entrySet()) {
            q.setParameter(e.getKey(), e.getValue());
        }
        q.setParameter("limit", pageSize);
        q.setParameter("offset", page * pageSize);
        @SuppressWarnings("unchecked")
        List<Artifact> results = q.getResultList();
        return results;
    }

    private long countByTenantWithTagNative(
            UUID tenantId,
            ArtifactType type,
            ArtifactStatus status,
            String area,
            String tag) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM artifact WHERE tenant_id = :tid");
        Map<String, Object> params = new HashMap<>();
        params.put("tid", tenantId);

        if (type != null) {
            sql.append(" AND type = :type");
            params.put("type", type.name());
        }
        if (status != null) {
            sql.append(" AND status = :status");
            params.put("status", status.name());
        }
        if (area != null && !area.isBlank()) {
            sql.append(" AND area = :area");
            params.put("area", area);
        }

        sql.append(" AND :tag = ANY(tags)");
        params.put("tag", tag);

        Query q = em.createNativeQuery(sql.toString());
        for (Map.Entry<String, Object> e : params.entrySet()) {
            q.setParameter(e.getKey(), e.getValue());
        }
        Number n = (Number) q.getSingleResult();
        return n.longValue();
    }
}
