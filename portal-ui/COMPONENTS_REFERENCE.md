# Components Reference - Stillum Business Portal UI

## Complete Component Catalog

### UI Primitives (`src/components/ui/`)

#### Button
- **File**: `Button.tsx`
- **Props**: 
  - `variant`: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  - `size`: 'sm' | 'md' | 'lg'
  - `isLoading`: boolean
- **Usage**: All interactive buttons throughout the app

#### Input
- **File**: `Input.tsx`
- **Props**:
  - `type`: HTML input type
  - `label`: Optional label text
  - `error`: Error message to display
  - `helperText`: Helper text below input
- **Usage**: Text input fields in forms

#### Select
- **File**: `Select.tsx`
- **Props**:
  - `label`: Optional label
  - `options`: Array of {value, label}
  - `error`: Error message
  - `helperText`: Helper text
- **Usage**: Dropdown select inputs

#### Textarea
- **File**: `Textarea.tsx`
- **Props**:
  - `label`: Optional label
  - `error`: Error message
  - `helperText`: Helper text
  - `rows`: Number of rows
- **Usage**: Multi-line text input

#### Card
- **File**: `Card.tsx`
- **Components**:
  - `Card` - Main container
  - `CardHeader` - Header section
  - `CardTitle` - Title element
  - `CardContent` - Content section
  - `CardFooter` - Footer section
- **Usage**: Container for grouped content

#### Badge
- **File**: `Badge.tsx`
- **Props**:
  - `variant`: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
- **Usage**: Tags, status indicators

#### Avatar
- **File**: `Avatar.tsx`
- **Props**:
  - `name`: User name (for initials)
  - `src`: Image URL
  - `size`: 'sm' | 'md' | 'lg'
- **Usage**: User avatars with fallback

#### Spinner
- **File**: `Spinner.tsx`
- **Props**:
  - `size`: 'sm' | 'md' | 'lg'
- **Usage**: Loading indicators

---

## Layout Components (`src/components/layout/`)

### AppLayout
- **File**: `AppLayout.tsx`
- **Description**: Main application wrapper
- **Children**: Page content
- **Structure**:
  - Sidebar + Header + Content area
  - Responsive grid layout

### Sidebar
- **File**: `Sidebar.tsx`
- **Features**:
  - Navigation menu
  - Role-based menu items
  - Active route highlighting
  - Logo/branding section
  - Footer info

### Header
- **File**: `Header.tsx`
- **Features**:
  - Tenant info display
  - Language toggle (EN/IT)
  - Notification bell
  - User menu (Profile, Logout)
  - Sticky positioning

---

## Common Components (`src/components/common/`)

### ErrorBoundary
- **File**: `ErrorBoundary.tsx`
- **Purpose**: Catch React errors
- **Wraps**: Entire app
- **Shows**: Error message and "Back to home" button

### LoadingPage
- **File**: `LoadingPage.tsx`
- **Description**: Full-page loading state
- **Shows**: Centered spinner with "Loading..." text

### EmptyState
- **File**: `EmptyState.tsx`
- **Props**:
  - `title`: Main message
  - `description`: Details
  - `icon`: Optional icon
  - `action`: Optional action button
- **Usage**: When no data available

### ProtectedRoute
- **File**: `ProtectedRoute.tsx`
- **Props**:
  - `requiredRole`: Optional role check
  - `children`: Protected content
- **Behavior**: Redirects to login if not authenticated

### PageHeader
- **File**: `PageHeader.tsx`
- **Props**:
  - `title`: Page title
  - `description`: Subtitle
  - `action`: Action button/component
  - `breadcrumbs`: Navigation breadcrumbs
- **Usage**: Consistent page headers

### StatusBadge
- **File**: `StatusBadge.tsx`
- **Props**:
  - `status`: Status value (e.g., 'DRAFT', 'PUBLISHED')
  - `label`: Optional custom label
- **Behavior**: Color-coded by status

