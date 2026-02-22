import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Go back home
        </Button>
      </div>
    </div>
  )
}
