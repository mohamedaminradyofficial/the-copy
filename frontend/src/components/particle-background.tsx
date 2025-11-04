"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ParticleVelocity, ParticlePosition, EffectConfig } from "./particle-effects";
import {
  applySparkEffect,
  applyWaveEffect,
  applyVortexEffect,
  applyDefaultEffect,
  calculateWaveColor,
  calculateVortexColor,
} from "./particle-effects";

type Effect = "default" | "spark" | "wave" | "vortex";

/**
 * Update camera position based on rotation
 */
function updateCameraPosition(
  camera: THREE.PerspectiveCamera,
  rotationX: number,
  rotationY: number
): void {
  camera.position.x = Math.sin(rotationY) * 3.5;
  camera.position.z = Math.cos(rotationY) * 3.5;
  camera.position.y = rotationX * 0.5;
  camera.lookAt(0, 0, 0);
}

/**
 * Apply particle effect using lookup strategy
 */
function applyParticleEffect(
  effect: Effect,
  position: ParticlePosition,
  intersection: THREE.Vector3,
  velocity: ParticleVelocity,
  config: EffectConfig,
  time: number
): ParticleVelocity {
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
}

/**
 * Apply attraction to original position
 */
function applyAttraction(
  position: ParticlePosition,
  target: { x: number; y: number; z: number },
  velocity: ParticleVelocity,
  attractStrength: number
): ParticleVelocity {
  return {
    vx: velocity.vx + (target.x - position.px) * attractStrength,
    vy: velocity.vy + (target.y - position.py) * attractStrength,
    vz: velocity.vz + (target.z - position.pz) * attractStrength,
  };
}

/**
 * Apply damping to velocity
 */
function applyDamping(velocity: ParticleVelocity, damping: number): ParticleVelocity {
  return {
    vx: velocity.vx * damping,
    vy: velocity.vy * damping,
    vz: velocity.vz * damping,
  };
}

/**
 * Update position based on velocity
 */
function updatePosition(
  position: ParticlePosition,
  velocity: ParticleVelocity
): ParticlePosition {
  return {
    px: position.px + velocity.vx,
    py: position.py + velocity.vy,
    pz: position.pz + velocity.vz,
  };
}

/**
 * Calculate particle color based on effect
 */
function calculateParticleColor(
  effect: Effect,
  position: ParticlePosition,
  intersection: THREE.Vector3 | null,
  effectRadius: number,
  time: number
): { r: number; g: number; b: number } {
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
}

