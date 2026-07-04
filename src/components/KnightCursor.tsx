import { useEffect, useRef } from 'react';

/**
 * The knight cursor: a ♞ that trails the pointer with a soft lerp,
 * flips to face its direction of travel, swells over interactive
 * elements, and does a little L-shaped hop on every click.
 * Only activates for fine pointers (mouse/trackpad).
 */
export default function KnightCursor() {
  const knightRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const knight = knightRef.current;
    const dot = dotRef.current;
    if (!knight || !dot) return;

    document.body.classList.add('knight-cursor-active');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let kx = mx;
    let ky = my;
    let scale = 1;
    let targetScale = 1;
    let facing = 1;
    let hopT = 0; // 0..1 progress of the click hop

    const onMove = (e: MouseEvent) => {
      if (e.clientX < mx - 1) facing = -1;
      else if (e.clientX > mx + 1) facing = 1;
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const isInteractive = (el: Element | null) =>
      !!el?.closest('a, button, [role="button"], input, textarea, [data-hover]');

    const onOver = (e: MouseEvent) => {
      targetScale = isInteractive(e.target as Element) ? 1.55 : 1;
    };

    const onDown = () => {
      if (!reduceMotion) hopT = 0.0001; // kick off the L-hop
      targetScale = 0.85;
    };
    const onUp = () => {
      targetScale = 1;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(now - last, 50) / 16.7;
      last = now;

      kx += (mx - kx) * 0.18 * dt;
      ky += (my - ky) * 0.18 * dt;
      scale += (targetScale - scale) * 0.2 * dt;

      // The L-shaped hop: two squares up, one square over.
      let hopX = 0;
      let hopY = 0;
      if (hopT > 0) {
        hopT = Math.min(hopT + 0.06 * dt, 1);
        const SQ = 14;
        if (hopT < 0.6) {
          const t = hopT / 0.6;
          hopY = -2 * SQ * t;
        } else {
          const t = (hopT - 0.6) / 0.4;
          hopY = -2 * SQ;
          hopX = SQ * t * facing;
        }
        if (hopT >= 1) hopT = 0;
      }

      knight.style.transform =
        `translate(${kx + hopX}px, ${ky + hopY}px) ` +
        `translate(-50%, -58%) scale(${scale * facing}, ${scale})`;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      document.body.classList.remove('knight-cursor-active');
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const base: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: 'none',
    willChange: 'transform',
  };

  return (
    <>
      {/* precise dot at the true pointer position */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          ...base,
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          borderRadius: '50%',
          background: 'var(--accent)',
        }}
      />
      {/* the knight that chases it */}
      <div
        ref={knightRef}
        aria-hidden="true"
        style={{
          ...base,
          fontSize: 26,
          lineHeight: 1,
          color: 'var(--ivory)',
          textShadow: '0 0 14px rgba(212,249,51,0.45)',
          userSelect: 'none',
        }}
      >
        ♞
      </div>
    </>
  );
}
