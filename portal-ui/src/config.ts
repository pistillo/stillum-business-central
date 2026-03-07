/** In dev usiamo il proxy Vite (/api/registry, /api/publisher) per evitare CORS. */
export const config = {
  theiaBaseUrl: '/theia',
  registryApiBaseUrl: '/api/registry',
  publisherApiBaseUrl: '/api/publisher',
  cheBaseUrl: '',
  nexus: {
    /** Ricerca npm: default via gateway per evitare CORS con Nexus. */
    npmSearchUrl: '/api/nexus/search',
    /** Lookup singolo package: default via gateway. */
    npmProxyPackageUrl: '/api/nexus/package',
  },
  oidc: {
    authority: `${window.location.origin}/auth/realms/stillum`,
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
    scope: import.meta.env.VITE_OIDC_SCOPE ?? 'openid profile email',
    redirectUri: `${window.location.origin}/oidc/callback`,
    postLogoutRedirectUri: `${window.location.origin}/login`,
  },
} as const;
