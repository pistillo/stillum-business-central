import { useParams } from 'react-router-dom'
import { useArtifact } from '@/hooks/useArtifacts'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import LoadingPage from '@/components/common/LoadingPage'
import { useTranslation } from 'react-i18next'
import { Save } from 'lucide-react'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const { data: artifact, isLoading } = useArtifact(id)
  const { t } = useTranslation()

  if (isLoading || !artifact) return <LoadingPage />

  const renderEditor = () => {
    switch (artifact.type) {
      case 'BPMN':
        return <div className="bg-white rounded-lg p-4 h-96 border border-gray-200">BPMN Editor would render here</div>
      case 'DMN':
        return <div className="bg-white rounded-lg p-4 h-96 border border-gray-200">DMN Editor would render here</div>
      case 'FORM':
      case 'REQUEST':
        return <div className="bg-white rounded-lg p-4 h-96 border border-gray-200">JSON Schema Editor would render here</div>
      default:
        return <div className="bg-white rounded-lg p-4 h-96 border border-gray-200">Unknown artifact type</div>
    }
  }

  return (
    <div>
      <PageHeader
        title={`Edit: ${artifact.name}`}
        action={
          <Button variant="primary">
            <Save className="w-4 h-4" />
            {t('common.save')}
          </Button>
        }
      />

      <Card className="mb-6">
        <div className="p-4">{renderEditor()}</div>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button variant="outline">{t('common.cancel')}</Button>
        <Button variant="primary">{t('common.save')}</Button>
      </div>
    </div>
  )
}
