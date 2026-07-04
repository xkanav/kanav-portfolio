import type { PlacedPiece } from '../lib/chess';

// ─────────────────────────────────────────────────────────────
// THE GAUNTLET — three real "White to play, mate in one" puzzles
// of rising difficulty. Each has ONE correct move (from → to) and
// a shrinking clock. All positions are hand-checked so the given
// move is a genuine mate. To swap a puzzle: replace pieces + move.
// ─────────────────────────────────────────────────────────────

export type Puzzle = {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  seconds: number;
  prompt: string;
  hint: string;
  pieces: PlacedPiece[];
  solution: { from: string; to: string };
  solutionSan: string;
  idea: string; // shown after solving
};

export const puzzles: Puzzle[] = [
  {
    id: 1,
    name: "Philidor's Legacy",
    difficulty: 'Easy',
    seconds: 7,
    prompt: 'White to play. Mate in one.',
    hint: 'The black king has walled itself in with its own pieces. A knight ignores walls.',
    pieces: [
      // white
      { sq: 'g1', type: 'k', color: 'w' },
      { sq: 'h6', type: 'n', color: 'w' },
      { sq: 'f1', type: 'r', color: 'w' },
      { sq: 'd1', type: 'q', color: 'w' },
      { sq: 'f2', type: 'p', color: 'w' },
      { sq: 'g2', type: 'p', color: 'w' },
      { sq: 'h2', type: 'p', color: 'w' },
      // black
      { sq: 'h8', type: 'k', color: 'b' },
      { sq: 'g8', type: 'r', color: 'b' },
      { sq: 'a8', type: 'r', color: 'b' },
      { sq: 'c8', type: 'b', color: 'b' },
      { sq: 'g7', type: 'p', color: 'b' },
      { sq: 'h7', type: 'p', color: 'b' },
      { sq: 'a7', type: 'p', color: 'b' },
      { sq: 'b7', type: 'p', color: 'b' },
    ],
    solution: { from: 'h6', to: 'f7' },
    solutionSan: 'Nf7#',
    idea: 'Smothered mate. The king is trapped by its own defenders; the knight lands on the one square nobody can answer.',
  },
  {
    id: 2,
    name: 'The Arabian',
    difficulty: 'Medium',
    seconds: 10,
    prompt: 'White to play. Mate in one.',
    hint: 'Slide the rook along the seventh rank to sit right beside the king. It looks capturable. The knight on f6 says it is not.',
    pieces: [
      // white
      { sq: 'g1', type: 'k', color: 'w' },
      { sq: 'd7', type: 'r', color: 'w' },
      { sq: 'f6', type: 'n', color: 'w' },
      { sq: 'a2', type: 'p', color: 'w' },
      { sq: 'f2', type: 'p', color: 'w' },
      { sq: 'g2', type: 'p', color: 'w' },
      { sq: 'h2', type: 'p', color: 'w' },
      // black
      { sq: 'h8', type: 'k', color: 'b' },
      { sq: 'a8', type: 'r', color: 'b' },
      { sq: 'c8', type: 'b', color: 'b' },
      { sq: 'b6', type: 'q', color: 'b' },
      { sq: 'd5', type: 'n', color: 'b' },
      { sq: 'a7', type: 'p', color: 'b' },
      { sq: 'b7', type: 'p', color: 'b' },
    ],
    solution: { from: 'd7', to: 'h7' },
    solutionSan: 'Rh7#',
    idea: 'The Arabian mate. The rook sits beside the king covering g7, while the knight on f6 guards both g8 and the rook itself. Nothing can answer.',
  },
  {
    id: 3,
    name: "Boden's Mate",
    difficulty: 'Hard',
    seconds: 15,
    prompt: 'White to play. Mate in one.',
    hint: 'Two bishops, two diagonals. One of them already covers the dark squares around the king. The other just needs to arrive.',
    pieces: [
      // white
      { sq: 'g1', type: 'k', color: 'w' },
      { sq: 'e2', type: 'b', color: 'w' },
      { sq: 'f4', type: 'b', color: 'w' },
      { sq: 'a2', type: 'p', color: 'w' },
      { sq: 'f2', type: 'p', color: 'w' },
      { sq: 'g2', type: 'p', color: 'w' },
      { sq: 'h2', type: 'p', color: 'w' },
      // black
      { sq: 'c8', type: 'k', color: 'b' },
      { sq: 'd8', type: 'r', color: 'b' },
      { sq: 'f6', type: 'n', color: 'b' },
      { sq: 'h5', type: 'q', color: 'b' },
      { sq: 'd7', type: 'p', color: 'b' },
      { sq: 'a7', type: 'p', color: 'b' },
      { sq: 'f7', type: 'p', color: 'b' },
      { sq: 'g7', type: 'p', color: 'b' },
      { sq: 'h7', type: 'p', color: 'b' },
    ],
    solution: { from: 'e2', to: 'a6' },
    solutionSan: 'Ba6#',
    idea: "Boden's mate. The two bishops crisscross: one seals the dark squares b8 and c7, the other checks down the light diagonal into c8. The king is caught between them with nowhere to step.",
  },
];

export const gauntletReward = {
  title: 'You have an eye for this.',
  text: 'Three brilliancies, three clocks, no misses. Most people never find the third. We should play a real one sometime. Find me here.',
  links: [
    {
      label: 'my chess.com',
      handle: 'kanavxd',
      href: 'https://www.chess.com/member/kanavxd',
    },
    {
      label: 'my instagram',
      handle: '@xkanav',
      href: 'https://instagram.com/xkanav',
    },
  ],
};