### FilterBar
- **File**: `FilterBar.tsx`
- **Props**:
  - `children`: Filter controls
  - `onReset`: Reset handler
- **Usage**: Filter section above lists

---

## Artifact Components (`src/components/artifacts/`)

### ArtifactCard
- **File**: `ArtifactCard.tsx`
- **Props**: `artifact: Artifact`
- **Displays**:
  - Name and description
  - Type and status
  - Owner avatar
  - Last updated date
  - Tags
- **Behavior**: Clickable to detail page

### ArtifactList
- **File**: `ArtifactList.tsx`
- **Props**:
  - `artifacts`: Artifact[]
  - `isLoading`: boolean
  - `view`: 'grid' | 'list'
- **Renders**: Grid or list of artifacts

---

## Page Components (`src/pages/`)

### LoginPage
- **Path**: `/login`
- **Features**:
  - Email/password form
  - Demo credentials info
  - Gradient background

### SelectTenantPage
- **Path**: `/tenants`
- **Features**:
  - Tenant cards
  - Tenant selection
  - Tenant info display

### HomePage
- **Path**: `/`
- **Features**:
  - Dashboard cards (drafts, tasks, pubs)
  - Recent drafts list
  - Recent publications list
  - Quick action button

### CataloguePage
- **Path**: `/catalogue`
- **Features**:
  - Search input
  - Type filter
  - Status filter
  - Grid/List toggle
  - Pagination

### ArtifactDetailPage
- **Path**: `/artifacts/:id`
- **Features**:
  - Artifact information
  - Version list
  - Edit button
  - Publish button
  - Metadata section

### EditorPage
- **Path**: `/artifacts/:id/edit`
- **Features**:
  - Editor placeholder (type-specific)
  - Save button
  - Type routing logic

### PublishPage
- **Path**: `/artifacts/:id/publish`
- **Features**:
  - 4-step wizard
  - Preview step
  - Validation step
  - Environment selection
  - Confirmation step

### InstancesPage
- **Path**: `/instances`
- **Features**:
  - Instance list
  - Status filter
  - Search
  - Process key display
  - Progress indicator

### InstanceDetailPage
- **Path**: `/instances/:id`
- **Features**:
  - Instance info
  - Status display
  - History timeline
  - Variables section

### TasksPage
- **Path**: `/tasks`
- **Features**:
  - Task list
  - Status filter
  - Priority filter
  - Complete button
  - Task details

### AuditPage
- **Path**: `/audit`
- **Features**:
  - Audit log table
  - User filter
  - Action filter
  - Export button
  - Status indicators

### AdminUsersPage
- **Path**: `/admin/users`
- **Features**:
  - User list
  - Invite form
  - User details
  - Edit button
  - Admin role only

### AnalyticsPage
- **Path**: `/analytics`
- **Features**:
  - Chart placeholders
  - Dashboard grid

### DiffPage
- **Path**: `/artifacts/:id/diff/:v1/:v2`
- **Features**:
  - Version comparison
  - Side-by-side view

### ImportPage
- **Path**: `/import`
- **Features**:
  - File upload area
  - Import button

### SettingsPage
- **Path**: `/settings`
- **Features**:
  - General settings
  - Notification preferences
  - Security (password change)

### NotFoundPage
- **Path**: `*` (catch-all)
- **Shows**: 404 message and back button

---

## Hook Components

### useAuth
- **Returns**: { token, user, tenantId, setAuth, logout }
- **Purpose**: Authentication state access

### useArtifacts
- **Params**: page, pageSize, filters
- **Returns**: Query result { data, isLoading, error }
- **Purpose**: Artifact list with pagination

### useArtifact
- **Params**: id
- **Returns**: Query result
- **Purpose**: Single artifact detail

### useVersions
- **Params**: artifactId, page, pageSize
- **Returns**: Query result
- **Purpose**: Artifact versions

### useInstances
- **Params**: page, pageSize, filters
- **Returns**: Query result
- **Purpose**: Process instances

