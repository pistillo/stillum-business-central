import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  decodeJwtPayload,
  extractDefaultTenantIdFromJwt,
  extractTenantIdsFromJwt,
} from '../utils/jwt';
import { useAuth } from '../auth/AuthContext';

type TenantContextValue = {
  status: 'loading' | 'ready';
  tenantId: string | null;
  availableTenantIds: string[];
  setTenantId: (tenantId: string | null) => void;
};

const TenantContext = createContext<TenantContextValue | null>(null);

const STORAGE_KEY = 'stillum.tenantId';

export function TenantProvider(props: { children: ReactNode }) {
  const { state } = useAuth();
  const [tenantId, setTenantIdState] = useState<string | null>(() => {
    return window.localStorage.getItem(STORAGE_KEY);
  });
  const [availableTenantIds, setAvailableTenantIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    if (state.status === 'loading') {
      setStatus('loading');
      return;
    }
    if (state.status !== 'authenticated') {
      setAvailableTenantIds([]);
      setTenantIdState(null);
      window.localStorage.removeItem(STORAGE_KEY);
      setStatus('ready');
      return;
    }
    setStatus('loading');
    const accessToken = state.user.access_token;
    if (!accessToken) {
      setAvailableTenantIds([]);
      setStatus('ready');
      return;
    }
    try {
      const payload = decodeJwtPayload(accessToken);
      const tenants = extractTenantIdsFromJwt(payload);
      const defaultTenantId = extractDefaultTenantIdFromJwt(payload);
      setAvailableTenantIds(tenants);

      if (tenants.length === 1) {
        setTenantIdState(tenants[0]);
        window.localStorage.setItem(STORAGE_KEY, tenants[0]);
        setStatus('ready');
        return;
      }

      if (tenantId && tenants.includes(tenantId)) {
        setStatus('ready');
        return;
      }
      if (tenantId && !tenants.includes(tenantId)) {
        setTenantIdState(null);
        window.localStorage.removeItem(STORAGE_KEY);
        if (defaultTenantId && tenants.includes(defaultTenantId)) {
          setTenantIdState(defaultTenantId);
          window.localStorage.setItem(STORAGE_KEY, defaultTenantId);
        }
        setStatus('ready');
        return;
      }

      if (!tenantId && defaultTenantId && tenants.includes(defaultTenantId)) {
        setTenantIdState(defaultTenantId);
        window.localStorage.setItem(STORAGE_KEY, defaultTenantId);
        setStatus('ready');
        return;
      }
      setStatus('ready');
    } catch {
      setAvailableTenantIds([]);
      setStatus('ready');
    }
  }, [state, tenantId]);

  const setTenantId = useCallback((id: string | null) => {
    setTenantIdState(id);
    if (id) {
      window.localStorage.setItem(STORAGE_KEY, id);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo<TenantContextValue>(
    () => ({ status, tenantId, availableTenantIds, setTenantId }),
    [status, tenantId, availableTenantIds, setTenantId]
  );

  return <TenantContext.Provider value={value}>{props.children}</TenantContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return ctx;
}
