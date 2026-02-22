package com.stillum.registry.service;

import com.stillum.registry.entity.Instance;
import com.stillum.registry.entity.enums.InstanceStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class InstanceService {

    @Transactional
    public Instance startInstance(UUID tenantId, UUID artifactVersionId, String correlationKey, String businessKey) {
        Instance instance = new Instance();
        instance.tenantId = tenantId;
        instance.artifactVersionId = artifactVersionId;
        instance.correlationKey = correlationKey;
        instance.businessKey = businessKey;
        instance.status = InstanceStatus.RUNNING;
        instance.startedAt = LocalDateTime.now();
        instance.persist();
        return instance;
    }

    @Transactional
    public void completeInstance(UUID instanceId) {
        Instance instance = Instance.findById(instanceId);
        if (instance != null) {
            instance.status = InstanceStatus.COMPLETED;
            instance.endedAt = LocalDateTime.now();
            instance.persist();
        }
    }

    @Transactional
    public void failInstance(UUID instanceId) {
        Instance instance = Instance.findById(instanceId);
        if (instance != null) {
            instance.status = InstanceStatus.FAILED;
            instance.endedAt = LocalDateTime.now();
            instance.persist();
        }
    }

    public Instance getInstance(UUID instanceId) {
        return Instance.findById(instanceId);
    }

    public List<Instance> listInstances(UUID tenantId, int page, int size) {
        return Instance.find("tenantId", tenantId)
            .page(page, size)
            .list();
    }
}
