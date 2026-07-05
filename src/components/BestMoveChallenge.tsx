import { useCallback, useEffect, useRef, useState } from 'react';
import { puzzles, gauntletReward } from '../data/puzzles';
import { makeBoard, pseudoMoves, pieceSrc, type Board } from '../lib/chess';
import Confetti from './Confetti';

/**
 * FIND THE BEST MOVE — an OPTIONAL challenge. The page shows a
 * teaser; only if the visitor hits Play does the gauntlet open in a
 * modal: three mate-in-one puzzles of rising difficulty, each on a
 * shrinking clock (7s / 10s / 15s). Clear all three and they unlock
 * Kanav's chess.com handle. Nothing is forced; nobody is distracted.
 */

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

type Phase = 'closed' | 'playing' | 'reward';
type Status = 'running' | 'won' | 'lost';

export default function BestMoveChallenge() {
  const [phase, setPhase] = useState<Phase>('closed');
  const [idx, setIdx] = useState(0);
  const [board, setBoard] = useState<Board>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [targets, setTargets] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>('running');
  const [timeLeft, setTimeLeft] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [wrongSq, setWrongSq] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  const puzzle = puzzles[idx];

  const sound = useCallback((kind: 'move' | 'win' | 'nope' | 'finish') => {
    try {
      audioRef.current ??= new AudioContext();
      const ctx = audioRef.current;
      const t = ctx.currentTime;
      const notes =
        kind === 'win'
          ? [523, 659, 784]
          : kind === 'finish'
          ? [523, 659, 784, 1047, 1319]
          : kind === 'nope'
          ? [150]
          : [320];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = kind === 'win' || kind === 'finish' ? 'sine' : 'triangle';
        osc.frequency.value = freq;
        const start = t + i * 0.08;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.13, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.17);
      });
    } catch {
      /* silent */
    }
  }, []);

  const loadPuzzle = useCallback((i: number) => {
    setBoard(makeBoard(puzzles[i].pieces));
    setSelected(null);
    setTargets(new Set());
    setStatus('running');
    setWrong(false);
    setWrongSq(null);
    setShowHint(false);
    setTimeLeft(puzzles[i].seconds * 1000);
  }, []);

  const open = () => {
    setPhase('playing');
    setIdx(0);
    loadPuzzle(0);
  };

  const close = useCallback(() => {
    setPhase('closed');
  }, []);

  // the clock
  useEffect(() => {
    if (phase !== 'playing' || status !== 'running') return;
    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) {
          clearInterval(tick);
          setStatus('lost');
          return 0;
        }
        return t - 100;
      });
    }, 100);
    return () => clearInterval(tick);
  }, [phase, status, idx]);

  // lock body scroll while the modal is up
  useEffect(() => {
    if (phase === 'closed') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [phase, close]);

  // On a phone the board fills the screen; when the puzzle ends, make
  // sure the result (Next / Retry) scrolls into view so it's tappable.
  const sideRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      const t = setTimeout(
        () => sideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        60
      );
      return () => clearTimeout(t);
    }
  }, [status]);

  const onSquare = (square: string) => {
    if (status !== 'running') return;
    const piece = board[square];

    if (selected && targets.has(square)) {
      const sol = puzzle.solution;
      if (selected === sol.from && square === sol.to) {
        // correct — play the move and win
        setBoard((b) => {
          const nb = { ...b };
          nb[square] = nb[selected];
          delete nb[selected];
          return nb;
        });
        setSelected(null);
        setTargets(new Set());
        setStatus('won');
        sound(idx === puzzles.length - 1 ? 'finish' : 'win');
      } else {
        // legal, but not the best move — flash the square red and reset
        setWrong(true);
        setWrongSq(square);
        sound('nope');
        setTimeout(() => {
          setBoard(makeBoard(puzzle.pieces));
          setSelected(null);
          setTargets(new Set());
          setWrong(false);
          setWrongSq(null);
        }, 650);
      }
      return;
    }

    // (re)select one of our own pieces
    if (piece && piece.color === 'w') {
      setSelected(square);
      setTargets(new Set(pseudoMoves(board, square)));
      sound('move');
    } else {
      setSelected(null);
      setTargets(new Set());
    }
  };

  const next = () => {
    if (idx === puzzles.length - 1) {
      setPhase('reward');
    } else {
      const ni = idx + 1;
      setIdx(ni);
      loadPuzzle(ni);
    }
  };

  const totalMs = puzzle ? puzzle.seconds * 1000 : 1;
  const R = 15;
  const C = 2 * Math.PI * R;

  return (
    <>
      {/* ── the teaser card on the page ── */}
      <div className="bmc-teaser">
        <div className="bmc-teaser-left">
          <div className="bmc-mini" aria-hidden="true">
            <div className="bmc-mini-board">
              {Array.from({ length: 16 }, (_, i) => (
                <span key={i} className={(i + Math.floor(i / 4)) % 2 ? 'd' : 'l'} />
              ))}
              <span className="bmc-mini-knight">♞</span>
            </div>
          </div>
          <div>
            <h3 className="bmc-teaser-title">Care for a game?</h3>
            <p className="bmc-teaser-text">
              Three mate-in-one puzzles, rising difficulty, a shrinking clock on
              each. Entirely optional. Solve all three and something unlocks.
            </p>
            <p className="bmc-teaser-meta mono">
              3 puzzles · 7s → 10s → 15s · no pressure
            </p>
          </div>
        </div>
        <button className="bmc-play magnetic" onClick={open}>
          <span className="bmc-play-tri">▶</span> Play
        </button>
      </div>

      {/* ── the modal gauntlet ── */}
      {phase !== 'closed' && (
        <div className="bmc-overlay" onClick={close}>
          <div
            className="bmc-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button className="bmc-close" onClick={close} aria-label="Close">
              ✕
            </button>

            {phase === 'reward' ? (
              <div className="bmc-reward">
                <Confetti />
                <div className="bmc-reward-crown">♛</div>
                <div className="bmc-dots">
                  {puzzles.map((p) => (
                    <span key={p.id} className="bmc-dot done" />
                  ))}
                </div>
                <h3 className="bmc-reward-title">{gauntletReward.title}</h3>
                <p className="bmc-reward-text">{gauntletReward.text}</p>
                <div className="bmc-handles">
                  {gauntletReward.links.map((l) => (
                    <a
                      key={l.href}
                      className="bmc-handle mono"
                      href={l.href}
                      target="_blank"
                      rel="noopener"
                    >
                      <span className="bmc-handle-label">{l.label}</span>
                      <span className="bmc-handle-value">{l.handle} ↗</span>
                    </a>
                  ))}
                </div>
                <button className="bmc-again" onClick={open}>
                  Play again
                </button>
              </div>
            ) : (
              <>
                <div className="bmc-head">
                  <div className="bmc-head-info">
                    <span className="bmc-pill mono">
                      Puzzle {idx + 1}/{puzzles.length}
                    </span>
                    <span className={`bmc-diff mono d-${puzzle.difficulty.toLowerCase()}`}>
                      {puzzle.difficulty}
                    </span>
                    <span className="bmc-name">{puzzle.name}</span>
                  </div>
                  <div className="bmc-dots">
                    {puzzles.map((p, i) => (
                      <span
                        key={p.id}
                        className={`bmc-dot ${i < idx ? 'done' : ''} ${
                          i === idx ? 'current' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bmc-body">
                  <div className="bmc-board-col">
                    <div
                      className={`bmc-board ${status} ${wrong ? 'wrong' : ''}`}
                      role="grid"
                    >
                      {Array.from({ length: 64 }, (_, i) => {
                        const f = i % 8;
                        const r = 7 - Math.floor(i / 8);
                        const square = `${FILES[f]}${r + 1}`;
                        const piece = board[square];
                        const dark = (f + r) % 2 === 0;
                        const isTarget = targets.has(square);
                        const isSel = selected === square;
                        const isRight =
                          status === 'won' && square === puzzle.solution.to;
                        const isBad = wrongSq === square;
                        return (
                          <button
                            key={square}
                            className={[
                              'bmc-sq',
                              dark ? 'dark' : 'light',
                              isTarget ? 'target' : '',
                              isSel ? 'sel' : '',
                              isRight ? 'right' : '',
                              isBad ? 'bad' : '',
                            ].join(' ')}
                            onClick={() => onSquare(square)}
                            aria-label={square}
                          >
                            {f === 0 && <span className="bmc-rank mono">{r + 1}</span>}
                            {r === 0 && <span className="bmc-file mono">{FILES[f]}</span>}
                            {piece && (
                              <img
                                className="bmc-piece"
                                src={pieceSrc(piece)}
                                alt=""
                                draggable={false}
                              />
                            )}
                            {isTarget && !piece && <span className="bmc-dot-hint" />}
                            {isTarget && piece && <span className="bmc-ring-hint" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bmc-side" ref={sideRef}>
                    {/* clock */}
                    <div className="bmc-clock">
                      <svg width="80" height="80" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r={R} className="bmc-clock-bg" />
                        <circle
                          cx="20"
                          cy="20"
                          r={R}
                          className={`bmc-clock-fg ${timeLeft < 3000 ? 'low' : ''}`}
                          strokeDasharray={C}
                          strokeDashoffset={C * (1 - timeLeft / totalMs)}
                          transform="rotate(-90 20 20)"
                        />
                      </svg>
                      <span className={`bmc-clock-num mono ${timeLeft < 3000 ? 'low' : ''}`}>
                        {(timeLeft / 1000).toFixed(1)}
                      </span>
                    </div>

                    {status === 'running' && (
                      <>
                        <p className="bmc-prompt mono">{puzzle.prompt}</p>
                        <p className="bmc-guide">
                          Tap a white piece to see its moves, then play the one
                          that ends it.
                        </p>
                        {wrong && (
                          <p className="bmc-nope mono">Legal, but not the win.</p>
                        )}
                        <button
                          className="bmc-hintbtn mono"
                          onClick={() => setShowHint((s) => !s)}
                        >
                          {showHint ? 'Hide hint' : '💡 Hint'}
                        </button>
                        {showHint && <p className="bmc-hint">{puzzle.hint}</p>}
                      </>
                    )}

                    {status === 'won' && (
                      <div className="bmc-result won">
                        <span className="bmc-badge mono">{puzzle.solutionSan}</span>
                        <h4>Brilliant.</h4>
                        <p>{puzzle.idea}</p>
                        <button className="bmc-next" onClick={next}>
                          {idx === puzzles.length - 1
                            ? 'Claim your reward ▸'
                            : 'Next puzzle ▸'}
                        </button>
                      </div>
                    )}

                    {status === 'lost' && (
                      <div className="bmc-result lost">
                        <h4>Time.</h4>
                        <p>
                          The move was <b className="mono">{puzzle.solutionSan}</b>.
                          Want another crack at it?
                        </p>
                        <div className="bmc-lost-btns">
                          <button className="bmc-next" onClick={() => loadPuzzle(idx)}>
                            ↺ Retry
                          </button>
                          <button className="bmc-ghostbtn" onClick={close}>
                            Maybe later
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* ── teaser ── */
        .bmc-teaser {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
          background: var(--bg-elev);
          border: 1px solid var(--line-strong);
          border-radius: 18px;
          padding: 34px 36px;
        }
        .bmc-teaser-left { display: flex; align-items: center; gap: 26px; }
        .bmc-mini-board {
          position: relative;
          width: 84px; height: 84px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .bmc-mini-board span.l { background: #20261c; }
        .bmc-mini-board span.d { background: #161b12; }
        .bmc-mini-knight {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-size: 2.4rem;
          color: var(--accent);
          text-shadow: 0 0 16px rgba(212,249,51,0.5);
        }
        .bmc-teaser-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .bmc-teaser-text { color: var(--ivory-dim); max-width: 46ch; font-size: 0.96rem; }
        .bmc-teaser-meta {
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 10px;
        }
        .bmc-play {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--accent);
          color: var(--bg);
          border: none;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 16px 30px;
          border-radius: 999px;
        }
        .bmc-play-tri { font-size: 0.7rem; }

        /* ── overlay + modal ── */
        .bmc-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(6, 8, 6, 0.82);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          padding: 20px;
          animation: bmc-fade 0.25s ease;
        }
        @keyframes bmc-fade { from { opacity: 0; } }
        .bmc-modal {
          position: relative;
          width: min(880px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          background: var(--bg);
          border: 1px solid var(--line-strong);
          border-radius: 20px;
          padding: 30px;
          animation: bmc-pop 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes bmc-pop { from { opacity: 0; transform: translateY(18px) scale(0.98); } }
        .bmc-close {
          position: absolute;
          top: 18px; right: 18px;
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1px solid var(--line-strong);
          background: none;
          color: var(--ivory-dim);
          font-size: 0.9rem;
          z-index: 2;
        }
        .bmc-close:hover { border-color: var(--accent); color: var(--accent); }

        .bmc-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 22px;
          padding-right: 40px;
        }
        .bmc-head-info { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .bmc-pill {
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          border: 1px solid var(--line-strong);
          padding: 4px 10px;
          border-radius: 999px;
        }
        .bmc-diff {
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          font-weight: 700;
        }
        .d-easy { background: rgba(27,172,162,0.16); color: #4fd6c9; }
        .d-medium { background: rgba(91,139,176,0.18); color: #85b0d6; }
        .d-hard { background: rgba(224,80,60,0.16); color: #f0846f; }
        .bmc-name {
          font-family: var(--font-display);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .bmc-dots { display: flex; gap: 7px; }
        .bmc-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          border: 1px solid var(--line-strong);
        }
        .bmc-dot.done { background: var(--accent); border-color: var(--accent); }
        .bmc-dot.current { border-color: var(--accent); }

        .bmc-body { display: grid; grid-template-columns: 1fr 260px; gap: 28px; }
        .bmc-board {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          aspect-ratio: 1;
          border: 1px solid var(--line-strong);
          border-radius: 10px;
          overflow: hidden;
          transition: box-shadow 0.4s;
        }
        .bmc-board.won { box-shadow: 0 0 0 1px var(--accent), 0 0 50px rgba(212,249,51,0.22); }
        .bmc-board.wrong { animation: bmc-shake 0.4s; }
        @keyframes bmc-shake {
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .bmc-sq {
          position: relative;
          border: none;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          padding: 0;
        }
        /* classic tournament board so the realistic pieces read clearly */
        .bmc-sq.light { background: #eeeed2; }
        .bmc-sq.dark { background: #6f9350; }
        .bmc-sq.sel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(212, 249, 51, 0.55);
        }
        .bmc-sq.right::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(96, 224, 84, 0.95), rgba(96, 224, 84, 0.4));
          animation: bmc-glow 0.5s ease;
        }
        .bmc-sq.bad::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(224, 80, 60, 0.95), rgba(224, 80, 60, 0.4));
          animation: bmc-glow 0.4s ease;
        }
        @keyframes bmc-glow { from { opacity: 0; transform: scale(0.6); } }
        .bmc-rank { position: absolute; top: 1px; left: 2px; font-size: 0.5rem; color: rgba(0,0,0,0.4); z-index: 2; }
        .bmc-file { position: absolute; bottom: 0; right: 2px; font-size: 0.5rem; color: rgba(0,0,0,0.4); z-index: 2; }
        .bmc-piece {
          width: 82%;
          height: 82%;
          object-fit: contain;
          user-select: none;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.28));
          transition: transform 0.2s;
        }
        .bmc-sq.sel .bmc-piece { transform: scale(1.06); }
        .bmc-dot-hint {
          width: 30%; height: 30%;
          border-radius: 50%;
          background: rgba(20, 30, 15, 0.32);
          z-index: 1;
        }
        .bmc-ring-hint {
          position: absolute; inset: 6%;
          border-radius: 50%;
          box-shadow: inset 0 0 0 4px rgba(20, 30, 15, 0.3);
          z-index: 1;
        }

        .bmc-side { display: flex; flex-direction: column; }
        .bmc-clock {
          position: relative;
          width: 80px; height: 80px;
          margin-bottom: 18px;
        }
        .bmc-clock-bg { fill: none; stroke: var(--line-strong); stroke-width: 2.5; }
        .bmc-clock-fg {
          fill: none;
          stroke: var(--accent);
          stroke-width: 2.5;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.1s linear, stroke 0.3s;
        }
        .bmc-clock-fg.low { stroke: #e0503c; }
        .bmc-clock-num {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--ivory);
        }
        .bmc-clock-num.low { color: #f0846f; }
        .bmc-prompt {
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 10px;
        }
        .bmc-guide { color: var(--ivory-dim); font-size: 0.9rem; }
        .bmc-nope { color: #f0846f; font-size: 0.8rem; margin-top: 12px; }
        .bmc-hintbtn {
          align-self: flex-start;
          margin-top: 16px;
          background: none;
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ivory-dim);
        }
        .bmc-hintbtn:hover { border-color: var(--accent); color: var(--accent); }
        .bmc-hint {
          margin-top: 14px;
          font-size: 0.85rem;
          color: var(--ivory-dim);
          padding: 12px 14px;
          border-left: 2px solid var(--accent);
          background: var(--accent-soft);
          border-radius: 0 8px 8px 0;
        }
        .bmc-result h4 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .bmc-result p { color: var(--ivory-dim); font-size: 0.9rem; }
        .bmc-badge {
          display: inline-block;
          background: #1baca2;
          color: #fff;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 14px;
          box-shadow: 0 3px 14px rgba(27,172,162,0.4);
        }
        .bmc-next {
          margin-top: 18px;
          background: var(--accent);
          color: var(--bg);
          border: none;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.76rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 12px 20px;
          border-radius: 999px;
        }
        .bmc-lost-btns { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
        .bmc-ghostbtn {
          background: none;
          border: 1px solid var(--line-strong);
          color: var(--ivory-dim);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 12px 18px;
          border-radius: 999px;
        }

        /* ── reward ── */
        .bmc-reward { text-align: center; padding: 24px 10px 10px; }
        .bmc-reward-crown {
          font-size: 3.4rem;
          color: var(--accent);
          text-shadow: 0 0 30px rgba(212,249,51,0.5);
          margin-bottom: 14px;
        }
        .bmc-reward .bmc-dots { justify-content: center; margin-bottom: 22px; }
        .bmc-reward-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .bmc-reward-text {
          color: var(--ivory-dim);
          max-width: 44ch;
          margin: 0 auto 26px;
        }
        .bmc-handles {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .bmc-handle {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
          padding: 18px 34px;
          border: 1px solid var(--accent);
          border-radius: 14px;
          background: var(--accent-soft);
          transition: transform 0.2s;
        }
        .bmc-handle:hover { transform: translateY(-3px); }
        .bmc-handle-label {
          font-size: 0.64rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .bmc-handle-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--accent);
        }
        .bmc-again {
          display: block;
          margin: 22px auto 0;
          background: none;
          border: 1px solid var(--line-strong);
          color: var(--ivory-dim);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 20px;
          border-radius: 999px;
        }

        @media (max-width: 720px) {
          .bmc-body { grid-template-columns: 1fr; }
          /* keep the board from eating the whole screen so the panel + buttons show */
          .bmc-board { max-width: 74vh; margin: 0 auto; width: 100%; }
          .bmc-side { flex-direction: row; flex-wrap: wrap; align-items: flex-start; gap: 16px; }
          .bmc-clock { margin-bottom: 0; }
          .bmc-next, .bmc-ghostbtn { padding: 14px 22px; font-size: 0.8rem; }
        }
      `}</style>
    </>
  );
}
