import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Evita fetch verso authority OIDC (localhost:8080) in CI dove non c'è Keycloak
vi.mock('oidc-client-ts', () => {
  return {
    UserManager: class FakeUserManager {
      constructor() {}
      getUser = vi.fn(() => Promise.resolve(null));
      signinRedirect = vi.fn(() => Promise.resolve());
      signoutRedirect = vi.fn(() => Promise.resolve());
      events = {
        addUserLoaded: vi.fn(),
        addUserUnloaded: vi.fn(),
        removeUserLoaded: vi.fn(),
        removeUserUnloaded: vi.fn(),
      };
    },
    WebStorageStateStore: class FakeWebStorageStateStore {
      constructor() {}
    },
  };
});

beforeAll(() => {
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

describe('App', () => {
  it('renders login page', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: /benvenuto/i })).toBeDefined();
  });
});
