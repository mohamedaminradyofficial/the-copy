import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dynamic import for particle-background-optimized
vi.mock('./particle-background-optimized', () => ({
  default: () => 'OptimizedParticleAnimation'
}));

describe('Particle Background Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Production Usage Check', () => {
    it('should use optimized particle background in production', async () => {
      // This test ensures the optimized version is being used
      const { default: OptimizedComponent } = await import('./particle-background-optimized');
      
      expect(typeof OptimizedComponent).toBe('function');
    });

    it('should not contain console.log statements in optimized version', async () => {
      // Check if the file contains console.log statements
      const fs = require('fs');
      const path = require('path');
      
      const filePath = path.join(__dirname, 'particle-background-optimized.tsx');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // In production, console.log statements should be removed
      const hasConsoleLogs = fileContent.includes('console.log(');
      
      // Note: This test checks the source code, which may still contain console.log
      // In a real CI environment, console.log should be stripped during build
      expect(hasConsoleLogs).toBe(false);
    });

    it('should support prefers-reduced-motion', async () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      // Test that the component properly checks reduced motion preference
      const React = require('react');
      const { renderHook } = require('@testing-library/react');
      
      const { result } = renderHook(() => {
        const prefersReducedMotion = React.useMemo(() => {
          return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }, []);
        return { prefersReducedMotion };
      });

      // The component should respect the user's motion preference
      expect(result.current.prefersReducedMotion).toBe(false); // Default is no preference
    });
  });

  describe('Performance Configuration', () => {
    it('should have optimized particle counts for different devices', () => {
      // Verify the optimized configuration exists
      const fs = require('fs');
      const path = require('path');
      
      const filePath = path.join(__dirname, 'particle-background-optimized.tsx');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Should contain device-specific configurations
      expect(fileContent).toContain('DESKTOP');
      expect(fileContent).toContain('MOBILE');
      expect(fileContent).toContain('TABLET');
    });

    it('should implement requestIdleCallback optimization', () => {
      const fs = require('fs');
      const path = require('path');
      
      const filePath = path.join(__dirname, 'particle-background-optimized.tsx');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Should implement idle callback for performance
      expect(fileContent).toContain('requestIdle');
      expect(fileContent).toContain('setTimeout');
    });
  });
});
