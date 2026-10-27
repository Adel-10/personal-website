# Adel Mithaiwala — Portfolio Website: Agent Brief

Single source of truth for any AI agent picking up this project. Read this first.
`HANDOFF.md` is the chronological changelog (v3 → v24). Its older entries are **partly
stale**: the skill tree, ball pit and tool sphere it describes are no longer on the site.
Where the two disagree, this file wins.

Last reconciled against the working tree on **2026-10-24**.

---

## 1. What this is

A personal portfolio for **Adel Mithaiwala**, a first-class BSc (Hons) Computer Science
with Management graduate from King's College London (Sep 2023 – Jul 2026). He is looking for a
**one-year ML/AI engineering role** before starting an AI/ML master's.

The site has two jobs:

- **Credibility.** Every number on it is a real, measured artifact from his project repos
  and eval logs. Nothing is invented.
- **Delight.** Adel's stated goal is a site that is *"overwhelmingly interactive (in a good
  way)"*, where the visitor finds something to play with at every point.

- **Repo:** `github.com/Adel-10/personal-website` on branch `main`. The repo root is this
  `portfolio/` folder: `package.json` is at the top level.
- **Hosting:** Vercel (Hobby). Pushes to `main` auto-deploy. Settings: Vite preset, Root
  Directory `./`, build `npm run build`, output `dist`, no environment variables.
- **Local path:** `~/Desktop/Projects/Claude/portfolio/`. The sibling folders under `Claude/`
  are Adel's other projects (RAG, fine-tune, shakespeare-gpt, minimal-agent). Leave them alone.
- **Owner contact (already public on the site):** adelaziz1311@gmail.com ·
  github.com/Adel-10 · linkedin.com/in/adel-mithaiwala-a1b938278/

---

## 2. Run, build, deploy

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/   (passes as of 2026-10-24)
npm run preview   # serve the production build locally
```

- Fully static SPA. No backend, no secrets, no environment variables.
- `vite.config.js` sets `base: './'`. Combined with `HashRouter`, the built site works from
  any path with no server rewrite rules.
- **Git state:** the last commit is `a03ccac "Prepare portfolio for production"`
  (2026-10-18). The owner-directed copy revision, removed sections, Vite security update,
  and retired Contact-particles cleanup are currently uncommitted. **What's on Vercel is
  the commit, not the working tree.** Commit and push to deploy these changes.
- Build warning about chunks over 500 kB is expected. The large chunks (Spline runtime and
  physics, three.js) are lazy-loaded on the pages that use them.

---

## 3. Owner's standing rules (do not violate)

These are explicit decisions Adel made during development.

**Visual**

1. **"Birthday" palette.** The base is off-white "cake" and the accents are six vibrant
   "candle" colors (table in §8).
2. **No gradients on elements.** Each element wears exactly ONE candle color. Variety comes
   from giving *different elements different candles*. Never use a multi-stop gradient on
   text, bars or borders. (`--grad` was deleted deliberately.)
3. **Single theme.** There is no light/dark mode and no theme toggle. The old theme code was removed.
4. **Playful, interactive and surprising everywhere**, but readable. Text must stay legible
   over every animated background.
5. **Cool Mode** (a particle spray on press-and-hold) applies to **body buttons only**, never
   to the navbar or the title blocks.
6. Banner backgrounds per page (§6) are Adel's choices. Specifics: **Grid Scan** is "graph
   paper" (cream band, tan lines, **light-blue `#7cc4ff` scan**, no wobble or blur).
   **Liquid Ether** uses warm candles only (red, orange, yellow). **Dot Grid** is **green**.
7. Every page's title block is tall (`min(72vh,720px)`). It pins and shrinks or fades on
   scroll, and that effect is shared by all pages.

**Content**

8. **Never invent facts or numbers.** Sources are Adel's CV (`Adel_Mithaiwala_CV_B.pdf`,
   which isn't in the repo; the facts already on the site are faithful to it) and the project
   eval write-ups. When unsure, ask Adel.
