import Badge from '@/components/ui/Badge'
import { STATUS_COLORS } from '@/lib/constants'

export interface StatusBadgeProps {
  status: string
  label?: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'
  
  return (
    <Badge className={colorClass}>
      {label || status}
    </Badge>
  )
}
