/**
 * Device Detection and Performance Optimization
 *
 * Detects device capabilities and adjusts performance settings
 * for particle systems and animations
 */

export interface DeviceCapabilities {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  performanceTier: 'low' | 'medium' | 'high';
  supportsWebGL: boolean;
  pixelRatio: number;
  maxTextureSize: number;
  isTouchDevice: boolean;
  isLowPowerMode: boolean;
  hardwareConcurrency: number;
  memoryGB: number | null;
}

export interface ParticleLODConfig {
  particleCount: number;
  effectRadius: number;
  updateFrequency: number; // ms
  enableAdvancedEffects: boolean;
  enableShadows: boolean;
  textureQuality: 'low' | 'medium' | 'high';
}

/**
 * Detect device type based on screen size and user agent
 */
export function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();

  // Check user agent
  const isMobile = /mobile|android|iphone|ipod|blackberry|windows phone/.test(userAgent);
  const isTablet = /tablet|ipad/.test(userAgent);

  // Check screen size
  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return isTablet ? 'tablet' : 'mobile';
  } else {
    return isMobile ? 'tablet' : 'desktop';
  }
}

/**
 * Check if device supports WebGL
 */
export function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Get maximum texture size supported by GPU
 */
export function getMaxTextureSize(): number {
  if (typeof window === 'undefined') return 2048;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

    if (gl) {
      return gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }
  } catch (e) {
    console.warn('Failed to get max texture size:', e);
  }

  return 2048; // Default fallback
}

/**
 * Detect if device is in low power mode (battery saving)
 */
export function isLowPowerMode(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Check Battery API (if available)
  if ('getBattery' in navigator) {
    // Battery API is deprecated but still useful
    return false; // We can't reliably detect low power mode
  }

  // Check for reduced motion preference (often enabled in low power mode)
  if (window.matchMedia) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion;
  }

  return false;
}

/**
 * Get hardware concurrency (CPU cores)
 */
export function getHardwareConcurrency(): number {
  if (typeof navigator === 'undefined') return 4;
  return navigator.hardwareConcurrency || 4;
}

/**
 * Get device memory (if available)
 */
export function getDeviceMemory(): number | null {
  if (typeof navigator === 'undefined') return null;

  // @ts-ignore - deviceMemory is not in TypeScript definitions
  const memory = navigator.deviceMemory;
  return typeof memory === 'number' ? memory : null;
}

/**
 * Calculate performance tier based on device capabilities
 */
export function calculatePerformanceTier(
  deviceType: string,
  cores: number,
  memory: number | null,
  webglSupport: boolean
): 'low' | 'medium' | 'high' {
  // Low tier criteria
  if (!webglSupport) return 'low';
  if (deviceType === 'mobile' && (memory === null || memory < 4)) return 'low';
  if (cores <= 2) return 'low';

  // High tier criteria
  if (deviceType === 'desktop' && cores >= 8 && (memory === null || memory >= 8)) return 'high';
  if (deviceType === 'desktop' && cores >= 4) return 'high';

  // Medium tier (default)
  return 'medium';
}

/**
 * Get complete device capabilities
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  const deviceType = detectDeviceType();
  const supportsWebGLFlag = supportsWebGL();
  const hardwareConcurrency = getHardwareConcurrency();
  const memoryGB = getDeviceMemory();

  return {
    deviceType,
    performanceTier: calculatePerformanceTier(
      deviceType,
      hardwareConcurrency,
      memoryGB,
      supportsWebGLFlag
    ),
    supportsWebGL: supportsWebGLFlag,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    maxTextureSize: getMaxTextureSize(),
    isTouchDevice: typeof window !== 'undefined' && 'ontouchstart' in window,
    isLowPowerMode: isLowPowerMode(),
    hardwareConcurrency,
    memoryGB,
  };
}

/**
 * Get Level of Detail (LOD) configuration based on device capabilities
 */
export function getParticleLODConfig(capabilities: DeviceCapabilities): ParticleLODConfig {
  const { performanceTier, deviceType, isLowPowerMode } = capabilities;

  // Low power mode overrides
  if (isLowPowerMode) {
    return {
      particleCount: 500,
      effectRadius: 100,
      updateFrequency: 100, // Update every 100ms
      enableAdvancedEffects: false,
      enableShadows: false,
      textureQuality: 'low',
    };
  }

  // Performance tier based configurations
  switch (performanceTier) {
    case 'high':
      return {
        particleCount: deviceType === 'desktop' ? 3000 : 2000,
        effectRadius: 200,
        updateFrequency: 16, // ~60fps
        enableAdvancedEffects: true,
        enableShadows: deviceType === 'desktop',
        textureQuality: 'high',
      };

    case 'medium':
      return {
        particleCount: deviceType === 'mobile' ? 800 : 1500,
        effectRadius: 150,
        updateFrequency: 33, // ~30fps
        enableAdvancedEffects: deviceType !== 'mobile',
        enableShadows: false,
        textureQuality: 'medium',
      };

    case 'low':
    default:
      return {
        particleCount: 500,
        effectRadius: 100,
        updateFrequency: 50, // ~20fps
        enableAdvancedEffects: false,
        enableShadows: false,
        textureQuality: 'low',
      };
  }
}

/**
 * Monitor performance and adjust LOD dynamically
 */
export class PerformanceMonitor {
  private frameTimeHistory: number[] = [];
  private readonly historySize = 60; // Track last 60 frames
  private lastFrameTime = 0;

  recordFrame(currentTime: number): void {
    if (this.lastFrameTime > 0) {
      const frameTime = currentTime - this.lastFrameTime;
      this.frameTimeHistory.push(frameTime);

      if (this.frameTimeHistory.length > this.historySize) {
        this.frameTimeHistory.shift();
      }
    }
    this.lastFrameTime = currentTime;
  }

  getAverageFPS(): number {
    if (this.frameTimeHistory.length === 0) return 60;

    const avgFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
    return 1000 / avgFrameTime;
  }

  shouldReduceQuality(targetFPS: number = 30): boolean {
    const avgFPS = this.getAverageFPS();
    return avgFPS < targetFPS;
  }

  shouldIncreaseQuality(targetFPS: number = 55): boolean {
    const avgFPS = this.getAverageFPS();
    return avgFPS > targetFPS && this.frameTimeHistory.length >= this.historySize;
  }

  reset(): void {
    this.frameTimeHistory = [];
    this.lastFrameTime = 0;
  }
}

/**
 * Log device capabilities for debugging
 */
export function logDeviceCapabilities(): void {
  const capabilities = getDeviceCapabilities();
  const lodConfig = getParticleLODConfig(capabilities);

  console.log('🖥️ Device Capabilities:', {
    deviceType: capabilities.deviceType,
    performanceTier: capabilities.performanceTier,
    webGL: capabilities.supportsWebGL ? '✅' : '❌',
    cores: capabilities.hardwareConcurrency,
    memory: capabilities.memoryGB ? `${capabilities.memoryGB}GB` : 'unknown',
    pixelRatio: capabilities.pixelRatio,
    lowPowerMode: capabilities.isLowPowerMode ? '🔋' : '⚡',
  });

  console.log('✨ Particle LOD Config:', {
    particles: lodConfig.particleCount,
    effectRadius: lodConfig.effectRadius,
    updateRate: `${1000 / lodConfig.updateFrequency}fps`,
    advancedEffects: lodConfig.enableAdvancedEffects ? '✅' : '❌',
    shadows: lodConfig.enableShadows ? '✅' : '❌',
    quality: lodConfig.textureQuality,
  });
}
