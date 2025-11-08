# The Copy - Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict TypeScript Configuration**: All files use strict TypeScript with comprehensive type definitions
- **Interface Definitions**: Complex objects use detailed TypeScript interfaces (e.g., `SidebarContext`, `AutoRefreshConfig`)
- **Type Safety**: Extensive use of type guards and proper typing for all function parameters and return values
- **Generic Types**: Proper use of generics for reusable components and utilities

### File Structure and Naming
- **Kebab-case for Files**: Component files use kebab-case (e.g., `particle-background-optimized.tsx`, `system-metrics-dashboard.tsx`)
- **PascalCase for Components**: React components use PascalCase naming convention
- **Descriptive Naming**: File names clearly indicate functionality and purpose
- **Test File Naming**: Test files follow `.test.ts` pattern with descriptive names

### Import Organization
- **Grouped Imports**: Imports organized in logical groups (React, external libraries, internal modules)
- **Absolute Imports**: Consistent use of `@/` path aliases for internal imports
- **Type-only Imports**: Proper use of `import type` for TypeScript types

## React Component Patterns

### Component Structure
- **Functional Components**: All components use React functional components with hooks
- **forwardRef Pattern**: Extensive use of `React.forwardRef` for component composition
- **Custom Hooks**: Complex logic extracted into custom hooks (e.g., `useSidebar`, `useMetrics`)
- **Compound Components**: Complex UI components broken into smaller, composable parts

### State Management
- **useState for Local State**: Local component state managed with `useState`
- **useContext for Shared State**: Shared state managed through React Context (e.g., `SidebarContext`)
- **useMemo for Performance**: Expensive calculations memoized with `useMemo`
- **useCallback for Functions**: Event handlers and functions memoized with `useCallback`

### Props and API Design
- **Flexible Props**: Components accept both controlled and uncontrolled patterns
- **Optional Props**: Extensive use of optional props with sensible defaults
- **Variant Props**: Components support multiple variants through props (e.g., `variant`, `size`)
- **Composition Props**: Support for `asChild` pattern for flexible composition

## Styling and UI Patterns

### CSS-in-JS and Tailwind
- **Tailwind CSS**: Primary styling approach using Tailwind utility classes
- **Class Variance Authority (CVA)**: Used for component variants and conditional styling
- **CSS Variables**: Custom CSS properties for theming and dynamic values
- **Responsive Design**: Mobile-first responsive design patterns

### Component Variants
- **Systematic Variants**: Components support multiple variants (default, outline, destructive, etc.)
- **Size Variants**: Consistent size system (sm, default, lg)
- **State Variants**: Visual states for different component states (active, disabled, loading)

## Performance Optimization

### React Performance
- **Memoization**: Strategic use of `useMemo` and `useCallback` for performance
- **Lazy Loading**: Components and resources loaded on demand
- **Batch Processing**: Large datasets processed in batches to prevent UI blocking
- **requestIdleCallback**: Background processing using browser idle time

### Resource Management
- **Memory Management**: Proper cleanup of resources and event listeners
- **Animation Optimization**: Performance-conscious animation implementations
- **Device Detection**: Adaptive behavior based on device capabilities
- **Reduced Motion**: Respect for user accessibility preferences

## Error Handling and Validation

### Error Boundaries
- **Comprehensive Error Handling**: Try-catch blocks around critical operations
- **User-Friendly Messages**: Error messages in Arabic with clear explanations
- **Graceful Degradation**: Fallback behavior when features fail
- **Error Recovery**: Retry mechanisms and recovery options

### Input Validation
- **Type Validation**: Runtime type checking for critical inputs
- **Boundary Checks**: Proper validation of numeric ranges and limits
- **Sanitization**: Input sanitization for security

## Testing Patterns

### Test Structure
- **Comprehensive Test Coverage**: Detailed test suites covering multiple scenarios
- **Mocking Strategy**: Proper mocking of external dependencies and services
- **Test Organization**: Tests organized by functionality with clear describe blocks
- **Edge Case Testing**: Testing of error conditions and edge cases

### Test Utilities
- **Mock Objects**: Comprehensive mock implementations for testing
- **Test Helpers**: Reusable test utilities and setup functions
- **Async Testing**: Proper handling of asynchronous operations in tests

## API and Service Patterns

### Service Architecture
- **Service Layer**: Clear separation between UI and business logic
- **WebSocket Integration**: Real-time communication patterns with proper error handling
- **Event-Driven Architecture**: Event-based communication between components
- **Queue Management**: Background job processing with progress tracking

### Data Fetching
- **Custom Hooks**: Data fetching logic encapsulated in custom hooks
- **Auto-refresh**: Configurable auto-refresh patterns for real-time data
- **Error States**: Proper handling of loading, error, and success states
- **Caching Strategy**: Intelligent caching and data invalidation

## Internationalization and Accessibility

### Arabic Language Support
- **RTL Support**: Right-to-left text direction support
- **Arabic Text**: UI text and messages in Arabic
- **Cultural Adaptation**: UI patterns adapted for Arabic users

### Accessibility
- **ARIA Labels**: Proper ARIA labels and accessibility attributes
- **Keyboard Navigation**: Full keyboard navigation support
- **Screen Reader Support**: Semantic HTML and proper labeling
- **Reduced Motion**: Respect for user motion preferences

## Code Documentation

### Comments and Documentation
- **JSDoc Comments**: Comprehensive function and component documentation
- **Inline Comments**: Explanatory comments for complex logic
- **Type Documentation**: Detailed TypeScript interface documentation
- **Usage Examples**: Clear examples of component usage

### Code Organization
- **Logical Grouping**: Related functionality grouped together
- **Clear Separation**: Distinct sections for different concerns
- **Consistent Formatting**: Uniform code formatting and style
- **Meaningful Names**: Descriptive variable and function names

## Security and Best Practices

### Security Measures
- **Input Sanitization**: Proper sanitization of user inputs
- **Type Safety**: TypeScript for compile-time safety
- **Error Boundaries**: Contained error handling to prevent crashes
- **Resource Cleanup**: Proper cleanup to prevent memory leaks

### Performance Best Practices
- **Bundle Optimization**: Code splitting and lazy loading
- **Memory Management**: Proper cleanup of resources and listeners
- **Efficient Algorithms**: Performance-conscious algorithm choices
- **Monitoring Integration**: Built-in performance monitoring and metrics