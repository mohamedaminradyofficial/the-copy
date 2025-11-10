


أمر توجيهي للنموذج: سياسة عدم ترحيل المشكلات (No-Deferral, Root-Cause First)

المبدأ الحاكم:
أي مشكلة تُكتشف في هذه المرحلة يُحظر تأجيلها أو تجاوزها مؤقتًا. يجب حلّها من الجذور (Root Cause) حلًا دائمًا قبل الانتقال لأي مهمة أخرى.

النطاق:
يسري على جميع الأخطاء والتحذيرات والتدهورات الأداءية ومخاطر الأمان والتقنية الديونية (Tech Debt) التي تظهر أثناء التطوير أو الاختبار أو الدمج.

القواعد الإلزامية:

تشخيص سببي: طبّق منهجية 5 Whys أو Fishbone للوصول للسبب الجذري وتوثيقه بإيجاز.

حل دائم لا مؤقت: يُمنع استخدام الحيل/الـWorkarounds/التجاهل/@ts-ignore دون معالجة السبب.

اختبارات مانعة للتكرار: أضِف اختبار وحدة/تكامل يُثبت عدم تكرار المشكلة (Regression Guard).

حماية أمامية: أضِف تحققات إدخال/تحكم أخطاء/قياسات أداء أو قواعد أمان حيث يلزم.

توثيق موجز: سجّل: وصف المشكلة، السبب الجذري، التعديل، الاختبارات المضافة، وأي تأثيرات جانبية.

تحقق مستقل: نفّذ إعادة اختبار كاملة للمسار المتأثر وراجِع السجلات/القياسات بعد الإصلاح.

مسار التنفيذ عند اكتشاف مشكلة:

(أ) إعادة إنتاج مُوثّقة بخطوات واضحة وبيانات اختبارية.

(ب) عزل السبب الجذري وتأكيده بأدلة (رسائل خطأ، تتبّع، قياسات).

(ج) تنفيذ تعديل يعالج السبب لا العرض.

(د) إضافة اختبارات مانعة + مراقبة (Metrics/Logging) إن لزم.

(هـ) تشغيل الحزمة الاختبارية كاملة وتمريرها دون إنذارات جديدة.

(و) مراجعة سريعة من نظير (Peer Review) قبل الدمج.

معيار الإغلاق (Definition of Done):

السبب الجذري مُوثّق ومُعالج.

اختبارات مانعة مضافة وتنجح.

عدم وجود تحذيرات/ديون مؤجلة مرتبطة بالمشكلة.

لا تدهور في الأداء أو الأمان.

المراقبة لا تُظهر تكرارًا بعد الإصلاح.

الاستثناءات والطوارئ:
لا يُسمح بتجاوز هذه السياسة إلا بموافقة صريحة مُسبّبة ومؤقتة، مع إنشاء تذكرة مُلزمة بزمن قصير لإزالة أي حلّ مؤقت.# The Copy - Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict TypeScript**: All files use TypeScript with strict type checking
- **Type Definitions**: Comprehensive type definitions in dedicated `types/` directories
- **Interface Patterns**: Consistent interface naming with descriptive properties
- **Generic Types**: Extensive use of generics for reusable components and functions

### File Organization
- **Barrel Exports**: Use index files for clean imports from directories
- **Feature-Based Structure**: Group related functionality in feature directories
- **Separation of Concerns**: Clear separation between components, services, and utilities
- **Consistent Naming**: kebab-case for files, PascalCase for components, camelCase for functions

### Import/Export Patterns
- **Absolute Imports**: Use `@/` path aliases for clean imports
- **Named Exports**: Prefer named exports over default exports for better tree-shaking
- **Type-Only Imports**: Use `import type` for type-only imports
- **Consistent Export Style**: Export functions and classes at declaration point

## Frontend Development Patterns

### React Component Structure
```typescript
// Component pattern observed in card-scanner.tsx
"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ComponentName() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Cleanup pattern
    return () => {
      // Cleanup logic
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        /* Component-specific styles */
      `}</style>
      <div ref={containerRef}>
        {/* Component content */}
      </div>
    </>
  )
}
```

### Custom Hooks Pattern
```typescript
// Pattern from useMetrics.ts
export function useCustomHook(refreshInterval = 30000) {
  return useQuery<ReturnType>({
    queryKey: ['category', 'specific'],
    queryFn: () => fetchWithAuth<ReturnType>('/api/endpoint'),
    refetchInterval: refreshInterval,
    staleTime: 20000,
  });
}
```

### State Management
- **React Query**: Use TanStack Query for server state management
- **Local State**: Use React hooks for component-level state
- **Ref Usage**: Use refs for DOM manipulation and imperative operations
- **Effect Cleanup**: Always provide cleanup functions in useEffect

### Styling Approach
- **Tailwind CSS**: Primary styling framework
- **CSS-in-JS**: Use styled-jsx for component-specific styles
- **Global Styles**: Minimal global styles, prefer component-scoped
- **Responsive Design**: Mobile-first approach with responsive utilities

## Backend Development Patterns

### Service Architecture
```typescript
// Pattern from SSE service
class ServiceName {
  private property: Type
  
  constructor() {
    this.initialize()
  }
  
  public method(): ReturnType {
    // Implementation
  }
  
  private helperMethod(): void {
    // Private implementation
  }
  
