// ─────────────────────────────────────────────────────────────
// THE ARSENAL — skills & certifications.
// Add new skills to the right group; add certifications below.
// ─────────────────────────────────────────────────────────────

export const skillGroups = [
  { group: 'Programming', items: ['Python', 'SQL'] },
  { group: 'Libraries', items: ['NumPy', 'Pandas', 'Matplotlib'] },
  {
    group: 'Tools',
    items: ['Microsoft Excel', 'MySQL', 'Power BI', 'Stata', 'oTree', 'Canva'],
  },
  {
    group: 'Domain',
    items: [
      'Data Analysis',
      'Statistical Modeling',
      'Econometrics',
      'NLP',
      'Experimental Design',
      'Financial Modeling',
    ],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  year?: string;
};

export const certifications: Certification[] = [
  {
    name: 'McKinsey Forward Program',
    issuer: 'McKinsey & Company',
  },
  // ── New certifications go here ──
];
