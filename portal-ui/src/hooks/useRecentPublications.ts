import { useQuery } from '@tanstack/react-query'
import * as artifactsApi from '@/api/artifacts'

export function useRecentPublications(page = 0, pageSize = 10) {
  return useQuery({
    queryKey: ['recentPublications', page, pageSize],
    queryFn: () =>
      artifactsApi.getArtifacts(page, pageSize, { status: 'PUBLISHED' }),
  })
}
