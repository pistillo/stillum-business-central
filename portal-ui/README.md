# Stillum Business Portal UI

A professional React + TypeScript frontend for the Stillum Business Portal - a multi-tenant business process management platform.

## Features

- **Multi-tenant Architecture** - Support for multiple tenants with tenant switching
- **Process Management** - Create, edit, and manage BPMN processes
- **Decision Management** - Support for DMN decisions
- **Form & Request Management** - JSON Schema-based forms and requests
- **Instance Management** - Monitor and manage process instances
- **Task Management** - Assign, claim, and complete user tasks
- **Version Control** - Track artifact versions with full history
- **Publishing Workflow** - Multi-step publishing wizard with validation and environments
- **Review System** - Peer review and approval workflow
- **Audit Logging** - Complete audit trail of all operations
- **Internationalization** - Built-in support for English and Italian
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Type Safety** - Full TypeScript support with strict type checking

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5 with Axios
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom configuration
- **Editor Integration**: Monaco Editor, BPMN-JS, DMN-JS
- **Internationalization**: i18next with React integration
- **Icons**: Lucide React

## Project Structure

```
portal-ui/
├── src/
│   ├── api/                    # API client and service functions
│   ├── components/             # React components
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # UI primitives
│   │   ├── common/            # Common components
│   │   ├── artifacts/         # Artifact-related components
│   │   ├── editors/           # Editor wrappers
│   │   ├── publish/           # Publishing workflow
│   │   ├── instances/         # Instance components
│   │   ├── reviews/           # Review components
│   │   ├── notifications/     # Notification components
│   │   ├── admin/             # Admin components
│   │   └── analytics/         # Analytics components
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores
│   ├── pages/                 # Page components
│   ├── i18n/                  # Internationalization config
│   │   └── locales/          # Translation files
│   ├── lib/
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── constants.ts      # Application constants
│   │   └── utils.ts          # Utility functions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── .eslintrc.cjs             # ESLint configuration
├── .prettierrc                # Prettier configuration
└── package.json              # Dependencies

```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd portal-ui
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```
VITE_API_URL=http://localhost:3000/api
VITE_OIDC_AUTHORITY=https://your-oidc-provider.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_REDIRECT_URI=http://localhost:5173/callback
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Authentication

The application uses JWT tokens for authentication. Upon login, the token is stored in localStorage and automatically included in all API requests via an axios interceptor.

### Store: useAuthStore

```typescript
const { token, user, tenantId, setAuth, logout } = useAuthStore()
```

## API Integration

All API calls are made through the `apiClient` (axios instance) with automatic:
- Authorization header injection
- Tenant ID header inclusion
- 401 error handling with automatic logout

### Example API Service

```typescript
import apiClient from './client'

export const getArtifacts = async (page = 0, pageSize = 20) => {
  const response = await apiClient.get('/artifacts', {
    params: { page, pageSize }
  })
  return response.data
}
```

### Custom Hooks for Data Fetching

```typescript
import { useArtifacts } from '@/hooks/useArtifacts'

function MyComponent() {
  const { data, isLoading, error } = useArtifacts(0, 20)
}
```

## Internationalization

The app supports English and Italian out of the box.

### Switch Language

```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { i18n, t } = useTranslation()
  
  return (
    <>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('it')}>
        Switch to Italian
      </button>
    </>
  )
}
```

### Add Translations

1. Update `src/i18n/locales/en.json` for English
2. Update `src/i18n/locales/it.json` for Italian

## Component Library

The app includes a set of reusable UI components styled with Tailwind CSS:

- **Button** - Primary, secondary, danger, outline, ghost variants
- **Input** - Text input with label and error support
- **Select** - Dropdown select with options
- **Textarea** - Multi-line text input
- **Card** - Container with header and content sections
- **Badge** - Status and tag badges
- **Avatar** - User avatar with initials fallback
- **Spinner** - Loading indicator
- **PageHeader** - Page title with breadcrumbs and actions
- **StatusBadge** - Colored status indicators
- **EmptyState** - Empty state placeholder
- **FilterBar** - Filter controls

## Styling

All styling uses Tailwind CSS utility classes. Custom styles can be added to `src/index.css`.

### Dark Mode Support

Currently configured for light mode. To enable dark mode:

1. Update `tailwind.config.ts` to include `darkMode: 'class'`
2. Add dark mode utilities to components

## State Management

### Zustand Stores

#### authStore
```typescript
{
  token: string | null
  user: User | null
  tenantId: string | null
  isAuthenticated: boolean
  setAuth(token, user, tenantId): void
  logout(): void
}
```

#### notificationStore
```typescript
{
  notifications: Notification[]
  unreadCount: number
  setNotifications(notifications): void
  addNotification(notification): void
  removeNotification(id): void
  setUnreadCount(count): void
}
```

## Data Fetching Patterns

The app uses React Query for all data fetching with automatic caching and synchronization:

```typescript
// Query (read)
const { data, isLoading, error } = useArtifacts(page, pageSize, filters)

// Mutation (write)
const { mutate, isPending } = useCreateArtifact()
mutate(newArtifact)
```

## Error Handling

### ErrorBoundary

Wraps the entire app to catch React errors:

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### API Errors

Automatically handled by axios interceptors. 401 errors trigger logout.

## Protected Routes

Use the `ProtectedRoute` component to restrict access:

```typescript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

## Performance Optimization

- Code splitting with React Router
- Image lazy loading
- Debounced search and filter inputs
- React Query caching and stale-while-revalidate
- Tailwind CSS purging for production builds

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues

1. Check that `VITE_API_URL` is correctly set
2. Verify backend is running
3. Check CORS configuration on backend
4. Inspect network tab in DevTools

### Build Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Run linting before committing:
   ```bash
   npm run lint
   npm run format
   ```

## License

Proprietary - Stillum Business Portal

## Support

For issues and questions, contact the development team.
