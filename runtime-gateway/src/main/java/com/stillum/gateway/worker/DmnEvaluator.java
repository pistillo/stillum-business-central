package com.stillum.gateway.worker;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;
import java.util.Map;

@ActivityInterface
public interface DmnEvaluator {

    @ActivityMethod
    Map<String, Object> evaluateDecision(String decisionId, Map<String, Object> input);

    @ActivityMethod
    Map<String, Object> evaluateTable(String tableId, Map<String, Object> input);

    @ActivityMethod
    Map<String, Object> evaluateExpression(String expression, Map<String, Object> context);
}
