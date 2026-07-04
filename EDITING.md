# Editing this website

This is your personal portfolio, built with **Astro + React** (a normal, popular
web setup). You do **not** need to be a web developer to update it, and you do
**not** need any specific person or AI to maintain it — any developer or any AI
coding assistant can open this folder and continue.

Almost everything you'll ever want to change lives in **`src/data/`** as plain
text files. Change the text, save, done.

---

## 1. See it on your computer

Do this once to install:

```bash
cd ~/kanav-portfolio
npm install
```

Then any time you want to work on it:

```bash
npm run dev
```

Open the link it prints (usually **http://localhost:4321**). Leave it running —
when you save a file, the site updates in the browser automatically.

Requirement: **Node.js** installed (https://nodejs.org, the "LTS" version). That's it.

---

## 2. Where everything lives (the important part)

All your content is in **`src/data/`**. Each file has comments explaining it.

| I want to change... | Open this file |
|---|---|
| Name, tagline, intro line, email, LinkedIn, location | `src/data/profile.ts` |
| Experience / education / internships (the timeline) | `src/data/timeline.ts` |
| Research projects | `src/data/research.ts` |
| Competitions (descriptions, decks, photos) | `src/data/achievements.ts` |
| Skills & certifications | `src/data/skills.ts` |
| "Off the Board" personal cards (hobbies, story) | `src/data/facts.ts` |
| The 3 chess puzzles + the reward (chess.com / Instagram) | `src/data/puzzles.ts` |

**Files (images, PDFs, resume, voice clips) go in the `public/` folder:**

| Item | Put it here | Referenced as |
|---|---|---|
| Resume PDF | `public/Kanav-Nanda-Resume.pdf` | `/Kanav-Nanda-Resume.pdf` |
| Main hero portrait | `public/kanav-portrait.jpg` | `/kanav-portrait.jpg` |
| Portrait "reveal" (2nd image) | `public/kanav-portrait-alt.jpg` | `/kanav-portrait-alt.jpg` |
| Competition decks (PDFs) | `public/decks/` | `/decks/name.pdf` |
| Competition / project photos | `public/wins/` | `/wins/name.jpg` |
| Off-the-Board voice clips | `public/facts/` | plays automatically |

---

## 3. Common edits, step by step

### Change a piece of text
Open the matching file above, find the words, retype them between the quotes,
save. Example — new tagline: in `src/data/profile.ts`, change
`tagline: 'Exploring possibilities.'` to whatever you want.

### Add a new internship / role to the timeline
In `src/data/timeline.ts`, copy one `{ ... }` block, paste it, edit the fields
(`date`, `title`, `org`, `detail`, `kind`). Keep the list oldest-first.

### Add a new competition
In `src/data/achievements.ts`, copy an entry inside the right category and fill
it in. To attach proof: put the PDF in `public/decks/` and set
`deck: '/decks/your-file.pdf'`. To attach a photo: put it in `public/wins/` and
set `image: '/wins/your-photo.jpg'`.

### Add a new project
In `src/data/research.ts`, copy an entry, edit `title`, `position`, `line`,
`evaluation`, `tech`, and (optional) `deck`.

### Add / edit an "Off the Board" personal card
In `src/data/facts.ts`, copy an entry. Pick a free `square` (a1–e5 that isn't
already used), give it a short `tag` and your `title` + `text`.
Voice: record a clip and save it as `public/facts/<square>.m4a`
(e.g. the `b2` card reads `public/facts/b2.m4a`). If there's no clip, the
browser reads the text automatically.

### Swap the portrait photo
Replace `public/kanav-portrait.jpg` with a new image of the same name.

---

## 4. Making images and PDFs smaller (optional but nice)

Big files make the site slow. Handy commands (macOS built-ins + ghostscript):

```bash
# shrink a photo to 1200px wide JPEG (~150 KB)
sips -Z 1200 -s format jpeg -s formatOptions 80 big-photo.jpg --out public/wins/small.jpg

# compress a PDF (needs: brew install ghostscript)
gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=public/decks/small.pdf big-deck.pdf
```

---

## 5. Putting changes live (after it's deployed)

Once the site is deployed on **Vercel** (connected to a **GitHub** repo),
updating the live site is three commands:

```bash
git add .
git commit -m "update content"
git push
```

Vercel sees the push and rebuilds the live site automatically in ~1 minute.
(You can also edit files directly on github.com and it deploys the same way.)

---

## 6. If you ever feel stuck

- This is a standard **Astro** site (https://docs.astro.build). Any web developer
  can help in minutes.
- Any AI coding assistant (Claude Code, Cursor, etc.): open this folder and say
  *"this is an Astro portfolio, help me edit the content in src/data"*.
- The structure never changes when you edit content — you're only changing words
  and swapping files. It's very hard to break.

You've got this.
