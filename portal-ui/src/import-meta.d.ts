interface ImportMetaEnv {
  readonly VITE_GATEWAY_API_BASE_URL?: string;
  readonly VITE_THEIA_BASE_URL?: string;
  readonly VITE_REGISTRY_API_BASE_URL?: string;
  readonly VITE_PUBLISHER_API_BASE_URL?: string;
  readonly VITE_CHE_BASE_URL?: string;
  readonly VITE_NEXUS_NPM_SEARCH_URL?: string;
  readonly VITE_NEXUS_NPM_PROXY_PACKAGE_URL?: string;
  readonly VITE_OIDC_AUTHORITY?: string;
  readonly VITE_OIDC_CLIENT_ID?: string;
  readonly VITE_OIDC_SCOPE?: string;
  readonly VITE_OIDC_REDIRECT_URI?: string;
  readonly VITE_OIDC_POST_LOGOUT_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
