# Quick Start Guide - Stillum Business Portal UI

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd /sessions/sharp-beautiful-knuth/mnt/stillum-business-central/portal-ui
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:
```
VITE_API_URL=http://localhost:3000/api
VITE_OIDC_AUTHORITY=https://your-oidc.com
VITE_OIDC_CLIENT_ID=your-client-id
```

### 3. Start Development Server
```bash
npm run dev
```

Open browser: `http://localhost:5173`

### 4. Default Login
- Email: `test@example.com`
- Password: `password`

## Build for Production
```bash
npm run build    # Creates dist/ folder
npm run preview  # Test production build locally
```

## Project Structure Quick Reference

```
src/
├── api/              → API service functions
├── components/       → React components
│   ├── ui/          → Primitive UI components
│   ├── layout/      → Layout components
│   ├── common/      → Shared components
│   └── artifacts/   → Feature components
├── hooks/           → Custom React hooks
├── pages/           → Page components
├── stores/          → Zustand state stores
├── lib/             → Types, constants, utilities
├── i18n/            → Translations (English & Italian)
├── App.tsx          → Main app with routing
└── main.tsx         → Entry point
```

## Common Tasks

### Add a New Page
1. Create file in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx`

### Add a Translation
Edit `src/i18n/locales/en.json` and `it.json`:
```json
{
  "mySection": {
    "myKey": "English text"
  }
}
```

Use in component:
```typescript
import { useTranslation } from 'react-i18next'
const { t } = useTranslation()
<h1>{t('mySection.myKey')}</h1>
```

### Create a Custom Hook
```typescript
// src/hooks/useMyFeature.ts
import { useQuery } from '@tanstack/react-query'

export function useMyFeature() {
  return useQuery({
    queryKey: ['myFeature'],
    queryFn: () => fetchData()
  })
}
```

### Create a New Component
```typescript
// src/components/ui/MyComponent.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface MyComponentProps {
  label?: string
  variant?: 'primary' | 'secondary'
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ label, variant = 'primary', ...props }, ref) => (
    <div ref={ref} className={cn('...', variant === 'primary' ? '...' : '...')} {...props}>
      {label}
    </div>
  )
)

MyComponent.displayName = 'MyComponent'

export default MyComponent
```

### Call an API
```typescript
import { useArtifacts } from '@/hooks/useArtifacts'

export function MyComponent() {
  const { data: artifacts, isLoading, error } = useArtifacts(0, 20)
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{artifacts.data.length} artifacts</div>
}
```

### Handle Form Submission
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  )
}
```

### Create a Mutation
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createArtifact } from '@/api/artifacts'

export function MyComponent() {
  const queryClient = useQueryClient()
  
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => createArtifact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artifacts'] })
    }
  })
  
  return (
    <button onClick={() => mutate({ name: 'New' })} disabled={isPending}>
      Create
    </button>
  )
}
```

## Available Commands

```bash
npm run dev      # Start dev server on localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code with ESLint
npm run format   # Format code with Prettier
```

## Browser DevTools

### React DevTools
- Install: Chrome/Firefox extension
- Inspect components, props, state

### React Query DevTools
- Already configured in dev mode
- Monitor queries and mutations
- Replay failed requests

## Debugging

### Enable TypeScript Checking
```bash
npm run build  # Full type check
```

### Check Network Requests
1. Open Browser DevTools (F12)
2. Go to Network tab
3. Look at API calls to verify endpoints

### View Component Props
1. Open React DevTools extension
2. Select component
3. See all props in panel

## Common Issues

### "Cannot find module"
- Verify path alias in `tsconfig.json`: `@` → `./src`
- Check import statement syntax

### API 404 Errors
- Verify `VITE_API_URL` in `.env.local`
- Check backend is running
- Review browser console

### Styling Not Applied
- Clear browser cache (Ctrl+F5)
- Restart dev server
- Check Tailwind class names are correct

### Type Errors
- Run `npm run build` to see all TypeScript errors
- Check type definitions in `src/lib/types.ts`

## Performance Tips

1. **Development**: Use `npm run dev` for hot reload
2. **Production**: Always run `npm run build` before deploying
3. **Bundle Size**: Check with `npm run build` output
4. **Images**: Compress before using
5. **API Calls**: React Query handles caching automatically

## Resources

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com
- **React Query**: https://tanstack.com/query/latest
- **Zustand**: https://github.com/pmndrs/zustand

## Need Help?

1. Check `README.md` for detailed documentation
2. Review `FILE_MANIFEST.md` for file structure
3. Check `IMPLEMENTATION_SUMMARY.md` for architecture details
4. Look at similar components for patterns
5. Check browser console for error messages

## Next Steps

1. **Replace API calls** with your backend endpoints
2. **Customize theme** in `tailwind.config.ts`
3. **Add your pages** following the existing patterns
4. **Configure authentication** (OIDC or custom)
5. **Deploy** to your hosting platform

Enjoy! 🚀
