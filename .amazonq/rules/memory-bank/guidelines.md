# Development Guidelines & Patterns

## Code Quality Standards

### TypeScript Implementation Patterns
- **Strict Type Safety**: All new code uses TypeScript with strict mode enabled
- **Interface Definitions**: Comprehensive type definitions in dedicated `types/` directories
- **Zod Schema Validation**: Input validation using Zod schemas with custom error messages in Arabic
- **Generic Type Usage**: Extensive use of generic types for reusable components and functions

### Code Structure & Organization
- **Modular Architecture**: Clear separation between components, services, utilities, and types
- **Barrel Exports**: Index files for clean imports (`export * from './module'`)
- **Functional Components**: React functional components with hooks over class components
- **Service Layer Pattern**: Business logic abstracted into service classes with dependency injection

### Naming Conventions
- **File Naming**: kebab-case for files (`screenplay-editor.tsx`, `particle-background.tsx`)
- **Component Naming**: PascalCase for React components (`ScreenplayEditor`, `ParticleBackground`)
- **Variable Naming**: camelCase for variables and functions (`currentFormat`, `handleKeyDown`)
- **Constant Naming**: SCREAMING_SNAKE_CASE for constants (`ACTION_VERB_LIST`, `STROKE_WIDTH`)
- **Class Naming**: PascalCase for classes (`ScreenplayClassifier`, `NetworkDiagnostics`)

### Documentation Standards
- **JSDoc Comments**: Comprehensive function documentation with parameter and return types
- **Inline Comments**: Arabic and English comments for complex logic
- **README Files**: Detailed documentation in both Arabic and English
- **Type Annotations**: Explicit type annotations for complex types and interfaces

## Architectural Patterns

### Frontend Architecture (Next.js)
- **App Router Pattern**: Next.js 15 App Router with route groups `(main)`
- **Server Components**: React Server Components for performance optimization
- **Client Components**: Explicit `"use client"` directive for interactive components
- **Custom Hooks**: Reusable state logic extracted into custom hooks
- **Component Composition**: Compound components using shadcn/ui patterns

### Backend Architecture (Express.js)
- **Layered Architecture**: Controllers → Services → Utils separation
- **Middleware Pipeline**: Express middleware for cross-cutting concerns
- **Error Handling**: Centralized error handling with Winston logging
- **Input Validation**: Zod schema validation at API boundaries
- **Service Abstraction**: Business logic abstracted from HTTP concerns

### AI Integration Patterns
- **Station-Based Processing**: Sequential AI processing through specialized stations
- **Flow-Based Architecture**: Genkit flows for AI operations
- **Service Abstraction**: AI services abstracted from business logic
- **Constitutional AI**: Multi-agent systems for balanced analysis
- **Pipeline Orchestration**: Coordinated execution of AI processing stages

## Security Implementation

### Input Validation & Sanitization
- **HTML Sanitization**: DOMParser and manual sanitization to prevent XSS
- **Command Injection Prevention**: Subprocess calls without `shell=True`
- **Input Validation**: Zod schemas for all user inputs
- **File Upload Security**: Type checking and content validation for uploaded files
- **SQL Injection Prevention**: Parameterized queries and ORM usage

### Security Headers & Middleware
- **Helmet Integration**: HTTP security headers configuration
- **CORS Configuration**: Strict CORS policies with environment-specific origins
- **Rate Limiting**: Express rate limiting middleware
- **Content Security Policy**: CSP headers for XSS prevention
- **Authentication Middleware**: Secure session management

### Error Handling & Logging
- **Winston Logging**: Structured logging with different levels
- **Error Boundaries**: React error boundaries for graceful failure
- **Sentry Integration**: Error tracking and performance monitoring
- **Safe Error Messages**: No sensitive information in error responses

## Testing Patterns

### Unit Testing (Vitest)
- **Test Structure**: Describe/it blocks with clear test descriptions
- **Mock Patterns**: Service mocking with dependency injection
- **Type Testing**: Zod schema validation testing
- **Edge Case Testing**: Boundary value testing and error conditions
- **Coverage Requirements**: 80%+ coverage for lines, functions, and branches

### E2E Testing (Playwright)
- **Page Object Model**: Reusable page objects for UI interactions
- **Test Data Management**: Isolated test data for each test
- **Accessibility Testing**: A11y tests with `@a11y` tags
- **Performance Testing**: Performance tests with `@performance` tags
- **Cross-Browser Testing**: Chromium, Firefox, and WebKit support

