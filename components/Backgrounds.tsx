"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Wrapper to delay WebGL initialization until after critical UI renders
function withDeferredInitialization(Component: any) {
  return function DeferredComponent(props: any) {
    const [shouldRender, setShouldRender] = useState(false);
    
    useEffect(() => {
      // Use requestIdleCallback if available, otherwise fallback to setTimeout
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => setShouldRender(true), { timeout: 1000 });
      } else {
        const timer = setTimeout(() => setShouldRender(true), 250);
        return () => clearTimeout(timer);
      }
    }, []);

    if (!shouldRender) return null;
    return <Component {...props} />;
  };
}

export const AcidSquares = withDeferredInitialization(dynamic(() => import('@/components/AcidSquares'), { ssr: false }));
export const Ferrofluid = withDeferredInitialization(dynamic(() => import('@/components/Ferrofluid'), { ssr: false }));
export const LiquidEther = withDeferredInitialization(dynamic(() => import('@/components/LiquidEther'), { ssr: false }));
export const GradientWaves = withDeferredInitialization(dynamic(() => import('@/components/GradientWaves'), { ssr: false }));
export const Silk = withDeferredInitialization(dynamic(() => import('@/components/Silk'), { ssr: false }));
export const Iridescence = withDeferredInitialization(dynamic(() => import('@/components/Iridescence'), { ssr: false }));
export const FaultyTerminal = withDeferredInitialization(dynamic(() => import('@/components/FaultyTerminal'), { ssr: false }));
export const PrismaticBurst = withDeferredInitialization(dynamic(() => import('@/components/PrismaticBurst'), { ssr: false }));

export const GridScan = withDeferredInitialization(dynamic(() => import('@/components/GridScan').then(mod => mod.GridScan), { ssr: false }));
