export const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800',
  REVIEW: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  RETIRED: 'bg-red-100 text-red-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
  CREATED: 'bg-gray-100 text-gray-800',
  RUNNING: 'bg-blue-100 text-blue-800',
  SUSPENDED: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
} as const

export const ARTIFACT_TYPE_ICONS = {
  BPMN: 'GitBranch',
  DMN: 'GitBranch',
  FORM: 'FileText',
  REQUEST: 'Send',
  WORKFLOW: 'Workflow',
} as const

export const ARTIFACT_TYPES = [
  { value: 'BPMN', label: 'BPMN Process' },
  { value: 'DMN', label: 'DMN Decision' },
  { value: 'FORM', label: 'Form' },
  { value: 'REQUEST', label: 'Request' },
  { value: 'WORKFLOW', label: 'Workflow' },
] as const

export const PRIORITY_COLORS = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
} as const

export const REVIEW_STATUS_COLORS = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CHANGES_REQUESTED: 'bg-orange-100 text-orange-800',
} as const

export const PAGE_SIZE = 20
export const NOTIFICATION_POLLING_INTERVAL = 30000 // 30 seconds
export const AUTO_SAVE_INTERVAL = 5000 // 5 seconds
