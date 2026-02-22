import { Artifact } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import StatusBadge from '@/components/common/StatusBadge'
import Avatar from '@/components/ui/Avatar'
import { formatDateIT } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export interface ArtifactCardProps {
  artifact: Artifact
}

export default function ArtifactCard({ artifact }: ArtifactCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate(`/artifacts/${artifact.id}`)}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{artifact.name}</CardTitle>
          <StatusBadge status={artifact.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-4">{artifact.description || 'No description'}</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Type</span>
            <span className="font-medium">{artifact.type}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Owner</span>
            <div className="flex items-center gap-2">
              <Avatar name={artifact.owner.name} size="sm" />
              <span className="font-medium">{artifact.owner.name}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Updated</span>
            <span>{formatDateIT(artifact.updatedAt)}</span>
          </div>
          {artifact.tags && artifact.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {artifact.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
