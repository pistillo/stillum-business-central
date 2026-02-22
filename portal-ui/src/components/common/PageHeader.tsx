import { ReactNode } from 'react'

export interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export default function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          {breadcrumbs.map((bc, i) => (
            <div key={i}>
              {bc.href ? <a href={bc.href} className="hover:text-gray-900">{bc.label}</a> : <span>{bc.label}</span>}
              {i < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600 mt-2">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  )
}
