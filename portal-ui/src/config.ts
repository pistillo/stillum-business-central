export const config = {
  registryApiBaseUrl: import.meta.env.VITE_REGISTRY_API_BASE_URL ?? 'http://localhost:8081/api',
  publisherApiBaseUrl: import.meta.env.VITE_PUBLISHER_API_BASE_URL ?? 'http://localhost:8082/api',
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
