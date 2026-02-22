import { useState } from 'react'
import { useAuditLog, useExportAuditLog } from '@/hooks/useAudit'
import PageHeader from '@/components/common/PageHeader'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import FilterBar from '@/components/common/FilterBar'
import { Card, CardContent } from '@/components/ui/Card'
import { useTranslation } from 'react-i18next'
import { Download } from 'lucide-react'
import { formatDateIT } from '@/lib/utils'

export default function AuditPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [userFilter, setUserFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  const filters = {
    ...(userFilter && { userId: userFilter }),
    ...(actionFilter && { action: actionFilter }),
  }

  const { data, isLoading } = useAuditLog(page, 50, filters)
  const { mutate: exportAudit } = useExportAuditLog()

  return (
    <div>
      <PageHeader
        title={t('audit.title')}
        action={
          <Button variant="outline" onClick={() => exportAudit(filters)}>
            <Download className="w-4 h-4" />
            {t('audit.export')}
          </Button>
        }
      />

      <FilterBar onReset={() => { setUserFilter(''); setActionFilter(''); setPage(0); }}>
        <Input
          placeholder={t('audit.userId')}
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder={t('audit.action')}
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="flex-1"
        />
      </FilterBar>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No audit logs found</div>
        ) : (
          data?.data.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{log.action}</div>
                    <div className="text-sm text-gray-600 mt-1">{log.resourceType}: {log.resourceId}</div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>User: {log.userId}</span>
                      <span>{formatDateIT(log.timestamp)}</span>
                      {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded text-sm font-medium ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {log.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {data && data.total > 50 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="outline" disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))}>
            {t('common.prev')}
          </Button>
          <span>Page {page + 1} of {Math.ceil(data.total / 50)}</span>
          <Button
            variant="outline"
            disabled={page >= Math.ceil(data.total / 50) - 1}
            onClick={() => setPage(page + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      )}
    </div>
  )
}
