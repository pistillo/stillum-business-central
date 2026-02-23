package com.stillum.registry.service;

import com.stillum.registry.dto.request.CreateEnvironmentRequest;
import com.stillum.registry.dto.request.UpdateEnvironmentRequest;
import com.stillum.registry.dto.response.EnvironmentResponse;
import com.stillum.registry.entity.Environment;
import com.stillum.registry.exception.EnvironmentNotFoundException;
import com.stillum.registry.filter.EnforceTenantRls;
import com.stillum.registry.repository.EnvironmentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
@EnforceTenantRls
public class EnvironmentService {

    @Inject
    EnvironmentRepository repo;

    @Transactional
    public EnvironmentResponse create(UUID tenantId, CreateEnvironmentRequest req) {
        Environment env = new Environment();
        env.tenantId = tenantId;
        env.name = req.name();
        env.description = req.description();
        repo.persist(env);
        return EnvironmentResponse.from(env);
    }

    @Transactional
    public List<EnvironmentResponse> list(UUID tenantId) {
        return repo.findByTenant(tenantId).stream()
                .map(EnvironmentResponse::from)
                .toList();
    }

    @Transactional
    public EnvironmentResponse getById(UUID tenantId, UUID environmentId) {
        return repo.findByIdAndTenant(environmentId, tenantId)
                .map(EnvironmentResponse::from)
                .orElseThrow(() -> new EnvironmentNotFoundException(environmentId));
    }

    @Transactional
    public EnvironmentResponse update(UUID tenantId, UUID environmentId, UpdateEnvironmentRequest req) {
        Environment env = repo.findByIdAndTenant(environmentId, tenantId)
                .orElseThrow(() -> new EnvironmentNotFoundException(environmentId));
        env.name = req.name();
        env.description = req.description();
        return EnvironmentResponse.from(env);
    }

    @Transactional
    public void delete(UUID tenantId, UUID environmentId) {
        Environment env = repo.findByIdAndTenant(environmentId, tenantId)
                .orElseThrow(() -> new EnvironmentNotFoundException(environmentId));
        repo.delete(env);
    }
}
