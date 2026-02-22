// Auth & User
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  roles: Role[]
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

// Tenants
export interface Tenant {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  maxUsers: number
  createdAt: string
  updatedAt: string
}

// Artifacts
export type ArtifactType = 'BPMN' | 'DMN' | 'FORM' | 'REQUEST' | 'WORKFLOW'

export type ArtifactStatus = 'DRAFT' | 'PUBLISHED' | 'RETIRED' | 'ARCHIVED'

export interface Artifact {
  id: string
  tenantId: string
  name: string
  description?: string
  type: ArtifactType
  status: ArtifactStatus
  currentVersionId: string
  latestPublishedVersionId?: string
  tags?: string[]
  category?: string
  owner: User
  createdAt: string
  updatedAt: string
  lastModifiedBy: User
}

// Versions
export interface ArtifactVersion {
  id: string
  artifactId: string
  versionNumber: number
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'RETIRED'
  content: string // JSON or XML content
  metadata?: Record<string, any>
  changeDescription?: string
  author: User
  reviewedBy?: User
  reviewComments?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
  environment?: string
}

// Dependencies
export interface ArtifactDependency {
  id: string
  sourceArtifactId: string
  targetArtifactId: string
  dependencyType: 'USES' | 'EXTENDS' | 'IMPLEMENTS' | 'REFERENCES'
  createdAt: string
}

// Publishing
export interface PublishRequest {
  versionId: string
  targetEnvironment: string
  changeDescription: string
  approvers?: string[]
  scheduledAt?: string
}

export interface Publication {
  id: string
  versionId: string
  environment: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK'
  startedAt?: string
  completedAt?: string
  error?: string
  appliedChanges?: Record<string, any>
}

// Instances
export interface ProcessInstance {
  id: string
  artifactId: string
  versionId: string
  processKey: string
  status: 'CREATED' | 'RUNNING' | 'SUSPENDED' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  initiator: User
  variables?: Record<string, any>
  businessKey?: string
  startedAt: string
  completedAt?: string
  duration?: number
  progress?: number
}

export interface InstanceHistory {
  id: string
  instanceId: string
  eventType: string
  eventName: string
  timestamp: string
  elementType?: string
  elementId?: string
  variables?: Record<string, any>
  errorMessage?: string
}

// Tasks
export type TaskStatus = 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'SUSPENDED' | 'COMPLETED' | 'FAILED'

export interface UserTask {
  id: string
  instanceId: string
  name: string
  description?: string
  formKey?: string
  assignee?: User
  candidateGroups?: string[]
  status: TaskStatus
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  dueDate?: string
  createdAt: string
  variables?: Record<string, any>
}

// Reviews
export interface Review {
  id: string
  versionId: string
  reviewerIds: string[]
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'
  comments: ReviewComment[]
  createdAt: string
  updatedAt: string
  dueDate?: string
}

export interface ReviewComment {
  id: string
  reviewer: User
  content: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'
  timestamp: string
  attachments?: string[]
}

// Notifications
export interface Notification {
  id: string
  userId: string
  type: 'TASK_ASSIGNED' | 'APPROVAL_REQUIRED' | 'PUBLICATION_FAILED' | 'INSTANCE_FAILED' | 'REVIEW_REQUESTED' | 'SYSTEM'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
  updatedAt: string
}

// Audit
export interface AuditLog {
  id: string
  tenantId: string
  userId: string
  action: string
  resourceType: string
  resourceId: string
  changes?: Record<string, any>
  status: 'SUCCESS' | 'FAILURE'
  errorMessage?: string
  ipAddress?: string
  timestamp: string
}

// Search
export interface SearchQuery {
  q: string
  type?: ArtifactType
  status?: ArtifactStatus
  owner?: string
  tags?: string[]
  createdAfter?: string
  createdBefore?: string
  limit?: number
  offset?: number
}

export interface SearchResult {
  total: number
  results: Artifact[]
}

// Environments
export interface Environment {
  id: string
  tenantId: string
  name: string
  slug: string
  description?: string
  order: number
  isProduction: boolean
  endpoints?: Record<string, string>
  variables?: Record<string, string>
}

// API Responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, any>
  }
}

export interface PaginatedResponse<T> {
  total: number
  page: number
  pageSize: number
  data: T[]
}
