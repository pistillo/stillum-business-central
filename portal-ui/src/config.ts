/** Base URL del gateway (evita CORS: il frontend chiama solo il gateway). */
export const gatewayApiBaseUrl =
  import.meta.env.VITE_GATEWAY_API_BASE_URL ?? 'http://localhost:8083/api';

/** In dev usiamo il proxy Vite (/api/registry, /api/publisher) per evitare CORS. */
export const config = {
  theiaBaseUrl: import.meta.env.VITE_THEIA_BASE_URL ?? 'http://localhost:3000',
  registryApiBaseUrl:
    import.meta.env.VITE_REGISTRY_API_BASE_URL ??
    (import.meta.env.DEV ? '/api/registry' : 'http://localhost:8081/api'),
  publisherApiBaseUrl:
    import.meta.env.VITE_PUBLISHER_API_BASE_URL ??
    (import.meta.env.DEV ? '/api/publisher' : 'http://localhost:8082/api'),
  cheBaseUrl: import.meta.env.VITE_CHE_BASE_URL ?? '',
  nexus: {
    /** Ricerca npm: default via gateway per evitare CORS con Nexus. */
    npmSearchUrl: import.meta.env.VITE_NEXUS_NPM_SEARCH_URL ?? `${gatewayApiBaseUrl}/nexus/search`,
    /** Lookup singolo package: default via gateway. */
    npmProxyPackageUrl:
      import.meta.env.VITE_NEXUS_NPM_PROXY_PACKAGE_URL ?? `${gatewayApiBaseUrl}/nexus/package`,
  },
  oidc: {
    authority: import.meta.env.VITE_OIDC_AUTHORITY,
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
    scope: import.meta.env.VITE_OIDC_SCOPE ?? 'openid profile email',
    redirectUri:
      import.meta.env.VITE_OIDC_REDIRECT_URI ?? `${window.location.origin}/oidc/callback`,
    postLogoutRedirectUri:
      import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI ?? `${window.location.origin}/login`,
  },
} as const;
