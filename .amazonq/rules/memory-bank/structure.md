# The Copy - Project Structure

## Architecture Overview
The Copy is a full-stack monorepo application with separate frontend and backend services, following a microservices-oriented architecture with shared utilities and comprehensive tooling.

## Directory Structure

### Root Level
```
k:\New folder (48)/
├── frontend/          # Next.js 15 React application
├── backend/           # Express.js API server
├── docs/             # Comprehensive documentation
├── scripts/          # Build and maintenance scripts
├── monitoring/       # Grafana/Prometheus configuration
├── redis/            # Redis server binaries and config
├── slidingcarousel/  # Standalone carousel component demo
└── .amazonq/         # AI assistant rules and memory bank
```

### Frontend Structure (`frontend/`)
```
frontend/
├── src/
│   ├── app/                    # Next.js 15 App Router pages
│   │   ├── (main)/            # Main application routes
│   │   │   ├── directors-studio/  # Directors Studio feature
│   │   │   └── seven-stations/    # Seven Stations Analysis
│   │   ├── api/               # API route handlers
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── card-scanner/     # Document scanning components
│   │   └── [feature-specific]/
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and configurations
│   ├── types/                # TypeScript type definitions
│   ├── ai/                   # AI integration (Genkit)
│   └── workers/              # Web Workers for heavy processing
├── public/                   # Static assets
├── tests/                    # Test suites (unit, e2e)
└── docs/                     # Frontend-specific documentation
```

### Backend Structure (`backend/`)
```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   ├── services/            # Business logic layer
│   ├── middleware/          # Express middleware
│   ├── db/                  # Database schema and migrations
│   ├── queues/              # BullMQ job processors
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript definitions
│   └── config/              # Configuration management
├── db-performance-analysis/ # Database optimization tools
├── migrations/              # Database migration scripts
└── docs/                    # Backend documentation
```

## Core Components

### Frontend Components
- **Directors Studio**: Project management interface with tabs for scenes, characters, shots
- **Seven Stations Analysis**: AI-powered dramatic analysis interface
- **Card Scanner**: Document upload and processing components
- **UI Components**: shadcn/ui based design system with Arabic RTL support

### Backend Services
- **Project Service**: CRUD operations for projects, scenes, characters
- **Analysis Service**: AI integration for dramatic analysis
- **Queue Service**: Background job processing with BullMQ
- **SSE Service**: Server-sent events for real-time updates
- **Cache Service**: Redis-based caching layer

### Database Schema
- **Projects**: Main project entities with metadata
- **Scenes**: Individual scenes within projects
- **Characters**: Character definitions and tracking
- **Shots**: Shot planning and organization
- **Users**: Authentication and user management
- **Analysis Results**: Cached AI analysis results

## Architectural Patterns

### Frontend Patterns
- **App Router**: Next.js 15 file-based routing
- **Server Components**: React Server Components for performance
- **Client Components**: Interactive components with state management
- **Custom Hooks**: Reusable logic abstraction
- **Component Composition**: Modular, reusable component design

### Backend Patterns
- **MVC Architecture**: Controllers, Services, Models separation
- **Middleware Pipeline**: Express middleware for cross-cutting concerns
- **Queue Processing**: Asynchronous job processing with BullMQ
- **Caching Strategy**: Multi-level caching with Redis
- **Event-Driven**: Real-time updates via WebSocket + SSE

### Data Flow
1. **Frontend** → API calls → **Backend Controllers**
2. **Controllers** → **Services** → **Database/Cache**
3. **Background Jobs** → **Queue Processors** → **External APIs**
4. **Real-time Updates** → **SSE/WebSocket** → **Frontend**

## Integration Points
- **AI Services**: Google Gemini API for analysis
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis for session and data caching
- **Monitoring**: Sentry for error tracking, Prometheus for metrics
- **File Storage**: Local file system with CDN integration
- **Real-time**: WebSocket + Server-Sent Events for live updates