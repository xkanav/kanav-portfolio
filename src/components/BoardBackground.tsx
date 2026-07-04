import { useEffect, useRef } from 'react';

/**
 * The alive background: a faint 8x8 board haze plus chess-piece
 * glyphs drifting on parallax layers. One canvas, one RAF loop —
 * zero animated DOM nodes.
 */

type Piece = {
  glyph: string;
  x: number; // 0..1 of viewport width
  y: number; // 0..1 of viewport height
  size: number;
  depth: number; // 0 (far) .. 1 (near) — drives parallax + opacity
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
};

const GLYPHS = ['♞', '♜', '♝', '♛', '♚', '♟'];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function BoardBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Deterministic layout so the scene is stable between reloads
    const rand = mulberry32(64);
    const pieces: Piece[] = Array.from({ length: 14 }, () => {
      const depth = rand();
      return {
        glyph: GLYPHS[Math.floor(rand() * GLYPHS.length)],
        x: rand(),
        y: rand(),
        size: 28 + depth * 74,
        depth,
        vx: (rand() - 0.5) * 0.012,
        vy: (rand() - 0.5) * 0.009,
        rot: (rand() - 0.5) * 0.5,
        vrot: (rand() - 0.5) * 0.00035,
      };
    });

    let scrollY = window.scrollY;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMX = 0.5;
    let targetMY = 0.5;

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    const onMouse = (e: MouseEvent) => {
      targetMX = e.clientX / w;
      targetMY = e.clientY / h;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });

    const drawBoardHaze = () => {
      // A large, barely-there board fading out of the top-right corner
      const cell = Math.max(w, h) / 10;
      const cols = 9;
      const rows = 7;
      ctx.save();
      const grad = ctx.createRadialGradient(
        w * 0.85,
        h * 0.1,
        0,
        w * 0.85,
        h * 0.1,
        Math.max(w, h) * 0.75
      );
      grad.addColorStop(0, 'rgba(241,242,233,0.028)');
      grad.addColorStop(1, 'rgba(241,242,233,0)');
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r + c) % 2 === 0) continue;
          ctx.fillStyle = grad;
          ctx.fillRect(w - (cols - c) * cell, (r - 1.5) * cell, cell, cell);
        }
      }
      ctx.restore();
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;

      mouseX += (targetMX - mouseX) * 0.03;
      mouseY += (targetMY - mouseY) * 0.03;

      ctx.clearRect(0, 0, w, h);
      drawBoardHaze();

      for (const p of pieces) {
        if (!reduceMotion) {
          p.x += (p.vx * dt) / 1000;
          p.y += (p.vy * dt) / 1000;
          p.rot += p.vrot * dt;
          // wrap around the edges
          if (p.x < -0.12) p.x = 1.12;
          if (p.x > 1.12) p.x = -0.12;
          if (p.y < -0.12) p.y = 1.12;
          if (p.y > 1.12) p.y = -0.12;
        }

        // parallax: nearer pieces move more with scroll + mouse
        const px =
          p.x * w + (mouseX - 0.5) * p.depth * 46;
        const py =
          p.y * h -
          ((scrollY * (0.04 + p.depth * 0.1)) % (h * 1.24)) +
          (mouseY - 0.5) * p.depth * 30;
        // wrap vertical parallax offset
        const wrappedY = ((py % (h * 1.24)) + h * 1.24) % (h * 1.24) - h * 0.12;

        ctx.save();
        ctx.translate(px, wrappedY);
        ctx.rotate(p.rot);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(241,242,233,${0.018 + p.depth * 0.045})`;
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
