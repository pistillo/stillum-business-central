import PageHeader from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useTranslation } from 'react-i18next'

export default function AnalyticsPage() {
  const { t } = useTranslation()

  return (
    <div>
      <PageHeader title={t('navigation.analytics')} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Chart {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                Analytics Dashboard Area
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
