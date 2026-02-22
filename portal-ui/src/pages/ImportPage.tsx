import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useTranslation } from 'react-i18next'
import { Upload } from 'lucide-react'

export default function ImportPage() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleImport = () => {
    if (file) {
      console.log('Importing:', file.name)
    }
  }

  return (
    <div>
      <PageHeader title={t('common.import')} />

      <Card>
        <CardHeader>
          <CardTitle>Import Artifacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-center"
              />
              {file && <p className="mt-2 text-green-600">File selected: {file.name}</p>}
            </div>

            <Button variant="primary" onClick={handleImport} disabled={!file} className="w-full">
              {t('common.import')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
