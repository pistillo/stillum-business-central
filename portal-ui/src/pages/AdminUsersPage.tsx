import { useState } from 'react'
import { useUsers, useInviteUser } from '@/hooks/useUsers'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

import { Card, CardContent } from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  
  const { data, isLoading } = useUsers(page)
  const { mutate: inviteUser, isPending } = useInviteUser()

  const handleInvite = () => {
    if (inviteEmail) {
      inviteUser({ email: inviteEmail, roles: ['USER'] }, {
        onSuccess: () => {
          setInviteEmail('')
          setShowInviteForm(false)
        }
      })
    }
  }

  return (
    <div>
      <PageHeader
        title={t('users.title')}
        action={
          <Button variant="primary" onClick={() => setShowInviteForm(!showInviteForm)}>
            <Plus className="w-4 h-4" />
            {t('users.invite')}
          </Button>
        }
      />

      {showInviteForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Input
                label={t('users.email')}
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
              />
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleInvite} isLoading={isPending}>
                  Send Invitation
                </Button>
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No users found</div>
        ) : (
          data?.data.map((user: any) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar name={user.name} />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="flex gap-2 mt-1">
                        {user.roles.map((role: any) => (
                          <span key={role.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
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
