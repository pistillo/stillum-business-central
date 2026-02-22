import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArtifacts } from '@/hooks/useArtifacts'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import FilterBar from '@/components/common/FilterBar'
import ArtifactList from '@/components/artifacts/ArtifactList'
import { Plus, Grid, List } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ARTIFACT_TYPES } from '@/lib/constants'

export default function CataloguePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filters = {
    ...(searchQuery && { search: searchQuery }),
    ...(typeFilter && { type: typeFilter }),
    ...(statusFilter && { status: statusFilter }),
  }

  const { data, isLoading } = useArtifacts(page, 20, filters)

  const handleReset = () => {
    setSearchQuery('')
    setTypeFilter('')
    setStatusFilter('')
    setPage(0)
  }

  return (
    <div>
      <PageHeader
        title={t('navigation.catalogue')}
        action={
          <Button variant="primary" onClick={() => navigate('/artifacts/new/edit')}>
            <Plus className="w-5 h-5" />
            {t('artifacts.create')}
          </Button>
        }
      />

      <FilterBar onReset={handleReset}>
        <Input
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPage(0)
          }}
          className="flex-1"
        />

        <Select
          options={ARTIFACT_TYPES}
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value)
            setPage(0)
          }}
        />

        <Select
          options={[
            { value: 'DRAFT', label: t('artifacts.DRAFT') },
            { value: 'PUBLISHED', label: t('artifacts.PUBLISHED') },
            { value: 'RETIRED', label: t('artifacts.RETIRED') },
          ]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(0)
          }}
        />

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </FilterBar>

      <ArtifactList artifacts={data?.data || []} isLoading={isLoading} view={view} />

      {data && data.total > 20 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage(Math.max(0, page - 1))}
          >
            {t('common.prev')}
          </Button>
          <span className="text-gray-600">
            Page {page + 1} of {Math.ceil(data.total / 20)}
          </span>
          <Button
            variant="outline"
            disabled={page >= Math.ceil(data.total / 20) - 1}
            onClick={() => setPage(page + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      )}
    </div>
  )
}
