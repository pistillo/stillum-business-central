import { useNavigate } from 'react-router-dom'
import { useMyDrafts } from '@/hooks/useMyDrafts'
import { useRecentPublications } from '@/hooks/useRecentPublications'
import { useMyTasks } from '@/hooks/useMyTasks'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import ArtifactList from '@/components/artifacts/ArtifactList'
import EmptyState from '@/components/common/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { Plus, FileText, CheckSquare, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: draftsData, isLoading: draftsLoading } = useMyDrafts()
  const { data: publicationsData, isLoading: publicationsLoading } = useRecentPublications()
  const { data: tasksData, isLoading: tasksLoading } = useMyTasks(0, 5)
  const { t } = useTranslation()

  return (
    <div>
      <PageHeader
        title={`${t('dashboard.welcome')}, ${user?.name}!`}
        action={
          <Button variant="primary" onClick={() => navigate('/catalogue')}>
            <Plus className="w-5 h-5" />
            {t('artifacts.create')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{t('dashboard.myDrafts')}</p>
                <p className="text-3xl font-bold text-gray-900">{draftsData?.total || 0}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{t('dashboard.myTasks')}</p>
                <p className="text-3xl font-bold text-gray-900">{tasksData?.total || 0}</p>
              </div>
              <CheckSquare className="w-12 h-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{t('dashboard.recentPublications')}</p>
                <p className="text-3xl font-bold text-gray-900">{publicationsData?.total || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.myDrafts')}</CardTitle>
          </CardHeader>
          <CardContent>
            {draftsData?.data && draftsData.data.length > 0 ? (
              <ArtifactList artifacts={draftsData.data} isLoading={draftsLoading} view="list" />
            ) : (
              <EmptyState
                title="No drafts yet"
                action={
                  <Button variant="primary" onClick={() => navigate('/catalogue')}>
                    Create your first artifact
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentPublications')}</CardTitle>
          </CardHeader>
          <CardContent>
            {publicationsData?.data && publicationsData.data.length > 0 ? (
              <ArtifactList artifacts={publicationsData.data} isLoading={publicationsLoading} view="list" />
            ) : (
              <EmptyState title="No published artifacts yet" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
