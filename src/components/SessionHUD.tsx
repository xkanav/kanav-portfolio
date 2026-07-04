import { useEffect, useState } from 'react';

/**
 * Session HUD, bottom-left: a ticking chess clock for time-on-site
 * and a move counter driven by scroll depth, plus a thin progress
 * ring. The visitor is "playing a game" against the page.
 */

const TOTAL_MOVES = 40; // a classical game's nominal length

export default function SessionHUD() {
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const clock = setInterval(() => setSeconds((s) => s + 1), 1000);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearInterval(clock);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const move = Math.max(1, Math.round(progress * TOTAL_MOVES));

  const R = 15;
  const C = 2 * Math.PI * R;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 22,
        bottom: 22,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '9px 14px',
        background: 'rgba(14, 18, 16, 0.72)',
        border: '1px solid var(--line)',
        borderRadius: 999,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11.5,
        letterSpacing: '0.06em',
        color: 'var(--ivory-dim)',
        userSelect: 'none',
      }}
      className="session-hud"
    >
      {/* scroll ring with a pawn that promotes to a queen at the end */}
      <span style={{ position: 'relative', width: 34, height: 34 }}>
        <svg width="34" height="34" viewBox="0 0 34 34">
          <circle
            cx="17"
            cy="17"
            r={R}
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="1.5"
          />
          <circle
            cx="17"
            cy="17"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            transform="rotate(-90 17 17)"
            style={{ transition: 'stroke-dashoffset 0.2s linear' }}
          />
        </svg>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            fontSize: 14,
            color: 'var(--ivory)',
          }}
        >
          {progress > 0.985 ? '♛' : '♟'}
        </span>
      </span>

      <span>
        <span style={{ color: 'var(--ivory)' }}>
          {mm}:{ss}
        </span>{' '}
        on the clock
      </span>

      <span style={{ opacity: 0.35 }}>·</span>

      <span>
        move <span style={{ color: 'var(--accent)' }}>{move}</span>
        <span style={{ opacity: 0.6 }}>/{TOTAL_MOVES}</span>
      </span>
    </div>
  );
}
