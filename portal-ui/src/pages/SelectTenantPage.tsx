import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { getTenants } from '@/api/tenants'
import Button from '@/components/ui/Button'
import { Tenant } from '@/lib/types'
import { Building2 } from 'lucide-react'
import LoadingPage from '@/components/common/LoadingPage'

export default function SelectTenantPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { setTenant } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const data = await getTenants()
        setTenants(data)
      } catch (error) {
        console.error('Failed to load tenants:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTenants()
  }, [])

  const handleSelectTenant = (tenantId: string) => {
    setTenant(tenantId)
    navigate('/')
  }

  if (isLoading) return <LoadingPage />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select a Tenant</h1>
          <p className="text-gray-600 mb-8">Choose which tenant you want to work with</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                onClick={() => handleSelectTenant(tenant.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{tenant.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{tenant.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
