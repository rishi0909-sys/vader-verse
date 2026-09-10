"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import VaderLoader from "./VaderLoader";

const MIN_LOADER_DURATION = 1000;
// Use 60 seconds in dev (due to heavy compilation) and 4 seconds in production
const MAX_LOADER_DURATION = process.env.NODE_ENV === "development" ? 60000 : 4000;

interface LoaderContextValue {
  markReady: () => void;
  startLoader: (targetUrl: string) => void;
}

const LoaderContext = createContext<LoaderContextValue>({ 
  markReady: () => {},
  startLoader: () => {}
});

export const useLoader = () => useContext(LoaderContext);

function NavigationObserver({ markReady, isTransitioningRef }: { markReady: () => void, isTransitioningRef: React.MutableRefObject<boolean> }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isTransitioningRef.current) {
      markReady();
    }
  }, [pathname, searchParams, markReady, isTransitioningRef]);

  return null;
}

export default function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [destination, setDestination] = useState("");
  
  const timerStartRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioningRef = useRef(false);

  const cleanup = useCallback(() => {
    setIsActive(false);
    setIsReady(false);
    isTransitioningRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
  }, []);

  const evaluateDismissal = useCallback(() => {
    if (!isTransitioningRef.current) return;
    
    const elapsed = Date.now() - timerStartRef.current;
    if (elapsed >= MIN_LOADER_DURATION) {
      cleanup();
    } else {
      timeoutRef.current = setTimeout(cleanup, MIN_LOADER_DURATION - elapsed);
    }
  }, [cleanup]);

  const markReady = useCallback(() => {
    if (!isTransitioningRef.current) return;
    setIsReady(true);
    evaluateDismissal();
  }, [evaluateDismissal]);

  const startLoader = useCallback((targetUrl: string) => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    timerStartRef.current = Date.now();
    setIsActive(true);
    setIsReady(false);
    setDestination(targetUrl);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    safetyTimeoutRef.current = setTimeout(() => {
      console.warn("Loader safety timeout reached. Forcing dismissal.");
      cleanup();
    }, MAX_LOADER_DURATION);
  }, [cleanup]);

  useEffect(() => {
    if (isTransitioningRef.current && isReady) {
       evaluateDismissal();
    }
  }, [isReady, evaluateDismissal]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;
      if (anchor.target === "_blank") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.href.startsWith("mailto:") || anchor.href.startsWith("tel:")) return;
      if (e.defaultPrevented) return;

      const currentUrl = new URL(window.location.href);
      const destUrl = new URL(anchor.href, window.location.href);

      if (destUrl.origin !== currentUrl.origin) return;
      if (destUrl.pathname === currentUrl.pathname && destUrl.search === currentUrl.search) return;

      startLoader(destUrl.pathname);
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => document.removeEventListener("click", handleGlobalClick, { capture: true });
  }, [startLoader]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <LoaderContext.Provider value={{ markReady, startLoader }}>
      <Suspense fallback={null}>
        <NavigationObserver markReady={markReady} isTransitioningRef={isTransitioningRef} />
      </Suspense>
      {children}
      {isMounted && <VaderLoader isActive={isActive} destinationPath={destination} />}
    </LoaderContext.Provider>
  );
}
