package com.stillum.gateway.worker;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

@ActivityInterface
public interface BpmnWorker {

    @ActivityMethod
    String executeActivity(String activityType, String input);

    @ActivityMethod
    String callService(String serviceName, String payload);

    @ActivityMethod
    String executeScript(String scriptType, String script);

    @ActivityMethod
    String sendMessage(String topic, String message);

    @ActivityMethod
    String waitForSignal(String signalName, long timeoutMs);
}