### Integration Testing
- **API Testing**: Full request/response cycle testing
- **Database Testing**: Transaction rollback for test isolation
- **File System Testing**: Temporary directories for file operations
- **External Service Mocking**: Mock external API dependencies

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Dynamic imports for large components
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: Next.js Image component usage
- **Lazy Loading**: React.lazy for non-critical components
- **Memoization**: React.memo and useMemo for expensive operations

### Backend Performance
- **Database Optimization**: Efficient queries with proper indexing
- **Caching Strategies**: In-memory caching for frequently accessed data
- **Connection Pooling**: Database connection pooling
- **Compression**: Gzip/Brotli compression for responses
- **Rate Limiting**: API rate limiting to prevent abuse

### AI Processing Optimization
- **Batch Processing**: Efficient batch processing for AI operations
- **Caching**: AI response caching for repeated queries
- **Streaming**: Streaming responses for long-running AI operations
- **Resource Management**: Memory and CPU optimization for AI workloads

## Internationalization (i18n)

### Language Support
- **Primary Language**: Arabic (RTL) as primary language
- **Secondary Language**: English (LTR) support
- **Direction Handling**: Proper RTL/LTR text direction handling
- **Font Selection**: Arabic-optimized fonts (Amiri, Cairo, Noto Sans Arabic)
- **Cultural Adaptation**: Arabic-specific UI patterns and conventions

### Text Processing
- **Arabic Text Normalization**: Tashkeel removal and separator normalization
- **Character Recognition**: Arabic character pattern matching
- **Bidirectional Text**: Proper handling of mixed Arabic/English text
- **Number Conversion**: Eastern to Western digit conversion

## Development Workflow

### Git Workflow
- **Branch Naming**: Feature branches with descriptive names
- **Commit Messages**: Conventional commit format with clear descriptions
- **Pull Request Process**: Code review requirements and CI checks
- **Branch Protection**: Protected main branch with required status checks

### CI/CD Pipeline
- **Automated Testing**: Full test suite on every commit
- **Type Checking**: TypeScript compilation checks
- **Linting**: ESLint and Prettier formatting checks
- **Security Scanning**: Automated security vulnerability scanning
- **Deployment**: Automated deployment to staging and production

### Code Review Standards
- **Review Checklist**: Security, performance, and maintainability checks
- **Documentation Review**: Ensure adequate documentation
- **Test Coverage**: Verify test coverage meets requirements
- **Breaking Changes**: Identify and document breaking changes

## Error Handling Patterns

### Frontend Error Handling
- **Error Boundaries**: React error boundaries for component failures
- **Graceful Degradation**: Fallback UI for failed components
- **User Feedback**: Clear error messages in user's language
- **Retry Logic**: Automatic retry for transient failures
- **Loading States**: Proper loading and error state management

### Backend Error Handling
- **Structured Errors**: Consistent error response format
- **Error Classification**: Different handling for different error types
- **Logging**: Comprehensive error logging with context
- **Circuit Breakers**: Prevent cascading failures
- **Timeout Handling**: Proper timeout configuration for external calls

### AI Processing Error Handling
- **Fallback Strategies**: Default responses when AI fails
- **Retry Logic**: Exponential backoff for AI service calls
- **Graceful Degradation**: Reduced functionality when AI unavailable
- **Error Recovery**: Automatic recovery from transient AI failures

## Code Examples & Patterns

### React Component Pattern
```typescript
interface ComponentProps {
  onAction?: () => void;
}

export default function Component({ onAction }: ComponentProps) {
  const [state, setState] = useState<string>("");
  
  const handleEvent = useCallback(() => {
    // Event handling logic
  }, []);
  
  return (
    <div className="component">
      {/* Component JSX */}
    </div>
  );
}
```

### Service Class Pattern
```typescript
class ServiceClass {
  constructor(private dependency: Dependency) {}
  
  async processData(input: InputType): Promise<OutputType> {
    // Service logic
  }
}
```

### Error Handling Pattern
```typescript
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error("Operation failed", { error: error.message });
  return { success: false, error: "Operation failed" };
}
```

### Zod Validation Pattern
```typescript
const schema = z.object({
  field: z.string().min(1, "Field is required"),
});

const validateInput = (input: unknown) => {
  return schema.parse(input);
};
```

These guidelines ensure consistent, secure, and maintainable code across the entire project while supporting both Arabic and English languages effectively.