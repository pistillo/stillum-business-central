import { useParams, useNavigate } from 'react-router-dom'
import { useArtifact } from '@/hooks/useArtifacts'
import { useVersions } from '@/hooks/useVersions'
import LoadingPage from '@/components/common/LoadingPage'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import StatusBadge from '@/components/common/StatusBadge'
import Avatar from '@/components/ui/Avatar'
import { formatDateIT } from '@/lib/utils'
import { Edit, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ArtifactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: artifact, isLoading } = useArtifact(id)
  const { data: versionsData } = useVersions(id || '', 0, 10)

  if (isLoading || !artifact) return <LoadingPage />

  return (
    <div>
      <PageHeader
        title={artifact.name}
        description={artifact.description}
        breadcrumbs={[
          { label: t('navigation.catalogue'), href: '/catalogue' },
          { label: artifact.name },
        ]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/artifacts/${id}/edit`)}>
              <Edit className="w-4 h-4" />
              {t('common.edit')}
            </Button>
            <Button variant="primary" onClick={() => navigate(`/artifacts/${id}/publish`)}>
              <Send className="w-4 h-4" />
              {t('publish.publishArtifact')}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('artifacts.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('artifacts.type')}</p>
                  <p className="font-medium">{artifact.type}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('artifacts.status')}</p>
                  <StatusBadge status={artifact.status} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('artifacts.owner')}</p>
                  <div className="flex items-center gap-2">
                    <Avatar name={artifact.owner.name} size="sm" />
                    <span className="font-medium">{artifact.owner.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('artifacts.createdAt')}</p>
                  <p className="font-medium">{formatDateIT(artifact.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('versions.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {versionsData && versionsData.data.length > 0 ? (
                <div className="space-y-3">
                  {versionsData.data.map((version) => (
                    <div key={version.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            v{version.versionNumber}
                          </p>
                          <p className="text-sm text-gray-600">{version.changeDescription}</p>
                          <p className="text-xs text-gray-500">
                            by {version.author.name} • {formatDateIT(version.createdAt)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/artifacts/${id}/edit?version=${version.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">{t('common.noData')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('common.info')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('artifacts.category')}</p>
                <p className="font-medium">{artifact.category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('artifacts.tags')}</p>
                <div className="flex flex-wrap gap-2">
                  {artifact.tags?.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('artifacts.updatedAt')}</p>
                <p className="font-medium">{formatDateIT(artifact.updatedAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Last Modified By</p>
                <div className="flex items-center gap-2">
                  <Avatar name={artifact.lastModifiedBy.name} size="sm" />
                  <span className="font-medium">{artifact.lastModifiedBy.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
