export type JwtPayload = Record<string, unknown>;

export function decodeJwtPayload(token: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Invalid JWT');
  }
  const payload = parts[1];
  const json = decodeBase64Url(payload);
  return JSON.parse(json) as JwtPayload;
}

function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function extractTenantIdsFromJwt(payload: JwtPayload): string[] {
  const candidates: string[] = [];

  const direct = firstArrayOfStrings(payload, [
    'tenants',
    'tenant_ids',
    'tenantIds',
    'stillum_tenants',
  ]);
  candidates.push(...direct);

  const groups = firstArrayOfStrings(payload, ['groups', 'roles']);
  for (const g of groups) {
    const m1 = /^tenant:(.+)$/i.exec(g);
    if (m1?.[1]) candidates.push(m1[1]);
    // Keycloak group path può essere "tenant/UUID" o "/tenant/UUID"
    const m2 = /^\/?tenant\/(.+)$/i.exec(g);
    if (m2?.[1]) candidates.push(m2[1]);
    // Keycloak path come "/UUID" quando il group name è l'UUID
    const trimmed = g.replace(/^\//, '');
    if (isUuid(trimmed)) candidates.push(trimmed);
  }

  return uniq(candidates).filter((x) => isUuid(x));
}

export function extractDefaultTenantIdFromJwt(payload: JwtPayload): string | null {
  const direct = firstString(payload, [
    'defaultTenantId',
    'default_tenant_id',
    'tenantId',
    'tenant_id',
  ]);
  if (direct && isUuid(direct)) return direct;
  return null;
}

function firstArrayOfStrings(payload: JwtPayload, keys: string[]): string[] {
  for (const k of keys) {
    const v = payload[k];
    if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
      return v as string[];
    }
  }
  return [];
}

function firstString(payload: JwtPayload, keys: string[]): string | null {
  for (const k of keys) {
    const v = payload[k];
    if (typeof v === 'string') return v;
  }
  return null;
}

function uniq(items: string[]): string[] {
  return Array.from(new Set(items));
}

function isUuid(value: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    value
  );
}
