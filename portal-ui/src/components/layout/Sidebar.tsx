import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, Play, CheckSquare, Inbox, Settings, BarChart3, Users, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: FileText, label: 'Catalogue', href: '/catalogue' },
  { icon: Play, label: 'Instances', href: '/instances' },
  { icon: CheckSquare, label: 'My Tasks', href: '/tasks' },
  { icon: Inbox, label: 'Audit Log', href: '/audit' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', admin: true },
  { icon: Users, label: 'Users', href: '/admin/users', admin: true },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()
  const isAdmin = user?.roles.some((r) => r.name === 'ADMIN') || false

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Lock className="w-6 h-6" />
          <h1 className="text-xl font-bold">Stillum Portal</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          if (item.admin && !isAdmin) return null

          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
        <p>v1.0.0</p>
        <p>© 2026 Stillum</p>
      </div>
    </div>
  )
}
