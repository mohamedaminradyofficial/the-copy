"use client";

import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import type { ParticleVelocity, ParticlePosition, EffectConfig } from "./particle-effects";
import {
  applySparkEffect,
  applyWaveEffect,
  applyVortexEffect,
  applyDefaultEffect,
  calculateWaveColor,
  calculateVortexColor,
  performanceMonitor,
} from "./particle-effects";
import {
  getDeviceCapabilities,
  getParticleLODConfig,
  logDeviceCapabilities,
} from "./device-detection";

type Effect = "default" | "spark" | "wave" | "vortex";

/**
 * Get optimal particle configuration using device detection
 */
function getOptimalParticleCount(): { count: number; batchSize: number; config: any } {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { count: 3000, batchSize: 400, config: null };
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return { count: 0, batchSize: 0, config: null };
  }

  // Use device detection system
  const capabilities = getDeviceCapabilities();
  const lodConfig = getParticleLODConfig(capabilities);

  // Calculate batch size based on particle count (20-25% of total)
  const batchSize = Math.floor(lodConfig.particleCount * 0.22);

  // Log device capabilities in development
  if (process.env.NODE_ENV === 'development') {
    logDeviceCapabilities();
  }

  return {
    count: lodConfig.particleCount,
    batchSize: batchSize,
    config: lodConfig,
  };
}

/**
 * Enhanced requestIdleCallback with fallback
 */
const requestIdle = (callback: (deadline: any) => void, options?: any): number => {
  if (typeof requestIdleCallback !== 'undefined') {
    return requestIdleCallback(callback, options);
  } else {
    return setTimeout(() => callback({
      timeRemaining: () => Math.max(0, 50),
      didTimeout: false
    }), options?.timeout || 0) as any;
  }
};

