# Project Structure & Architecture

## Monorepo Organization
The Copy is organized as a pnpm workspace monorepo with clear separation of concerns:

```
the-copy/
├── frontend/          # Next.js application (main UI)
├── backend/           # Express.js API server
├── scripts/           # Utility scripts and automation
├── graphite-demo/     # Demo server implementation
└── .amazonq/          # AI assistant rules and memory bank
```

## Frontend Architecture (`/frontend`)

### Core Application Structure
```
src/
├── app/                    # Next.js App Router (v15.4.7)
│   ├── (main)/            # Route groups for main application
│   │   ├── analysis/      # Analysis tools and interfaces
│   │   ├── directors-studio/ # Director's studio workspace
│   │   └── editor/        # Screenplay editor interface
│   ├── api/               # API routes and endpoints
│   ├── layout.tsx         # Root layout component
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui component library
│   └── particle-background.tsx # 3D visual effects
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── types/           # TypeScript type definitions
│   ├── ai/              # AI helper functions
│   └── utils.ts         # General utilities
└── ai/                   # AI integration layer
    ├── flows/           # Genkit AI flow definitions
    ├── genkit.ts        # Genkit configuration
    └── dev.ts           # AI development tools
```

### AI Processing Pipeline
```
ai/
├── stations/              # 7-station analysis pipeline
│   ├── station1-text-analysis.js
│   ├── station2-conceptual-analysis.js
│   ├── station3-network-builder.js
│   ├── station4-efficiency-metrics.js
│   ├── station5-dynamic-symbolic-stylistic.js
│   ├── station6-diagnostics-treatment.js
│   └── station7-finalization.js
├── constitutional/        # Constitutional AI components
│   ├── multi-agent-debate.js
│   ├── principles.js
│   └── uncertainty-quantification.js
├── core/                 # Core AI models and pipeline
├── flows/                # Genkit flow definitions
├── interfaces/           # Response type definitions
└── services/             # AI service implementations
```

## Backend Architecture (`/backend`)

### API Server Structure
```
src/
├── config/               # Application configuration
│   └── env.ts           # Environment variable management
├── controllers/         # Request handling logic
│   └── analysis.controller.ts
├── middleware/          # Express middleware
│   └── index.ts        # CORS, Helmet, Rate limiting
├── services/           # Business logic layer
│   ├── analysis.service.ts
│   └── gemini.service.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── logger.ts       # Winston logger configuration
└── server.ts           # Application entry point
```

## Core Components & Relationships

### Frontend Components
- **ScreenplayEditor**: Main text editing interface with AI integration
- **ParticleBackground**: 3D visual effects using Three.js
- **UI Components**: shadcn/ui based component library
- **Analysis Tools**: Character analysis, theme extraction interfaces

### Backend Services
- **Analysis Service**: Core text analysis logic
- **Gemini Service**: Google AI integration layer
- **File Processing**: PDF, DOCX, TXT file handling
- **Security Middleware**: Authentication, rate limiting, validation

### AI Pipeline Architecture
- **Station-Based Processing**: Sequential analysis through 7 specialized stations
- **Constitutional AI**: Multi-agent debate system for balanced analysis
- **Network Analysis**: Character and theme relationship mapping
- **Metrics Calculation**: Efficiency and quality metrics for dramatic elements

## Architectural Patterns

### Frontend Patterns
- **App Router**: Next.js 15 App Router for file-based routing
- **Server Components**: React Server Components for performance
- **Client Components**: Interactive components with "use client" directive
- **Custom Hooks**: Reusable state logic and side effects
- **Component Composition**: Compound components with shadcn/ui

### Backend Patterns
- **Layered Architecture**: Controllers → Services → Utils separation
- **Middleware Pipeline**: Express middleware for cross-cutting concerns
- **Service Layer**: Business logic abstraction
- **Type Safety**: Full TypeScript with Zod validation
- **Error Handling**: Centralized error handling and logging

### AI Integration Patterns
- **Pipeline Architecture**: Sequential processing through specialized stations
- **Flow-Based Processing**: Genkit flows for AI operations
- **Service Abstraction**: AI services abstracted from business logic
- **Constitutional AI**: Multi-agent systems for balanced analysis

## Development Environment
- **Monorepo Management**: pnpm workspace with shared dependencies
- **Development Servers**: Frontend (port 9002), Backend (port 3001)
- **Hot Reloading**: Next.js dev server with fast refresh
- **Type Checking**: Shared TypeScript configuration
- **Code Quality**: ESLint, Prettier, Husky git hooks

## Build & Deployment Architecture
- **Frontend Build**: Next.js static generation and optimization
- **Backend Build**: TypeScript compilation to JavaScript
- **Asset Optimization**: Bundle analysis, tree shaking, code splitting
- **Deployment**: Firebase Hosting for frontend, containerized backend
- **Monitoring**: Sentry error tracking, Web Vitals performance monitoring