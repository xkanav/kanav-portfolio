// ─────────────────────────────────────────────────────────────
// OFF THE BOARD — the interactive knight's tour.
// Visitors move a knight around a 5x5 board; landing on these
// squares reveals a piece of who you are beyond the resume.
//
// To add one: pick a free square (a1..e5), give it a short TAG
// (3-4 letters, shown on the square) and write the card.
// Photos: drop a picture into  public/facts/  and set
//   image: '/facts/your-file.jpg'
// on the fact. The card shows it automatically.
// ─────────────────────────────────────────────────────────────

export type BoardFact = {
  square: string;  // e.g. 'b4'
  tag: string;     // short mono label shown on the square
  title: string;
  text: string;
  image?: string;  // optional photo, path under /public
  audio?: string;  // optional voice clip (your AI-cloned voice), path under /public
  big?: boolean;   // highlight as a major reveal
};

export const boardFacts: BoardFact[] = [
  {
    square: 'c3',
    tag: '♞',
    title: 'The Knight',
    text: 'I learned chess when I was six, sitting across the board from my mother and brother. What started as a pastime quickly became a hobby, and there was no looking back. Through every game, one piece has always been my favourite: the knight. Maybe it is because it never follows the obvious path.',
  },
  {
    square: 'a5',
    tag: '-40',
    title: '-40 kgs',
    text: 'I lost over 40 kg by making small, consistent choices every day. It remains one of the biggest lessons I have learned in discipline and patience.',
    big: true,
  },
  {
    square: 'd5',
    tag: 'HKE',
    title: 'Hiking',
    text: 'My first trek was Kedarkantha (14,500 ft) in January 2026, and it completely changed how I looked at the mountains. Five days without my phone, surrounded by nothing but nature, became one of the most peaceful experiences I have ever had, and since then I have looked forward to every trek.',
  },
  {
    square: 'b2',
    tag: 'RUN',
    title: 'Running',
    text: 'I never thought I would enjoy running until a friend took me to a local run club. Finishing my first sub-30 5K completely changed my perspective, and I have loved running ever since.',
  },
  {
    square: 'b1',
    tag: 'GYM',
    title: 'The Gym',
    text: 'For me, the gym is more than lifting weights. It is a daily lesson in discipline, consistency and perseverance, a place where I can switch off from everything else and focus on becoming a little better each day.',
  },
  {
    square: 'e5',
    tag: 'BBL',
    title: 'Basketball',
    text: 'I have been playing basketball since third grade, and it has stayed with me ever since. Some of my best evenings are still spent on the court with friends, just playing, unwinding and enjoying the game.',
  },
  {
    square: 'c1',
    tag: 'SWM',
    title: 'Swimming',
    text: 'I used to swim regularly back in sixth grade, and I still miss it. There is something about being in the water that leaves both your mind and body feeling refreshed.',
  },
  {
    square: 'e3',
    tag: 'DNC',
    title: 'Dancing',
    text: 'If you had asked me when I started, I would have said I hated it. Thanks to my mum, I stuck with it, and I am glad I did. It is a lot more fun than I ever expected.',
  },
  {
    square: 'e1',
    tag: 'PKR',
    title: 'Poker',
    text: 'Poker is one of my favourite strategy games. Balancing probabilities, making decisions with incomplete information, and trying to read the table is what makes every game different.',
  },
  {
    square: 'c4',
    tag: 'GIG',
    title: 'Concerts',
    text: 'I have been lucky enough to experience Travis Scott live twice, and both concerts were unforgettable. There is something about thousands of people singing the same songs that never gets old.',
  },
  {
    square: 'a1',
    tag: 'MUS',
    title: 'Music',
    text: "Music has been the background to almost every memory I have. Whether it is old Bollywood, ABBA or Drake, there has been a playlist for every mood and every phase of life.",
  },
  {
    square: 'a3',
    tag: 'TRV',
    title: 'Travelling',
    text: 'Travel has become one of my favourite things since COVID. Every trip reminds me that while places are beautiful, it is the people you meet along the way who make them unforgettable.',
  },
  {
    square: 'd2',
    tag: 'CHD',
    title: 'Chandigarh',
    text: 'I was born in Patiala, but Chandigarh is the city I call home. It is where I grew up, made my closest friends and built countless memories. I cannot imagine calling anywhere else home.',
  },
  {
    square: 'b5',
    tag: 'ENT',
    title: 'Entrepreneurship',
    text: "I was introduced to entrepreneurship long before I understood business. As a kid, I would rather watch Shark Tank US than cartoons. The idea of solving problems, building something from scratch and turning ideas into reality has fascinated me ever since. One day, I would love to build something of my own.",
    big: true,
  },
  {
    square: 'c5',
    tag: 'AI',
    title: 'Artificial Intelligence',
    text: 'I love exploring new AI tools to learn faster and adapt to a constantly changing world. To me, AI is not here to replace us, it is here to amplify what we are capable of.',
  },
];

// Shown when every fact has been found
export const tourEndgame = {
  title: 'Board fully explored.',
  text: 'That is the part of me the resume leaves out. If it made you curious, the board is set.',
  cta: { label: 'Make your move', href: '#contact' },
};