export default function OptimizedParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentEffect: Effect = "spark";

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  }, []);

  // Scene reference with all necessary data
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    points: THREE.Points;
    geometry: THREE.BufferGeometry;
    originalPositions: Float32Array;
    velocities: Float32Array;
    phases: Float32Array;
    intersectionPoint: THREE.Vector3 | null;
    rotationX: number;
    rotationY: number;
    isDragging: boolean;
    previousMouseX: number;
    previousMouseY: number;
    particleCount: number;
    isGenerated: boolean;
  } | null>(null);

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };

  // Distance to box with rounded corners
  const sdBox = (
    px: number, py: number, bx: number, by: number, r: number
  ): number => {
    const dx = Math.abs(px) - bx;
    const dy = Math.abs(py) - by;
    return (
      Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) +
      Math.min(Math.max(dx, dy), 0) - r
    );
  };

  // Distance to circle
  const sdCircle = (
    px: number, py: number, cx: number, cy: number, r: number
  ): number => {
    return Math.hypot(px - cx, py - cy) - r;
  };

  // Distance to ring (hollow circle)
  const sdRing = (
    px: number, py: number, cx: number, cy: number, r: number, thickness: number
  ): number => {
    return Math.abs(sdCircle(px, py, cx, cy, r)) - thickness;
  };

  // Distance to line segment (capsule)
  const sdSegment = (
    px: number, py: number,
    ax: number, ay: number,
    bx: number, by: number,
    r: number
  ): number => {
    const pax = px - ax;
    const pay = py - ay;
    const bax = bx - ax;
    const bay = by - ay;
    const h = clamp((pax * bax + pay * bay) / (bax * bax + bay * bay), 0, 1);
    const dx = pax - bax * h;
    const dy = pay - bay * h;
    return Math.sqrt(dx * dx + dy * dy) - r;
  };

  // Distance to arc
  const sdArc = (
    px: number, py: number,
    cx: number, cy: number, r: number,
    startAngle: number, endAngle: number,
    thickness: number
  ): number => {
    const dx = px - cx;
    const dy = py - cy;
    const angle = Math.atan2(dy, dx);

    let normAngle = angle;
    while (normAngle < startAngle) normAngle += Math.PI * 2;
    while (normAngle > endAngle + Math.PI * 2) normAngle -= Math.PI * 2;

    const clampedAngle = clamp(normAngle, startAngle, endAngle);
    const targetX = cx + Math.cos(clampedAngle) * r;
    const targetY = cy + Math.sin(clampedAngle) * r;

    return Math.hypot(px - targetX, py - targetY) - thickness;
  };

  // SDF boolean operations
  const opUnion = (a: number, b: number): number => Math.min(a, b);
  const opSubtract = (a: number, b: number): number => Math.max(a, -b);

  // Character definitions for "the-copy" text
  const STROKE_WIDTH = 0.035;
  const BASELINE = 0.0;
  const X_HEIGHT = 0.35;
  const ASCENDER_HEIGHT = 0.65;
  const DESCENDER_DEPTH = -0.25;
  const ARABIC_HEIGHT = 0.45;

  // Letters SDF definitions (simplified for performance)
  const dist_t = (px: number, py: number): number => {
    const x = -1.7;
    const stem = sdSegment(px, py, x, BASELINE + ASCENDER_HEIGHT - 0.05, x, BASELINE, STROKE_WIDTH);
    const crossbar = sdSegment(px, py, x - 0.15, BASELINE + ASCENDER_HEIGHT, x + 0.15, BASELINE + ASCENDER_HEIGHT, STROKE_WIDTH);
    return opUnion(stem, crossbar);
  };

  const dist_h = (px: number, py: number): number => {
    const x = -1.25;
    const stem = sdSegment(px, py, x, BASELINE + ASCENDER_HEIGHT, x, BASELINE, STROKE_WIDTH);
    const shoulder = sdArc(px, py, x, BASELINE + X_HEIGHT * 0.8, 0.22, -Math.PI / 2, 0, STROKE_WIDTH);
    const rightLeg = sdSegment(px, py, x + 0.22, BASELINE + X_HEIGHT * 0.8, x + 0.22, BASELINE, STROKE_WIDTH);
    return opUnion(opUnion(stem, shoulder), rightLeg);
  };

  const dist_e = (px: number, py: number): number => {
    const cx = -0.6;
    const cy = BASELINE + X_HEIGHT * 0.5;
    const r = 0.2;
    let ring = sdRing(px, py, cx, cy, r, STROKE_WIDTH);
    const cutBox = sdBox(px - (cx + r * 0.5), py - cy, 0.15, 0.14, 0);
    ring = opSubtract(ring, cutBox);
    const bar = sdSegment(px, py, cx - r, cy, cx + r * 0.7, cy, STROKE_WIDTH);
    return opUnion(ring, bar);
  };

  const dist_c = (px: number, py: number): number => {
    const cx = 0.0;
    const cy = BASELINE + X_HEIGHT * 0.5;
    const r = 0.2;
    let ring = sdRing(px, py, cx, cy, r, STROKE_WIDTH);
    const cutBox = sdBox(px - (cx + r * 0.5), py - cy, 0.15, 0.14, 0);
    return opSubtract(ring, cutBox);
  };

  const dist_o = (px: number, py: number): number => {
    const cx = 0.5;
    const cy = BASELINE + X_HEIGHT * 0.5;
    const r = 0.2;
    return sdRing(px, py, cx, cy, r, STROKE_WIDTH);
  };

  const dist_p = (px: number, py: number): number => {
    const x = 1.0;
    const cy = BASELINE + X_HEIGHT * 0.5;
    const stem = sdSegment(px, py, x, BASELINE + X_HEIGHT, x, BASELINE + DESCENDER_DEPTH, STROKE_WIDTH);
    const bowl = sdRing(px, py, x + 0.2, cy, 0.17, STROKE_WIDTH);
    return opUnion(stem, bowl);
  };

  const dist_y = (px: number, py: number): number => {
    const x = 1.9;
    const top = BASELINE + X_HEIGHT;
    const mid = BASELINE + X_HEIGHT * 0.2;
    const leftArm = sdSegment(px, py, x - 0.15, top, x, mid, STROKE_WIDTH);
    const rightArm = sdSegment(px, py, x + 0.15, top, x, mid, STROKE_WIDTH);
    const descender = sdSegment(px, py, x, mid, x + 0.05, BASELINE + DESCENDER_DEPTH, STROKE_WIDTH);
    return opUnion(opUnion(leftArm, rightArm), descender);
  };

  const dist_dash = (px: number, py: number): number => {
    const x = 2.4;
    return sdSegment(px, py, x - 0.1, BASELINE + X_HEIGHT * 0.5, x + 0.1, BASELINE + X_HEIGHT * 0.5, STROKE_WIDTH * 0.8);
  };

  const dist_alef = (px: number, py: number): number => {
    const x = 2.9;
    const stem = sdSegment(px, py, x, BASELINE + ARABIC_HEIGHT * 0.95, x, BASELINE, STROKE_WIDTH * 1.2);
    const base = sdSegment(px, py, x - 0.03, BASELINE, x + 0.03, BASELINE, STROKE_WIDTH * 1.5);
    return opUnion(stem, base);
  };

  const dist_lam = (px: number, py: number): number => {
    const x = 3.3;
    const stem = sdSegment(px, py, x, BASELINE + ARABIC_HEIGHT * 0.95, x, BASELINE + 0.08, STROKE_WIDTH * 1.2);
    const hook = sdArc(px, py, x - 0.12, BASELINE + 0.08, 0.12, 0, Math.PI / 2, STROKE_WIDTH * 1.1);
    const hookEnd = sdSegment(px, py, x - 0.24, BASELINE, x - 0.15, BASELINE, STROKE_WIDTH);
    return opUnion(opUnion(stem, hook), hookEnd);
  };

  const dist_noon = (px: number, py: number): number => {
    const x = 3.75;
    const cy = BASELINE + ARABIC_HEIGHT * 0.4;
    const mainArc = sdArc(px, py, x, cy, 0.18, -Math.PI * 0.15, Math.PI * 0.85, STROKE_WIDTH * 1.1);
    const connector = sdSegment(px, py, x - 0.17, cy - 0.05, x - 0.08, BASELINE + 0.02, STROKE_WIDTH);
    const base = sdSegment(px, py, x - 0.08, BASELINE + 0.02, x + 0.1, BASELINE, STROKE_WIDTH);
    const dot = sdCircle(px, py, x, cy + 0.28, 0.035);
    return opUnion(opUnion(opUnion(mainArc, connector), base), dot);
  };

  const dist_seen = (px: number, py: number): number => {
    const x = 4.25;
    const baseY = BASELINE + 0.02;
    const toothHeight = ARABIC_HEIGHT * 0.35;
    const baseLine = sdSegment(px, py, x - 0.28, baseY, x + 0.28, baseY, STROKE_WIDTH * 1.1);
    const tooth1 = sdArc(px, py, x - 0.18, baseY + toothHeight * 0.6, 0.1, Math.PI * 0.9, Math.PI * 0.1, STROKE_WIDTH);
    const tooth2 = sdArc(px, py, x, baseY + toothHeight * 0.8, 0.12, Math.PI * 0.9, Math.PI * 0.1, STROKE_WIDTH);
    const tooth3 = sdArc(px, py, x + 0.18, baseY + toothHeight * 0.6, 0.1, Math.PI * 0.9, Math.PI * 0.1, STROKE_WIDTH);
    const connect1 = sdSegment(px, py, x - 0.18, baseY, x - 0.18, baseY + toothHeight * 0.5, STROKE_WIDTH * 0.8);
    const connect2 = sdSegment(px, py, x, baseY, x, baseY + toothHeight * 0.7, STROKE_WIDTH * 0.8);
    const connect3 = sdSegment(px, py, x + 0.18, baseY, x + 0.18, baseY + toothHeight * 0.5, STROKE_WIDTH * 0.8);
    return opUnion(opUnion(opUnion(opUnion(opUnion(opUnion(baseLine, tooth1), tooth2), tooth3), connect1), connect2), connect3);
  };

  const dist_khaa = (px: number, py: number): number => {
    const x = 4.75;
    const cy = BASELINE + ARABIC_HEIGHT * 0.4;
    const mainArc = sdArc(px, py, x, cy, 0.2, Math.PI * 0.6, Math.PI * 2.4, STROKE_WIDTH * 1.1);
    const rightConnect = sdSegment(px, py, x + 0.15, cy - 0.12, x + 0.12, BASELINE, STROKE_WIDTH);
    const leftConnect = sdSegment(px, py, x - 0.15, cy - 0.12, x - 0.08, BASELINE, STROKE_WIDTH);
    const dot = sdCircle(px, py, x, cy + 0.28, 0.035);
    return opUnion(opUnion(opUnion(mainArc, rightConnect), leftConnect), dot);
  };

  const dist_taa_marbouta = (px: number, py: number): number => {
    const x = 5.2;
    const cy = BASELINE + ARABIC_HEIGHT * 0.4;
    let circle = sdRing(px, py, x, cy, 0.17, STROKE_WIDTH * 1.1);
    const opening = sdBox(px - x, py - (cy - 0.05), 0.08, 0.08, 0);
    circle = opSubtract(circle, opening);
    const dot1 = sdCircle(px, py, x - 0.07, cy + 0.28, 0.03);
    const dot2 = sdCircle(px, py, x + 0.07, cy + 0.28, 0.03);
    return opUnion(opUnion(circle, dot1), dot2);
  };

  // Combine all letters
  const dist_all = (px: number, py: number): number => {
    return Math.min(
      dist_t(px, py), dist_h(px, py), dist_e(px, py), dist_c(px, py),
      dist_o(px, py), dist_p(px, py), dist_y(px, py), dist_dash(px, py),
      dist_alef(px, py), dist_lam(px, py), dist_noon(px, py),
      dist_seen(px, py), dist_khaa(px, py), dist_taa_marbouta(px, py)
    );
  };

  const dist = (px: number, py: number): number => dist_all(px, py);

  /**
   * Generate particles in batches using requestIdleCallback
   */
  const generateParticlesInBatches = async (): Promise<{
    positions: Float32Array;
    colors: Float32Array;
    count: number;
    originalPositions: Float32Array;
    phases: Float32Array;
    velocities: Float32Array;
    lodConfig: any;
  }> => {
    try {
      // Get optimal particle count based on device capabilities
      const particleConfig = getOptimalParticleCount();

      // If no particles should be rendered (reduced motion preference)
      if (particleConfig.count === 0) {
        return {
          positions: new Float32Array(0),
          colors: new Float32Array(0),
          count: 0,
          originalPositions: new Float32Array(0),
          phases: new Float32Array(0),
          velocities: new Float32Array(0),
          lodConfig: null,
        };
      }

      const numParticles = particleConfig.count;
      const batchSize = particleConfig.batchSize;
      const thickness = 0.15;

      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);

      // Sampling bounds
      const minX = -2.1;
      const maxX = 5.6;
      const minY = -0.4;
      const maxY = 0.85;

      let generatedCount = 0;
      const maxAttempts = 3000000;
      let attempts = 0;
      let batchAttempts = 0;
      const maxBatchAttempts = 50000;

      const processBatch = (): Promise<void> => {
        return new Promise((resolve) => {
          let batchGenerated = 0;
          
          while (batchGenerated < batchSize && 
                 generatedCount < numParticles && 
                 attempts < maxAttempts &&
                 batchAttempts < maxBatchAttempts) {
            
            attempts++;
            batchAttempts++;
            
            const x = Math.random() * (maxX - minX) + minX;
            const y = Math.random() * (maxY - minY) + minY;
            const z = Math.random() * thickness - thickness / 2;

            const d = dist(x, y);
            const threshold = x > 2.5 ? 0.015 : 0.01;

            if (d <= threshold) {
              const idx = generatedCount * 3;
              positions[idx] = x;
              positions[idx + 1] = y;
              positions[idx + 2] = z;
              colors[idx] = 1;
              colors[idx + 1] = 1;
              colors[idx + 2] = 1;
              generatedCount++;
              batchGenerated++;
            }
          }

          if (generatedCount < numParticles && 
              attempts < maxAttempts && 
              batchAttempts < maxBatchAttempts) {
            requestIdle(() => resolve(), { timeout: 100 });
          } else {
            resolve();
          }
        });
      };

      // Process all batches
      while (generatedCount < numParticles && attempts < maxAttempts) {
        await processBatch();
      }

      // If SDF sampling produced too few points, fall back to a simple starfield
      if (generatedCount < 200) {
        const fallbackCount = Math.min(numParticles, 3000);
        for (let j = 0; j < fallbackCount; j++) {
          const idx = j * 3;
          positions[idx] = (Math.random() - 0.5) * 6;
          positions[idx + 1] = (Math.random() - 0.5) * 3.5;
          positions[idx + 2] = (Math.random() - 0.5) * 0.3;
          colors[idx] = 1;
          colors[idx + 1] = 1;
          colors[idx + 2] = 1;
        }
        generatedCount = fallbackCount;
      }

      // Create final arrays
      const finalPositions = positions.slice(0, generatedCount * 3);
      const finalColors = colors.slice(0, generatedCount * 3);
      const originalPositions = positions.slice(0, generatedCount * 3);
      const phases = new Float32Array(generatedCount);
      const velocities = new Float32Array(generatedCount * 3);

      for (let j = 0; j < generatedCount; j++) {
        phases[j] = Math.random() * Math.PI * 2;
      }

      return {
        positions: finalPositions,
        colors: finalColors,
        count: generatedCount,
        originalPositions,
        phases,
        velocities,
        lodConfig: particleConfig.config,
      };

    } catch (error) {
      console.error('❌ خطأ في توليد الجسيمات:', error);
      throw error;
    }
  };

  /**
   * Update camera position based on rotation
   */
  const updateCameraPosition = (camera: THREE.PerspectiveCamera, rotationX: number, rotationY: number): void => {
    camera.position.x = Math.sin(rotationY) * 3.5;
    camera.position.z = Math.cos(rotationY) * 3.5;
    camera.position.y = rotationX * 0.5;
    camera.lookAt(0, 0, 0);
  };

  /**
   * Apply attraction to original position
   */
  const applyAttraction = (
    position: ParticlePosition,
    target: { x: number; y: number; z: number },
    velocity: ParticleVelocity,
    attractStrength: number
  ): ParticleVelocity => {
    return {
      vx: velocity.vx + (target.x - position.px) * attractStrength,
      vy: velocity.vy + (target.y - position.py) * attractStrength,
      vz: velocity.vz + (target.z - position.pz) * attractStrength,
    };
  };

  /**
   * Apply damping to velocity
   */
  const applyDamping = (velocity: ParticleVelocity, damping: number): ParticleVelocity => {
    return {
      vx: velocity.vx * damping,
      vy: velocity.vy * damping,
      vz: velocity.vz * damping,
    };
  };

  /**
   * Update position based on velocity
   */
  const updatePosition = (position: ParticlePosition, velocity: ParticleVelocity): ParticlePosition => {
    return {
      px: position.px + velocity.vx,
      py: position.py + velocity.vy,
      pz: position.pz + velocity.vz,
    };
  };

  /**
   * Calculate particle color based on effect
   */
  const calculateParticleColor = (
    effect: Effect,
    position: ParticlePosition,
    intersection: THREE.Vector3 | null,
    effectRadius: number,
    time: number
  ): { r: number; g: number; b: number } => {
    if (!intersection) {
      return { r: 1, g: 1, b: 1 };
    }

    const intersectionPoint = { x: intersection.x, y: intersection.y, z: intersection.z };

    if (effect === "wave") {
      return calculateWaveColor(position, intersectionPoint, effectRadius, time);
    }
    if (effect === "vortex") {
      return calculateVortexColor(position, intersectionPoint, effectRadius, time);
    }

    return { r: 1, g: 1, b: 1 };
  };

  /**
   * Apply particle effect using lookup strategy
   */
  const applyParticleEffect = (
    effect: Effect,
    position: ParticlePosition,
    intersection: THREE.Vector3,
    velocity: ParticleVelocity,
    config: EffectConfig,
    time: number
  ): ParticleVelocity => {
    const intersectionPoint = { x: intersection.x, y: intersection.y, z: intersection.z };

    switch (effect) {
      case "spark":
        return applySparkEffect(position, intersectionPoint, velocity, config);
      case "wave":
        return applyWaveEffect(position, intersectionPoint, velocity, config, time);
      case "vortex":
        return applyVortexEffect(position, intersectionPoint, velocity, config);
      case "default":
        return applyDefaultEffect(position, intersectionPoint, velocity, config);
    }
  };

  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;
    
    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) {
      console.log('[ParticleAnimation] Skipping animation - user prefers reduced motion');
      return;
    }

    const canvas = canvasRef.current;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // Initialize geometry (will be updated after particle generation)
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      size: 0.008,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    camera.position.set(0, 0, 3.2);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Initialize scene reference
    sceneRef.current = {
      scene,
      camera,
      renderer,
      points,
      geometry,
      originalPositions: new Float32Array(0),
      velocities: new Float32Array(0),
      phases: new Float32Array(0),
      intersectionPoint: null,
      rotationX: 0,
      rotationY: 0,
      isDragging: false,
      previousMouseX: 0,
      previousMouseY: 0,
      particleCount: 0,
      isGenerated: false,
    };

    // Generate particles asynchronously
    generateParticlesInBatches()
      .then((result) => {
        if (!sceneRef.current) return;

        const { positions, colors, count, originalPositions, phases, velocities, lodConfig } = result;

        // Update geometry
        sceneRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        sceneRef.current.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        // Update scene reference
        sceneRef.current.originalPositions = originalPositions;
        sceneRef.current.phases = phases;
        sceneRef.current.velocities = velocities;
        sceneRef.current.particleCount = count;
        sceneRef.current.isGenerated = true;

        // Log LOD configuration for debugging
        if (process.env.NODE_ENV === 'development' && lodConfig) {
          console.log('🎨 Particle LOD Applied:', {
            particles: count,
            effectRadius: lodConfig.effectRadius,
            updateFrequency: `${1000 / lodConfig.updateFrequency}fps`,
            advancedEffects: lodConfig.enableAdvancedEffects,
          });
        }
      })
      .catch((error) => {
        console.error('❌ فشل في توليد الجسيمات:', error);
      });

    // Mouse interaction handlers
    const handleCanvasMouseMove = (event: MouseEvent) => {
      if (!sceneRef.current) return;

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      sceneRef.current.intersectionPoint = intersection;
    };

    const handleMouseLeave = () => {
      if (sceneRef.current) {
        sceneRef.current.intersectionPoint = null;
      }
    };

    canvas.addEventListener("mousemove", handleCanvasMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop with batch processing
    const animate = () => {
      if (!sceneRef.current || !sceneRef.current.isGenerated) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const currentTime = performance.now();
      const time = currentTime * 0.001;

      // Record frame for performance monitoring
      performanceMonitor.recordFrame(currentTime);

      const {
        scene,
        camera,
        renderer,
        geometry,
        originalPositions,
        velocities,
        intersectionPoint,
        rotationX,
        rotationY,
        particleCount,
      } = sceneRef.current;

      const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
      const colorAttribute = geometry.getAttribute("color") as THREE.BufferAttribute;

      const config: EffectConfig = {
        effectRadius: 0.5,
        repelStrength: 0.08,
      };
      const attractStrength = 0.15;
      const damping = 0.92;

      // Apply rotation
      updateCameraPosition(camera, rotationX, rotationY);

      // Process particles in batches for better performance
      const processParticlesInBatches = (batchSize: number = 800) => {
        let currentIndex = 0;
        
        const processBatch = () => {
          const endIndex = Math.min(currentIndex + batchSize, particleCount);
          
          for (let j = currentIndex; j < endIndex; j++) {
            const idx = j * 3;
            const position: ParticlePosition = {
              px: positionAttribute.getX(j),
              py: positionAttribute.getY(j),
              pz: positionAttribute.getZ(j),
            };

            const target = {
              x: originalPositions[idx] ?? 0,
              y: originalPositions[idx + 1] ?? 0,
              z: originalPositions[idx + 2] ?? 0,
            };

            let velocity: ParticleVelocity = {
              vx: velocities[idx] ?? 0,
              vy: velocities[idx + 1] ?? 0,
              vz: velocities[idx + 2] ?? 0,
            };

            // Apply effect based on mouse interaction
            if (intersectionPoint) {
              try {
                velocity = applyParticleEffect(
                  currentEffect,
                  position,
                  intersectionPoint,
                  velocity,
                  config,
                  time
                );
              } catch (error) {
                console.warn('خطأ في تأثير الجسيم:', error);
              }
            }

            // Attract back to original position
            velocity = applyAttraction(position, target, velocity, attractStrength);
            velocity = applyDamping(velocity, damping);

            // Update position
            const newPos = updatePosition(position, velocity);
            positionAttribute.setXYZ(j, newPos.px, newPos.py, newPos.pz);

            velocities[idx] = velocity.vx;
            velocities[idx + 1] = velocity.vy;
            velocities[idx + 2] = velocity.vz;

            // Calculate and apply color
            try {
              const color = calculateParticleColor(
                currentEffect,
                newPos,
                intersectionPoint,
                config.effectRadius,
                time
              );
              colorAttribute.setXYZ(j, color.r, color.g, color.b);
            } catch (error) {
              console.warn('خطأ في حساب لون الجسيم:', error);
            }
          }

          currentIndex = endIndex;

          if (currentIndex < particleCount) {
            requestAnimationFrame(processBatch);
          } else {
            // Update data and render
            positionAttribute.needsUpdate = true;
            colorAttribute.needsUpdate = true;

            renderer.render(scene, camera);

            // Performance monitoring (log FPS every 60 frames in development)
            if (process.env.NODE_ENV === 'development') {
              const frameCount = performanceMonitor['frameTimeHistory']?.length || 0;
              if (frameCount > 0 && frameCount % 60 === 0) {
                const avgFPS = performanceMonitor.getAverageFPS();
                console.log(`⚡ Particle Performance: ${avgFPS.toFixed(1)} FPS`);
              }
            }

            // Schedule next frame
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        processBatch();
      };

      processParticlesInBatches();
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);

    // Mouse drag handlers
    const handleMouseDown = (event: React.MouseEvent) => {
      if (!sceneRef.current) return;
      sceneRef.current.isDragging = true;
      sceneRef.current.previousMouseX = event.clientX;
      sceneRef.current.previousMouseY = event.clientY;
    };

    const handleMouseMove = (event: React.MouseEvent) => {
      if (!sceneRef.current || !sceneRef.current.isDragging) return;

      const deltaX = event.clientX - sceneRef.current.previousMouseX;
      const deltaY = event.clientY - sceneRef.current.previousMouseY;

      sceneRef.current.rotationY -= deltaX * 0.005;
      sceneRef.current.rotationX -= deltaY * 0.005;

      sceneRef.current.previousMouseX = event.clientX;
      sceneRef.current.previousMouseY = event.clientY;
    };

    const handleMouseUp = () => {
      if (sceneRef.current) {
        sceneRef.current.isDragging = false;
      }
    };

    // Touch handlers
    const handleTouchStart = (event: React.TouchEvent) => {
      if (!sceneRef.current || !event.touches[0]) return;
      sceneRef.current.isDragging = true;
      sceneRef.current.previousMouseX = event.touches[0].clientX;
      sceneRef.current.previousMouseY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: React.TouchEvent) => {
      if (!sceneRef.current || !sceneRef.current.isDragging || !event.touches[0]) return;

      const deltaX = event.touches[0].clientX - sceneRef.current.previousMouseX;
      const deltaY = event.touches[0].clientY - sceneRef.current.previousMouseY;

      sceneRef.current.rotationY -= deltaX * 0.005;
      sceneRef.current.rotationX -= deltaY * 0.005;

      sceneRef.current.previousMouseX = event.touches[0].clientX;
      sceneRef.current.previousMouseY = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (sceneRef.current) {
        sceneRef.current.isDragging = false;
      }
    };

    // Cleanup function with error handling
    const cleanup = () => {
      try {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (cleanupTimeoutRef.current) {
          clearTimeout(cleanupTimeoutRef.current);
        }

        canvas.removeEventListener("mousemove", handleCanvasMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);

        if (geometry) geometry.dispose();
        if (material) material.dispose();
        if (renderer) renderer.dispose();

        window.removeEventListener('resize', handleResize);

        // Reset performance monitor
        performanceMonitor.reset();

        if (sceneRef.current) {
          sceneRef.current.originalPositions = null as any;
          sceneRef.current.velocities = null as any;
          sceneRef.current.phases = null as any;
          sceneRef.current = null;
        }

        // تم تنظيف موارد الجسيمات بنجاح
      } catch (error) {
        console.error('خطأ في تنظيف موارد الجسيمات:', error);
      }
    };

    // Automatic cleanup after 5 minutes for safety
    cleanupTimeoutRef.current = setTimeout(cleanup, 300000);

    // Attach event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart as unknown as EventListener, { passive: true } as AddEventListenerOptions);
    canvas.addEventListener("touchmove", handleTouchMove as unknown as EventListener, { passive: true } as AddEventListenerOptions);
    canvas.addEventListener("touchend", handleTouchEnd);

    return cleanup;
  }, []);

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center w-full h-full bg-black">
      <canvas
        ref={canvasRef}
        width={1400}
        height={600}
        className="block"
        style={{ touchAction: 'none', pointerEvents: 'none' }}
      />
    </div>
  );
}