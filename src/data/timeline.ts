// ─────────────────────────────────────────────────────────────
// THE JOURNEY — education, leadership and work experience, in
// order. To add a new role: copy an entry, fill it in, and keep
// the array sorted oldest-first (the knight travels down the rail
// as the reader scrolls forward in time).
// ─────────────────────────────────────────────────────────────

export type TimelineEntry = {
  date: string;        // e.g. 'Aug 2024'
  endDate?: string;    // omit or 'Present' for ongoing
  title: string;
  org: string;
  detail: string;
  kind: 'education' | 'experience' | 'leadership';
};

export const timeline: TimelineEntry[] = [
  {
    date: 'Aug 2024',
    endDate: '2028',
    title: 'BTech, Data Science, Economics & Business',
    org: 'Plaksha University',
    detail:
      'A programme that blends data science, economics and business: the three lenses I think through.',
    kind: 'education',
  },
  {
    date: 'Aug 2025',
    endDate: 'Present',
    title: 'Head of Sponsorship & Finance',
    org: 'Model United Nations Society, Plaksha',
    detail:
      'Secured partnerships with The New Shop and MYOP, running end-to-end sponsor negotiation, contracts and budget tracking for the society\'s flagship conference.',
    kind: 'leadership',
  },
  {
    date: 'Mar 2026',
    title: 'Event Operations Intern',
    org: 'Chopra Audio Visual · Investor Punjab Summit',
    detail:
      'Coordinated vendors, AV teams and logistics for a summit of 1000+ participants.',
    kind: 'experience',
  },
  {
    date: 'Mar 2026',
    endDate: 'Jun 2026',
    title: 'Student Teaching Assistant',
    org: 'Young Technology Scholars (YTS) 2026',
    detail:
      'Leading classroom sessions for curriculum delivery for 45+ students multiple times, and mentoring project teams from concept to final demonstration.',
    kind: 'experience',
  },
  {
    date: 'May 2026',
    endDate: 'Present',
    title: 'Leo Research Intern',
    org: 'Plaksha University',
    detail:
      'Developed Python parsers and automated validation pipelines to convert OCR-based Wimbledon scorecards into a high-quality research dataset spanning ~295,000 match points.',
    kind: 'experience',
  },
  // ── New roles go here. The page updates as they land. ──
];
