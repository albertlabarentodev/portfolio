"use client";

import { useEffect, useRef, useState } from "react";

// The hero's signature moment (Bruno Simon reference): the stack drawn as a
// live workflow. Edges draw in, then data pulses travel along them. Hovering
// a node highlights everything it connects to.

type Node = { id: string; label: string; kind: string; x: number; y: number };

const NODES: Node[] = [
  { id: "figma", label: "Figma", kind: "DESIGN", x: 0, y: 0.18 },
  { id: "hook", label: "Webhooks", kind: "TRIGGER", x: 0, y: 0.5 },
  { id: "cron", label: "Schedules", kind: "TRIGGER", x: 0, y: 0.82 },
  { id: "laravel", label: "Laravel", kind: "BACKEND", x: 0.5, y: 0.18 },
  { id: "n8n", label: "n8n", kind: "AUTOMATION", x: 0.5, y: 0.5 },
  { id: "claude", label: "Claude", kind: "AI AGENT", x: 0.5, y: 0.82 },
  { id: "vue", label: "Vue · Nuxt", kind: "FRONT END", x: 1, y: 0.18 },
  { id: "next", label: "Next.js", kind: "FRONT END", x: 1, y: 0.5 },
  { id: "crm", label: "CRM · Slack", kind: "OUTPUT", x: 1, y: 0.82 },
];

const EDGES: [string, string][] = [
  ["figma", "laravel"], ["hook", "laravel"], ["hook", "n8n"], ["cron", "n8n"], ["cron", "claude"],
  ["laravel", "vue"], ["laravel", "next"], ["n8n", "next"], ["n8n", "crm"], ["claude", "crm"], ["claude", "next"],
];

const C = {
  accent: "#3ee6c1",
  edge: "#2a3654",
  edgeDim: "rgba(46,59,92,0.45)",
  node: "#111a2c",
  nodeHot: "#10231f",
  ink: "#eef2f7",
  ink3: "#7c889c",
};

const NODE_H = 54;
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function WorkflowGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<Node | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontSans = getComputedStyle(document.body).getPropertyValue("--font-geist-sans") || "system-ui";
    const fontMono = getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace";
    let W = 0, H = 0, dpr = 1, raf = 0, visible = true, hot: string | null = null;
    let t0 = performance.now();
    const phases = EDGES.map((_, i) => (i * 0.37) % 1);

    const size = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    // Three columns that always fit inside the canvas, with smaller type on phones.
    const PAD = 14, GAP = 14;
    const small = () => W < 480;
    const nodeW = () => Math.min(150, (W - 2 * PAD - 2 * GAP) / 3);
    const pos = (n: Node) => {
      const w = nodeW();
      return { x: PAD + w / 2 + n.x * (W - 2 * PAD - w), y: n.y * H };
    };
    const ends = ([a, b]: [string, string]) => {
      const p = pos(byId[a]), q = pos(byId[b]), w = nodeW() / 2;
      return [{ x: p.x + w, y: p.y }, { x: q.x - w, y: q.y }] as const;
    };
    const bezier = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => {
      const dx = (b.x - a.x) * 0.5, u = 1 - t, c1 = a.x + dx, c2 = b.x - dx;
      return {
        x: u * u * u * a.x + 3 * u * u * t * c1 + 3 * u * t * t * c2 + t * t * t * b.x,
        y: u * u * u * a.y + 3 * u * u * t * a.y + 3 * u * t * t * b.y + t * t * t * b.y,
      };
    };
    const linked = (e: [string, string]) => hot !== null && (e[0] === hot || e[1] === hot);

    const draw = (now: number) => {
      const el = (now - t0) / 1000;
      let p = reduce ? 1 : Math.max(0, Math.min(1, (el - 0.7) / 1.3));
      p = 1 - Math.pow(1 - p, 3);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      EDGES.forEach((e, i) => {
        const [a, b] = ends(e);
        const on = linked(e);
        const steps = 48, lim = Math.round(steps * p);
        ctx.beginPath();
        for (let s = 0; s <= lim; s++) {
          const q = bezier(a, b, s / steps);
          if (s === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
        }
        ctx.strokeStyle = on ? C.accent : hot ? C.edgeDim : C.edge;
        ctx.lineWidth = on ? 2.2 : 1.6;
        ctx.stroke();

        if (!reduce && p >= 1 && (!hot || on)) {
          const d = bezier(a, b, (el * 0.42 + phases[i]) % 1);
          ctx.save();
          ctx.shadowColor = C.accent;
          ctx.shadowBlur = on ? 18 : 12;
          ctx.fillStyle = C.accent;
          ctx.beginPath();
          ctx.arc(d.x, d.y, on ? 3.6 : 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      NODES.forEach((n, i) => {
        const a = reduce ? 1 : Math.max(0, Math.min(1, (el - 0.2 - i * 0.06) / 0.5));
        if (a <= 0) return;
        const q = pos(n), w = nodeW(), x = q.x - w / 2, y = q.y - NODE_H / 2 + (1 - a) * 10;
        const isHot = hot === n.id;
        const isLinked = EDGES.some((e) => linked(e) && (e[0] === n.id || e[1] === n.id));
        ctx.globalAlpha = a * (hot && !isHot && !isLinked ? 0.45 : 1);
        ctx.beginPath();
        ctx.roundRect(x, y, w, NODE_H, 12);
        ctx.fillStyle = isHot ? C.nodeHot : C.node;
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = isHot || isLinked ? C.accent : C.edge;
        ctx.stroke();
        const tx = x + (small() ? 9 : 14);
        ctx.fillStyle = C.ink3;
        ctx.font = `500 ${small() ? 9 : 10}px ${fontMono}`;
        ctx.fillText(n.kind, tx, y + 21);
        ctx.fillStyle = C.ink;
        ctx.font = `600 ${small() ? 12 : 15}px ${fontSans}`;
        ctx.fillText(n.label, tx, y + 40, w - (tx - x) * 2);
        ctx.globalAlpha = 1;
      });
    };

    const loop = (now: number) => {
      draw(now);
      if (!reduce && visible) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) draw(performance.now());
      else raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top, w = nodeW();
      const found = NODES.find((n) => {
        const q = pos(n);
        return Math.abs(mx - q.x) < w / 2 && Math.abs(my - q.y) < NODE_H / 2;
      }) ?? null;
      if ((found?.id ?? null) !== hot) {
        hot = found?.id ?? null;
        setHover(found);
        if (reduce) draw(performance.now());
      }
    };
    const onLeave = () => {
      hot = null;
      setHover(null);
      if (reduce) draw(performance.now());
    };
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(performance.now()); });
    // Pause the loop while the graph is off-screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else cancelAnimationFrame(raf);
    });

    size();
    ro.observe(canvas);
    io.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    document.fonts.ready.then(() => { t0 = performance.now(); start(); });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <figure className="m-0 flex min-w-0 flex-col gap-3">
      <div className="overflow-hidden rounded-[20px] border border-line bg-panel bg-[radial-gradient(#18223a_1.2px,transparent_1.2px)] bg-size-[22px_22px]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Animated diagram: Figma, webhooks and schedules feed Laravel, n8n and Claude, which feed Vue, Next.js, the CRM and Slack"
          className="block h-[360px] w-full cursor-crosshair sm:h-[440px]"
        />
      </div>
      <figcaption className="label flex flex-wrap justify-between gap-3 tracking-[0.06em]">
        <span>Live · hover a node to trace it</span>
        <span aria-live="polite">{hover ? `${hover.kind} → ${hover.label.toUpperCase()}` : "9 nodes · 11 connections"}</span>
      </figcaption>
    </figure>
  );
}
