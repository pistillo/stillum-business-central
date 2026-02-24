import { createContext } from 'react';
import type { User, UserManager } from 'oidc-client-ts';

export type AuthState =
  | { status: 'loading'; userManager: UserManager }
  | { status: 'anonymous'; userManager: UserManager }
  | { status: 'authenticated'; userManager: UserManager; user: User };

export type AuthContextValue = {
  state: AuthState;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
