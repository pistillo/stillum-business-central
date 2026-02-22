import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && !user?.roles.some((r) => r.name === requiredRole)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
