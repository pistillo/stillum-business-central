package com.stillum.registry.service;

import com.stillum.registry.dto.response.ArtifactResponse;
import com.stillum.registry.dto.response.PagedResponse;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import com.stillum.registry.filter.EnforceTenantRls;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
@EnforceTenantRls
public class SearchService {

    @Inject
    EntityManager em;

    @Transactional
    public PagedResponse<ArtifactResponse> search(
            UUID tenantId,
            String query,
            ArtifactType type,
            ArtifactStatus status,
            String area,
            String tag,
            int page,
            int pageSize) {

        StringBuilder where = buildWhere(tenantId, query, type, status, area, tag);
        Map<String, Object> params = buildParams(tenantId, query, type, status, area, tag);

        // Count query
        Query cq = em.createNativeQuery("SELECT COUNT(*) FROM artifact" + where);
        for (Map.Entry<String, Object> e : params.entrySet()) {
            cq.setParameter(e.getKey(), e.getValue());
        }
        long total = ((Number) cq.getSingleResult()).longValue();

        // Data query
        String dataSql = "SELECT * FROM artifact" + where
                + " ORDER BY updated_at DESC LIMIT :limit OFFSET :offset";
        Query dq = em.createNativeQuery(dataSql, Artifact.class);
        for (Map.Entry<String, Object> e : params.entrySet()) {
            dq.setParameter(e.getKey(), e.getValue());
        }
        dq.setParameter("limit", pageSize);
        dq.setParameter("offset", page * pageSize);

        @SuppressWarnings("unchecked")
        List<Artifact> results = dq.getResultList();

        List<ArtifactResponse> items = results.stream()
                .map(ArtifactResponse::from)
                .toList();

        return PagedResponse.of(items, page, pageSize, total);
    }

    private StringBuilder buildWhere(
            UUID tenantId, String query, ArtifactType type,
            ArtifactStatus status, String area, String tag) {
        StringBuilder w = new StringBuilder(" WHERE tenant_id = :tid");
        if (query != null && !query.isBlank()) {
            w.append(" AND to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))")
             .append(" @@ plainto_tsquery('simple', :q)");
        }
        if (type != null) {
            w.append(" AND type = :type");
        }
        if (status != null) {
            w.append(" AND status = :status");
        }
        if (area != null && !area.isBlank()) {
            w.append(" AND area = :area");
        }
        if (tag != null && !tag.isBlank()) {
            w.append(" AND :tag = ANY(tags)");
        }
        return w;
    }

    private Map<String, Object> buildParams(
            UUID tenantId, String query, ArtifactType type,
            ArtifactStatus status, String area, String tag) {
        Map<String, Object> params = new HashMap<>();
        params.put("tid", tenantId);
        if (query != null && !query.isBlank()) {
            params.put("q", query);
        }
        if (type != null) {
            params.put("type", type.name());
        }
        if (status != null) {
            params.put("status", status.name());
        }
        if (area != null && !area.isBlank()) {
            params.put("area", area);
        }
        if (tag != null && !tag.isBlank()) {
            params.put("tag", tag);
        }
        return params;
    }
}