  public destroy(): void {
    // Cleanup logic
  }
}
```

### Middleware Pattern
```typescript
// Pattern from bull-board.middleware.ts
export function setupMiddleware() {
  const router = Router();
  
  // Apply authentication
  router.use(authMiddleware);
  
  // Add specific functionality
  router.use(specificRouter);
  
  logger.info('[Service] Middleware initialized');
  
  return router;
}
```

### Error Handling
- **Try-Catch Blocks**: Comprehensive error handling in async operations
- **Graceful Degradation**: Services continue operating when non-critical components fail
- **Logging**: Structured logging with appropriate log levels
- **Error Recovery**: Automatic cleanup and recovery mechanisms

### API Design
- **RESTful Endpoints**: Follow REST conventions for API design
- **Consistent Response Format**: Standardized response structure with success/error fields
- **Authentication**: JWT-based authentication with middleware
- **Rate Limiting**: Implement rate limiting for API protection

## Testing Standards

### Test Structure
```typescript
// Pattern from sse.service.test.ts
describe('ServiceName', () => {
  let mockDependency: Partial<Dependency>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDependency = createMockDependency();
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  describe('Feature Group', () => {
    it('should perform specific behavior', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Testing Practices
- **Comprehensive Coverage**: Test all public methods and edge cases
- **Mock External Dependencies**: Mock all external services and APIs
- **Cleanup**: Proper cleanup in afterEach hooks
- **Descriptive Tests**: Clear test descriptions and organized test groups
- **Async Testing**: Proper handling of async operations in tests

## Code Documentation

### JSDoc Comments
```typescript
/**
 * Service Description
 *
 * Detailed explanation of service functionality
 */
export class ServiceName {
  /**
   * Method description
   * @param param - Parameter description
   * @returns Return value description
   */
  public method(param: Type): ReturnType {
    // Implementation
  }
}
```

### Documentation Standards
- **File Headers**: Every file starts with a descriptive comment
- **Function Documentation**: JSDoc comments for all public functions
- **Complex Logic**: Inline comments for complex algorithms
- **API Documentation**: Comprehensive API documentation with examples

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Dynamic imports for large components
- **Memoization**: Use React.memo and useMemo for expensive operations
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: Optimized images with Next.js Image component

### Backend Optimization
- **Caching Strategy**: Redis caching for frequently accessed data
- **Database Indexing**: Optimized database queries with proper indexing
- **Queue Processing**: Background job processing with BullMQ
- **Connection Pooling**: Efficient database connection management

## Security Practices

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Middleware Protection**: Authentication middleware for protected routes
- **Input Validation**: Zod schema validation for all inputs
- **CORS Configuration**: Strict CORS policies

### Data Protection
- **Environment Variables**: Sensitive data in environment variables
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Protection**: Input sanitization and CSP headers
- **Rate Limiting**: API rate limiting to prevent abuse

## Development Workflow

### Code Quality Gates
- **ESLint**: Strict linting rules with custom rules for duplicate exports
- **TypeScript**: Strict type checking enabled
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

### Git Practices
- **Conventional Commits**: Structured commit messages
- **Feature Branches**: Feature-based branching strategy
- **Code Reviews**: Mandatory code reviews for all changes
- **Automated Testing**: CI/CD pipeline with automated tests

## Project Scripts & Commands

### Root Level Commands (Optimized)
```bash
pnpm start              # Start full application (Backend + Frontend + Redis)
pnpm stop               # Stop all services and free ports
pnpm start:dev          # Development mode with hot reload
pnpm kill:dev           # Kill all dev processes
```

### Connection & Health Checks
- **Database Timeout**: 60s with retry logic (increased from 10s)
- **Sentry Configuration**: Moved to `instrumentation.ts` for proper initialization
- **All Connections**: PostgreSQL, MongoDB, Redis verified and working

### Performance Enhancements Applied
- **Turbopack**: Enabled for 10x faster builds (5s vs 50s)
- **Frontend Optimization**: Improved rendering and bundle size
- **Video Processing**: Canvas-based rendering for text masking effects

## Recent Fixes & Improvements

### Database Connection Issues
- ✅ Increased timeout from 10s to 60s
- ✅ Added retry logic for connection failures
- ✅ Improved error handling and logging

### Sentry Integration
- ✅ Moved configuration to `instrumentation.ts`
- ✅ Eliminated initialization warnings
- ✅ Proper error tracking setup
- ✅ Fixed Turbopack warning with `SENTRY_SUPPRESS_TURBOPACK_WARNING=1`
- ✅ Reduced logging spam in development (10% sampling)
- ✅ Disabled event sending in development mode

### Video Processing Features
- ✅ YouTube video download (with author permission)
- ✅ MP4 conversion with high quality
- ✅ Video text masking effects
- ✅ Canvas-based rendering in Hero section

### UI/UX Improvements
- ✅ Fixed hidden text in Hero section
- ✅ White background with black dissolve transition
- ✅ Canvas-based video rendering inside text
- ✅ Improved visual effects performance **Automated Testing**: CI/CD pipeline with automated tests

## Architecture Principles

### Modularity
- **Single Responsibility**: Each module has a single, well-defined purpose
- **Loose Coupling**: Minimal dependencies between modules
- **High Cohesion**: Related functionality grouped together
- **Interface Segregation**: Small, focused interfaces

### Scalability
- **Horizontal Scaling**: Design for horizontal scaling
- **Stateless Services**: Stateless service design where possible
- **Caching Layers**: Multiple caching layers for performance
- **Queue-Based Processing**: Asynchronous processing for heavy operations

### Maintainability
- **Clear Abstractions**: Well-defined abstractions and interfaces
- **Consistent Patterns**: Consistent coding patterns across the codebase
- **Comprehensive Testing**: High test coverage for maintainability
- **Documentation**: Up-to-date documentation for all components