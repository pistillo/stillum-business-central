import { Artifact } from '@/lib/types'
import ArtifactCard from './ArtifactCard'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/ui/Spinner'

export interface ArtifactListProps {
  artifacts: Artifact[]
  isLoading: boolean
  view?: 'grid' | 'list'
}

export default function ArtifactList({ artifacts, isLoading, view = 'grid' }: ArtifactListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (artifacts.length === 0) {
    return <EmptyState title="No artifacts found" description="Create a new artifact to get started" />
  }

  const gridClass = view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'

  return (
    <div className={gridClass}>
      {artifacts.map((artifact) => (
        <ArtifactCard key={artifact.id} artifact={artifact} />
      ))}
    </div>
  )
}
