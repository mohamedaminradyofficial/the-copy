# The Copy | Development Guidelines

## Code Quality Standards

### TypeScript Configuration
- **Strict Mode**: All TypeScript files use strict mode configuration
- **Type Safety**: Explicit typing required, no `any` types without justification
- **Interface Definitions**: Comprehensive interfaces for all data structures
- **Import Organization**: Absolute imports using `@/` path mapping

### File Structure Conventions
- **Component Files**: Use `.tsx` extension for React components
- **Service Files**: Use `.ts` extension with descriptive naming (e.g., `auth.service.ts`)
- **Test Files**: Use `.test.ts` or `.test.tsx` suffix
- **Type Definitions**: Centralized in dedicated `types/` directories

### Naming Conventions
- **Components**: PascalCase (e.g., `ScreenplayEditor`, `ParticleBackground`)
- **Functions**: camelCase with descriptive names (e.g., `handleKeyDown`, `calculateStats`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TOAST_LIMIT`, `STROKE_WIDTH`)
- **Files**: kebab-case for utilities, PascalCase for components
- **Variables**: camelCase with meaningful names

## React Development Patterns

### Component Architecture
- **Functional Components**: Exclusive use of function components with hooks
- **Props Interface**: Explicit interface definition for all component props
- **Default Props**: Use default parameters instead of defaultProps
- **Component Documentation**: JSDoc comments for complex components

### State Management
- **useState Hook**: Primary state management for component-level state
- **useRef Hook**: DOM references and mutable values that don't trigger re-renders
- **useEffect Hook**: Side effects with proper dependency arrays
- **Custom Hooks**: Reusable logic extraction (e.g., `useToast`)

### Event Handling
- **Inline Handlers**: Simple event handlers defined inline
- **Complex Handlers**: Extracted to separate functions with descriptive names
- **Keyboard Events**: Comprehensive keyboard shortcut support
- **Mouse Events**: Proper event object typing with React.MouseEvent

### Performance Optimizations
- **Dynamic Imports**: Large components loaded dynamically
- **Memoization**: Strategic use of React.memo for expensive components
- **Effect Dependencies**: Careful dependency array management
- **Cleanup Functions**: Proper cleanup in useEffect hooks

## Backend Development Patterns

### Service Layer Architecture
- **Service Classes**: Business logic encapsulated in service classes
- **Dependency Injection**: Services receive dependencies through constructor
- **Error Handling**: Consistent error throwing with descriptive messages
- **Method Organization**: Public methods for external use, private for internal logic

### Database Patterns
- **ORM Usage**: Drizzle ORM with type-safe queries
- **Query Building**: Fluent API pattern for complex queries
- **Transaction Handling**: Proper transaction management for data consistency
- **Schema Definitions**: Centralized schema definitions with proper typing

### Authentication & Security
- **JWT Tokens**: Secure token generation and verification
- **Password Hashing**: bcrypt with appropriate salt rounds
- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Messages**: User-friendly error messages in Arabic

### Testing Patterns
- **Unit Tests**: Comprehensive test coverage using Vitest
- **Mocking**: Strategic mocking of external dependencies
- **Test Organization**: Descriptive test suites with clear assertions
- **Error Testing**: Explicit testing of error conditions

## API Design Patterns

### Request/Response Structure
- **RESTful Endpoints**: Standard HTTP methods and status codes
- **JSON Responses**: Consistent JSON response format
- **Error Responses**: Standardized error response structure
- **Content Types**: Proper content-type headers

### Middleware Patterns
- **Authentication**: JWT verification middleware
- **Validation**: Request validation middleware
- **Logging**: Request/response logging
- **Error Handling**: Centralized error handling middleware

## UI/UX Development Standards

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **Component Variants**: Class variance authority for component variations
- **Responsive Design**: Mobile-first responsive design principles
- **Dark Mode**: Comprehensive dark mode support

### Accessibility Standards
- **ARIA Labels**: Proper ARIA labeling for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML structure
- **Focus Management**: Proper focus handling in modals and dialogs

### Internationalization
- **Arabic Support**: RTL (right-to-left) text direction support
- **Font Selection**: Arabic-optimized fonts (Amiri, Cairo)
- **Text Formatting**: Proper Arabic text formatting and typography
- **Cultural Considerations**: Arabic-specific UI patterns

## Error Handling Standards

### Frontend Error Handling
- **Try-Catch Blocks**: Comprehensive error catching in async operations
- **User Feedback**: Toast notifications for user-facing errors
- **Error Boundaries**: React error boundaries for component error isolation
- **Graceful Degradation**: Fallback UI states for error conditions

### Backend Error Handling
- **Custom Exceptions**: Domain-specific error classes
- **Error Logging**: Structured logging with Winston
- **HTTP Status Codes**: Appropriate status codes for different error types
- **Error Messages**: Localized error messages in Arabic

## Performance Guidelines

### Frontend Performance
- **Bundle Optimization**: Code splitting and lazy loading
- **Memory Management**: Proper cleanup of event listeners and timers
- **Rendering Optimization**: Efficient re-rendering strategies
- **Asset Optimization**: Optimized images and fonts

### Backend Performance
- **Database Optimization**: Efficient queries and indexing
- **Caching Strategies**: Strategic caching for frequently accessed data
- **Memory Usage**: Efficient memory usage patterns
- **Response Times**: Optimized response times for API endpoints

## Security Best Practices

### Data Protection
- **Input Sanitization**: Comprehensive input validation and sanitization
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Prevention**: Proper output encoding and CSP headers
- **CSRF Protection**: CSRF token implementation

### Authentication Security
- **Password Security**: Strong password hashing and validation
- **Token Security**: Secure JWT implementation with proper expiration
- **Session Management**: Secure session handling
- **Rate Limiting**: API rate limiting to prevent abuse

## Code Documentation

### Inline Documentation
- **JSDoc Comments**: Comprehensive function and class documentation
- **Type Annotations**: Clear type annotations for complex types
- **Code Comments**: Explanatory comments for complex logic
- **README Files**: Comprehensive README files for each module

### API Documentation
- **Endpoint Documentation**: Clear API endpoint documentation
- **Request/Response Examples**: Practical usage examples
- **Error Code Documentation**: Comprehensive error code reference
- **Integration Guides**: Step-by-step integration instructions

## Development Workflow

### Version Control
- **Commit Messages**: Descriptive commit messages with clear intent
- **Branch Naming**: Consistent branch naming conventions
- **Pull Requests**: Comprehensive pull request descriptions
- **Code Reviews**: Thorough code review process

### Testing Strategy
- **Unit Testing**: Comprehensive unit test coverage
- **Integration Testing**: API and component integration tests
- **E2E Testing**: End-to-end testing with Playwright
- **Performance Testing**: Performance benchmarking and monitoring

### Deployment Standards
- **Environment Configuration**: Proper environment variable management
- **Build Optimization**: Optimized production builds
- **Health Checks**: Comprehensive health check endpoints
- **Monitoring**: Application performance monitoring