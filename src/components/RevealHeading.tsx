import { useRef, useState } from 'react';

/**
 * REVEAL HEADING — the same mask-reveal used on the portrait, but on
 * text. Two identical copies of the heading are stacked; a spotlight
 * that follows the cursor reveals the chartreuse copy through the
 * base one. Styles live in global.css (.rh / .rh-base / .rh-top).
 */

type Props = {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  reveal?: boolean; // adds data-reveal for the scroll-in animation
};

const RADIUS = 110;

export default function RevealHeading({
  text,
  as = 'h2',
  className = '',
  reveal = true,
}: Props) {
  const Tag = as as any;
  const ref = useRef<HTMLHeadingElement>(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [active, setActive] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    setActive(true);
  };

  const mask =
    `radial-gradient(circle ${RADIUS}px at ${pos.x}px ${pos.y}px, ` +
    `#000 0, #000 55%, rgba(0,0,0,0) 100%)`;

  return (
    <Tag
      ref={ref}
      className={`rh ${className}`}
      {...(reveal ? { 'data-reveal': true } : {})}
      onMouseMove={onMove}
      onMouseEnter={onMove}
      onMouseLeave={() => setActive(false)}
    >
      <span className="rh-base">{text}</span>
      <span
        className="rh-top"
        aria-hidden="true"
        style={{ opacity: active ? 1 : 0, WebkitMaskImage: mask, maskImage: mask }}
      >
        {text}
      </span>
    </Tag>
  );
}
