import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { t } = useTranslation()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Mock authentication - replace with actual API call
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        roles: [{ id: '1', name: 'USER', permissions: [] }],
      }
      setAuth('mock-token-' + Date.now(), mockUser, 'default-tenant')
      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">Stillum Portal</h1>
          </div>

          <h2 className="text-center text-gray-600 mb-6">{t('auth.signIn')}</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

            <Input
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              {t('auth.login')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo credentials: test@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  )
}
