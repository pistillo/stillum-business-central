import { useArtifacts } from './useArtifacts';

export function useMyDrafts() {
  return useArtifacts({ status: 'DRAFT', size: 5 });
}
