"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// Optional interface sounds (Josh W. Comeau reference). Off by default and
// remembered per browser.

type Sound = { enabled: boolean; toggle: () => void; blip: (freq?: number) => void };

const SoundContext = createContext<Sound>({ enabled: false, toggle: () => {}, blip: () => {} });

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem("sound") === "on");
    } catch {}
  }, []);

  const play = useCallback((freq = 660) => {
    try {
      ctxRef.current ??= new AudioContext();
      const ac = ctxRef.current;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.08);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    } catch {}
  }, []);

  const blip = useCallback((freq?: number) => {
    if (enabled) play(freq);
  }, [enabled, play]);

  const toggle = useCallback(() => {
    setEnabled((on) => {
      const next = !on;
      try {
        localStorage.setItem("sound", next ? "on" : "off");
      } catch {}
      if (next) play(880);
      return next;
    });
  }, [play]);

  return <SoundContext.Provider value={{ enabled, toggle, blip }}>{children}</SoundContext.Provider>;
}

export const useSound = () => useContext(SoundContext);

export function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn interface sounds off" : "Turn interface sounds on"}
      className="flex size-11 items-center justify-center rounded-full border border-line-strong text-ink-2 transition hover:-translate-y-0.5 hover:border-accent"
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={enabled ? "#3ee6c1" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        {enabled ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 5a10 10 0 0 1 0 14" />
          </>
        ) : (
          <path d="m22 9-6 6M16 9l6 6" />
        )}
      </svg>
    </button>
  );
}
