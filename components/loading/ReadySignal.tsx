"use client";

import { useEffect } from "react";
import { useLoader } from "./LoaderProvider";

export default function ReadySignal() {
  const { markReady } = useLoader();

  useEffect(() => {
    markReady();
  }, [markReady]);

  return null;
}
