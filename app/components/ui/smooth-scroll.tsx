"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__lenis = lenis;

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return null;
}