### useMyTasks
- **Params**: page, pageSize, filters
- **Returns**: Query result
- **Purpose**: User's assigned tasks

### useCompleteTask
- **Returns**: Mutation { mutate, isPending }
- **Purpose**: Complete a task

### usePublish
- **Returns**: Mutation
- **Purpose**: Publish artifact

### useNotifications
- **Returns**: Query result
- **Polling**: Every 30 seconds
- **Purpose**: User notifications

### useAuditLog
- **Params**: page, pageSize, filters
- **Returns**: Query result
- **Purpose**: Audit logging

### useUsers
- **Params**: page, pageSize
- **Returns**: Query result
- **Purpose**: User management

---

## Store Components

### useAuthStore
- **State**:
  - `token`: string | null
  - `user`: User | null
  - `tenantId`: string | null
  - `isAuthenticated`: boolean
- **Methods**:
  - `setAuth(token, user, tenantId)`
  - `setUser(user)`
  - `logout()`

### useNotificationStore
- **State**:
  - `notifications`: Notification[]
  - `unreadCount`: number
- **Methods**:
  - `setNotifications()`
  - `addNotification()`
  - `removeNotification()`
  - `incrementUnreadCount()`

---

## Component Props Examples

### Complete Button Usage
```typescript
<Button 
  variant="primary" 
  size="md" 
  onClick={handleClick}
  isLoading={isLoading}
  disabled={!isValid}
>
  Click Me
</Button>
```

### Complete Card Usage
```typescript
<Card>
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

### Complete Form Usage
```typescript
<div className="space-y-4">
  <Input
    label="Name"
    type="text"
    error={errors.name}
    value={formData.name}
    onChange={(e) => setFormData({...formData, name: e.target.value})}
  />
  <Select
    label="Type"
    options={typeOptions}
    value={formData.type}
    onChange={(e) => setFormData({...formData, type: e.target.value})}
  />
  <Textarea
    label="Description"
    rows={4}
    value={formData.description}
    onChange={(e) => setFormData({...formData, description: e.target.value})}
  />
  <Button variant="primary">Submit</Button>
</div>
```

---

## Component Tree Structure

```
App
├── ErrorBoundary
│   ├── Router
│   │   ├── LoginPage
│   │   ├── SelectTenantPage
│   │   └── AppLayout (for all other pages)
│   │       ├── Sidebar
│   │       ├── Header
│   │       └── PageContent
│   │           ├── HomePage
│   │           ├── CataloguePage
│   │           │   └── ArtifactList
│   │           │       └── ArtifactCard[]
│   │           ├── ArtifactDetailPage
│   │           ├── EditorPage
│   │           ├── PublishPage
│   │           ├── InstancesPage
│   │           ├── InstanceDetailPage
│   │           ├── TasksPage
│   │           ├── AuditPage
│   │           ├── AdminUsersPage
│   │           ├── AnalyticsPage
│   │           ├── DiffPage
│   │           ├── ImportPage
│   │           ├── SettingsPage
│   │           └── NotFoundPage
└── QueryClientProvider
    └── (React Query context)
```

---

## Styling Classes Used

### Button Variants
- `bg-blue-600` - Primary
- `bg-purple-600` - Secondary
- `bg-red-600` - Danger
- `border border-gray-300` - Outline
- `text-gray-700` - Ghost

### Status Colors
- `bg-gray-100` - Draft/Neutral
- `bg-blue-100` - Running/Review
- `bg-green-100` - Published/Completed
- `bg-red-100` - Failed/Rejected
- `bg-yellow-100` - Pending/Suspended

---

## Responsive Behavior

All components are mobile-responsive using Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Grid layouts automatically adjust for mobile viewing.

---

## Accessibility Features

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators on buttons
- Color contrast compliance (WCAG AA)
- Form labels for screen readers

---

## Performance Optimizations

- Components use React.forwardRef for ref forwarding
- Memoization ready for expensive components
- Event handler optimization with debounce/throttle
- Query caching with React Query
- Code splitting with React Router
- CSS purging in production build
