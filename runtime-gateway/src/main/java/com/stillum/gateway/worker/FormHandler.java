package com.stillum.gateway.worker;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;
import java.util.Map;

@ActivityInterface
public interface FormHandler {

    @ActivityMethod
    String validateFormSubmission(String formId, Map<String, Object> data);

    @ActivityMethod
    Map<String, Object> renderForm(String formId, Map<String, Object> context);

    @ActivityMethod
    String processFormData(String formId, Map<String, Object> data);
}
