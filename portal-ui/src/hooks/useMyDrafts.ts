import { useQuery } from '@tanstack/react-query'
import * as artifactsApi from '@/api/artifacts'

export function useMyDrafts(page = 0, pageSize = 10) {
  return useQuery({
    queryKey: ['myDrafts', page, pageSize],
    queryFn: () => artifactsApi.getArtifacts(page, pageSize, { status: 'DRAFT' }),
  })
}
