import { useMemo } from 'react';

/**
 * A one-shot confetti burst, rendered when the gauntlet is cleared.
 * Pure CSS animation over ~70 bits; a few are chess glyphs for
 * theme. Positioned fixed so it rains over the whole viewport.
 */

const COLORS = ['#d4f933', '#ffffff', '#1baca2', '#f0846f', '#85b0d6'];
const GLYPHS = ['♞', '♛', '♚', '♜'];

export default function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        const isGlyph = i % 7 === 0;
        return {
          left: Math.random() * 100,
          drift: (Math.random() - 0.5) * 240,
          delay: Math.random() * 0.5,
          dur: 2.4 + Math.random() * 1.8,
          color: COLORS[i % COLORS.length],
          size: 7 + Math.random() * 9,
          spin: Math.random() * 720 - 360,
          glyph: isGlyph ? GLYPHS[i % GLYPHS.length] : null,
        };
      }),
    []
  );

  return (
    <div className="cft" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className={b.glyph ? 'cft-bit glyph' : 'cft-bit'}
          style={{
            left: `${b.left}%`,
            color: b.color,
            background: b.glyph ? 'transparent' : b.color,
            width: b.glyph ? 'auto' : `${b.size}px`,
            height: b.glyph ? 'auto' : `${b.size * 0.4}px`,
            fontSize: b.glyph ? `${b.size + 8}px` : undefined,
            ['--drift' as string]: `${b.drift}px`,
            ['--spin' as string]: `${b.spin}deg`,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
      <style>{`
        .cft {
          position: fixed;
          inset: 0;
          z-index: 300;
          pointer-events: none;
          overflow: hidden;
        }
        .cft-bit {
          position: absolute;
          top: -6%;
          border-radius: 1px;
          opacity: 0;
          animation-name: cft-fall;
          animation-timing-function: cubic-bezier(0.3, 0.6, 0.7, 1);
          animation-fill-mode: forwards;
        }
        .cft-bit.glyph {
          text-shadow: 0 0 10px rgba(212, 249, 51, 0.4);
          line-height: 1;
        }
        @keyframes cft-fall {
          0% { opacity: 1; transform: translate(0, 0) rotate(0); }
          100% {
            opacity: 0;
            transform: translate(var(--drift), 108vh) rotate(var(--spin));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cft { display: none; }
        }
      `}</style>
    </div>
  );
}
