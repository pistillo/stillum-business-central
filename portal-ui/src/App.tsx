import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/hooks/useAuth'

// Pages
import LoginPage from '@/pages/LoginPage'
import SelectTenantPage from '@/pages/SelectTenantPage'
import HomePage from '@/pages/HomePage'
import CataloguePage from '@/pages/CataloguePage'
import ArtifactDetailPage from '@/pages/ArtifactDetailPage'
import EditorPage from '@/pages/EditorPage'
import PublishPage from '@/pages/PublishPage'
import InstancesPage from '@/pages/InstancesPage'
import InstanceDetailPage from '@/pages/InstanceDetailPage'
import TasksPage from '@/pages/TasksPage'
import AuditPage from '@/pages/AuditPage'
import AdminUsersPage from '@/pages/AdminUsersPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import DiffPage from '@/pages/DiffPage'
import ImportPage from '@/pages/ImportPage'
import SettingsPage from '@/pages/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

function AppRoutes() {
  const { isAuthenticated, tenantId } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (!tenantId) {
    return <SelectTenantPage />
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/artifacts/:id" element={<ArtifactDetailPage />} />
        <Route path="/artifacts/:id/edit" element={<EditorPage />} />
        <Route path="/artifacts/:id/publish" element={<PublishPage />} />
        <Route path="/artifacts/:id/diff/:versionId1/:versionId2" element={<DiffPage />} />
        <Route path="/instances" element={<InstancesPage />} />
        <Route path="/instances/:id" element={<InstanceDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="ADMIN"><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
