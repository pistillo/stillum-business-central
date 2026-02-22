package com.stillum.gateway.dto;

import java.util.HashMap;
import java.util.Map;

public class TaskRequest {
    private String taskId;
    private String action;
    private String assignee;
    private Map<String, Object> data;

    public TaskRequest() {
        this.data = new HashMap<>();
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }
}
