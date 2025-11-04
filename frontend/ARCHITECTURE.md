# Frontend Architecture

This document describes the architecture and best practices for the Next.js frontend application.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React hooks, Server Components
- **AI/ML**: Google Gemini API via Genkit
- **Testing**: Vitest (unit), Playwright (E2E)
- **Linting**: ESLint 9 with flat config

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Main layout group
│   ├── actions.ts         # [Deprecated] Use lib/actions instead
│   ├── error.tsx          # Global error boundary
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── features/          # Feature-specific components
│   ├── layouts/           # Layout components
│   └── ui/                # Base UI components (shadcn/ui)
├── lib/
│   ├── actions/           # Server Actions organized by domain
│   │   ├── analysis.ts
│   │   └── index.ts
│   ├── ai/                # AI/ML logic and flows
│   ├── drama-analyst/     # Drama analysis domain logic
│   └── utils.ts           # Utility functions
├── config/                # Application configuration
│   └── app.ts             # App-wide constants
├── types/                 # Shared TypeScript types
├── hooks/                 # Custom React hooks
└── env.ts                 # Environment variable validation

```

## Architecture Principles

### 1. Server Components First (RSC)

- **Default to Server Components**: All components are Server Components unless they need client-side interactivity
- **Explicit client boundaries**: Use `'use client'` directive only when necessary
- **Data fetching on server**: Fetch data in Server Components when possible

### 2. Server Actions Organization

All Server Actions are centralized in `src/lib/actions/` and organized by domain:

```typescript
// ✅ Good: Organized by domain
src/lib/actions/
  ├── analysis.ts    # Analysis-related actions
  ├── projects.ts    # Project management actions
  └── index.ts       # Re-exports for convenience

// ❌ Bad: Server Actions in pages
src/app/some-page/actions.ts
```

### 3. Named Exports Policy

ESLint enforces named exports everywhere except App Router special files:

```typescript
// ✅ Good: Named exports in components
export function MyComponent() { ... }

// ❌ Bad: Default exports in components
export default function MyComponent() { ... }

// ✅ Exception: App Router files (page.tsx, layout.tsx, error.tsx, etc.)
export default function Page() { ... }
```

### 4. Environment Variables

Environment variables are validated at runtime using Zod schemas in `src/env.ts`:

- **Server-only**: `GEMINI_API_KEY_*`, `SENTRY_AUTH_TOKEN`, etc.
- **Client-safe**: `NEXT_PUBLIC_*` variables
- **Type-safe**: TypeScript types exported for autocomplete

See `.env.example` for all available variables.

### 5. Component Organization

#### UI Components (`src/components/ui/`)

- Base components from shadcn/ui
- Generic, reusable across features
- No business logic

#### Feature Components (`src/components/features/`)

- Business logic and feature-specific components
- Organized by domain (analysis, editor, projects, etc.)
- Can contain local state and effects

#### Layout Components (`src/components/layouts/`)

- Structural components (page layouts, grids, containers)
- Reusable across different pages

### 6. Error Handling

- **Global error boundary**: `src/app/error.tsx` catches all errors
- **Granular boundaries**: Add error.tsx in specific route segments as needed
- **Error tracking**: Integrated with Sentry for production monitoring

## Development Workflow

### Environment Setup

1. Copy environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in required values (especially `GEMINI_API_KEY_STAGING`)

3. Install dependencies:
   ```bash
   pnpm install
   ```

### Scripts

```bash
# Development
pnpm dev                 # Start dev server
pnpm genkit:dev         # Start Genkit development

# Quality checks
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix auto-fixable issues
pnpm typecheck          # TypeScript type checking
pnpm test               # Run unit tests
pnpm e2e                # Run E2E tests

# CI/CD
pnpm prepush            # Pre-push checks (lint + typecheck + test)
pnpm ci                 # Full CI pipeline (prepush + build)

# Building
pnpm build              # Production build
pnpm start              # Start production server
```

## Best Practices

### Server vs Client Components

Use this decision tree:

1. **Does it use browser APIs (window, localStorage, etc.)?** → Client Component
2. **Does it use hooks (useState, useEffect, etc.)?** → Client Component
3. **Does it use event handlers (onClick, onChange, etc.)?** → Client Component
4. **Otherwise** → Server Component (default)

### Data Fetching

```typescript
// ✅ Good: Fetch in Server Component
async function ServerPage() {
  const data = await fetchData() // Direct async/await
  return <Display data={data} />
}

// ✅ Good: Server Action for mutations
'use server'
export async function createProject(data: FormData) {
  // Server-side mutation logic
}

// ❌ Avoid: Client-side data fetching for initial render
'use client'
function ClientPage() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/data').then(...)  // Unnecessary client fetch
  }, [])
}
```

### Type Safety

- Use Zod for runtime validation (forms, API responses, env vars)
- Export types from domain modules
- Avoid `any` - use `unknown` for truly unknown types

## Testing Strategy

### Unit Tests (Vitest)

- Test Server Actions in isolation
- Test utility functions and helpers
- Test complex business logic

### Integration Tests

- Test component integration with Server Actions
- Use MSW for API mocking

### E2E Tests (Playwright)

- Critical user flows
- Error boundary behavior
- Cross-browser compatibility

## Performance Optimization

1. **Code splitting**: Dynamic imports for heavy components
2. **Image optimization**: Always use Next.js `<Image>`
3. **Font optimization**: Use Next.js font optimization
4. **Bundle analysis**: Run `pnpm analyze` to check bundle size
5. **Server Components**: Reduce client bundle by using RSC

## Security

- ✅ Server secrets never exposed to client
- ✅ Environment variables validated at runtime
- ✅ API keys stored server-side only
- ✅ CSP headers configured
- ✅ Sentry for error tracking

## Migration Notes

### Recent Changes

1. **ESLint 9 Migration**: Migrated from `.eslintrc.json` to `eslint.config.js` (flat config)
2. **Server Actions**: Moved from `src/app/actions.ts` to `src/lib/actions/*`
3. **Named Exports**: Enforced via ESLint, except for App Router files
4. **Error Boundary**: Added global `error.tsx`
5. **Folder Structure**: Added `features/`, `layouts/`, `config/` directories

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Best Practices](https://nextjs.org/docs/app/building-your-application)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
