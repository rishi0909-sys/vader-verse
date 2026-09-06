"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { PerformanceTier, PerformanceProfile, PERFORMANCE_PROFILES, getDowngradedTier, getUpgradedTier } from './performanceProfile';
import { detectDeviceCapabilities, DeviceCapabilities } from './deviceCapabilities';

interface PerformanceContextValue {
  deviceCapability: PerformanceTier;
  runtimeQuality: PerformanceTier;
  profile: PerformanceProfile;
  capabilities: DeviceCapabilities;
  setRuntimeQuality: (tier: PerformanceTier) => void;
  requestDowngrade: () => void;
  requestUpgrade: () => void;
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [runtimeQuality, setRuntimeQuality] = useState<PerformanceTier>('BALANCED');

  useEffect(() => {
    // Detect on client mount
    const caps = detectDeviceCapabilities();
    setCapabilities(caps);
    setRuntimeQuality(caps.tier);
  }, []);

  const requestDowngrade = () => {
    setRuntimeQuality(prev => getDowngradedTier(prev));
  };

  const requestUpgrade = () => {
    setRuntimeQuality(prev => {
      const upgraded = getUpgradedTier(prev);
      // Don't upgrade past device capability
      if (capabilities && PERFORMANCE_PROFILES[upgraded].shaderQuality > PERFORMANCE_PROFILES[capabilities.tier].shaderQuality) {
         return prev;
      }
      return upgraded;
    });
  };

  if (!capabilities) {
    // SSR or initial mount
    return null;
  }

  const value: PerformanceContextValue = {
    deviceCapability: capabilities.tier,
    runtimeQuality,
    profile: PERFORMANCE_PROFILES[runtimeQuality],
    capabilities,
    setRuntimeQuality,
    requestDowngrade,
    requestUpgrade
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}
