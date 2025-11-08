# The Copy - Project Structure

## Monorepo Architecture
The project follows a monorepo structure with clear separation between frontend, backend, and shared resources.

## Root Directory Structure

### Core Applications
- **`frontend/`** - Next.js 14 React application with TypeScript
- **`backend/`** - Express.js API server with TypeScript and Drizzle ORM
- **`monitoring/`** - Grafana dashboards and Prometheus configuration

### Documentation & Guides
- **`docs/`** - Comprehensive documentation including performance optimization guides
- **`scripts/`** - Automation scripts for maintenance, testing, and deployment
- **`.github/`** - GitHub Actions workflows and CI/CD configuration

### Configuration Files
- **`pnpm-workspace.yaml`** - Monorepo workspace configuration
- **`docker-compose.prometheus.yml`** - Monitoring stack setup
- **`tsconfig.json`** - Root TypeScript configuration

## Frontend Structure (`frontend/`)

### Application Core
- **`src/app/`** - Next.js App Router pages and layouts
- **`src/components/`** - Reusable React components with shadcn/ui
- **`src/lib/`** - Utility functions and shared logic
- **`src/hooks/`** - Custom React hooks
- **`src/types/`** - TypeScript type definitions

### Specialized Modules
- **`src/ai/`** - AI integration and Gemini API handling
- **`src/workers/`** - Web Workers for background processing
- **`public/`** - Static assets including fonts, images, and PDF workers

### Development Tools
- **`tests/`** - Unit tests, E2E tests, and test utilities
- **`scripts/`** - Build optimization and performance analysis scripts
- **`docs/`** - Frontend-specific documentation

## Backend Structure (`backend/`)

### Application Core
- **`src/controllers/`** - API route handlers and business logic
- **`src/services/`** - Business services and external integrations
- **`src/db/`** - Database schema and Drizzle ORM configuration
- **`src/middleware/`** - Express middleware for auth, validation, etc.

### Infrastructure
- **`src/queues/`** - BullMQ job queues for background processing
- **`src/config/`** - Application configuration and environment setup
- **`src/utils/`** - Utility functions and helpers
- **`migrations/`** - Database migration files

### Performance & Analysis
- **`db-performance-analysis/`** - Database optimization tools and reports
- **`drizzle/`** - Drizzle ORM metadata and generated files

## Key Architectural Patterns

### Separation of Concerns
- **Frontend**: UI/UX, client-side logic, user interactions
- **Backend**: API endpoints, business logic, data processing
- **Database**: Data persistence with PostgreSQL and Redis caching

### Real-time Communication
- **WebSocket**: Bidirectional real-time communication
- **Server-Sent Events (SSE)**: Server-to-client streaming updates
- **Queue System**: Background job processing with BullMQ

### Performance Architecture
- **Caching Layer**: Redis for frequently accessed data
- **Database Optimization**: Composite indexes and query optimization
- **Bundle Optimization**: Code splitting and lazy loading
- **CDN Integration**: Static asset optimization

### Security Architecture
- **Authentication**: JWT-based user authentication
- **Authorization**: Role-based access control
- **Data Validation**: Zod schema validation
- **Rate Limiting**: Multi-level request throttling

## Development Workflow

### Package Management
- **pnpm**: Workspace-aware package manager
- **Shared Dependencies**: Common packages managed at root level
- **Workspace Scripts**: Cross-package command execution

### Build System
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Express.js with TypeScript compilation
- **Containerization**: Docker support for deployment

### Quality Assurance
- **Linting**: ESLint with custom rules for code quality
- **Type Checking**: Strict TypeScript configuration
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Performance**: Bundle analysis and performance budgets