9. The dialect fine-tune repo is **unpublished**, so its card says "write-up available on
   request" and has no GitHub link.
10. When rewriting Adel's descriptions, *rewrite* them. Don't transcribe. He asked for better
    phrasing, not copies.

**Engineering**

11. Everything for the site lives **inside `portfolio/`**. Don't put dependencies or files in
    the parent `Claude/` folder.
12. Plain CSS only (`src/index.css` plus per-component CSS). **No Tailwind.** Port
    Tailwind/shadcn/framer-motion components from React Bits, 21st.dev or Magic UI to plain
    CSS, gsap or CSS keyframes. Don't add their dependency stacks.
13. Every animation must respect `prefers-reduced-motion` with a static fallback.
14. When patching a vendored component, mark it with a `LOCAL PATCH` comment that says why.

---

## 4. Tech stack

| Dependency | Used for |
|---|---|
| react 19, react-dom, react-router-dom 7 | App, `HashRouter` routing |
| vite 8, @vitejs/plugin-react 6 | Dev and build |
| gsap 3.15 (incl. ScrollTrigger, SplitText, free since 3.13) | All scrollytelling, pins, scrubs, counters |
| three 0.180, postprocessing | Lanyard, Liquid Ether, Hyperspeed, Grid Scan |
| matter-js | FallingText title, Skill Signal Board |
| @splinetool/react-spline + runtime | 3D robot on Home |
| lucide-react | Icons in the Skill Signal Board |
| @fontsource-variable/roboto-flex | Self-hosted variable font for TextPressure |

`face-api.js` was **removed** in the security audit. The GridScan webcam feature it powered
is gone.

---

## 5. Architecture

```
vercel.json                Production security headers, including CSP
src/
  main.jsx, App.jsx        HashRouter shell: ScrollToTop, .ambient blobs, CoolModeZone, Nav, Routes, footer
  index.css                ~970 lines: palette vars + all layout/component styles
  pages/                   Home, Projects, Skills, Education, Experience, Contact
  sections/                Hero, Nav, Contact (links + warp), projects/*Project.jsx (5 cards)
  components/
    PageHeader.jsx         Shared title block: optional animated bg, gsap pin + shrink/fade on scroll
    SectionBackground.jsx  Lazy, visibility-gated React Bits backgrounds + Hyperspeed palette table
    RouteMetadata.jsx      Per-route title, description, canonical and social metadata
    backgrounds/           Vendored React Bits: LiquidEther, GridScan, DotGrid, Hyperspeed
    text/                  React Bits text effect ports: TextPressure, DecryptedText, TextType, FallingText, CurvedLoop
    lanyard/               Custom three.js lanyard (Lanyard.jsx, kclTextures.js)
    ChapterIntro.jsx       Projects-page pinned chapter scenes
    ProjectSection.jsx     Project card wrapper (--pc candle per project)
    SkillSignalBoard.jsx   Skills page main experience
    SplineScene.jsx        21st.dev port + error boundary
    WarpBackground.jsx     Magic UI port (CSS keyframes)
    CoolModeZone.jsx       Magic UI Cool Mode as one delegated listener
  data/tools.js            TOOLS list + CANDLES array (shared)
  confetti.js              Dependency-free candle-colored confetti burst
  useReveal.js             IntersectionObserver .reveal → .in fade-up (per page)
  useProjectsScrolly.js    Projects scrollytelling
  useEducationScrolly.js   Education timeline scrollytelling
  useExperienceScrolly.js  Experience horizontal rides (any number of .xp-pin sections)
public/
  assets/                  Project figures (PNG)
  assets/lanyard/          wordmark.png (front), crest.png (back): KCL images from Adel
  favicon.svg              Solid-red, single-candle favicon
  robots.txt               Allows indexing
legacy/                    Old single-file v2 site, kept for reference
```

**Key mechanics**

