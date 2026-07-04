// ─────────────────────────────────────────────────────────────
// PROJECTS. Each card keeps the three-part structure:
//   The position  (the problem)
//   The line      (the approach)
//   Evaluation    (the result, always with a number)
// plus tech tags and, optionally, a deck as proof of work.
//
// PROOF OF WORK: drop the PDF into  public/decks/  and set
//   deck: '/decks/your-file.pdf'
// on the project. The deck link appears automatically.
// ─────────────────────────────────────────────────────────────

export type ResearchProject = {
  title: string;
  guide?: string;         // professor / mentor
  period: string;
  position: string;       // the problem
  line: string;           // the approach
  evaluation: string;     // the headline result
  stat: { value: string; label: string };
  tech: string[];
  deck?: string;          // path to proof of work, under /public
  deckLabel?: string;     // link text; defaults to 'The deck'
};

export const research: ResearchProject[] = [
  {
    title: 'Checkmates & Incentives',
    guide: 'Prof. Prakarsh Singh, DSEB Chair',
    period: 'Dec 2025 – Present',
    position:
      'Do men and women blunder differently when the clock is about to fall? Nobody had tested it with move-level data.',
    line:
      'Leading a team of 2; built a large-scale tournament dataset from Candidates 2024 and analysed performance in equivalent game states under severe time pressure.',
    evaluation:
      "Women's blunder rates under severe time pressure are 23% higher than men's in equivalent positions.",
    stat: { value: '23%', label: 'blunder-rate gap under time pressure' },
    tech: ['Behavioural Economics', 'Chess', 'Python', 'Causal Inference'],
    deck: '/decks/checkmates-incentives.pdf',
  },
  {
    title: 'Framing Bias Detection in News Headlines',
    guide: 'Prof. Siddharth',
    period: 'Jan 2026 – May 2026',
    position:
      'Media framing bias usually gets flattened into a crude binary label. Could it be measured with more nuance?',
    line:
      'Engineered 25+ linguistic, semantic and sentiment features on the BABE dataset (3,675 samples) and compared Logistic Regression, SVM, Random Forest and XGBoost.',
    evaluation:
      '88.8% Macro F1 and 0.934 ROC-AUC, beating published benchmarks, plus a regression framework to score bias intensity rather than just flag it.',
    stat: { value: '88.8%', label: 'Macro F1 · 0.934 ROC-AUC' },
    tech: ['Python', 'NLP', 'Scikit-learn', 'XGBoost'],
    deck: '/decks/framing-bias.pdf',
  },
  {
    title: 'Out-of-Pocket Healthcare Expenditure',
    guide: 'Prof. T.V. Ramanathan',
    period: 'Feb 2026 – May 2026',
    position:
      'Why do insured Indian families still get wiped out by medical bills?',
    line:
      'Regression analysis and statistical modelling over 11M+ data points from 50,000 households.',
    evaluation:
      'Better district infrastructure cuts out-of-pocket costs by 4.3%. And an insurance paradox: insured families are 1.5x more likely to face catastrophic costs due to inadequate coverage limits.',
    stat: { value: '11M+', label: 'data points · 50,000 households' },
    tech: ['Econometrics', 'Health Economics', 'Stata', 'Regression'],
    deck: '/decks/out-of-pocket-healthcare.pdf',
  },
  {
    title: 'AI & Economic Behaviour: Modified Ultimatum Game',
    guide: 'Prof. Vasudha Chopra',
    period: 'Jan 2026 – May 2026',
    position:
      'When AI hands you unearned income, do you still feel entitled to it at the bargaining table?',
    line:
      'Designed a 2×2 factorial between-subjects experiment and built a networked oTree platform to run it live.',
    evaluation:
      'A working experimental platform testing how AI-assisted income shifts the Entitlement Effect.',
    stat: { value: '2×2', label: 'factorial experiment, live on oTree' },
    tech: ['Experimental Economics', 'oTree', 'Behavioural Science'],
    deck: '/decks/ultimatum-game.pdf',
  },
  {
    title: 'SCAA: Stabilized Cosine Annealing Adam',
    guide: 'Prof. Ashish Kumar',
    period: 'Oct 2025 – Dec 2025',
    position:
      'Adam stalls on ill-conditioned loss landscapes. Could a smarter schedule fix it?',
    line:
      'Engineered a custom optimizer combining Adam, cosine annealing, warmup and restarts in PyTorch.',
    evaluation:
      '23.8% faster convergence than Adam on ill-conditioned benchmarks; 96.25% on MNIST.',
    stat: { value: '23.8%', label: 'faster convergence than Adam' },
    tech: ['Deep Learning', 'PyTorch', 'Optimization'],
    deck: '/decks/scaa-optimizer.pdf',
  },
  {
    title: 'KrishiSetu',
    guide: 'Fintech Venture Lab',
    period: '3rd of 185+ teams',
    position:
      'Smallholder farmers are locked out of formal credit because their risk is invisible to conventional scoring.',
    line:
      'Built an AI agri-fintech platform with crop-cycle-aligned lending, alternative credit scoring and parametric insurance, shipped as a live interface.',
    evaluation:
      'Placed 3rd of 185+ teams, defending the unit economics before industry investors.',
    stat: { value: '185+', label: 'teams · judged by investors' },
    tech: ['Agri-Fintech', 'Credit Scoring', 'Python', 'Business Modeling'],
    deck: '/krishisetu.html',
    deckLabel: 'Live build',
  },
];
