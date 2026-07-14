import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../lib/useReducedMotion.js";

const MAX_POINTS = 22;   // trail length (history samples)
const OFFSET = 5;        // px separation between the two lines

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    let raf = 0;
    const points = []; // {x, y}

    const resize = () => {
      const r = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      const r = parent.getBoundingClientRect();
      points.push({ x: e.clientX - r.left, y: e.clientY - r.top });
      while (points.length > MAX_POINTS) points.shift();
    };

    // Draw one fading/blurring polyline offset perpendicular to travel direction.
    const drawLine = (sign) => {
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const t = i / points.length;              // 0 tail -> 1 head
        const dx = p1.x - p0.x, dy = p1.y - p0.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = (-dy / len) * OFFSET * sign;   // perpendicular offset
        const ny = (dx / len) * OFFSET * sign;
        ctx.beginPath();
        ctx.moveTo(p0.x + nx, p0.y + ny);
        ctx.lineTo(p1.x + nx, p1.y + ny);
        ctx.lineCap = "round";
        ctx.lineWidth = 0.5 + t * 1.5;            // thinner at tail
        ctx.strokeStyle = `rgba(255,255,255,${t * 0.9})`; // fade toward tail
        ctx.shadowBlur = (1 - t) * 8;             // blur toward tail
        ctx.shadowColor = "rgba(255,255,255,0.6)";
        ctx.stroke();
      }
    };

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (points.length > 1) { drawLine(1); drawLine(-1); }
      if (points.length) points.shift(); // trail decays when the mouse stops
      raf = requestAnimationFrame(renderFrame);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="cursor-trail" data-testid="cursor-trail" aria-hidden="true" />;
}
