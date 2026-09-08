"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export interface TelemetryEventOptions {
  eventType: "click" | "view" | "session_start" | "session_end" | "scroll" | "hover";
  category: string;
  entityId?: string;
  metadata?: any;
}

export function useAiTelemetry() {
  const pathname = usePathname();
  const sessionStartTime = useRef<number>(Date.now());

  // Function to manually fire an event
  const trackEvent = async (options: TelemetryEventOptions) => {
    try {
      // Only fire if the user is authenticated (checked via token existence to save network calls if logged out)
      const token = localStorage.getItem("vader_token");
      if (!token) return;

      await fetch("/api/telemetry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(options),
      });
    } catch (error) {
      // Fail silently for telemetry
      console.warn("Telemetry tracking failed", error);
    }
  };

  // Automatically track page views and session duration
  useEffect(() => {
    sessionStartTime.current = Date.now();

    trackEvent({
      eventType: "view",
      category: "page_navigation",
      entityId: pathname,
    });

    return () => {
      const durationMs = Date.now() - sessionStartTime.current;
      trackEvent({
        eventType: "session_end",
        category: "page_navigation",
        entityId: pathname,
        metadata: { durationMs },
      });
    };
  }, [pathname]);

  return { trackEvent };
}
