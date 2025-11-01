# The Copy | Technology Stack

## Core Technologies

### Frontend Stack
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5+ (Strict mode)
- **Styling**: Tailwind CSS 3.4.1 + tailwindcss-animate
- **UI Components**: Radix UI primitives
- **State Management**: React 18.3.1 hooks + context
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: pnpm 9.15.4

### Backend Stack
- **Runtime**: Node.js ≥20.11.0
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5+
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM 0.44.7
- **Authentication**: JWT + bcrypt
- **File Processing**: Mammoth (DOCX) + PDF.js

### AI & ML Integration
- **Primary AI**: Google Gemini AI (@google/generative-ai 0.24.1)
- **AI Framework**: Genkit 1.20.0 (@genkit-ai/google-genai)
- **Agent System**: Custom multi-agent architecture
- **Context Management**: RAG (Retrieval-Augmented Generation)

## Development Environment

### Required Versions
```json
{
  "node": ">=20.11.0",
  "npm": ">=10.0.0",
  "pnpm": "9.15.4"
}
```

### Environment Setup
```bash
# Frontend development
cd frontend
pnpm install
pnpm dev  # Runs on http://localhost:9002

# Backend development  
cd backend
npm install
cp .env.example .env  # Add Google AI key
npm run dev  # Runs on http://localhost:3001
```

### Key Development Commands

#### Frontend Commands
```bash
pnpm dev                    # Development server
pnpm build                  # Production build
pnpm build:production       # Production build with optimizations
pnpm test                   # Run Vitest unit tests
pnpm test:coverage          # Test coverage report
pnpm e2e                    # Playwright E2E tests
pnpm lint                   # ESLint validation
pnpm typecheck              # TypeScript validation
pnpm analyze                # Bundle analysis
```

#### Backend Commands
```bash
npm run dev                 # Development with watch mode
npm run dev:mcp             # MCP server development
npm run build               # TypeScript compilation
npm run test                # Vitest unit tests
npm run test:coverage       # Coverage report
npm run lint                # ESLint validation
npm run db:generate         # Generate database migrations
npm run db:push             # Push schema changes
```

## Testing Infrastructure

### Frontend Testing
- **Unit Tests**: Vitest 2.1.8 + @testing-library/react
- **E2E Tests**: Playwright 1.49.1
- **Coverage**: @vitest/coverage-v8
- **Test Environment**: jsdom 27.0.1

### Backend Testing
- **Unit Tests**: Vitest 4.0.2
- **API Testing**: Supertest 7.1.3
- **Coverage**: @vitest/coverage-v8 4.0.2
- **Test Database**: In-memory SQLite for tests

### Quality Assurance
- **Linting**: ESLint 9.17.0 with TypeScript rules
- **Formatting**: Prettier 3.6.2
- **Type Checking**: TypeScript strict mode
- **Pre-commit**: Husky 9.1.7 + lint-staged

## Database & Storage

### Database Configuration
- **Provider**: Neon PostgreSQL (serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Migrations**: Drizzle Kit 0.31.6
- **Connection**: @neondatabase/serverless 1.0.2

### File Storage
- **Documents**: Local file system + cloud storage
- **Processing**: Mammoth (DOCX), PDF.js (PDF)
- **Upload**: Multer 2.0.2 middleware

## Security & Performance

### Security Stack
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcrypt 6.0.0
- **Session Management**: express-session 1.18.2
- **Security Headers**: Helmet 7.1.0
- **Rate Limiting**: express-rate-limit 7.1.5
- **CORS**: cors 2.8.5

### Performance Optimizations
- **Compression**: compression 1.7.4
- **Bundle Analysis**: @next/bundle-analyzer
- **Code Splitting**: Dynamic imports
- **Caching**: Service-level caching
- **Memory**: Node.js --max-old-space-size=4096

## Deployment & Monitoring

### Deployment Stack
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions
- **Environment**: Firebase App Hosting
- **Monitoring**: Sentry 8.47.0

### Development Tools
- **IDE**: VS Code with TypeScript support
- **Git Hooks**: Husky pre-commit validation
- **Package Management**: pnpm workspaces
- **Build Analysis**: Bundle analyzer + performance reports

## API Integration

### External Services
- **AI Provider**: Google Gemini AI
- **Database**: Neon PostgreSQL
- **Monitoring**: Sentry error tracking
- **Analytics**: Web Vitals 4.2.4

### Internal APIs
- **Health Check**: `/api/health`
- **Analysis Pipeline**: `/api/analysis/seven-stations`
- **Screenplay Review**: `/api/review-screenplay`

## Configuration Files

### Key Configuration
- **TypeScript**: `tsconfig.json` (strict mode)
- **ESLint**: `.eslintrc.json` (TypeScript rules)
- **Prettier**: `.prettierrc` (formatting rules)
- **Tailwind**: `tailwind.config.ts` (design system)
- **Next.js**: `next.config.ts` (build configuration)
- **Vitest**: `vitest.config.ts` (test configuration)
- **Playwright**: `playwright.config.ts` (E2E configuration)