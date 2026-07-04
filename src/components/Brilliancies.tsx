import { useState } from 'react';
import { achievementCategories } from '../data/achievements';

/**
 * BRILLIANCY — the competition record, badged like chess.com move
 * quality: !! brilliant (teal), ! great (blue), !? interesting
 * (yellow). Rows are collapsed to name + placing + field; clicking
 * expands the story (and photo, when provided).
 */

const BADGE: Record<string, { bg: string; label: string }> = {
  '!!': { bg: '#1baca2', label: 'Brilliant' },
  '!': { bg: '#5b8bb0', label: 'Great move' },
  '!?': { bg: '#e8a33d', label: 'Interesting' },
};

export default function Brilliancies() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="br-grid">
      {achievementCategories.map((cat) => (
        <div className="br-col" key={cat.category}>
          <h3 className="br-cat mono">{cat.category}</h3>
          <ul className="br-list">
            {cat.achievements.map((a) => {
              const id = `${cat.category}:${a.event}`;
              const isOpen = open === id;
              const badge = BADGE[a.annotation];
              return (
                <li className={`br-item ${isOpen ? 'open' : ''}`} key={id}>
                  <button
                    className="br-row"
                    onClick={() => setOpen(isOpen ? null : id)}
                    aria-expanded={isOpen}
                  >
                    <span
                      className="br-badge mono"
                      style={{ background: badge.bg }}
                      title={badge.label}
                    >
                      {a.annotation}
                    </span>
                    <span className="br-main">
                      <span className="br-event">{a.event}</span>
                      <span className="br-sub mono">
                        <b data-first={a.result === '1st Place'}>{a.result}</b>
                        {' · '}
                        {a.field}
                        {a.host ? ` · ${a.host}` : ''}
                      </span>
                    </span>
                    <span className={`br-caret ${isOpen ? 'up' : ''}`}>▾</span>
                  </button>
                  <div className="br-detail" aria-hidden={!isOpen}>
                    <div className="br-detail-inner">
                      <p>{a.description}</p>
                      {a.image && (
                        <img
                          src={a.image}
                          alt={a.event}
                          loading="lazy"
                          className="br-img"
                        />
                      )}
                      {a.deck && (
                        <a
                          className="br-deck mono"
                          href={a.deck}
                          target="_blank"
                          rel="noopener"
                        >
                          {a.deckLabel ?? 'The deck'} ↗
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <style>{`
        .br-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          align-items: start;
        }
        .br-cat {
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          padding-bottom: 14px;
          border-bottom: 1px solid var(--line-strong);
        }
        .br-list { list-style: none; }
        .br-item { border-bottom: 1px solid var(--line); }
        .br-row {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 16px 0;
          background: none;
          border: none;
          font: inherit;
          color: inherit;
          text-align: left;
        }
        .br-badge {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
        }
        .br-main { flex: 1; min-width: 0; }
        .br-event {
          display: block;
          font-weight: 600;
          font-size: 0.98rem;
          line-height: 1.3;
        }
        .br-row:hover .br-event { color: var(--accent); }
        .br-sub {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 4px;
        }
        .br-sub b { font-weight: 400; }
        .br-sub b[data-first='true'] { color: var(--accent); font-weight: 700; }
        .br-caret {
          color: var(--muted);
          font-size: 0.8rem;
          transition: transform 0.3s;
        }
        .br-caret.up { transform: rotate(180deg); color: var(--accent); }
        .br-detail {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .br-item.open .br-detail { grid-template-rows: 1fr; }
        .br-detail-inner { overflow: hidden; }
        .br-detail-inner p {
          color: var(--ivory-dim);
          font-size: 0.9rem;
          padding: 0 0 18px 48px;
          max-width: 52ch;
        }
        .br-img {
          margin: 0 0 18px 48px;
          border-radius: 12px;
          max-height: 300px;
          width: calc(100% - 48px);
          object-fit: cover;
          object-position: center top;
          border: 1px solid var(--line-strong);
        }
        .br-deck {
          display: inline-block;
          margin: 0 0 18px 48px;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          border-bottom: 1px solid rgba(212, 249, 51, 0.4);
          padding-bottom: 2px;
        }
        .br-deck:hover { border-color: var(--accent); }
        @media (max-width: 900px) {
          .br-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </div>
  );
}
