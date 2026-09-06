import { PerformanceTier } from './performanceProfile';

export interface DeviceCapabilities {
  tier: PerformanceTier;
  hardwareConcurrency: number;
  devicePixelRatio: number;
  isMobile: boolean;
  reducedMotion: boolean;
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    // SSR safe default
    return {
      tier: 'BALANCED',
      hardwareConcurrency: 4,
      devicePixelRatio: 1,
      isMobile: false,
      reducedMotion: false,
    };
  }

  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Connection hints
  const connection = (navigator as any).connection;
  const isSlowConnection = connection ? (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData) : false;

  let initialTier: PerformanceTier = 'BALANCED';

  if (reducedMotion) {
    initialTier = 'MINIMAL';
  } else if (isSlowConnection) {
    initialTier = 'LOW';
  } else if (isMobile) {
    if (hardwareConcurrency >= 6 && devicePixelRatio >= 2) {
      initialTier = 'BALANCED'; // High end mobile gets BALANCED
    } else {
      initialTier = 'LOW'; // Mid/low end mobile gets LOW
    }
  } else {
    // Desktop
    if (hardwareConcurrency >= 8) {
      initialTier = 'ULTRA';
    } else if (hardwareConcurrency >= 6) {
      initialTier = 'HIGH';
    } else if (hardwareConcurrency >= 4) {
      initialTier = 'BALANCED';
    } else {
      initialTier = 'LOW';
    }
  }

  return {
    tier: initialTier,
    hardwareConcurrency,
    devicePixelRatio,
    isMobile,
    reducedMotion,
  };
}
