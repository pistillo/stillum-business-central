import { useParams } from 'react-router-dom'
import { useCompareVersions } from '@/hooks/useVersions'
import PageHeader from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useTranslation } from 'react-i18next'

export default function DiffPage() {
  const { id, versionId1, versionId2 } = useParams<{ id: string; versionId1: string; versionId2: string }>()
  const { data: comparison, isLoading } = useCompareVersions(id || '')
  const { t } = useTranslation()

  return (
    <div>
      <PageHeader title={t('versions.compareVersions')} />

      <Card>
        <CardHeader>
          <CardTitle>Version {versionId1} vs {versionId2}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading comparison...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold mb-2">Version {versionId1}</h3>
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(comparison?.version1, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-bold mb-2">Version {versionId2}</h3>
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(comparison?.version2, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
