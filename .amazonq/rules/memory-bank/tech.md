# Technology Stack & Development Setup

## Programming Languages & Versions

### Primary Languages
- **TypeScript**: v5.x (strict mode enabled)
- **JavaScript**: ES2022+ (for legacy AI modules)
- **Python**: v3.x (utility scripts)

### Language Usage Patterns
- **TypeScript**: All new code, React components, API endpoints, type definitions
- **JavaScript**: Legacy AI pipeline modules, utility scripts
- **Python**: Data processing scripts, issue management automation

## Frontend Technology Stack

### Core Framework & Runtime
- **Next.js**: v15.4.7 (App Router, React Server Components)
- **React**: v18.3.1 (Functional components, hooks)
- **Node.js**: ≥20.11.0 (LTS requirement)
- **npm**: ≥10.0.0 (package management)

### UI & Styling
- **Tailwind CSS**: v4.1.16 (utility-first CSS framework)
- **shadcn/ui**: Radix UI based component library
- **Radix UI**: v1.x (accessible component primitives)
- **Lucide React**: v0.475.0 (icon library)
- **Framer Motion**: v11.0.0 (animations)
- **Three.js**: v0.180.0 (3D graphics for particle effects)

### AI & Data Processing
- **Google Genkit**: v1.20.0 (AI application framework)
- **Google Generative AI**: v0.8.0 (AI model integration)
- **Zod**: v3.25.76 (schema validation)
- **React Hook Form**: v7.54.2 (form management)

### Development & Build Tools
- **TypeScript**: v5.x (type checking)
- **ESLint**: v9.17.0 (code linting)
- **Prettier**: v3.6.2 (code formatting)
- **Vitest**: v2.1.8 (unit testing)
- **Playwright**: v1.49.1 (E2E testing)

## Backend Technology Stack

### Core Framework & Runtime
- **Express.js**: v4.18.2 (web application framework)
- **Node.js**: ≥20.0.0 (JavaScript runtime)
- **TypeScript**: v5.x (type safety)

### AI & Processing
- **Google Generative AI**: v0.24.1 (text analysis)
- **Zod**: v3.25.76 (input validation)
- **Drizzle ORM**: v0.44.7 (database operations)

### Security & Middleware
- **Helmet**: HTTP security headers
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting
- **Winston**: v3.11.0 (logging system)

## Build Systems & Package Management

### Package Management
- **pnpm**: v10.20.0 (workspace package manager)
- **npm**: ≥10.0.0 (fallback package manager)
- **Workspace Configuration**: pnpm-workspace.yaml

### Build Configuration
```json
{
  "engines": {
    "node": ">=20.11.0",
    "npm": ">=10.0.0"
  }
}
```

### Build Tools
- **Next.js Build**: Production optimization, static generation
- **TypeScript Compiler**: tsc for type checking and compilation
- **Bundle Analyzer**: @next/bundle-analyzer for size analysis
- **PostCSS**: CSS processing with autoprefixer and cssnano

## Development Commands & Scripts

### Frontend Development
```bash
# Development server (port 9002)
npm run dev

# AI development with Genkit
npm run genkit:dev
npm run genkit:watch

# Build and optimization
npm run build
npm run build:production
npm run analyze

# Testing
npm run test
npm run test:coverage
npm run e2e
npm run e2e:ui

# Code quality
npm run lint
npm run lint:fix
npm run format
npm run typecheck
```

### Backend Development
```bash
# Development server (port 3001)
npm run dev

# Build and production
npm run build
npm run start

# Testing and quality
npm run test
npm run test:coverage
npm run lint
npm run typecheck
```

### Monorepo Commands
```bash
# Start development environment
npm run start:dev

# Kill development processes
npm run kill:dev

# Workspace operations
pnpm --filter nextn [command]
```

## Testing Framework & Configuration

### Unit Testing (Vitest)
- **Framework**: Vitest v2.1.8
- **Coverage**: @vitest/coverage-v8
- **UI**: @vitest/ui for test interface
- **Configuration**: vitest.config.ts

### E2E Testing (Playwright)
- **Framework**: Playwright v1.49.1
- **Browsers**: Chromium, Firefox, WebKit
- **Configuration**: playwright.config.ts
- **Modes**: Headed, headless, debug, UI

### Testing Standards
- **Coverage Requirement**: ≥80% (lines, functions, branches)
- **Performance Tests**: @performance tagged tests
- **Accessibility Tests**: @a11y tagged tests

## Database & Data Management

### ORM & Database
- **Drizzle ORM**: v0.44.7 (type-safe database operations)
- **Drizzle Zod**: v0.8.3 (schema validation integration)
- **Configuration**: drizzle.config.ts

### File Processing
- **PDF**: pdfjs-dist v4.4.168
- **DOCX**: mammoth v1.7.0
- **Text Processing**: Custom utilities for dramatic text analysis

## Deployment & Infrastructure

### Frontend Deployment
- **Platform**: Firebase Hosting
- **Configuration**: firebase.json, apphosting.yaml
- **Build**: Static site generation with Next.js
- **CDN**: Firebase CDN for global distribution

### Backend Deployment
- **Runtime**: Node.js 20+ container
- **Environment**: Production environment variables
- **Monitoring**: Winston logging, Sentry error tracking

### CI/CD Pipeline
```bash
# Complete CI pipeline
npm run ci  # lint + typecheck + test + build + e2e

# Pre-commit hooks
npm run prepush  # lint + typecheck + test
```

## Monitoring & Analytics

### Error Tracking
- **Sentry**: v8.47.0 (error monitoring and performance)
- **Configuration**: sentry.*.config.ts files
- **Source Maps**: Automatic upload for debugging

### Performance Monitoring
- **Web Vitals**: v4.2.4 (Core Web Vitals tracking)
- **Bundle Analysis**: Size and performance optimization
- **Performance Reports**: Custom performance reporting scripts

## Development Environment Setup

### Required Tools
1. **Node.js**: v20.11.0+ (LTS)
2. **pnpm**: v10.20.0 (preferred package manager)
3. **Git**: Version control
4. **VS Code**: Recommended IDE with extensions

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key
ALLOWED_DEV_ORIGIN=https://your-dev-url  # for external dev environments

# Backend (.env)
GOOGLE_GENAI_API_KEY=your_api_key
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:9002
```

### IDE Configuration
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and TypeScript
- **Prettier**: Code formatting on save
- **Extensions**: TypeScript, ESLint, Prettier, Tailwind CSS IntelliSense