import { User, UserManager, WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { config } from '../config';

type AuthState =
  | { status: 'loading'; userManager: UserManager }
  | { status: 'anonymous'; userManager: UserManager }
  | { status: 'authenticated'; userManager: UserManager; user: User };

type AuthContextValue = {
  state: AuthState;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function createUserManager(): UserManager {
  const settings: UserManagerSettings = {
    authority: config.oidc.authority ?? 'http://localhost:8080/realms/stillum',
    client_id: config.oidc.clientId ?? 'portal-ui',
    redirect_uri: config.oidc.redirectUri,
    post_logout_redirect_uri: config.oidc.postLogoutRedirectUri,
    response_type: 'code',
    scope: config.oidc.scope,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  };
  return new UserManager(settings);
}

export function AuthProvider(props: { children: ReactNode }) {
  const [userManager] = useState(() => createUserManager());
  const [state, setState] = useState<AuthState>({ status: 'loading', userManager });

  useEffect(() => {
    let cancelled = false;
    userManager
      .getUser()
      .then((user) => {
        if (cancelled) return;
        if (user && !user.expired) {
          setState({ status: 'authenticated', userManager, user });
        } else {
          setState({ status: 'anonymous', userManager });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: 'anonymous', userManager });
      });

    const onUserLoaded = (user: User) => setState({ status: 'authenticated', userManager, user });
    const onUserUnloaded = () => setState({ status: 'anonymous', userManager });

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);

    return () => {
      cancelled = true;
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, [userManager]);

  const login = useCallback(async () => {
    await userManager.signinRedirect();
  }, [userManager]);

  const logout = useCallback(async () => {
    await userManager.signoutRedirect();
  }, [userManager]);

  const getAccessToken = useCallback(() => {
    if (state.status !== 'authenticated') return null;
    return state.user.access_token ?? null;
  }, [state]);

  const value = useMemo<AuthContextValue>(
    () => ({ state, login, logout, getAccessToken }),
    [state, login, logout, getAccessToken]
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export async function handleOidcCallback(userManager: UserManager): Promise<User> {
  return userManager.signinRedirectCallback();
}
