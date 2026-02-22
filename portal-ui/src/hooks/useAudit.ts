import { useQuery, useMutation } from '@tanstack/react-query'
import * as auditApi from '@/api/audit'

export function useAuditLog(page = 0, pageSize = 50, filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['auditLog', page, pageSize, filters],
    queryFn: () => auditApi.getAuditLog(page, pageSize, filters),
  })
}

export function useExportAuditLog() {
  return useMutation({
    mutationFn: (filters?: Record<string, any>) => auditApi.exportAuditLog(filters),
  })
}
