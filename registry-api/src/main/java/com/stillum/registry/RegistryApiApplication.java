package com.stillum.registry;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeType;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.security.SecurityScheme;

@ApplicationPath("/")
@OpenAPIDefinition(
    info = @Info(
        title = "Registry API",
        version = "1.0.0",
        description = "Multi-tenant Business Process Registry API"
    )
)
@SecurityScheme(
    securitySchemeName = "api_key",
    type = SecuritySchemeType.APIKEY,
    apiKeyName = "Authorization",
    description = "API Key based security"
)
public class RegistryApiApplication extends Application {
}
