"use client";

import { useEffect, useRef } from "react";

// A soft light that follows the cursor across the page.
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect();
        el.style.setProperty("--gx", `${Math.round(e.clientX - r.left)}px`);
        el.style.setProperty("--gy", `${Math.round(e.clientY - r.top)}px`);
      });
    };
    host.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="spotlight" />;
}
