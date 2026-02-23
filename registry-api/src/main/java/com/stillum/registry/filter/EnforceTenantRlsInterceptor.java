package com.stillum.registry.filter;

import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import jakarta.ws.rs.Priorities;

@EnforceTenantRls
@Interceptor
@Priority(Priorities.AUTHENTICATION + 10)
public class EnforceTenantRlsInterceptor {

    @Inject
    RlsSessionInitializer rlsSessionInitializer;

    @AroundInvoke
    public Object aroundInvoke(InvocationContext ctx) throws Exception {
        rlsSessionInitializer.propagate();
        return ctx.proceed();
    }
}
