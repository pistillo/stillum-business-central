import { describe, it, expect } from 'vitest';
import { decodeJwtPayload, extractDefaultTenantIdFromJwt, extractTenantIdsFromJwt } from '../jwt';

describe('decodeJwtPayload', () => {
  it('decodes a valid JWT payload', () => {
    const token = 'header.' + btoa(JSON.stringify({ sub: 'user1', name: 'Test' })) + '.signature';
    const payload = decodeJwtPayload(token);
    expect(payload).toEqual({ sub: 'user1', name: 'Test' });
  });

  it('throws on invalid JWT format', () => {
    const invalidToken = 'invalid';
    expect(() => decodeJwtPayload(invalidToken)).toThrow('Invalid JWT');
  });

  it('handles base64url encoding', () => {
    const payload = { test: 'value' };
    const base64Payload = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const token = 'header.' + base64Payload + '.signature';
    const decoded = decodeJwtPayload(token);
    expect(decoded).toEqual(payload);
  });
});

describe('extractTenantIdsFromJwt', () => {
  const validTenantId = '00000000-0000-0000-0000-000000000001';
  const validTenantId2 = '00000000-0000-0000-0000-000000000002';

  it('extracts from direct claim "tenants"', () => {
    const payload = { tenants: [validTenantId, validTenantId2] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId, validTenantId2]);
  });

  it('extracts from direct claim "tenant_ids"', () => {
    const payload = { tenant_ids: [validTenantId] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId]);
  });

  it('extracts from direct claim "tenantIds"', () => {
    const payload = { tenantIds: [validTenantId2] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId2]);
  });

  it('extracts from direct claim "stillum_tenants"', () => {
    const payload = { stillum_tenants: [validTenantId] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId]);
  });

  it('extracts from groups with pattern "tenant:UUID"', () => {
    const payload = { groups: [`tenant:${validTenantId}`, `tenant:${validTenantId2}`] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId, validTenantId2]);
  });

  it('extracts from groups with pattern "/tenant/UUID"', () => {
    const payload = { groups: [`/tenant/${validTenantId}`, `/tenant/${validTenantId2}`] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId, validTenantId2]);
  });

  it('extracts from groups with pattern "tenant/UUID" (no leading slash)', () => {
    const payload = { groups: [`tenant/${validTenantId}`] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId]);
  });

  it('extracts from groups with direct UUID pattern', () => {
    const payload = { groups: [`/${validTenantId}`, `/${validTenantId2}`] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId, validTenantId2]);
  });

  it('combines tenants from multiple sources and deduplicates', () => {
    const payload = {
      tenants: [validTenantId],
      groups: [`tenant:${validTenantId}`, `/tenant/${validTenantId2}`],
    };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId, validTenantId2]);
  });

  it('filters out invalid UUIDs', () => {
    const payload = {
      tenants: [validTenantId, 'invalid-uuid', 'not-a-uuid'],
      groups: ['/tenant/another-invalid'],
    };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId]);
  });

  it('handles empty payload', () => {
    const result = extractTenantIdsFromJwt({});
    expect(result).toEqual([]);
  });

  it('handles missing tenant claims and groups', () => {
    const payload = { sub: 'user1', name: 'Test' };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([]);
  });

  it('handles non-array claims gracefully', () => {
    const payload = { tenants: 'not-an-array' as unknown as string[] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([]);
  });

  it('handles mixed content in groups', () => {
    const payload = {
      groups: [`tenant:${validTenantId}`, 'admin', '/tenant/invalid-uuid', `/${validTenantId2}`],
    };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([validTenantId, validTenantId2]);
  });

  it('prioritizes direct claims over groups when both exist', () => {
    const payload = {
      tenants: [validTenantId],
      groups: [`tenant:${validTenantId2}`],
    };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toContain(validTenantId);
    expect(result).toContain(validTenantId2);
  });

  it('handles case-insensitive "tenant" pattern in groups', () => {
    const payload = { groups: ['Tenant:invalid', 'TENANT:invalid'] };
    const result = extractTenantIdsFromJwt(payload);
    expect(result).toEqual([]);
  });
});

describe('extractDefaultTenantIdFromJwt', () => {
  const validTenantId = '00000000-0000-0000-0000-000000000001';

  it('extracts from claim "defaultTenantId"', () => {
    const payload = { defaultTenantId: validTenantId };
    expect(extractDefaultTenantIdFromJwt(payload)).toBe(validTenantId);
  });

  it('extracts from claim "tenantId" as fallback', () => {
    const payload = { tenantId: validTenantId };
    expect(extractDefaultTenantIdFromJwt(payload)).toBe(validTenantId);
  });

  it('returns null for invalid UUID', () => {
    const payload = { defaultTenantId: 'not-a-uuid' };
    expect(extractDefaultTenantIdFromJwt(payload)).toBeNull();
  });

  it('returns null when missing', () => {
    expect(extractDefaultTenantIdFromJwt({})).toBeNull();
  });
});
