import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useArtifact } from '@/hooks/useArtifacts'
import { usePublish } from '@/hooks/usePublish'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import LoadingPage from '@/components/common/LoadingPage'
import { useTranslation } from 'react-i18next'

export default function PublishPage() {
  const { id } = useParams<{ id: string }>()
  const { data: artifact, isLoading } = useArtifact(id)
  const { mutate: publish, isPending } = usePublish()
  const { t } = useTranslation()
  
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    environment: '',
    changeDescription: '',
    schedule: false,
    scheduledAt: '',
  })

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const handlePublish = () => {
    if (artifact) {
      publish({
        versionId: artifact.currentVersionId,
        targetEnvironment: formData.environment,
        changeDescription: formData.changeDescription,
        scheduledAt: formData.schedule ? formData.scheduledAt : undefined,
      })
    }
  }

  if (isLoading || !artifact) return <LoadingPage />

  return (
    <div>
      <PageHeader title={`${t('publish.publishArtifact')}: ${artifact.name}`} />

      <div className="grid grid-cols-4 gap-4 mb-8">
        {['Preview', 'Validation', 'Environment', 'Confirm'].map((label, i) => (
          <div key={i} className={`p-4 rounded-lg text-center ${i <= step ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
            <div className="font-bold">{i + 1}</div>
            <div className="text-sm">{label}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('publish.stepPreview')}</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Name:</strong> {artifact.name}</p>
                <p><strong>Type:</strong> {artifact.type}</p>
                <p><strong>Status:</strong> {artifact.status}</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('publish.stepValidation')}</h3>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-700">All validations passed</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('publish.stepEnvironment')}</h3>
              <div className="space-y-4">
                <Select
                  label={t('publish.selectEnvironment')}
                  options={[
                    { value: 'development', label: 'Development' },
                    { value: 'staging', label: 'Staging' },
                    { value: 'production', label: 'Production' },
                  ]}
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                />
                <Textarea
                  label={t('publish.changeDescription')}
                  value={formData.changeDescription}
                  onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                  rows={4}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.checked })}
                  />
                  <span>{t('publish.schedule')}</span>
                </label>
                {formData.schedule && (
                  <Input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  />
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('publish.stepConfirm')}</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Artifact:</strong> {artifact.name}</p>
                <p><strong>Environment:</strong> {formData.environment}</p>
                <p><strong>Changes:</strong> {formData.changeDescription}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6 justify-between">
            <Button variant="outline" onClick={handlePrev} disabled={step === 0}>
              {t('common.prev')}
            </Button>
            {step === 3 ? (
              <Button variant="primary" onClick={handlePublish} isLoading={isPending}>
                {t('publish.publish')}
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                {t('common.next')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
