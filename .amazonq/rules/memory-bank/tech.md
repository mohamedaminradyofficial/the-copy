# The Copy - Technology Stack

## Programming Languages
- **TypeScript 5.9+**: Primary language for both frontend and backend
- **JavaScript**: Legacy code and build scripts
- **SQL**: Database queries and migrations
- **Bash/PowerShell**: Build and deployment scripts

## Frontend Technology Stack

### Core Framework
- **Next.js 15.4.7**: React framework with App Router
- **React 18.3.1**: UI library with Server Components
- **TypeScript 5.x**: Type safety and developer experience

### Styling & UI
- **Tailwind CSS 4.1.16**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **Radix UI**: Headless UI primitives
- **Framer Motion 11.0**: Animation library
- **GSAP 3.13**: Advanced animations

### State Management & Data
- **TanStack Query 5.90**: Server state management
- **React Hook Form 7.54**: Form handling
- **Zod 3.25**: Schema validation
- **React Hooks**: Local state management

### Development Tools
- **ESLint 9.17**: Code linting
- **Prettier 3.6**: Code formatting
- **Vitest 2.1**: Unit testing
- **Playwright 1.49**: E2E testing
- **Lighthouse CI**: Performance monitoring

## Backend Technology Stack

### Core Framework
- **Node.js 20+**: Runtime environment
- **Express.js 4.18**: Web framework
- **TypeScript 5.x**: Type safety

### Database & ORM
- **PostgreSQL**: Primary database (Neon Serverless)
- **Drizzle ORM 0.44**: Type-safe database toolkit
- **Redis 5.9**: Caching and session storage

### Queue & Background Processing
- **BullMQ 5.63**: Job queue system
- **Bull Board 6.14**: Queue monitoring dashboard

### AI & External Services
- **Google Generative AI 0.24**: Gemini API integration
- **Genkit 1.20**: AI development framework

### Security & Monitoring
- **Helmet 7.1**: Security headers
- **CORS 2.8**: Cross-origin resource sharing
- **JWT**: Authentication tokens
- **bcrypt 6.0**: Password hashing
- **Sentry 10.23**: Error monitoring
- **Prometheus**: Metrics collection

### Development Tools
- **ESLint**: Code linting
- **Vitest 4.0**: Testing framework
- **tsc-watch**: TypeScript compilation
- **tsx**: TypeScript execution

## Development Environment

### Package Management
- **pnpm 10.20**: Fast, disk space efficient package manager
- **Monorepo**: Workspace-based project structure

### Build Tools
- **Next.js Build**: Frontend compilation and optimization
- **TypeScript Compiler**: Type checking and compilation
- **PostCSS**: CSS processing
- **Bundle Analyzer**: Bundle size analysis

### Development Commands

#### Root Level Commands
```bash
pnpm start:dev          # Start both frontend and backend
pnpm kill:dev           # Stop all development servers
pnpm lint               # Lint frontend code
pnpm test               # Run frontend tests
pnpm build              # Build frontend for production
```

#### Frontend Commands
```bash
pnpm dev                # Start development server
pnpm build              # Production build
pnpm start              # Start production server
pnpm lint               # ESLint checking
pnpm typecheck          # TypeScript checking
pnpm test               # Run unit tests
pnpm e2e                # Run E2E tests
pnpm lighthouse         # Performance audit
```

#### Backend Commands
```bash
pnpm dev                # Start development server with watch
pnpm build              # Compile TypeScript
pnpm start              # Start production server
pnpm test               # Run unit tests
pnpm lint               # ESLint checking
pnpm db:push            # Push database schema
pnpm db:studio          # Open Drizzle Studio
```

## Performance Optimizations

### Database
- **8 Composite Indexes**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Analyzed and optimized slow queries

### Caching Strategy
- **Redis Caching**: API response caching
- **Next.js Caching**: Static and dynamic content caching
- **Browser Caching**: Optimized cache headers

### Bundle Optimization
- **Code Splitting**: Dynamic imports and lazy loading
- **Tree Shaking**: Unused code elimination
- **Bundle Analysis**: Size monitoring and optimization

## Deployment & DevOps

### Containerization
- **Docker**: Container orchestration
- **Docker Compose**: Multi-service development

### CI/CD
- **GitHub Actions**: Automated testing and deployment
- **Husky**: Git hooks for quality gates
- **Lint-staged**: Pre-commit code quality checks

### Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Bull Board**: Queue monitoring

### Environment Management
- **Environment Variables**: Configuration management
- **dotenv**: Local environment configuration
- **Multiple Environments**: Development, staging, production

## Version Requirements
- **Node.js**: >=20.11.0
- **npm**: >=10.0.0
- **pnpm**: 10.20.0
- **TypeScript**: ^5.0.0
- **PostgreSQL**: Latest stable
- **Redis**: Latest stable