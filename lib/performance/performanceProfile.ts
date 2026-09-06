export type PerformanceTier = 'ULTRA' | 'HIGH' | 'BALANCED' | 'LOW' | 'MINIMAL';

export interface PerformanceProfile {
  tier: PerformanceTier;
  dprConfig: [number, number]; // [min, max]
  particleMultiplier: number;
  geometryMultiplier: number;
  shaderQuality: number; // 0.0 to 1.0
  bloom: boolean;
  antialias: boolean;
  postProcessing: boolean;
  shadows: boolean;
  interactionQuality: number; // 0.0 to 1.0
  backgroundQuality: number; // 0.0 to 1.0
}

export const PERFORMANCE_PROFILES: Record<PerformanceTier, PerformanceProfile> = {
  ULTRA: {
    tier: 'ULTRA',
    dprConfig: [1, 2],
    particleMultiplier: 1.0,
    geometryMultiplier: 1.0,
    shaderQuality: 1.0,
    bloom: true,
    antialias: true,
    postProcessing: true,
    shadows: true,
    interactionQuality: 1.0,
    backgroundQuality: 1.0,
  },
  HIGH: {
    tier: 'HIGH',
    dprConfig: [1, 1.75],
    particleMultiplier: 0.8,
    geometryMultiplier: 0.8,
    shaderQuality: 0.8,
    bloom: true,
    antialias: true,
    postProcessing: true,
    shadows: true,
    interactionQuality: 1.0,
    backgroundQuality: 0.8,
  },
  BALANCED: {
    tier: 'BALANCED',
    dprConfig: [1, 1.5],
    particleMultiplier: 0.6,
    geometryMultiplier: 0.6,
    shaderQuality: 0.6,
    bloom: true, // simplified bloom
    antialias: false,
    postProcessing: true, // selective
    shadows: false,
    interactionQuality: 0.8,
    backgroundQuality: 0.6,
  },
  LOW: {
    tier: 'LOW',
    dprConfig: [1, 1.25],
    particleMultiplier: 0.4,
    geometryMultiplier: 0.4,
    shaderQuality: 0.4,
    bloom: false,
    antialias: false,
    postProcessing: false,
    shadows: false,
    interactionQuality: 0.5,
    backgroundQuality: 0.4,
  },
  MINIMAL: {
    tier: 'MINIMAL',
    dprConfig: [1, 1],
    particleMultiplier: 0.2,
    geometryMultiplier: 0.2,
    shaderQuality: 0.2,
    bloom: false,
    antialias: false,
    postProcessing: false,
    shadows: false,
    interactionQuality: 0.2,
    backgroundQuality: 0.2,
  },
};

// Helper for tier progression
export const TIER_LEVELS: PerformanceTier[] = ['MINIMAL', 'LOW', 'BALANCED', 'HIGH', 'ULTRA'];

export function getDowngradedTier(current: PerformanceTier): PerformanceTier {
  const idx = TIER_LEVELS.indexOf(current);
  if (idx > 0) return TIER_LEVELS[idx - 1];
  return current;
}

export function getUpgradedTier(current: PerformanceTier): PerformanceTier {
  const idx = TIER_LEVELS.indexOf(current);
  if (idx < TIER_LEVELS.length - 1) return TIER_LEVELS[idx + 1];
  return current;
}
