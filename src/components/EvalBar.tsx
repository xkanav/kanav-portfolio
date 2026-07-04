import { useEffect, useState } from 'react';

/**
 * EVAL BAR — a quiet chess-engine evaluation bar on the right edge.
 * White fills from the bottom as the visitor scrolls (White, i.e.
 * you, is winning); it reads a decisive "#1" at the contact section.
 * Deliberately understated: thin, low-contrast, no chrome, only
 * shows itself once the reader has actually started scrolling.
 */
export default function EvalBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const evalScore = 0.3 + Math.pow(progress, 1.7) * 8;
  const mate = progress > 0.97;
  const label = mate ? '#1' : `+${evalScore.toFixed(1)}`;
  const fillPct = 5 + progress * 90;

  return (
    <div
      className="evalbar"
      aria-hidden="true"
      style={{ opacity: progress > 0.02 ? 1 : 0 }}
    >
      <div className="evalbar-track">
        <div className="evalbar-white" style={{ height: `${fillPct}%` }} />
      </div>
      <span className={`evalbar-num mono ${mate ? 'mate' : ''}`}>{label}</span>

      <style>{`
        .evalbar {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 95;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        .evalbar-track {
          position: relative;
          width: 3px;
          height: 34vh;
          max-height: 300px;
          background: rgba(241, 242, 233, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }
        .evalbar-white {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--ivory);
          border-radius: 999px;
          transition: height 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .evalbar-num {
          font-size: 0.6rem;
          letter-spacing: 0.06em;
          color: var(--muted);
          transition: color 0.3s;
        }
        .evalbar-num.mate {
          color: var(--accent);
          font-weight: 700;
        }
        @media (max-width: 900px) {
          .evalbar { display: none; }
        }
      `}</style>
    </div>
  );
}
