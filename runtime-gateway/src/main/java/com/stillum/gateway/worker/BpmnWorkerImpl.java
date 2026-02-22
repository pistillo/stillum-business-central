package com.stillum.gateway.worker;

import io.temporal.activity.Activity;
import io.temporal.activity.ActivityExecutionContext;

public class BpmnWorkerImpl implements BpmnWorker {

    @Override
    public String executeActivity(String activityType, String input) {
        ActivityExecutionContext context = Activity.getExecutionContext();
        // Handle different activity types
        switch (activityType) {
            case "service_task":
                return executeServiceTask(input);
            case "script_task":
                return executeScriptTask(input);
            case "manual_task":
                return input;
            default:
                return "Unknown activity type: " + activityType;
        }
    }

    @Override
    public String callService(String serviceName, String payload) {
        // Call external service
        return "Service call response";
    }

    @Override
    public String executeScript(String scriptType, String script) {
        // Execute script (JavaScript, Groovy, etc.)
        return "Script execution result";
    }

    @Override
    public String sendMessage(String topic, String message) {
        // Send message to message broker
        return "Message sent to: " + topic;
    }

    @Override
    public String waitForSignal(String signalName, long timeoutMs) {
        // Wait for external signal with timeout
        return "Waiting for signal: " + signalName;
    }

    private String executeServiceTask(String input) {
        // Process service task
        return "Service task completed";
    }

    private String executeScriptTask(String input) {
        // Process script task
        return "Script task completed";
    }
}