- **SectionBackground:** each background is its own lazy chunk. It mounts only while within
  ±25% of the viewport, so at most about two WebGL contexts are alive at once. It skips
  WebGL under reduced motion or when WebGL is missing. DotGrid is 2D canvas and always allowed.
- **PageHeader:**
  - `has-bg` gives the tall banner.
  - `.page-header.has-bg .wrap::before` is a soft radial pool of page color behind the text,
    for legibility.
  - `.page-header.has-bg .wrap { width:100% }` is **required**. Without it the flex item
    shrinks to its content and titles jump left (this was the FallingText "shift" bug).
- **gsap hygiene:** every hook uses `gsap.matchMedia()` and `mm.revert()` on unmount, so
  triggers die on route change. Lazy images call `ScrollTrigger.refresh()` on load.
- **CoolModeZone:** a single document-level pointer listener. Coverage is the `SELECTORS`
  list at the top of the file (hero quick-links, project link pills, rail buttons, contact
  links, and skill-board proof links). Particles are SVG circles in candle colors, built
  with `createElementNS` rather than innerHTML.

---

## 6. Pages

### Home (`sections/Hero.jsx`)

- Two-column `wrap-wide` grid.
- **Left:** kicker "ML/AI Engineer · London", name as **TextPressure** (self-hosted Roboto Flex
  variable font; "Mithaiwala" in candle red), two lede paragraphs, and five quick-links
  (each lights a different candle on hover).
- **Right:** the **Spline robot** (`prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`),
  which tracks the mouse. A soft orange glow follows the cursor only inside the robot's box.
- The robot is skipped under reduced motion, and the error boundary hides it if it fails to load.

### Projects (`pages/Projects.jsx`, `useProjectsScrolly.js`)

- **Header:** Grid Scan "graph paper" with the title as **DecryptedText**.
- **Five chapters.** Each has a full-viewport `ChapterIntro`: a giant outlined number, a title
  assembled by SplitText characters, and a kicker. It pins, then shrinks away into its card.

  | # | Chapter | Candle |
  |---|---|---|
  | 01 | Bilingual RAG (LMRA) | red |
  | 02 | Dialect fine-tune | orange |
  | 03 | shakespeare-gpt | blue |
  | 04 | minimal-agent | green |
  | 05 | CI/CD pipeline to Kubernetes | purple |

- **Cards:** scrubbed rise-in, parallax on figures, tables and code, plus a
  **3-up bigstats strip** whose counters count up from 0 (values are in `data-count`).
- **Rail:** a fixed progress rail on the right (hidden under 1180px). It has an orange fill
  bar, per-project dots in each chapter's candle, and click-to-jump. It targets each pinned
  chapter's measured ScrollTrigger start, so distant chapters land in one click.
- **Key facts (do not alter without a source):**
  - **RAG:** hit@6 33/33, faithfulness 32/33, abstention 6/6, 0 false abstentions, EN↔AR
    cosine 0.781 vs 0.548, 1,133 chunks.
  - **Fine-tune:** dialect hit@6 57→63/68, MRR 0.687→0.766, texting MRR 0.33→0.62.
  - **GPT:** 11M params, val perplexity 4.4 (loss 1.47), −65% vs uniform.
  - **Agent:** about 230 lines, 3 stages.
  - **ci-k8s:** Jenkins → Docker → K8s, 2 replicas, readiness and liveness probes.

### Skills (`pages/Skills.jsx` → `components/SkillSignalBoard.jsx`)

- **Header:** Liquid Ether (warm candles only) with a **TextType** typewriter cycling "The
  skill signal board" / "Pull on the system" / "See what connects".
- **The Skill Signal Board:**
  - Six channel tabs (DL, RET, LLM, EVAL, ENG, OPS), each in its own candle.
  - A "live patch" field where three capability modules hang on matter-js spring
    constraints (zero gravity), wired by SVG cables to anchor ports. Modules are draggable
    and clickable. **Jolt** and **Reset** buttons sit on the console.
  - An inspector panel with a signal-wave animation and a "proven in" link to /projects.
  - A tool grid. Clicking a tool nudges the related module.
  - Reduced motion places the modules statically.
