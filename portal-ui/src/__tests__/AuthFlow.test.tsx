import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeContext';

// Components from the portal
import { AuthContext, type AuthContextValue } from '../auth/auth-context';
import { AuthProvider } from '../auth/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { OidcCallbackPage } from '../pages/OidcCallbackPage';
import { RequireAuth } from '../routes/RequireAuth';

// The portal uses `oidc-client-ts` under the hood.  To make tests deterministic and
// independent of a real Keycloak server, we mock this module and stub the
// behaviours we care about.  Each test can then assert that the correct
// methods on the `UserManager` instance were invoked.
const signinRedirectMock = vi.fn(() => Promise.resolve());
const signinRedirectCallbackMock = vi.fn(() => Promise.resolve());

/** Minimal UserManager-shaped object for tests; AuthContext only needs these members. */
function createTestUserManager() {
  return {
    signinRedirect: signinRedirectMock,
    signinRedirectCallback: signinRedirectCallbackMock,
    getUser: vi.fn(() => Promise.resolve(null)),
    events: {
      addUserLoaded: vi.fn(),
      addUserUnloaded: vi.fn(),
      removeUserLoaded: vi.fn(),
      removeUserUnloaded: vi.fn(),
    },
  };
}

/** Auth context value for anonymous user; used when we bypass AuthProvider. */
function createAnonymousAuthValue() {
  const userManager = createTestUserManager();
  return {
    state: { status: 'anonymous' as const, userManager },
    login: vi.fn(),
    logout: vi.fn(),
    getAccessToken: vi.fn(() => null),
  };
}

/** Auth context value for authenticated user; used when we bypass AuthProvider. */
function createAuthenticatedAuthValue() {
  const userManager = createTestUserManager();
  return {
    state: {
      status: 'authenticated' as const,
      userManager,
      user: { access_token: 'dummy' },
    },
    login: vi.fn(),
    logout: vi.fn(),
    getAccessToken: vi.fn(() => 'dummy'),
  };
}

// Mock `oidc-client-ts` before importing components that create a user manager.
vi.mock('oidc-client-ts', () => {
  class FakeUserManager {
    public settings: unknown;
    public signinRedirect = signinRedirectMock;
    public signinRedirectCallback = signinRedirectCallbackMock;
    public getUser = vi.fn(() => Promise.resolve(null));
    public events = {
      addUserLoaded: vi.fn(),
      addUserUnloaded: vi.fn(),
      removeUserLoaded: vi.fn(),
      removeUserUnloaded: vi.fn(),
    };
    constructor(settings: unknown) {
      this.settings = settings;
    }
  }
  // Provide a dummy WebStorageStateStore; it isn't used during tests but
  // `AuthContext` expects it to exist on the module.
  class FakeWebStorageStateStore {
    constructor() {
      // no-op; AuthContext expects the class to exist
    }
  }
  // Return the mocked classes.  Any other exports are left undefined because
  // the tests don't rely on them.
  return {
    UserManager: FakeUserManager,
    WebStorageStateStore: FakeWebStorageStateStore,
  };
});

describe('OIDC authentication flow', () => {
  beforeAll(() => {
    // jsdom does not implement window.matchMedia; ThemeProvider needs it
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          media: '',
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(() => false),
        } as unknown as MediaQueryList;
      };
  });

  beforeEach(() => {
    // Clear mocks between tests to avoid cross‑test pollution
    signinRedirectMock.mockClear();
    signinRedirectCallbackMock.mockClear();
  });

  it('invokes signinRedirect when the login button is clicked', async () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </MemoryRouter>
      </ThemeProvider>
    );
    // The login button is labelled "Accedi con SSO" on the page
    const button = screen.getByRole('button', { name: /accedi/i });
    fireEvent.click(button);
    // Wait for any pending promises; then assert that our stub was called
    await waitFor(() => {
      expect(signinRedirectMock).toHaveBeenCalledTimes(1);
    });
  });

  it('calls signinRedirectCallback on the OIDC callback page', async () => {
    // We don't use AuthProvider here because it would call getUser() again and
    // complicate the state transitions.
    const authValue = createAnonymousAuthValue();
    render(
      <AuthContext.Provider value={authValue as unknown as AuthContextValue}>
        <MemoryRouter initialEntries={['/oidc/callback']}>
          <Routes>
            <Route path="/oidc/callback" element={<OidcCallbackPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    await waitFor(() => {
      expect(signinRedirectCallbackMock).toHaveBeenCalledTimes(1);
    });
  });

  it('redirects unauthenticated users to /login via RequireAuth', () => {
    // Render a protected route behind RequireAuth and check that unauthenticated
    // users are redirected to the login page.
    const authValue = createAnonymousAuthValue();
    render(
      <AuthContext.Provider value={authValue as unknown as AuthContextValue}>
        <MemoryRouter initialEntries={['/secret']}>
          <Routes>
            <Route path="/login" element={<div>Login page</div>} />
            <Route element={<RequireAuth />}>
              <Route path="/secret" element={<div>Secret page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText('Login page')).toBeTruthy();
    expect(screen.queryByText('Secret page')).toBeNull();
  });

  it('allows authenticated users to access protected content via RequireAuth', () => {
    // When the user is authenticated, RequireAuth should render the child
    // component instead of redirecting.
    const authValue = createAuthenticatedAuthValue();
    render(
      <AuthContext.Provider value={authValue as unknown as AuthContextValue}>
        <MemoryRouter initialEntries={['/secret']}>
          <Routes>
            <Route path="/login" element={<div>Login page</div>} />
            <Route element={<RequireAuth />}>
              <Route path="/secret" element={<div>Secret page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText('Secret page')).toBeTruthy();
    expect(screen.queryByText('Login page')).toBeNull();
  });
});
