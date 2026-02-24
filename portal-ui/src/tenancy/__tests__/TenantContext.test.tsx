import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { TenantProvider, useTenant } from '../TenantContext';
import type { User } from 'oidc-client-ts';

const validTenantId = '00000000-0000-0000-0000-000000000001';
const validTenantId2 = '00000000-0000-0000-0000-000000000002';

const testTokenWithTenantIds = createTestToken({ tenantIds: [validTenantId, validTenantId2] });
const testTokenWithSingleTenant = createTestToken({ tenantIds: [validTenantId] });
const testTokenWithDefaultTenant = createTestToken({
  tenantIds: [validTenantId, validTenantId2],
  defaultTenantId: validTenantId,
});
const testTokenWithDefaultTenant2 = createTestToken({
  tenantIds: [validTenantId, validTenantId2],
  defaultTenantId: validTenantId2,
});

function createTestToken(claims: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify(claims));
  const signature = 'testsignature';
  return `${header}.${payload}.${signature}`;
}

describe('TenantContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('provides default tenant context when user is anonymous', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({ status: 'anonymous' }),
    });
    expect(typeof result.current.setTenantId).toBe('function');
    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.tenantId).toBeNull();
      expect(result.current.availableTenantIds).toEqual([]);
    });
  });

  it('extracts tenants from JWT when user is authenticated', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({ status: 'authenticated', accessToken: testTokenWithTenantIds }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.availableTenantIds).toEqual([validTenantId, validTenantId2]);
    });
  });

  it('auto-selects tenant when only one is available', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({
        status: 'authenticated',
        accessToken: testTokenWithSingleTenant,
      }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.tenantId).toBe(validTenantId);
      expect(result.current.availableTenantIds).toEqual([validTenantId]);
    });
  });

  it('does not auto-select when multiple tenants are available', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({ status: 'authenticated', accessToken: testTokenWithTenantIds }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.tenantId).toBeNull();
      expect(result.current.availableTenantIds).toEqual([validTenantId, validTenantId2]);
    });
  });

  it('auto-selects default tenant when multiple tenants are available', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({
        status: 'authenticated',
        accessToken: testTokenWithDefaultTenant,
      }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.tenantId).toBe(validTenantId);
      expect(result.current.availableTenantIds).toEqual([validTenantId, validTenantId2]);
    });
  });

  it('keeps stored tenant when available even if default differs', async () => {
    localStorage.setItem('stillum.tenantId', validTenantId);
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({
        status: 'authenticated',
        accessToken: testTokenWithDefaultTenant2,
      }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.tenantId).toBe(validTenantId);
      expect(result.current.availableTenantIds).toEqual([validTenantId, validTenantId2]);
    });
  });

  it('falls back to default tenant when stored tenant is not available', async () => {
    localStorage.setItem('stillum.tenantId', '00000000-0000-0000-0000-000000000099');
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({
        status: 'authenticated',
        accessToken: testTokenWithDefaultTenant,
      }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.tenantId).toBe(validTenantId);
      expect(result.current.availableTenantIds).toEqual([validTenantId, validTenantId2]);
    });
  });

  it('persists selected tenant in localStorage', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({ status: 'authenticated', accessToken: testTokenWithTenantIds }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.availableTenantIds).toEqual([validTenantId, validTenantId2]);
    });

    act(() => {
      result.current.setTenantId(validTenantId);
    });

    expect(localStorage.getItem('stillum.tenantId')).toBe(validTenantId);
    expect(result.current.tenantId).toBe(validTenantId);
  });

  it('clears tenant from localStorage when user is unauthenticated', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({ status: 'anonymous' }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.tenantId).toBeNull();
      expect(result.current.availableTenantIds).toEqual([]);
    });
  });

  it('removes tenant from localStorage when cleared', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({ status: 'authenticated', accessToken: testTokenWithTenantIds }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.availableTenantIds).toEqual([validTenantId, validTenantId2]);
    });

    act(() => {
      result.current.setTenantId(validTenantId);
    });

    expect(localStorage.getItem('stillum.tenantId')).toBe(validTenantId);

    act(() => {
      result.current.setTenantId(null);
    });

    expect(localStorage.getItem('stillum.tenantId')).toBeNull();
    expect(result.current.tenantId).toBeNull();
  });

  it('invalidates tenant when it is no longer available in JWT', async () => {
    localStorage.setItem('stillum.tenantId', validTenantId);

    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({
        status: 'authenticated',
        accessToken: testTokenWithSingleTenant,
      }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.tenantId).toBe(validTenantId);
      expect(result.current.availableTenantIds).toEqual([validTenantId]);
    });
  });

  it('handles invalid tokens gracefully', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({ status: 'authenticated', accessToken: 'invalid-token' }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.availableTenantIds).toEqual([]);
    });
  });

  it('handles missing access token', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createTestWrapper({ status: 'authenticated', accessToken: '' }),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.availableTenantIds).toEqual([]);
    });
  });
});

type AuthState = { status: 'anonymous' | 'authenticated' | 'loading'; user?: User };

function createTestWrapper(initialAuth: {
  status: 'anonymous' | 'authenticated';
  accessToken?: string;
}) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    const authState: AuthState =
      initialAuth.status === 'authenticated'
        ? {
            status: 'authenticated',
            user: createMockUser(initialAuth.accessToken || ''),
          }
        : { status: 'anonymous' };

    return (
      <MockAuthProvider authState={authState}>
        <TenantProvider>{children}</TenantProvider>
      </MockAuthProvider>
    );
  };
}

function createMockUser(accessToken: string): User {
  return {
    access_token: accessToken,
    id_token: '',
    token_type: 'Bearer',
    scope: 'openid',
    profile: {
      sub: 'test-user',
      iss: 'http://localhost:8080/realms/stillum',
      aud: 'portal-ui',
      exp: 9999999999,
      iat: 9999999990,
    },
    expires_at: 0,
    expired: false,
    state: null,
    toStorageString: () => '',
    session_state: '',
    expires_in: 3600,
    scopes: [],
  };
}

import { createContext, useContext, type ReactNode } from 'react';

const MockAuthContext = createContext<AuthState | null>(null);

function MockAuthProvider({ authState, children }: { authState: AuthState; children: ReactNode }) {
  return <MockAuthContext.Provider value={authState}>{children}</MockAuthContext.Provider>;
}

vi.mock('../../auth/AuthContext', () => ({
  AuthProvider: MockAuthProvider,
  useAuth: () => {
    const ctx = useContext(MockAuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return {
      state: ctx,
      login: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(() =>
        ctx.status === 'authenticated' ? (ctx.user?.access_token ?? null) : null
      ),
    };
  },
}));
