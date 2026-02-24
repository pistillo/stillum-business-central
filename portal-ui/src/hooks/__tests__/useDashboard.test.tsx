import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMyDrafts } from '../useMyDrafts';
import { useRecentPublications } from '../useRecentPublications';
import type { PagedResponse, Artifact } from '../../api/types';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

const mockListArtifacts = vi.fn();

vi.mock('../../api/registry', () => ({
  listArtifacts: (...args: unknown[]) => mockListArtifacts(...args),
}));

vi.mock('../../auth/AuthContext', () => ({
  useAuth: () => ({
    state: { status: 'authenticated' },
    getAccessToken: vi.fn(() => 'test-token'),
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

const mockUseTenant = vi.fn();

vi.mock('../../tenancy/TenantContext', () => ({
  useTenant: () => mockUseTenant(),
}));

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function makePagedResponse(items: Artifact[]): PagedResponse<Artifact> {
  return { items, page: 0, size: 5, total: items.length };
}

function makeArtifact(overrides: Partial<Artifact> = {}): Artifact {
  return {
    id: 'artifact-1',
    tenantId: TENANT_ID,
    type: 'PROCESS',
    title: 'Test Artifact',
    status: 'DRAFT',
    ...overrides,
  };
}

describe('useMyDrafts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTenant.mockReturnValue({ tenantId: TENANT_ID });
  });

  it('does not call listArtifacts when tenantId is null', () => {
    mockUseTenant.mockReturnValue({ tenantId: null });
    const { result } = renderHook(() => useMyDrafts(), { wrapper: makeWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockListArtifacts).not.toHaveBeenCalled();
  });

  it('calls listArtifacts with status DRAFT and size 5', async () => {
    mockListArtifacts.mockResolvedValue(makePagedResponse([]));
    renderHook(() => useMyDrafts(), { wrapper: makeWrapper() });
    await waitFor(() => expect(mockListArtifacts).toHaveBeenCalledTimes(1));
    const call = mockListArtifacts.mock.calls[0][0] as Record<string, unknown>;
    expect(call.status).toBe('DRAFT');
    expect(call.size).toBe(5);
    expect(call.tenantId).toBe(TENANT_ID);
  });

  it('returns draft artifacts on success', async () => {
    const draft = makeArtifact({ id: 'draft-1', status: 'DRAFT', title: 'My Draft' });
    mockListArtifacts.mockResolvedValue(makePagedResponse([draft]));
    const { result } = renderHook(() => useMyDrafts(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].title).toBe('My Draft');
  });
});

describe('useRecentPublications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTenant.mockReturnValue({ tenantId: TENANT_ID });
  });

  it('does not call listArtifacts when tenantId is null', () => {
    mockUseTenant.mockReturnValue({ tenantId: null });
    const { result } = renderHook(() => useRecentPublications(), { wrapper: makeWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockListArtifacts).not.toHaveBeenCalled();
  });

  it('calls listArtifacts with status PUBLISHED and size 5', async () => {
    mockListArtifacts.mockResolvedValue(makePagedResponse([]));
    renderHook(() => useRecentPublications(), { wrapper: makeWrapper() });
    await waitFor(() => expect(mockListArtifacts).toHaveBeenCalledTimes(1));
    const call = mockListArtifacts.mock.calls[0][0] as Record<string, unknown>;
    expect(call.status).toBe('PUBLISHED');
    expect(call.size).toBe(5);
    expect(call.tenantId).toBe(TENANT_ID);
  });

  it('returns published artifacts on success', async () => {
    const pub = makeArtifact({ id: 'pub-1', status: 'PUBLISHED', title: 'Published Process' });
    mockListArtifacts.mockResolvedValue(makePagedResponse([pub]));
    const { result } = renderHook(() => useRecentPublications(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].title).toBe('Published Process');
  });
});
