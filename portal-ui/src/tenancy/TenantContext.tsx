import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { decodeJwtPayload, extractTenantIdsFromJwt } from '../utils/jwt';
import { useAuth } from '../auth/AuthContext';

type TenantContextValue = {
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

  useEffect(() => {
    if (state.status !== 'authenticated') {
      setAvailableTenantIds([]);
      setTenantIdState(null);
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const accessToken = state.user.access_token;
    if (!accessToken) {
      setAvailableTenantIds([]);
      return;
    }
    try {
      const payload = decodeJwtPayload(accessToken);
      const tenants = extractTenantIdsFromJwt(payload);
      setAvailableTenantIds(tenants);

      if (tenants.length === 1) {
        setTenantIdState(tenants[0]);
        window.localStorage.setItem(STORAGE_KEY, tenants[0]);
        return;
      }

      if (tenantId && tenants.includes(tenantId)) {
        return;
      }
      if (tenantId && !tenants.includes(tenantId)) {
        setTenantIdState(null);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      setAvailableTenantIds([]);
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
    () => ({ tenantId, availableTenantIds, setTenantId }),
    [tenantId, availableTenantIds, setTenantId]
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
