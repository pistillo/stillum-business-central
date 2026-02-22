import { Bell, LogOut, User, Globe } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUnreadNotificationCount } from '@/hooks/useNotifications'
import Avatar from '@/components/ui/Avatar'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const { user, logout, tenantId } = useAuth()
  const { data: unreadData } = useUnreadNotificationCount()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Tenant: {tenantId || 'Loading...'}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => i18n.changeLanguage(i18n.language === 'it' ? 'en' : 'it')}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          title={`Switch to ${i18n.language === 'it' ? 'English' : 'Italian'}`}
        >
          <Globe className="w-5 h-5" />
          <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
        </button>

        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Bell className="w-5 h-5" />
          {unreadData && unreadData.count > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadData.count}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Avatar name={user?.name || ''} size="sm" />
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-2">
              <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                <User className="w-4 h-4" />
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
