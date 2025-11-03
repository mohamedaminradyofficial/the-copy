/**
 * Particle effect helper functions
 * Extracted from particle-background.tsx to reduce complexity
 */

export interface ParticleVelocity {
  vx: number;
  vy: number;
  vz: number;
}

export interface ParticlePosition {
  px: number;
  py: number;
  pz: number;
}

export interface EffectConfig {
  effectRadius: number;
  repelStrength: number;
}

/**
 * Apply spark effect to particle
 */
export function applySparkEffect(
  particle: ParticlePosition,
  intersection: { x: number; y: number; z: number },
  velocity: ParticleVelocity,
  config: EffectConfig
): ParticleVelocity {
  const dx = particle.px - intersection.x;
  const dy = particle.py - intersection.y;
  const dz = particle.pz - intersection.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  const dist = Math.sqrt(distSq);

  if (
    distSq < config.effectRadius * config.effectRadius &&
    distSq > 0.0001
  ) {
    const force = (1 - dist / config.effectRadius) * config.repelStrength * 3;
    return {
      vx: velocity.vx + (dx / dist) * force,
      vy: velocity.vy + (dy / dist) * force,
      vz: velocity.vz + (dz / dist) * force,
    };
  }

  return velocity;
}

/**
 * Apply wave effect to particle
 */
export function applyWaveEffect(
  particle: ParticlePosition,
  intersection: { x: number; y: number; z: number },
  velocity: ParticleVelocity,
  config: EffectConfig,
  time: number
): ParticleVelocity {
  const dx = particle.px - intersection.x;
  const dy = particle.py - intersection.y;
  const dz = particle.pz - intersection.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  const dist = Math.sqrt(distSq);

  if (distSq < config.effectRadius * config.effectRadius) {
    const wavePhase = time * 8 - dist * 12;
    const waveStrength = 0.12;
    const waveForce =
      Math.sin(wavePhase) * waveStrength * (1 - dist / config.effectRadius);
    if (dist > 0.001) {
      return {
        vx: velocity.vx + (dx / dist) * waveForce,
        vy: velocity.vy + (dy / dist) * waveForce,
        vz: velocity.vz + waveForce * 0.5,
      };
    }
  }

  return velocity;
}

/**
 * Apply vortex effect to particle
 */
export function applyVortexEffect(
  particle: ParticlePosition,
  intersection: { x: number; y: number; z: number },
  velocity: ParticleVelocity,
  config: EffectConfig
): ParticleVelocity {
  const dx = particle.px - intersection.x;
  const dy = particle.py - intersection.y;
  const dz = particle.pz - intersection.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  const dist = Math.sqrt(distSq);

  if (distSq < config.effectRadius * config.effectRadius && dist > 0.05) {
    const vortexStrength = 0.15;
    const spiralForce = vortexStrength * (1 - dist / config.effectRadius);

    const tangentX = -dy;
    const tangentY = dx;
    const tangentLength = Math.sqrt(
      tangentX * tangentX + tangentY * tangentY
    );

    let newVx = velocity.vx;
    let newVy = velocity.vy;

    if (tangentLength > 0.001) {
      newVx += (tangentX / tangentLength) * spiralForce;
      newVy += (tangentY / tangentLength) * spiralForce;
    }

    const pullStrength = spiralForce * 0.3;
    newVx -= (dx / dist) * pullStrength;
    newVy -= (dy / dist) * pullStrength;

    return {
      vx: newVx,
      vy: newVy,
      vz: velocity.vz,
    };
  }

  return velocity;
}

/**
 * Apply default repel effect to particle
 */
export function applyDefaultEffect(
  particle: ParticlePosition,
  intersection: { x: number; y: number; z: number },
  velocity: ParticleVelocity,
  config: EffectConfig
): ParticleVelocity {
  const dx = particle.px - intersection.x;
  const dy = particle.py - intersection.y;
  const dz = particle.pz - intersection.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  const dist = Math.sqrt(distSq);

  if (distSq < config.effectRadius * config.effectRadius && distSq > 0.0001) {
    const force = (1 - dist / config.effectRadius) * config.repelStrength;
    return {
      vx: velocity.vx + (dx / dist) * force,
      vy: velocity.vy + (dy / dist) * force,
      vz: velocity.vz + (dz / dist) * force,
    };
  }

  return velocity;
}

/**
 * Calculate color for wave effect
 */
export function calculateWaveColor(
  particle: ParticlePosition,
  intersection: { x: number; y: number; z: number },
  effectRadius: number,
  time: number
): { r: number; g: number; b: number } {
  const dx = particle.px - intersection.x;
  const dy = particle.py - intersection.y;
  const dz = particle.pz - intersection.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  const dist = Math.sqrt(distSq);

  if (distSq < effectRadius * effectRadius) {
    const wavePhase = time * 8 - dist * 15;
    const intensity =
      Math.abs(Math.sin(wavePhase)) * (1 - dist / effectRadius) + 1;
    return {
      r: intensity * 0.5 + 0.8,
      g: intensity * 0.8 + 0.6,
      b: intensity * 1.2 + 0.4,
    };
  }

  return { r: 1, g: 1, b: 1 };
}

/**
 * Calculate color for vortex effect
 */
export function calculateVortexColor(
  particle: ParticlePosition,
  intersection: { x: number; y: number; z: number },
  effectRadius: number,
  time: number
): { r: number; g: number; b: number } {
  const dx = particle.px - intersection.x;
  const dy = particle.py - intersection.y;
  const dz = particle.pz - intersection.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  const dist = Math.sqrt(distSq);

  if (distSq < effectRadius * effectRadius) {
    const angle = Math.atan2(dy, dx) + time * 5;
    const intensity = (1 - dist / effectRadius) * 2 + 1;
    return {
      r: (Math.sin(angle) * 0.5 + 0.5) * intensity,
      g: (Math.sin(angle + (Math.PI * 2) / 3) * 0.5 + 0.5) * intensity,
      b: (Math.sin(angle + (Math.PI * 4) / 3) * 0.5 + 0.5) * intensity,
    };
  }

  return { r: 1, g: 1, b: 1 };
}