- A CTA line underneath links to Projects.

### Education (`pages/Education.jsx`, `useEducationScrolly.js`)

- **Header:** green Dot Grid with the title as **FallingText**. On *hover* the words drop
  with physics and can be dragged. **↺ restart** restores the layout and re-arms on the next
  hover. The drop requires a real pointer-move event, so scrolling a stationary cursor over
  the pinned title does not trigger it.
- **Body:** a timeline whose line draws itself on scroll. Year stamps pop in. **The KCL
  lanyard rides sticky on the right.**
- **Three milestones:**
  1. **2022:** Ibn Khuldoon National School. Top of class, plus awards.
  2. **'22–'23:** KCL CS Foundation Year. 3 A* equivalents.
  3. **'23–'26:** BSc CS with Management, first-class with distinction. Modules,
     dissertation (on-device news summarisation app), student rep, 75 mentees.
- Reaching milestone 3 fires a **confetti burst**.
- The master's "next" card and the stats strip were **removed at Adel's request**.
- **Lanyard:** a custom three.js verlet rope with no artificial forces (no idle breeze or
  wobble), gravity −40 and damping 0.99. The card front composites `wordmark.png`, the back
  composites `crest.png`, and the strap is canvas-drawn KCL red. Drawn fallbacks are used if
  the images are missing.

### Experience (`pages/Experience.jsx`, `useExperienceScrolly.js`)

- **Header:** Hyperspeed, with a draggable **CurvedLoop** ribbon reading "Experience ✦ KPMG ✦
  Batelco ✦ King's ✦".
- The page is **two pinned horizontal "rides"**. Vertical scroll drives sideways.
  - **Ride 1, Professional:**
    - **KPMG** (red): AI Team Intern, Jun–Aug 2025. Azure OpenAI, multi-agent RAG,
      csv/xlsx→SQL, latency work.
    - **Batelco** (blue): Summer Intern, Jun–Aug 2023. −15% ticket backlog, 1M+ subscribers.
  - **Ride 2, Leadership** (ordered by significance):
    - **Engagement lead** (purple): Executive Student Engagement Associate, King's Business
      School Joint Honours, Sep 2024–May 2025. Led a team, 75 first-years mentored (6–7
      personally), workshops, faculty pitches and funding.
    - **Student rep** (green): Informatics, Sep 2023–May 2025, elected twice, 200+ students.
    - **PhD mentee** (orange): Informatics PhD mentorship, Jan–Mar 2024, HCI, final
      presentation.
- Under 861px or with reduced motion, the rides collapse to vertical stacks.

### Contact (`pages/Contact.jsx`, `sections/Contact.jsx`)

- A single Magic UI **Warp Background** card. Candle beams stream through a perspective grid
  around three links (email, GitHub, LinkedIn). All of them have Cool Mode. The page keeps a
  visually hidden `h1` after the decorative banner's removal.

---

## 7. Provenance and local patches

| Component | Source | Local changes |
|---|---|---|
| LiquidEther, DotGrid, Hyperspeed | React Bits registry | Themed via SectionBackground only |
| GridScan | React Bits | **LOCAL PATCHES:** alpha fades with distance (upstream painted lines black on light backgrounds); webcam/face-api code removed entirely |
| TextPressure, DecryptedText, TextType, FallingText, CurvedLoop | React Bits | Hand-ported; TextPressure uses locally bundled Roboto Flex; FallingText uses matter-js, builds DOM nodes rather than innerHTML, and requires pointer movement before starting |
| SplineScene | 21st.dev (serafim/splite) | Tailwind → CSS; error boundary added |
| WarpBackground, Cool Mode | Magic UI MCP | framer-motion → CSS keyframes; Cool Mode → delegated listener |
| Lanyard | Original (React Bits-style behavior, no @react-three deps) | n/a |

