package com.stillum.registry.service;

import com.stillum.registry.entity.Artifact;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class SearchService {

    public List<Artifact> fullTextSearch(UUID tenantId, String query, int page, int size) {
        if (query == null || query.isEmpty()) {
            return Artifact.find("tenantId = ?1 and deleted = false", tenantId)
                .page(page, size)
                .list();
        }
        
        String searchPattern = "%" + query.toLowerCase() + "%";
        return Artifact.find(
            "tenantId = ?1 and deleted = false and (lower(title) like ?2 or lower(description) like ?2 or lower(tags) like ?2)",
            tenantId,
            searchPattern
        ).page(page, size).list();
    }

    public long countSearchResults(UUID tenantId, String query) {
        if (query == null || query.isEmpty()) {
            return Artifact.count("tenantId = ?1 and deleted = false", tenantId);
        }
        
        String searchPattern = "%" + query.toLowerCase() + "%";
        return Artifact.count(
            "tenantId = ?1 and deleted = false and (lower(title) like ?2 or lower(description) like ?2 or lower(tags) like ?2)",
            tenantId,
            searchPattern
        );
    }
}
