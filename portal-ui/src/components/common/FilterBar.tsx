import { ReactNode } from 'react'

export interface FilterBarProps {
  children: ReactNode
  onReset?: () => void
}

export default function FilterBar({ children, onReset }: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 mb-6">
      {children}
      {onReset && (
        <button
          onClick={onReset}
          className="ml-auto px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
        >
          Reset
        </button>
      )}
    </div>
  )
}