The retired skill tree, tool sphere, ball pit, InfiniteMenu, morph/parallax experiments,
HeroShader and theme code were removed in v22, together with `gl-matrix` and their CSS.

---

## 8. Palette ("Birthday")

| Token | Value | Use |
|---|---|---|
| `--bg` | `#faf6ef` | Cake base |
| `--bg-alt` | `#f2ecdf` | Deeper cream (Grid Scan band, panels) |
| `--text` | `#241f2e` | Plum-ink body text |
| `--text-dim` | `#6f6880` | Secondary text |
| `--c-red` | `#ff4d4d` | `--accent` |
| `--c-orange` | `#ff9f1c` | |
| `--c-yellow` | `#ffd23f` | Signal board uses darker `#d6a600` for contrast |
| `--c-green` | `#2ec27e` | |
| `--c-blue` | `#3b82f6` | `--accent2` |
| `--c-purple` | `#8b5cf6` | |

Glass cards are white with dark translucent borders. WebGL background colors live in JS
tables in `SectionBackground.jsx` and must be kept in sync by hand.

---

## 9. Security posture

- `npm audit`: **0 vulnerabilities** as of 2026-10-24. The face-api.js chain was eliminated
  in v20; `source-map-js` was upgraded in v21; Vite was updated to 8.3.5 in v24 after new
  development-server advisories affected 8.0.0–8.1.5.
- No secrets in source. All `target="_blank"` links have `rel="noopener noreferrer"`. No
  `eval`. innerHTML has been removed from CoolModeZone and FallingText.
- **CSP and response headers** live in root `vercel.json`, which Vercel applies to all paths.
  There is deliberately no CSP `<meta>` in `index.html`, because Vite injects inline styles
  during development. The production CSP still disallows inline `<style>` blocks.
- **Allowed third-party runtime origins:** `prod.spline.design` for the robot scene and
  `unpkg.com` for Spline's versioned modelling/navmesh WASM. Roboto Flex is bundled locally,
  so the font needs no third-party origin.

---

## 10. Remaining release items and owner decisions

1. **The working tree is uncommitted.** Commit and push to ship the v24 copy revision.
2. **Run one post-deploy check on Vercel.** The local production preview is clean and the
   known Spline WASM origin is allowed, but only Vercel applies `vercel.json`; check the live
   Home console and response headers after pushing.
3. **Domain-dependent SEO:** route titles, descriptions, canonical URLs, Open Graph/Twitter
   metadata, `robots.txt`, and the favicon exist. After the final domain is attached, add an
   absolute production `og:url`/canonical fallback and `sitemap.xml` using that domain.
4. **Duplication:** the Education BSc entry mentions the student rep role and the 75 mentees,
   which now also have full Leadership panels on Experience. Adel was offered a trim and
   hasn't decided.
5. **Owner visual review:** all routes were checked at desktop and 390 px, but Adel still
   needs to approve the new Skill Signal Board's visual direction.

Resolved in v22: one-click Projects rail, mobile Education overflow, stationary-cursor
FallingText trigger, missing/duplicate page headings, Home's missing `<main>`, route metadata,
gradient favicon, dead code, and the missing Spline WASM CSP origin.

---

## 11. Working style with Adel

- He reviews in the browser and sends screenshots. Fix exactly what he points at, then
  explain the *cause* briefly.
- He gives autonomy for whole pages ("do whatever you think is good"). Pick a strong, coherent
  concept, explain the reasoning in a sentence or two, and keep it on-palette and interactive.
- He likes React Bits, 21st.dev and Magic UI components. 21st.dev's free tier allows only
  2 source retrievals per day. Magic UI's MCP is free.
- Keep `HANDOFF.md` appended with a short versioned entry per change set, and update this
  file when architecture or rules change.
