import { useEffect, useRef, useState } from 'react';
import { timeline } from '../data/timeline';

/**
 * THE JOURNEY — a clean vertical timeline of education, leadership
 * and work experience. A marker travels down the rail with scroll,
 * lighting up each entry as it's reached.
 */

const KIND_LABEL: Record<string, string> = {
  education: 'Education',
  experience: 'Experience',
  leadership: 'Leadership',
};

export default function GameTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;
          const total = rect.height + vh * 0.3;
          const passed = vh * 0.75 - rect.top;
          setProgress(Math.min(Math.max(passed / total, 0), 1));
        }
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

  const n = timeline.length;

  return (
    <div ref={sectionRef} className="tl">
      <div className="tl-rail" aria-hidden="true">
        <div className="tl-rail-fill" style={{ height: `${progress * 100}%` }} />
        <div className="tl-knight" style={{ top: `${progress * 100}%` }}>
          ♞
        </div>
      </div>

      <ol className="tl-list">
        {timeline.map((entry, i) => {
          const reached = progress >= (i + 0.5) / n;
          return (
            <li
              key={`${entry.title}-${i}`}
              className={`tl-item ${reached ? 'is-reached' : ''}`}
            >
              <span className="tl-node" aria-hidden="true" />
              <div className="tl-meta mono">
                {entry.date}
                {entry.endDate ? ` → ${entry.endDate}` : ''}
                <span className="tl-kind">{KIND_LABEL[entry.kind]}</span>
              </div>
              <h3 className="tl-title">{entry.title}</h3>
              <div className="tl-org">{entry.org}</div>
              <p className="tl-detail">{entry.detail}</p>
            </li>
          );
        })}
        <li className={`tl-item tl-next ${progress > 0.95 ? 'is-reached' : ''}`}>
          <span className="tl-node" aria-hidden="true" />
          <div className="tl-meta mono">On the way</div>
          <h3 className="tl-title">More to come</h3>
          <p className="tl-detail">
            New roles and projects are already in motion. This page updates as
            they land.
          </p>
        </li>
      </ol>

      <style>{`
        .tl {
          position: relative;
          padding-left: 8px;
        }
        .tl-rail {
          position: absolute;
          top: 8px;
          bottom: 8px;
          left: 8px;
          width: 2px;
          background: var(--line);
        }
        .tl-rail-fill {
          position: absolute;
          top: 0; left: 0; right: 0;
          background: linear-gradient(to bottom, transparent, var(--accent));
          transition: height 0.15s linear;
        }
        .tl-knight {
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 22px;
          color: var(--accent);
          text-shadow: 0 0 16px rgba(212, 249, 51, 0.5);
          transition: top 0.15s linear;
          line-height: 1;
        }
        .tl-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 52px;
          padding: 8px 0 8px 38px;
        }
        .tl-item {
          position: relative;
          opacity: 0.3;
          transform: translateX(10px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .tl-item.is-reached { opacity: 1; transform: none; }
        .tl-node {
          position: absolute;
          left: -38px;
          top: 6px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: var(--bg);
          border: 2px solid var(--muted);
          transform: translateX(-4px);
          transition: border-color 0.4s, background 0.4s;
        }
        .tl-item.is-reached .tl-node {
          border-color: var(--accent);
          background: var(--accent);
        }
        .tl-meta {
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 8px;
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }
        .tl-kind {
          padding: 2px 9px;
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          font-size: 0.66rem;
        }
        .tl-title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 600;
          line-height: 1.2;
          text-transform: uppercase;
        }
        .tl-org { color: var(--accent); font-size: 0.95rem; margin-top: 3px; }
        .tl-detail {
          color: var(--ivory-dim);
          font-size: 0.98rem;
          margin-top: 10px;
          max-width: 640px;
        }
        @media (prefers-reduced-motion: reduce) {
          .tl-item { opacity: 1; transform: none; }
          .tl-rail-fill, .tl-knight { transition: none; }
        }
      `}</style>
    </div>
  );
}
