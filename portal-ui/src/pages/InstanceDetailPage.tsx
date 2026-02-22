import { useParams } from 'react-router-dom'
import { useInstance, useInstanceHistory } from '@/hooks/useInstances'
import PageHeader from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import StatusBadge from '@/components/common/StatusBadge'
import Avatar from '@/components/ui/Avatar'
import LoadingPage from '@/components/common/LoadingPage'
import { formatDateIT, formatDuration } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export default function InstanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: instance, isLoading } = useInstance(id)
  const { data: historyData } = useInstanceHistory(id)
  const { t } = useTranslation()

  if (isLoading || !instance) return <LoadingPage />

  return (
    <div>
      <PageHeader title={`Instance: ${instance.processKey}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('common.info')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">{t('instances.status')}</p>
                  <StatusBadge status={instance.status} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('instances.initiator')}</p>
                  <div className="flex items-center gap-2">
                    <Avatar name={instance.initiator.name} size="sm" />
                    <span>{instance.initiator.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('instances.startedAt')}</p>
                  <p>{formatDateIT(instance.startedAt)}</p>
                </div>
                {instance.completedAt && (
                  <div>
                    <p className="text-gray-600 text-sm">{t('instances.completedAt')}</p>
                    <p>{formatDateIT(instance.completedAt)}</p>
                  </div>
                )}
                {instance.duration && (
                  <div>
                    <p className="text-gray-600 text-sm">{t('instances.duration')}</p>
                    <p>{formatDuration(instance.duration)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historyData?.data.map((event) => (
                  <div key={event.id} className="p-3 border-l-4 border-blue-500">
                    <p className="font-medium">{event.eventName}</p>
                    <p className="text-sm text-gray-600">{formatDateIT(event.timestamp)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {instance.variables ? (
                Object.entries(instance.variables).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <p className="font-medium">{key}</p>
                    <p className="text-gray-600">{String(value)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No variables</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
