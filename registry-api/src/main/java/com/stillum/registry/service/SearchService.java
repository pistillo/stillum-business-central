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
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import java.util.List;
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
            int page,
            int pageSize) {
        StringBuilder jpql = new StringBuilder(
            "SELECT a FROM Artifact a WHERE a.tenantId = :tid");

        if (query != null && !query.isBlank()) {
            jpql.append(
                " AND (LOWER(a.title) LIKE :q OR LOWER(a.description) LIKE :q)");
        }
        if (type != null) {
            jpql.append(" AND a.type = :type");
        }
        if (status != null) {
            jpql.append(" AND a.status = :status");
        }
        if (area != null && !area.isBlank()) {
            jpql.append(" AND a.area = :area");
        }
        jpql.append(" ORDER BY a.updatedAt DESC");

        TypedQuery<Artifact> q = em.createQuery(jpql.toString(), Artifact.class);
        q.setParameter("tid", tenantId);

        if (query != null && !query.isBlank()) {
            q.setParameter("q", "%" + query.toLowerCase() + "%");
        }
        if (type != null) {
            q.setParameter("type", type);
        }
        if (status != null) {
            q.setParameter("status", status);
        }
        if (area != null && !area.isBlank()) {
            q.setParameter("area", area);
        }

        // Count query
        StringBuilder countJpql = new StringBuilder(
            "SELECT COUNT(a) FROM Artifact a WHERE a.tenantId = :tid");
        if (query != null && !query.isBlank()) {
            countJpql.append(
                " AND (LOWER(a.title) LIKE :q OR LOWER(a.description) LIKE :q)");
        }
        if (type != null) {
            countJpql.append(" AND a.type = :type");
        }
        if (status != null) {
            countJpql.append(" AND a.status = :status");
        }
        if (area != null && !area.isBlank()) {
            countJpql.append(" AND a.area = :area");
        }

        TypedQuery<Long> cq = em.createQuery(countJpql.toString(), Long.class);
        cq.setParameter("tid", tenantId);
        if (query != null && !query.isBlank()) {
            cq.setParameter("q", "%" + query.toLowerCase() + "%");
        }
        if (type != null) {
            cq.setParameter("type", type);
        }
        if (status != null) {
            cq.setParameter("status", status);
        }
        if (area != null && !area.isBlank()) {
            cq.setParameter("area", area);
        }

        long total = cq.getSingleResult();
        List<ArtifactResponse> items = q
                .setFirstResult(page * pageSize)
                .setMaxResults(pageSize)
                .getResultList()
                .stream()
                .map(ArtifactResponse::from)
                .toList();

        return PagedResponse.of(items, page, pageSize, total);
    }
}
