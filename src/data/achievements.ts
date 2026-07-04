// ─────────────────────────────────────────────────────────────
// BRILLIANT MOVES — competition record, badged like chess.com:
//   !!  brilliant (1st place)      !  great move (podium)
//   !?  interesting (deep run in a huge field)
// Each row expands to show the story, an optional deck (proof of
// work) and an optional photo.
//   deck      → path under /public (PDF, code, or live page)
//   deckLabel → link text, defaults to "The deck"
//   image     → team photo, path under /public
// ─────────────────────────────────────────────────────────────

export type Achievement = {
  event: string;
  host?: string;
  field: string;        // e.g. '400+ teams'
  result: string;       // e.g. '1st Place'
  annotation: '!!' | '!' | '!?';
  description: string;  // shown when the row is expanded
  deck?: string;        // proof of work, path under /public
  deckLabel?: string;   // link text; defaults to 'The deck'
  image?: string;       // team photo, path under /public
};

export type AchievementCategory = {
  category: string;
  achievements: Achievement[];
};

export const achievementCategories: AchievementCategory[] = [
  {
    category: 'Case & Strategy',
    achievements: [
      {
        event: 'Ashoka Behavioural Case Competition 3.0',
        field: '400+ teams',
        result: '1st Place',
        annotation: '!!',
        description:
          "A national behavioural-science case competition at Ashoka University, built around Wai Wai's growth challenge. We designed an end-to-end strategy that fused consumer-behaviour insight, market research and behavioural design to lift customer acquisition, retention and brand preference.",
        deck: '/decks/ashoka-waiwai.pdf',
        image: '/wins/ashoka.jpg',
      },
      {
        event: 'Grant Thornton CASEQuest 2025-26',
        field: '900+ teams',
        result: 'Semi-finalist',
        annotation: '!?',
        description:
          "Grant Thornton's national case competition, tasking teams with solving real public-sector problems through data-driven solutions. We built Bharatiya Risk Terrain Modeling (BRTM), a predictive crime-prevention framework using geospatial analytics and environmental risk factors to flag hotspots before incidents occur, shifting policing from reactive to proactive.",
        deck: '/decks/casequest-brtm.pdf',
      },
      {
        event: 'Founders Crucible Case Competition',
        field: '40+ teams',
        result: '1st Place',
        annotation: '!!',
        description:
          "A strategy case on Myntra's quick-commerce expansion. Combining market research, financial analysis and competitive benchmarking, we designed a scalable rollout that balanced customer convenience with sustainable unit economics.",
        deck: '/decks/founders-crucible-myntra.pdf',
        image: '/wins/founders-crucible.jpg',
      },
      {
        event: 'Casecade',
        field: '25+ teams',
        result: '3rd Place',
        annotation: '!',
        description:
          'We designed STRAT-AI, an adaptive business-intelligence assistant that blends stakeholder insight, market trends and continuous learning to help organisations make faster, better-informed strategic decisions.',
        deck: '/decks/casecade-stratai.pdf',
        image: '/wins/casecade.jpg',
      },
    ],
  },
  {
    category: 'Finance & Markets',
    achievements: [
      {
        event: 'MarketCraft',
        host: 'Ashoka University',
        field: '125+ teams',
        result: '1st Place',
        annotation: '!!',
        description:
          'MarketCraft is a strategy simulation where teams design entire economic systems under constraints. We built and stress-tested Virelia, a simulated economy, through a global demand collapse, tracing systemic risk across trade, banking and consumer markets, then proposed policy responses balancing institutional limits with long-term resilience.',
        deck: '/decks/marketcraft-virelia.pdf',
      },
      {
        event: 'Fintech Venture Lab',
        field: '185+ teams',
        result: '3rd Place',
        annotation: '!',
        description:
          'We developed KrishiSetu, an AI agri-fintech platform reimagining rural credit through crop-cycle-aligned lending, alternative credit scoring and parametric insurance, combining financial inclusion with data-driven risk assessment to widen formal-credit access for smallholder farmers.',
        deck: '/krishisetu.html',
        deckLabel: 'Live build',
        image: '/wins/fintech-venture.jpg',
      },
      {
        event: 'Mergers & Acquisitions',
        field: '25+ teams',
        result: '1st Place',
        annotation: '!!',
        description:
          'A post-merger strategy for Barbeque Nation and Jubilant FoodWorks, combining crisis management, supply-chain resilience and operational synergy, balancing near-term reputational recovery with long-term growth through technology, governance and integration.',
        deck: '/decks/merger-bbq-jubilant.pdf',
      },
      {
        event: 'Finance Among Us',
        field: '20+ teams',
        result: '3rd Place',
        annotation: '!',
        description:
          'A corporate-governance and strategy simulation where teams represented competing stakeholder groups, negotiated under conflicting incentives and responded to evolving market and regulatory scenarios to maximise long-term value.',
        image: '/wins/finance-among-us.jpg',
      },
    ],
  },
  {
    category: 'Entrepreneurship & Technology',
    achievements: [
      {
        event: 'How I Met My Investor',
        host: 'E-Cell Plaksha',
        field: '25+ teams',
        result: '1st Place',
        annotation: '!!',
        description:
          'A venture-strategy simulation judging investor-startup fit. We redesigned Astroloom, a space-tech startup, to thrive in an AGI-disrupted future through strategic pivots, crisis management and go-to-market planning.',
        deck: '/decks/astroloom.pdf',
      },
      {
        event: 'Dhandha Paani',
        field: '10+ teams',
        result: '1st Place',
        annotation: '!!',
        description:
          'A brand-innovation challenge where teams turned a random company-product pairing into a viable business. I reimagined Pampers as a provider of child-friendly prosthetic limbs (PAMPSTEP), building the product, branding, marketing and commercialisation strategy.',
        deck: '/decks/dhandha-pampstep.pdf',
        image: '/wins/dhandha-paani.jpg',
      },
      {
        event: 'Leverage',
        host: 'Colossus Tech Fest',
        field: '12 teams',
        result: '3rd Place',
        annotation: '!',
        description:
          'An algorithmic-strategy competition built around Goofspiel. We designed autonomous bidding agents that maximise long-term performance through game theory, probabilistic reasoning and resource allocation under incomplete information.',
        deck: '/decks/leverage-goofspiel.py',
        deckLabel: 'The code',
      },
      {
        event: 'Startup Sprint',
        field: '20+ teams',
        result: '3rd Place',
        annotation: '!',
        description:
          'We developed JustPool, a subscription-based shared-mobility concept: fixed-route, door-to-door ride sharing. Backed by market research, competitive analysis and financial modelling, it delivers a cost-effective alternative to traditional ride-hailing.',
        deck: '/decks/startup-justpool.pdf',
        image: '/wins/startup-sprint.jpg',
      },
    ],
  },
];
