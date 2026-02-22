import PageHeader from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div>
      <PageHeader title={t('settings.title')} />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.general')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Tenant Name" defaultValue="My Tenant" />
            <Input label="Description" defaultValue="Organization description" />
            <div className="flex gap-2">
              <Button variant="primary">Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.notifications')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span>Task updates</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Weekly digest</span>
            </label>
            <Button variant="primary">Save Preferences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.security')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm Password" type="password" />
            <Button variant="primary">Change Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
