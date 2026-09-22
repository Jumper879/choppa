"use client";

import { useEffect, useState } from "react";

/** Tracks Tailwind's `lg` breakpoint (1024px). Returns null until mounted. */
export function useIsDesktop(): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    // matchMedia isn't available during SSR, so this can only run after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDesktop(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
