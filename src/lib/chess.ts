// ─────────────────────────────────────────────────────────────
// A tiny pseudo-legal move generator — just enough to make the
// "Find the Best Move" puzzles feel like real chess: pick a piece,
// see where it can go, move it. It intentionally ignores check,
// pins, castling, en passant and promotion (none of the puzzles
// need them). Board is a plain Record so it lives happily in React
// state.
// ─────────────────────────────────────────────────────────────

export type Color = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Piece = { type: PieceType; color: Color };
export type Board = Record<string, Piece>;

export type PlacedPiece = { sq: string; type: PieceType; color: Color };

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const sq = (f: number, r: number) => `${FILES[f]}${r + 1}`;
export const coords = (s: string) => ({
  f: s.charCodeAt(0) - 97,
  r: Number(s[1]) - 1,
});

export function makeBoard(list: PlacedPiece[]): Board {
  const b: Board = {};
  for (const p of list) b[p.sq] = { type: p.type, color: p.color };
  return b;
}

const KNIGHT = [
  [1, 2], [2, 1], [-1, 2], [-2, 1],
  [1, -2], [2, -1], [-1, -2], [-2, -1],
];
const KING = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];
const ROOK = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const BISHOP = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

const onBoard = (f: number, r: number) => f >= 0 && f < 8 && r >= 0 && r < 8;

export function pseudoMoves(board: Board, from: string): string[] {
  const pc = board[from];
  if (!pc) return [];
  const { f, r } = coords(from);
  const out: string[] = [];

  const step = (nf: number, nr: number) => {
    if (!onBoard(nf, nr)) return;
    const t = sq(nf, nr);
    const q = board[t];
    if (!q) out.push(t);
    else if (q.color !== pc.color) out.push(t);
  };

  const slide = (dirs: number[][]) => {
    for (const [df, dr] of dirs) {
      let nf = f + df;
      let nr = r + dr;
      while (onBoard(nf, nr)) {
        const t = sq(nf, nr);
        const q = board[t];
        if (!q) {
          out.push(t);
        } else {
          if (q.color !== pc.color) out.push(t);
          break;
        }
        nf += df;
        nr += dr;
      }
    }
  };

  switch (pc.type) {
    case 'n':
      for (const [df, dr] of KNIGHT) step(f + df, r + dr);
      break;
    case 'k':
      for (const [df, dr] of KING) step(f + df, r + dr);
      break;
    case 'r':
      slide(ROOK);
      break;
    case 'b':
      slide(BISHOP);
      break;
    case 'q':
      slide([...ROOK, ...BISHOP]);
      break;
    case 'p': {
      const dir = pc.color === 'w' ? 1 : -1;
      const startRank = pc.color === 'w' ? 1 : 6;
      const oneFwd = sq(f, r + dir);
      if (onBoard(f, r + dir) && !board[oneFwd]) {
        out.push(oneFwd);
        const twoFwd = sq(f, r + 2 * dir);
        if (r === startRank && !board[twoFwd]) out.push(twoFwd);
      }
      for (const df of [-1, 1]) {
        const nf = f + df;
        const nr = r + dir;
        if (onBoard(nf, nr)) {
          const t = sq(nf, nr);
          const q = board[t];
          if (q && q.color !== pc.color) out.push(t);
        }
      }
      break;
    }
  }
  return out;
}

const WHITE_GLYPH: Record<PieceType, string> = {
  k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙',
};
const BLACK_GLYPH: Record<PieceType, string> = {
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

export const glyph = (p: Piece) =>
  p.color === 'w' ? WHITE_GLYPH[p.type] : BLACK_GLYPH[p.type];

// realistic piece art (cburnett set) lives in /public/pieces
const CODE: Record<PieceType, string> = {
  k: 'K', q: 'Q', r: 'R', b: 'B', n: 'N', p: 'P',
};
export const pieceSrc = (p: Piece) => `/pieces/${p.color}${CODE[p.type]}.svg`;
