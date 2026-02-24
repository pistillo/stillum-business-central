import { useArtifacts } from './useArtifacts';

export function useRecentPublications() {
  return useArtifacts({ status: 'PUBLISHED', size: 5 });
}
