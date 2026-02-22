import { useState } from 'react'
import { useInstances } from '@/hooks/useInstances'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import FilterBar from '@/components/common/FilterBar'
import { Card, CardContent } from '@/components/ui/Card'
import StatusBadge from '@/components/common/StatusBadge'
import Avatar from '@/components/ui/Avatar'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Play } from 'lucide-react'

export default function InstancesPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filters = {
    ...(searchQuery && { search: searchQuery }),
    ...(statusFilter && { status: statusFilter }),
  }

  const { data, isLoading } = useInstances(page, 20, filters)

  return (
    <div>
      <PageHeader
        title={t('instances.title')}
        action={
          <Button variant="primary" onClick={() => navigate('/instances/new')}>
            <Play className="w-4 h-4" />
            {t('instances.create')}
          </Button>
        }
      />

      <FilterBar onReset={() => { setSearchQuery(''); setStatusFilter(''); setPage(0); }}>
        <Input
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select
          options={[
            { value: 'RUNNING', label: 'Running' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'FAILED', label: 'Failed' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </FilterBar>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No instances found</div>
        ) : (
          data?.data.map((instance) => (
            <Card
              key={instance.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/instances/${instance.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{instance.processKey}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div>Started by: <Avatar name={instance.initiator.name} size="sm" className="inline-block ml-1" /></div>
                      <div>Progress: {instance.progress || 0}%</div>
                    </div>
                  </div>
                  <StatusBadge status={instance.status} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {data && data.total > 20 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="outline" disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))}>
            {t('common.prev')}
          </Button>
          <span>Page {page + 1} of {Math.ceil(data.total / 20)}</span>
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
