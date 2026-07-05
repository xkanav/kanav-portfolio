import { useEffect, useRef, useState } from 'react';

/**
 * PORTRAIT MASK REVEAL — two stacked portrait layers.
 * On desktop a soft spotlight follows the cursor and reveals the
 * "back" image through the "front" one. On touch devices (no cursor)
 * a small button flips between the two images instead.
 *
 * backTinted=true turns the back image into a chartreuse duotone via
 * CSS, so the effect reads even when front and back are the same
 * photo. Once a dedicated second image exists, pass it as `back` and
 * set backTinted={false}.
 */

type Props = {
  front: string;
  back: string;
  alt: string;
  caption?: string;
  backTinted?: boolean;
};

const RADIUS = 240; // px, size of the reveal spotlight

export default function PortraitReveal({
  front,
  back,
  alt,
  caption,
  backTinted = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [active, setActive] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    setActive(true);
  };

  const maskValue =
    `radial-gradient(circle ${RADIUS}px at ${pos.x}px ${pos.y}px, ` +
    `#000 0, #000 55%, rgba(0,0,0,0) 100%)`;

  // On touch, the back layer shows fully when flipped (no spotlight).
  const backStyle: React.CSSProperties = isTouch
    ? { opacity: flipped ? 1 : 0 }
    : { opacity: active ? 1 : 0, WebkitMaskImage: maskValue, maskImage: maskValue };

  return (
    <div
      ref={ref}
      className="pr"
      onMouseMove={onMove}
      onMouseLeave={() => setActive(false)}
      onMouseEnter={onMove}
    >
      <img className="pr-layer" src={front} alt={alt} width={440} height={550} />

      <div className="pr-back" style={backStyle} aria-hidden="true">
        <img className={`pr-layer ${backTinted ? 'tinted' : ''}`} src={back} alt="" />
        {backTinted && <span className="pr-tint" />}
        {!isTouch && <span className="pr-ring" style={{ left: pos.x, top: pos.y }} />}
      </div>

      {isTouch ? (
        <button
          className="pr-flip mono"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
        >
          {flipped ? '↩ back' : 'see me live ⇄'}
        </button>
      ) : (
        caption && <figcaption className="pr-cap mono">{caption}</figcaption>
      )}

      <style>{`
        .pr {
          position: relative;
          aspect-ratio: 4 / 5;
          border: 1px solid var(--line-strong);
          border-radius: 18px;
          overflow: hidden;
          background: var(--bg-elev);
          transform: rotate(1.6deg);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pr:hover { transform: rotate(0deg) scale(1.015); }
        .pr::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 18px;
          box-shadow: inset 0 0 0 1px rgba(212, 249, 51, 0.18);
          pointer-events: none;
          z-index: 4;
        }
        .pr-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pr > .pr-layer { filter: grayscale(0.25) contrast(1.06); z-index: 1; }
        .pr-back {
          position: absolute;
          inset: 0;
          z-index: 2;
          transition: opacity 0.35s ease;
          will-change: opacity;
        }
        .pr-back .pr-layer.tinted {
          filter: grayscale(1) contrast(1.35) brightness(1.08);
        }
        /* a real second photo (not the duotone placeholder): frame toward the head */
        .pr-back .pr-layer:not(.tinted) {
          object-position: center 18%;
        }
        .pr-tint {
          position: absolute;
          inset: 0;
          background: var(--accent);
          mix-blend-mode: color;
        }
        .pr-ring {
          position: absolute;
          width: ${RADIUS * 2}px;
          height: ${RADIUS * 2}px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(212, 249, 51, 0.5),
            0 0 40px rgba(212, 249, 51, 0.25) inset;
          pointer-events: none;
        }
        .pr-cap {
          position: absolute;
          left: 14px;
          bottom: 12px;
          z-index: 5;
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ivory);
          background: rgba(10, 12, 10, 0.72);
          padding: 6px 12px;
          border-radius: 999px;
          backdrop-filter: blur(6px);
        }
        .pr-flip {
          position: absolute;
          right: 12px;
          bottom: 12px;
          z-index: 5;
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--bg);
          background: var(--accent);
          border: none;
          padding: 9px 15px;
          border-radius: 999px;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </div>
  );
}
