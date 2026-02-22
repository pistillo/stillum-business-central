package com.stillum.gateway.service;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class InstanceService {

    public Map<String, Object> getInstanceDetails(String instanceId, String tenantId) {
        Map<String, Object> instance = new HashMap<>();
        instance.put("id", instanceId);
        instance.put("status", "RUNNING");
        instance.put("progress", 45);

        return instance;
    }

    public void pauseInstance(String instanceId, String tenantId) throws Exception {
        // Pause workflow instance
    }

    public void resumeInstance(String instanceId, String tenantId) throws Exception {
        // Resume paused workflow instance
    }

    public void abortInstance(String instanceId, String reason, String tenantId) throws Exception {
        // Abort workflow instance with reason
    }

    public void retryInstance(String instanceId, String tenantId) throws Exception {
        // Retry failed instance
    }
}
