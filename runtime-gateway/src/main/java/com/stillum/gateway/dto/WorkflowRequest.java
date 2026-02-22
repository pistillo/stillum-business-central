package com.stillum.gateway.dto;

import java.util.HashMap;
import java.util.Map;

public class WorkflowRequest {
    private String workflowId;
    private String bundleRef;
    private Map<String, Object> input;
    private String priority;

    public WorkflowRequest() {
        this.input = new HashMap<>();
    }

    public String getWorkflowId() {
        return workflowId;
    }

    public void setWorkflowId(String workflowId) {
        this.workflowId = workflowId;
    }

    public String getBundleRef() {
        return bundleRef;
    }

    public void setBundleRef(String bundleRef) {
        this.bundleRef = bundleRef;
    }

    public Map<String, Object> getInput() {
        return input;
    }

    public void setInput(Map<String, Object> input) {
        this.input = input;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
