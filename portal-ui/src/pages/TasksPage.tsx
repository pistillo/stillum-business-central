import { useState } from 'react'
import { useMyTasks, useCompleteTask } from '@/hooks/useMyTasks'
import PageHeader from '@/components/common/PageHeader'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import FilterBar from '@/components/common/FilterBar'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/common/StatusBadge'
import Badge from '@/components/ui/Badge'
import { useTranslation } from 'react-i18next'
import { PRIORITY_COLORS } from '@/lib/constants'

export default function TasksPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  
  const filters = {
    ...(statusFilter && { status: statusFilter }),
    ...(priorityFilter && { priority: priorityFilter }),
  }

  const { data, isLoading } = useMyTasks(page, 20, filters)
  const { mutate: completeTask } = useCompleteTask()

  return (
    <div>
      <PageHeader title={t('navigation.myTasks')} />

      <FilterBar onReset={() => { setStatusFilter(''); setPriorityFilter(''); setPage(0); }}>
        <Select
          options={[
            { value: 'CREATED', label: 'Created' },
            { value: 'ASSIGNED', label: 'Assigned' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Select
          options={[
            { value: 'LOW', label: t('tasks.LOW') },
            { value: 'MEDIUM', label: t('tasks.MEDIUM') },
            { value: 'HIGH', label: t('tasks.HIGH') },
            { value: 'CRITICAL', label: t('tasks.CRITICAL') },
          ]}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        />
      </FilterBar>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No tasks assigned to you</div>
        ) : (
          data?.data.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-lg">{task.name}</div>
                    {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <StatusBadge status={task.status} />
                      <Badge variant="warning" className={(PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || '')}>
                        {task.priority}
                      </Badge>
                      {task.dueDate && <span className="text-gray-600">Due: {task.dueDate}</span>}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => completeTask({ id: task.id })}
                  >
                    Complete
                  </Button>
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
