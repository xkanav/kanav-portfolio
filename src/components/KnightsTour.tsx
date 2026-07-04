import { useEffect, useMemo, useRef, useState } from 'react';
import { boardFacts, tourEndgame } from '../data/facts';

/**
 * OFF THE BOARD — the interactive centerpiece.
 * The visitor IS the knight. Real knight moves only; fact squares
 * reveal the person behind the resume. Finding everything unlocks
 * the endgame card. Each hop makes a soft wooden piece-tap sound
 * (synthesized, no audio files, toggleable).
 */

const SIZE = 5;
const FILES = ['a', 'b', 'c', 'd', 'e'];

const toSquare = (idx: number) =>
  `${FILES[idx % SIZE]}${SIZE - Math.floor(idx / SIZE)}`;

const KNIGHT_DELTAS = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
];

function legalFrom(idx: number): number[] {
  const r = Math.floor(idx / SIZE);
  const c = idx % SIZE;
  const out: number[] = [];
  for (const [dr, dc] of KNIGHT_DELTAS) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) out.push(nr * SIZE + nc);
  }
  return out;
}

const START_IDX = 12; // c3, the centre

export default function KnightsTour() {
  const factBySquare = useMemo(
    () => new Map(boardFacts.map((f) => [f.square, f])),
    []
  );

  const [knight, setKnight] = useState(START_IDX);
  const [visited, setVisited] = useState<Set<number>>(new Set([START_IDX]));
  const [found, setFound] = useState<Set<string>>(new Set(['c3']));
  const [active, setActive] = useState(factBySquare.get('c3') ?? null);
  const [shake, setShake] = useState<number | null>(null);
  const [sound, setSound] = useState(true);
  const [voice, setVoice] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const clipRef = useRef<HTMLAudioElement | null>(null);

  // Read a fact aloud. If the fact has a recorded clip (your cloned
  // voice), play that; otherwise fall back to the browser's speech.
  const stopNarration = () => {
    if (clipRef.current) {
      clipRef.current.pause();
      clipRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Play a fact's narration. Prefers a recorded clip (fact.audio, or
  // the convention /facts/<square>.mp3 — just drop the file in); if
  // none exists it falls back to the browser's speech synthesis.
  const speakFact = (fact: (typeof boardFacts)[number]) => {
    stopNarration();
    const src = fact.audio ?? `/facts/${fact.square}.m4a`;
    const clip = new Audio(src);
    clipRef.current = clip;
    clip.play().catch(() => {
      if (clipRef.current === clip) clipRef.current = null;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(fact.text));
      }
    });
  };

  const narrate = (fact: (typeof boardFacts)[number]) => {
    if (voice) speakFact(fact);
  };

  useEffect(() => stopNarration, []);

  // A soft wooden "piece placed on board" tap, fully synthesized
  const tap = (found: boolean) => {
    if (!sound) return;
    try {
      audioCtxRef.current ??= new AudioContext();
      const ctx = audioCtxRef.current;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(found ? 340 : 190, t);
      osc.frequency.exponentialRampToValueAtTime(found ? 220 : 120, t + 0.07);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch {
      /* audio unavailable: stay silent */
    }
  };

  const legal = useMemo(() => new Set(legalFrom(knight)), [knight]);
  const allFound = found.size >= boardFacts.length;

  const jump = (idx: number) => {
    if (!legal.has(idx)) {
      setShake(idx);
      setTimeout(() => setShake(null), 400);
      return;
    }
    setKnight(idx);
    setVisited((v) => new Set(v).add(idx));
    const sq = toSquare(idx);
    const fact = factBySquare.get(sq);
    tap(!!fact);
    if (fact) {
      setFound((f) => new Set(f).add(sq));
      setActive(fact);
      narrate(fact);
    }
  };

  const toggleVoice = () => {
    setVoice((v) => {
      const next = !v;
      if (!next) stopNarration();
      else if (active) setTimeout(() => speakFact(active), 0);
      return next;
    });
  };

  const knightR = Math.floor(knight / SIZE);
  const knightC = knight % SIZE;

  return (
    <div className="kt">
      <div className="kt-board-wrap">
        <div className="kt-board" role="grid" aria-label="Interactive knight's tour board">
          {Array.from({ length: SIZE * SIZE }, (_, idx) => {
            const r = Math.floor(idx / SIZE);
            const c = idx % SIZE;
            const sq = toSquare(idx);
            const fact = factBySquare.get(sq);
            const isDark = (r + c) % 2 === 1;
            const isVisited = visited.has(idx);
            const isLegal = legal.has(idx);
            const isFound = fact && found.has(sq);
            return (
              <button
                key={idx}
                className={[
                  'kt-sq',
                  isDark ? 'dark' : 'light',
                  isLegal ? 'legal' : '',
                  isVisited ? 'visited' : '',
                  isFound ? 'found' : '',
                  shake === idx ? 'shake' : '',
                  active && fact?.square === active.square && isFound ? 'active' : '',
                ].join(' ')}
                onClick={() => jump(idx)}
                aria-label={`Square ${sq}${isLegal ? ', legal move' : ''}`}
              >
                <span className="kt-coord mono">{sq}</span>
                {fact && (
                  <span
                    className={`kt-tag mono ${isFound ? 'revealed' : 'hidden-fact'}`}
                  >
                    {isFound ? fact.tag : '?'}
                  </span>
                )}
                {isLegal && <span className="kt-dot" />}
              </button>
            );
          })}
          <div
            className="kt-knight"
            style={{
              transform: `translate(${knightC * 100}%, ${knightR * 100}%)`,
            }}
            aria-hidden="true"
          >
            ♞
          </div>
        </div>
        <p className="kt-help mono">
          You are the knight. Two squares one way, one square across.
          <button
            className="kt-sound mono"
            onClick={() => setSound((s) => !s)}
            aria-pressed={sound}
          >
            sound {sound ? 'on' : 'off'}
          </button>
        </p>
      </div>

      <div className="kt-panel">
        <div className="kt-progress mono">
          <span className="accent">{found.size}</span>/{boardFacts.length} squares of me found
          <span className="kt-bar">
            <span
              className="kt-bar-fill"
              style={{ width: `${(found.size / boardFacts.length) * 100}%` }}
            />
          </span>
        </div>

        {allFound ? (
          <div className="kt-card kt-endgame">
            <div className="kt-chip mono">♛</div>
            <h3 className="kt-card-title">{tourEndgame.title}</h3>
            <p className="kt-card-text">{tourEndgame.text}</p>
            <a href={tourEndgame.cta.href} className="kt-cta mono">
              {tourEndgame.cta.label} ▸
            </a>
          </div>
        ) : active ? (
          <div className={`kt-card ${active.big ? 'big' : ''}`} key={active.square}>
            <div className="kt-card-top">
              <div className="kt-chip mono">{active.tag}</div>
              <button
                className={`kt-voice mono ${voice ? 'on' : ''}`}
                onClick={toggleVoice}
                aria-pressed={voice}
                title={voice ? 'Voice on — click to mute' : 'Hear it in my voice'}
              >
                {voice ? '🔊' : '🔇'} <span className="kt-voice-label">{voice ? 'voice on' : 'voice off'}</span>
              </button>
            </div>
            <h3 className="kt-card-title">{active.title}</h3>
            <p className="kt-card-text">{active.text}</p>
            {active.image && (
              <img
                className="kt-card-img"
                src={active.image}
                alt={active.title}
                loading="lazy"
              />
            )}
            <span className="kt-card-sq mono">found on {active.square}</span>
          </div>
        ) : null}
      </div>

      <style>{`
        .kt {
          display: grid;
          grid-template-columns: minmax(300px, 480px) 1fr;
          gap: 48px;
          align-items: start;
        }
        .kt-board-wrap { position: relative; }
        .kt-board {
          position: relative;
          display: grid;
          grid-template-columns: repeat(${SIZE}, 1fr);
          aspect-ratio: 1;
          border: 1px solid var(--line-strong);
          border-radius: 12px;
          overflow: hidden;
        }
        .kt-sq {
          position: relative;
          border: none;
          background: var(--bg-elev);
          aspect-ratio: 1;
          font: inherit;
          transition: background 0.25s;
        }
        .kt-sq.dark { background: var(--bg-elev-2); }
        .kt-sq.visited.light { background: #171b12; }
        .kt-sq.visited.dark { background: #1c2115; }
        .kt-sq.legal {
          outline: 1px solid rgba(212, 249, 51, 0.35);
          outline-offset: -1px;
        }
        .kt-sq.legal:hover { background: var(--accent-soft); }
        .kt-sq.shake { animation: kt-shake 0.35s; }
        @keyframes kt-shake {
          20% { transform: translateX(-3px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
        .kt-coord {
          position: absolute;
          top: 5px;
          left: 7px;
          font-size: 0.55rem;
          letter-spacing: 0.08em;
          color: var(--muted);
          opacity: 0.7;
        }
        .kt-dot {
          position: absolute;
          bottom: 7px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          animation: kt-pulse 1.6s infinite;
        }
        @keyframes kt-pulse {
          50% { opacity: 0.3; transform: translateX(-50%) scale(0.7); }
        }
        .kt-tag {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-size: clamp(0.62rem, 1.7vw, 0.82rem);
          font-weight: 700;
          letter-spacing: 0.12em;
        }
        .kt-tag.hidden-fact {
          color: var(--ivory-dim);
          opacity: 0.9;
          font-weight: 700;
        }
        .kt-tag.revealed {
          color: var(--accent);
          animation: kt-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes kt-pop {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        .kt-sq.active { box-shadow: inset 0 0 0 2px var(--accent); }
        .kt-knight {
          position: absolute;
          top: 0;
          left: 0;
          width: ${100 / SIZE}%;
          height: ${100 / SIZE}%;
          display: grid;
          place-items: center;
          font-size: clamp(1.7rem, 4.5vw, 2.5rem);
          color: var(--accent);
          text-shadow: 0 0 22px rgba(212, 249, 51, 0.55);
          pointer-events: none;
          transition: transform 0.45s cubic-bezier(0.34, 1.3, 0.5, 1);
          z-index: 2;
        }
        .kt-help {
          margin-top: 14px;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .kt-sound {
          background: none;
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ivory-dim);
        }
        .kt-sound:hover { border-color: var(--accent); color: var(--accent); }
        .kt-panel { position: sticky; top: 110px; }
        .kt-progress {
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          color: var(--ivory-dim);
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .kt-bar {
          flex: 1;
          min-width: 120px;
          height: 3px;
          background: var(--line-strong);
          border-radius: 99px;
          overflow: hidden;
        }
        .kt-bar-fill {
          display: block;
          height: 100%;
          background: var(--accent);
          transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .kt-card {
          background: var(--bg-elev);
          border: 1px solid var(--line-strong);
          border-radius: 16px;
          padding: 34px 32px;
          animation: kt-card-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .kt-card.big { border-color: rgba(212, 249, 51, 0.5); }
        @keyframes kt-card-in {
          from { opacity: 0; transform: translateY(16px); }
        }
        .kt-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }
        .kt-chip {
          display: inline-grid;
          place-items: center;
          min-width: 46px;
          height: 34px;
          padding: 0 10px;
          border: 1px solid rgba(212, 249, 51, 0.4);
          border-radius: 8px;
          color: var(--accent);
          font-weight: 700;
          letter-spacing: 0.14em;
        }
        .kt-voice {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
        }
        .kt-voice.on { color: var(--accent); border-color: rgba(212, 249, 51, 0.45); }
        .kt-voice:hover { border-color: var(--accent); }
        @media (max-width: 420px) { .kt-voice-label { display: none; } }
        .kt-card-title {
          font-family: var(--font-display);
          font-size: 1.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          margin-bottom: 10px;
        }
        .kt-card-text {
          color: var(--ivory-dim);
          font-size: 1rem;
          max-width: 46ch;
        }
        .kt-card-img {
          margin-top: 18px;
          border-radius: 12px;
          max-height: 260px;
          object-fit: cover;
          width: 100%;
          border: 1px solid var(--line-strong);
        }
        .kt-card-sq {
          display: inline-block;
          margin-top: 18px;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .kt-endgame { border-color: var(--accent); }
        .kt-endgame .kt-chip { border-color: var(--accent); font-size: 1rem; }
        .kt-cta {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background: var(--accent);
          color: var(--bg);
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 999px;
        }
        @media (max-width: 860px) {
          .kt { grid-template-columns: 1fr; gap: 32px; }
          .kt-panel { position: static; }
        }
      `}</style>
    </div>
  );
}
