import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Home, LogOut, Menu, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTenant } from '../tenancy/TenantContext';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { to: '/home', label: 'Dashboard', icon: Home },
  { to: '/catalogue', label: 'Catalogo', icon: BookOpen },
  { to: '/catalogue/new', label: 'Nuovo Artefatto', icon: PlusCircle },
];

export function Layout() {
  const { state, logout } = useAuth();
  const { tenantId } = useTenant();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName =
    state.status === 'authenticated'
      ? (state.user.profile?.preferred_username ??
        state.user.profile?.name ??
        state.user.profile?.email ??
        'Utente')
      : 'Utente';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col
          border-r border-gray-200 dark:border-slate-700
          bg-white dark:bg-slate-800
          transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-slate-700 px-5">
          <NavLink
            to="/home"
            className="flex items-center gap-2.5"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
              S
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Stillum</span>
          </NavLink>
          <button className="btn-icon lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Tenant info */}
        <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-700/50">
          <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Tenant
          </div>
          <div className="mt-0.5 text-xs font-mono text-gray-600 dark:text-slate-400 truncate">
            {tenantId ?? '—'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/home'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-slate-200'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 dark:border-slate-700 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-slate-200 truncate">
                {userName}
              </div>
            </div>
            {state.status === 'authenticated' && (
              <button
                onClick={() => void logout()}
                className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50
                           dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 lg:px-6">
          <button className="btn-icon lg:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Page content: flex + min-h-0 so editor pages can fill height correctly */}
        <main className="flex flex-1 flex-col min-h-0 overflow-hidden p-4 lg:p-6">
          <div className="flex flex-1 flex-col min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
