# The Copy | Project Structure

## Root Directory Organization
```
the-copy-/
├── frontend/           # Next.js application (port 9002)
├── backend/            # Express.js API server (port 3001)
├── Arabic Creative Writing Studio/  # Standalone writing tools
├── .amazonq/           # Amazon Q configuration and rules
├── .idx/               # IDX development environment
└── scripts/            # Development and deployment scripts
```

## Frontend Architecture (`/frontend`)

### Core Application Structure
```
src/
├── app/                # Next.js App Router
│   ├── (main)/        # Main application routes
│   │   ├── editor/    # Screenplay editor interface
│   │   ├── analysis/  # Seven-stations analysis UI
│   │   ├── development/ # Creative development tools
│   │   └── brainstorm/ # Collaborative workspace
│   └── api/           # API route handlers
├── components/        # Reusable UI components
├── lib/               # Core libraries and utilities
└── hooks/             # Custom React hooks
```

### AI System Architecture
```
lib/ai/
├── stations/          # Seven analysis stations
├── drama-analyst/     # Specialized AI agents (17+ agents)
│   ├── agents/       # Individual agent implementations
│   ├── orchestration/ # Agent coordination
│   └── services/     # Supporting services
├── constitutional/    # AI safety and validation
└── interfaces/       # Type definitions and contracts
```

### Key Components & Relationships

#### Analysis Pipeline
- **Orchestrator**: Coordinates seven-station analysis sequence
- **Stations**: Individual analysis modules (1-7)
- **Agents**: Specialized AI workers for specific tasks
- **RAG System**: Context retrieval and text chunking

#### UI System
- **Main Navigation**: Central hub connecting four systems
- **Station Interface**: Seven-stations analysis UI
- **Editor Components**: Screenplay writing interface
- **Report Viewers**: Analysis result presentation

## Backend Architecture (`/backend`)

### Service Layer Organization
```
src/
├── controllers/       # Request handlers
├── services/         # Business logic
├── middleware/       # Authentication & validation
├── db/              # Database schema and connections
├── utils/           # Utility functions
└── types/           # TypeScript definitions
```

### Core Services
- **Analysis Service**: Manages AI analysis pipeline
- **Auth Service**: User authentication and sessions
- **Gemini Service**: Google AI integration
- **Database Service**: PostgreSQL operations

## Architectural Patterns

### Frontend Patterns
- **App Router**: Next.js 15 file-based routing
- **Component Composition**: Radix UI + custom components
- **State Management**: React hooks + context
- **Dynamic Loading**: Code splitting for performance
- **Type Safety**: Strict TypeScript configuration

### Backend Patterns
- **RESTful API**: Express.js with structured endpoints
- **Service Layer**: Business logic separation
- **Middleware Chain**: Authentication, validation, logging
- **Database ORM**: Drizzle with type-safe queries

### AI Integration Patterns
- **Agent Factory**: Dynamic agent instantiation
- **Pipeline Orchestration**: Sequential station processing
- **Constitutional AI**: Safety and validation layers
- **Multi-Agent Debate**: Collaborative decision making

## Data Flow Architecture

### Analysis Workflow
1. **Input**: User submits screenplay text
2. **Orchestration**: Pipeline coordinator initiates stations
3. **Processing**: Seven stations analyze different aspects
4. **Aggregation**: Results compiled into comprehensive report
5. **Output**: Formatted analysis delivered to frontend

### Development Workflow
1. **Analysis Input**: Receives analysis report + original text
2. **Agent Processing**: Development agents apply recommendations
3. **Style Preservation**: Maintains author's unique voice
4. **Iterative Refinement**: Multiple improvement cycles
5. **Final Output**: Enhanced screenplay version

## Integration Points

### Frontend ↔ Backend
- **API Endpoints**: `/api/analysis/`, `/api/health/`
- **Real-time Updates**: WebSocket connections for long-running processes
- **File Handling**: Document upload and processing

### AI Service Integration
- **Gemini API**: Google AI model integration
- **Agent Coordination**: Multi-agent system management
- **Context Management**: RAG system for relevant information retrieval

## Security & Performance

### Security Layers
- **Authentication**: JWT-based user sessions
- **Input Validation**: Zod schema validation
- **Rate Limiting**: API request throttling
- **CORS Configuration**: Cross-origin request management

### Performance Optimizations
- **Code Splitting**: Dynamic imports for large components
- **Caching**: Service-level caching for AI responses
- **Bundle Analysis**: Webpack bundle optimization
- **Memory Management**: Efficient resource utilization