export default function V0ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentEffect, setCurrentEffect] = useState<Effect>("default");
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
  } | null>(null);

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };

  // Distance to box with rounded corners
  const sdBox = (
    px: number,
    py: number,
    bx: number,
    by: number,
    r: number
  ): number => {
    const dx = Math.abs(px) - bx;
    const dy = Math.abs(py) - by;
    return (
      Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) +
      Math.min(Math.max(dx, dy), 0) -
      r
    );
  };

  // Distance to circle
  const sdCircle = (
    px: number,
    py: number,
    cx: number,
    cy: number,
    r: number
  ): number => {
    return Math.hypot(px - cx, py - cy) - r;
  };

  // Distance to ring (hollow circle)
  const sdRing = (
    px: number,
    py: number,
    cx: number,
    cy: number,
    r: number,
    thickness: number
  ): number => {
    return Math.abs(sdCircle(px, py, cx, cy, r)) - thickness;
  };

  // Distance to line segment (capsule)
  const sdSegment = (
    px: number,
    py: number,
    ax: number,
    ay: number,
    bx: number,
    by: number,
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
    px: number,
    py: number,
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number,
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

  // Bezier curve helper for smooth curves
  const sdBezier = (
    px: number,
    py: number,
    p0x: number,
    p0y: number,
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
    thickness: number
  ): number => {
    let minDist = Number.MAX_VALUE;
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const t2 = t * t;
      const mt = 1 - t;
      const mt2 = mt * mt;

      const bx = mt2 * p0x + 2 * mt * t * p1x + t2 * p2x;
      const by = mt2 * p0y + 2 * mt * t * p1y + t2 * p2y;

      const dist = Math.hypot(px - bx, py - by);
      minDist = Math.min(minDist, dist);
    }
    return minDist - thickness;
  };

  // SDF boolean operations
  const opUnion = (a: number, b: number): number => Math.min(a, b);
  const opSubtract = (a: number, b: number): number => Math.max(a, -b);

  // Letter definitions using SDF
  const STROKE_WIDTH = 0.035;
  const BASELINE = 0.0;
  const X_HEIGHT = 0.35;
  const ASCENDER_HEIGHT = 0.65;
  const DESCENDER_DEPTH = -0.25;
  const ARABIC_HEIGHT = 0.45; // ارتفاع الحروف العربية

  // ====== English Letters ======

  const dist_t = (px: number, py: number): number => {
    const x = -1.7;
    const stem = sdSegment(
      px,
      py,
      x,
      BASELINE + ASCENDER_HEIGHT - 0.05,
      x,
      BASELINE,
      STROKE_WIDTH
    );
    const crossbar = sdSegment(
      px,
      py,
      x - 0.15,
      BASELINE + ASCENDER_HEIGHT,
      x + 0.15,
      BASELINE + ASCENDER_HEIGHT,
      STROKE_WIDTH
    );
    return opUnion(stem, crossbar);
  };

  const dist_h = (px: number, py: number): number => {
    const x = -1.25;
    const stem = sdSegment(
      px,
      py,
      x,
      BASELINE + ASCENDER_HEIGHT,
      x,
      BASELINE,
      STROKE_WIDTH
    );
    const shoulder = sdArc(
      px,
      py,
      x,
      BASELINE + X_HEIGHT * 0.8,
      0.22,
      -Math.PI / 2,
      0,
      STROKE_WIDTH
    );
    const rightLeg = sdSegment(
      px,
      py,
      x + 0.22,
      BASELINE + X_HEIGHT * 0.8,
      x + 0.22,
      BASELINE,
      STROKE_WIDTH
    );
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
    ring = opSubtract(ring, cutBox);

    return ring;
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

    const stem = sdSegment(
      px,
      py,
      x,
      BASELINE + X_HEIGHT,
      x,
      BASELINE + DESCENDER_DEPTH,
      STROKE_WIDTH
    );
    const bowl = sdRing(px, py, x + 0.2, cy, 0.17, STROKE_WIDTH);

    return opUnion(stem, bowl);
  };

  const dist_y = (px: number, py: number): number => {
    const x = 1.9;
    const top = BASELINE + X_HEIGHT;
    const mid = BASELINE + X_HEIGHT * 0.2;

    const leftArm = sdSegment(px, py, x - 0.15, top, x, mid, STROKE_WIDTH);
    const rightArm = sdSegment(px, py, x + 0.15, top, x, mid, STROKE_WIDTH);
    const descender = sdSegment(
      px,
      py,
      x,
      mid,
      x + 0.05,
      BASELINE + DESCENDER_DEPTH,
      STROKE_WIDTH
    );

    return opUnion(opUnion(leftArm, rightArm), descender);
  };

  // ====== Dash Separator ======

  const dist_dash = (px: number, py: number): number => {
    const x = 2.4; // موقع الشرطة
    return sdSegment(
      px,
      py,
      x - 0.1,
      BASELINE + X_HEIGHT * 0.5,
      x + 0.1,
      BASELINE + X_HEIGHT * 0.5,
      STROKE_WIDTH * 0.8
    );
  };

  // ====== Arabic Letters (النسخة) ======
  // Enhanced Arabic letters with better particle density and shapes

  // حرف ا (alef) - خط رأسي محسّن
  const dist_alef = (px: number, py: number): number => {
    const x = 2.9;
    const stem = sdSegment(
      px,
      py,
      x,
      BASELINE + ARABIC_HEIGHT * 0.95,
      x,
      BASELINE,
      STROKE_WIDTH * 1.2
    );
    // إضافة قاعدة عريضة قليلاً
    const base = sdSegment(
      px,
      py,
      x - 0.03,
      BASELINE,
      x + 0.03,
      BASELINE,
      STROKE_WIDTH * 1.5
    );
    return opUnion(stem, base);
  };

  // حرف ل (lam) - محسّن مع خطاف أفضل
  const dist_lam = (px: number, py: number): number => {
    const x = 3.3;
    const stem = sdSegment(
      px,
      py,
      x,
      BASELINE + ARABIC_HEIGHT * 0.95,
      x,
      BASELINE + 0.08,
      STROKE_WIDTH * 1.2
    );
    // خطاف محسّن بقوس أكبر
    const hook = sdArc(
      px,
      py,
      x - 0.12,
      BASELINE + 0.08,
      0.12,
      0,
      Math.PI / 2,
      STROKE_WIDTH * 1.1
    );
    const hookEnd = sdSegment(
      px,
      py,
      x - 0.24,
      BASELINE,
      x - 0.15,
      BASELINE,
      STROKE_WIDTH
    );
    return opUnion(opUnion(stem, hook), hookEnd);
  };

  // حرف ن (noon) - محسّن بشكل أفضل
  const dist_noon = (px: number, py: number): number => {
    const x = 3.75;
    const cy = BASELINE + ARABIC_HEIGHT * 0.4;

    // قوس محسّن بزاوية أفضل
    const mainArc = sdArc(
      px,
      py,
      x,
      cy,
      0.18,
      -Math.PI * 0.15,
      Math.PI * 0.85,
      STROKE_WIDTH * 1.1
    );
    // خط الربط السفلي
    const connector = sdSegment(
      px,
      py,
      x - 0.17,
      cy - 0.05,
      x - 0.08,
      BASELINE + 0.02,
      STROKE_WIDTH
    );
    const base = sdSegment(
      px,
      py,
      x - 0.08,
      BASELINE + 0.02,
      x + 0.1,
      BASELINE,
      STROKE_WIDTH
    );
    // نقطة محسّنة
    const dot = sdCircle(px, py, x, cy + 0.28, 0.035);

    return opUnion(opUnion(opUnion(mainArc, connector), base), dot);
  };

  // حرف س (seen) - محسّن بأسنان أفضل
  const dist_seen = (px: number, py: number): number => {
    const x = 4.25;
    const baseY = BASELINE + 0.02;
    const toothHeight = ARABIC_HEIGHT * 0.35;

    // الخط الأساسي الممتد
    const baseLine = sdSegment(
      px,
      py,
      x - 0.28,
      baseY,
      x + 0.28,
      baseY,
      STROKE_WIDTH * 1.1
    );

    // الأسنان الثلاثة محسّنة
    const tooth1 = sdArc(
      px,
      py,
      x - 0.18,
      baseY + toothHeight * 0.6,
      0.1,
      Math.PI * 0.9,
      Math.PI * 0.1,
      STROKE_WIDTH
    );
    const tooth2 = sdArc(
      px,
      py,
      x,
      baseY + toothHeight * 0.8,
      0.12,
      Math.PI * 0.9,
      Math.PI * 0.1,
      STROKE_WIDTH
    );
    const tooth3 = sdArc(
      px,
      py,
      x + 0.18,
      baseY + toothHeight * 0.6,
      0.1,
      Math.PI * 0.9,
      Math.PI * 0.1,
      STROKE_WIDTH
    );

    // خطوط ربط الأسنان
    const connect1 = sdSegment(
      px,
      py,
      x - 0.18,
      baseY,
      x - 0.18,
      baseY + toothHeight * 0.5,
      STROKE_WIDTH * 0.8
    );
    const connect2 = sdSegment(
      px,
      py,
      x,
      baseY,
      x,
      baseY + toothHeight * 0.7,
      STROKE_WIDTH * 0.8
    );
    const connect3 = sdSegment(
      px,
      py,
      x + 0.18,
      baseY,
      x + 0.18,
      baseY + toothHeight * 0.5,
      STROKE_WIDTH * 0.8
    );

    return opUnion(
      opUnion(
        opUnion(
          opUnion(opUnion(opUnion(baseLine, tooth1), tooth2), tooth3),
          connect1
        ),
        connect2
      ),
      connect3
    );
  };

  // حرف خ (khaa) - محسّن بشكل أفضل
  const dist_khaa = (px: number, py: number): number => {
    const x = 4.75;
    const cy = BASELINE + ARABIC_HEIGHT * 0.4;

    // قوس مفتوح محسّن
    const mainArc = sdArc(
      px,
      py,
      x,
      cy,
      0.2,
      Math.PI * 0.6,
      Math.PI * 2.4,
      STROKE_WIDTH * 1.1
    );
    // خط الربط الأيمن
    const rightConnect = sdSegment(
      px,
      py,
      x + 0.15,
      cy - 0.12,
      x + 0.12,
      BASELINE,
      STROKE_WIDTH
    );
    // خط الربط الأيسر
    const leftConnect = sdSegment(
      px,
      py,
      x - 0.15,
      cy - 0.12,
      x - 0.08,
      BASELINE,
      STROKE_WIDTH
    );
    // نقطة محسّنة
    const dot = sdCircle(px, py, x, cy + 0.28, 0.035);

    return opUnion(opUnion(opUnion(mainArc, rightConnect), leftConnect), dot);
  };

  // حرف ة (taa marbouta) - محسّن بشكل أفضل
  const dist_taa_marbouta = (px: number, py: number): number => {
    const x = 5.2;
    const cy = BASELINE + ARABIC_HEIGHT * 0.4;

    // دائرة محسّنة بفتحة صغيرة
    let circle = sdRing(px, py, x, cy, 0.17, STROKE_WIDTH * 1.1);
    // فتحة صغيرة في الأعلى
    const opening = sdBox(px - x, py - (cy - 0.05), 0.08, 0.08, 0);
    circle = opSubtract(circle, opening);

    // نقطتان محسّنتان
    const dot1 = sdCircle(px, py, x - 0.07, cy + 0.28, 0.03);
    const dot2 = sdCircle(px, py, x + 0.07, cy + 0.28, 0.03);

    return opUnion(opUnion(circle, dot1), dot2);
  };

  // دمج جميع الحروف
  const dist_all = (px: number, py: number): number => {
    return Math.min(
      // English letters
      dist_t(px, py),
      dist_h(px, py),
      dist_e(px, py),
      dist_c(px, py),
      dist_o(px, py),
      dist_p(px, py),
      dist_y(px, py),
      // Separator
      dist_dash(px, py),
      // Arabic letters
      dist_alef(px, py),
      dist_lam(px, py),
      dist_noon(px, py),
      dist_seen(px, py),
      dist_khaa(px, py),
      dist_taa_marbouta(px, py)
    );
  };

  const dist = (px: number, py: number): number => dist_all(px, py);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0x000000);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // Generate particles with enhanced sampling for better Arabic text quality
    const numParticles = 25000; // زيادة عدد النقاط لجودة أفضل
    const thickness = 0.15;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    let i = 0;
    const maxAttempts = 3000000; // زيادة المحاولات لتغطية أفضل
    let attempts = 0;

    // توسيع منطقة أخذ العينات مع تركيز على الحروف العربية
    const minX = -2.1;
    const maxX = 5.6;
    const minY = -0.4;
    const maxY = 0.85;

    while (i < numParticles && attempts < maxAttempts) {
      attempts++;
      const x = Math.random() * (maxX - minX) + minX;
      const y = Math.random() * (maxY - minY) + minY;
      const z = Math.random() * thickness - thickness / 2;

      const d = dist(x, y);

      // تحسين عتبة القبول للحروف العربية
      const threshold = x > 2.5 ? 0.015 : 0.01; // عتبة أعلى للحروف العربية

      if (d <= threshold) {
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
        i++;
      }
    }

    console.log(`Generated ${i} particles in ${attempts} attempts`);

    const originalPositions = positions.slice();
    const phases = new Float32Array(i);
    const velocities = new Float32Array(i * 3);

    for (let j = 0; j < i; j++) {
      phases[j] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.0045, // زيادة حجم النقاط قليلاً لجودة أفضل
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.95, // زيادة الشفافية قليلاً
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    camera.position.set(0, 0, 3.2); // تعديل موضع الكاميرا لرؤية أفضل للنص المحسّن

    // Store scene data
    sceneRef.current = {
      scene,
      camera,
      renderer,
      points,
      geometry,
      originalPositions,
      velocities,
      phases,
      intersectionPoint: null,
      rotationX: 0,
      rotationY: 0,
      isDragging: false,
      previousMouseX: 0,
      previousMouseY: 0,
      particleCount: i,
    };

    // Mouse interaction handlers
    let animationId: number;

    const handleMouseMove = (event: MouseEvent) => {
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

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;

      const time = Date.now() * 0.001;
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

      const positionAttribute = geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const colorAttribute = geometry.getAttribute(
        "color"
      ) as THREE.BufferAttribute;

      const config: EffectConfig = {
        effectRadius: 0.5,
        repelStrength: 0.08,
      };
      const attractStrength = 0.15;
      const damping = 0.92;

      // Apply rotation
      updateCameraPosition(camera, rotationX, rotationY);

      for (let j = 0; j < particleCount; j++) {
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
          velocity = applyParticleEffect(
            currentEffect,
            position,
            intersectionPoint,
            velocity,
            config,
            time
          );
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
        const color = calculateParticleColor(
          currentEffect,
          newPos,
          intersectionPoint,
          config.effectRadius,
          time
        );
        colorAttribute.setXYZ(j, color.r, color.g, color.b);
      }

      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [currentEffect]);

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
    if (!sceneRef.current || !sceneRef.current.isDragging || !event.touches[0])
      return;

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

  // Zoom handlers
  const handleZoomIn = () => {
    if (sceneRef.current) {
      sceneRef.current.camera.position.z = Math.max(
        1,
        sceneRef.current.camera.position.z - 0.5
      );
      sceneRef.current.camera.updateProjectionMatrix();
    }
  };

  const handleZoomOut = () => {
    if (sceneRef.current) {
      sceneRef.current.camera.position.z = Math.min(
        5,
        sceneRef.current.camera.position.z + 0.5
      );
      sceneRef.current.camera.updateProjectionMatrix();
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black">
      <canvas
        ref={canvasRef}
        width={1400}
        height={600}
        className="block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Zoom controls */}
      <div className="absolute top-5 right-5 flex flex-col gap-2.5">
        <button
          onClick={handleZoomIn}
          className="px-5 py-2.5 text-2xl bg-white/10 border border-white text-white cursor-pointer transition-colors hover:bg-white/30 rounded"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="px-5 py-2.5 text-2xl bg-white/10 border border-white text-white cursor-pointer transition-colors hover:bg-white/30 rounded"
          aria-label="Zoom out"
        >
          -
        </button>
      </div>

      {/* Effect menu */}
      <div className="absolute top-5 left-5 flex flex-col gap-2.5">
        <select
          id="effect-select"
          value={currentEffect}
          onChange={(e) => setCurrentEffect(e.target.value as Effect)}
          className="px-3 py-2.5 text-base bg-white/10 border border-white text-white cursor-pointer rounded backdrop-blur-sm"
          aria-label="Select particle effect"
        >
          <option value="default">Default (Light Scatter)</option>
          <option value="spark">Spark (Strong Scatter)</option>
          <option value="wave">Wave (Ripple Effect)</option>
          <option value="vortex">Vortex (Spiral Pull)</option>
        </select>
      </div>

      {/* Credit link */}
      <div className="absolute bottom-5 right-5">
        <a
          href="https://x.com/YoheiNishitsuji/status/1976780747391500561"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 text-sm hover:text-white hover:underline transition-colors"
        >
          @YoheiNishitsuji
        </a>
      </div>
    </div>
  );
}
