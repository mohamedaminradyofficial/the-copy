# The Copy - Technology Stack

## Core Technologies

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 4.1+ with tailwindcss-animate
- **UI Components**: shadcn/ui + Radix UI primitives
- **State Management**: React Hooks and Context API
- **Build Tool**: Next.js built-in bundler with Turbopack

### Backend Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM with TypeScript
- **Caching**: Redis for session and data caching
- **Queue System**: BullMQ for background job processing

### AI & External Services
- **AI Provider**: Google Gemini API for Arabic text analysis
- **Alternative AI**: Mistral AI (@mistralai/mistralai ^1.10.0)
- **Real-time**: WebSocket + Server-Sent Events (SSE)

## Development Tools

### Package Management
- **Package Manager**: pnpm 10.20.0 (workspace-aware)
- **Workspace**: Monorepo with pnpm workspaces
- **Node Version**: Managed with .nvmrc (Node.js 20+)

### Code Quality
- **Linting**: ESLint with custom rules and TypeScript support
- **Formatting**: Prettier with custom configuration
- **Type Checking**: Strict TypeScript with custom type definitions
- **Style Linting**: Stylelint for CSS/SCSS validation

### Testing Framework
- **Unit Testing**: Vitest 4.0+ for fast unit tests
- **E2E Testing**: Playwright for end-to-end testing
- **Test Setup**: Custom test utilities and setup files
- **Coverage**: Built-in coverage reporting with Vitest

### Build & Optimization
- **Image Optimization**: Sharp 0.34+ for image processing
- **Bundle Analysis**: Custom scripts for bundle size monitoring
- **Performance Budget**: Automated performance budget enforcement
- **Code Splitting**: Next.js automatic code splitting

## Infrastructure & DevOps

### Containerization
- **Docker**: Multi-stage builds for production
- **Docker Compose**: Development environment orchestration
- **Base Images**: Node.js Alpine for minimal footprint

### Monitoring & Observability
- **Error Tracking**: Sentry for frontend and backend
- **Metrics**: Prometheus for application metrics
- **Dashboards**: Grafana for visualization
- **Performance**: Web Vitals integration with Sentry

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Workflows**: Lighthouse CI, performance budgets, security scans
- **Quality Gates**: Linting, type checking, and test coverage

## Database & Caching

### Database Configuration
- **Primary DB**: PostgreSQL with Neon Serverless
- **ORM**: Drizzle ORM with TypeScript schema
- **Migrations**: Automated database migrations
- **Performance**: Composite indexes for optimized queries

### Caching Strategy
- **Redis**: Session storage and data caching
- **Application Cache**: In-memory caching for frequently accessed data
- **CDN**: Static asset caching and optimization

## Security & Performance

### Security Measures
- **Authentication**: JWT-based authentication system
- **Validation**: Zod schema validation for all inputs
- **Rate Limiting**: Multi-level request throttling
- **CORS**: Strict cross-origin resource sharing policies
- **Helmet**: Security headers and CSP configuration

### Performance Optimizations
- **Database Indexes**: 8 composite indexes for optimal query performance
- **Queue Processing**: Background job processing with BullMQ
- **Bundle Optimization**: Code splitting and lazy loading
- **Image Optimization**: Automatic image compression and format conversion

## Development Commands

### Root Level Commands
```bash
pnpm start:dev          # Start development servers
pnpm kill:dev           # Stop all development processes
pnpm lint               # Run linting across workspace
pnpm test               # Run all tests
pnpm build              # Build all packages
pnpm ci                 # Full CI pipeline locally
```

### Frontend Commands
```bash
pnpm dev                # Start Next.js development server
pnpm build              # Build production bundle
pnpm start              # Start production server
pnpm test               # Run unit tests
pnpm test:e2e           # Run E2E tests
pnpm lint               # ESLint + Prettier
pnpm typecheck          # TypeScript type checking
```

### Backend Commands
```bash
pnpm dev                # Start Express development server
pnpm build              # Compile TypeScript
pnpm start              # Start production server
pnpm test               # Run unit tests with Vitest
pnpm db:push            # Push database schema changes
pnpm db:studio          # Open Drizzle Studio
```

## Environment Configuration

### Required Environment Variables
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Redis**: `REDIS_URL` for caching and sessions
- **AI Services**: `GEMINI_API_KEY` for Google Gemini API
- **Authentication**: `JWT_SECRET` for token signing
- **Monitoring**: `SENTRY_DSN` for error tracking

### Development Setup
- **Frontend**: Port 3000 (Next.js)
- **Backend**: Port 3001 (Express.js)
- **Database**: PostgreSQL (local or Neon)
- **Redis**: Port 6379 (Docker or local)
- **Monitoring**: Grafana on port 3002