> **Agents: read `AGENTS.md` first.** It's the current-state brief. This file is the
> chronological changelog, and older entries describe things since replaced (e.g. the
> Skills page is now the Skill Signal Board, not the skill tree).

# Portfolio handoff notes — v26 (deployed-site feedback pass)

- Added clear space between the fixed navigation and Contact's Warp card; shortened its
  lead to “Email is fastest.”
- Removed the shared footer from every route.
- Replaced Experience's explanatory header copy with “Professional and Leadership Experience.”
- Reduced Education's FallingText hover/physics region from 170px to 88px.
- Updated Projects' SplitText setup to animate characters inside whole-word wrappers, so
  “Kubernetes” moves intact to the second line instead of splitting mid-word.
- Removed the Skills closing “Prefer receipts…” CTA, the “live system” status mark, and the
  Jolt/shuffle control. Reset remains available.

**Verified:** the production build passes; all five affected routes were checked at the
956×709 screenshot size and at 390px; no route has horizontal overflow; the shared footer
is absent; the requested copy and controls are removed; and the browser console is clean.

---

# Portfolio handoff notes — v25 (Home location correction)

- Changed the Home kicker from “ML/AI Engineer · London” to “ML/AI Engineer · Bahrain” at
  Adel's request. King's College and education references to London remain unchanged.
- Verified with a production build.

---

# Portfolio handoff notes — v24 (owner copy revision)

## What changed in v24

- Applied Adel's edited website transcript across Home, Projects, Education, Experience,
  and Contact. This includes the shorter project chapter copy, expanded project explanations,
  and the corrected fine-tune baseline/evaluation figures supplied in the transcript.
- Removed the Home availability pill, Projects' “Work” eyebrow, Experience's closing
  “Your team?” panel, and Contact's decorative page-header banner. Contact retains one
  visually hidden `<h1>` for accessibility.
- Removed the now-unused Contact Particles background and its sole `ogl` dependency.
- Updated Vite from 8.1.4 to 8.3.5 after new development-server advisories, restoring
  `npm audit` to zero vulnerabilities.
- Kept the owner's Home introduction wording exactly as supplied; its editorial assessment
  is documented in the accompanying task response rather than silently rewriting it.

**Verified:** `npm run build` passes; `npm audit --omit=optional` reports **0 vulnerabilities**;
the affected routes were checked in the browser at desktop width and 390 px with no horizontal
overflow; removed sections are absent; Contact's remaining Warp card reveals correctly; and
the browser console produced no application errors. The expected large lazy-chunk warning and
the existing duplicate-three.js development warning remain.

**Still required to ship:** commit and push, then perform the existing post-deploy Vercel
header/Home-console check.

---

# Portfolio handoff notes — v23 (external copy deck)

## What changed in v23

- Exported a Google Docs-compatible copy deck containing a location-by-location
  transcription of the current website wording. It covers the six pages, project tables
  and captions, Skill Signal Board, shared navigation/footer, route metadata, image alt
  text, and control labels.
- Each section identifies its source component so edits made in the document can be
  applied back to the correct React file without searching or guessing.
- Image-embedded text is deliberately excluded because it is not HTML copy; its alt
  text and surrounding captions are included.
- The copy deck is kept outside the repository for editing; `WEBSITE_COPY.md` was removed.

No runtime code changed in v23.

# Portfolio handoff notes — v22 (production-readiness pass)

## What changed in v22

- Added Spline's versioned `unpkg.com` WASM origin to Vercel's CSP. The scene and font
  policies remain otherwise narrow; Roboto Flex is still local.
- Replaced each routed page header's `<h2>` with its one real `<h1>`, gave animated
  headings stable accessible names, added Home's missing `<main>`, and added a keyboard
  skip link. Home no longer exposes the name twice to assistive technology.
- Added per-route document titles, descriptions, runtime canonical/Open Graph URLs,
  Open Graph/Twitter metadata, `robots.txt`, and a solid-red favicon (the old favicon
  broke the no-gradients rule). A sitemap and static absolute URLs wait for the domain.
- Fixed the Projects rail: it now scrolls to each pinned chapter's measured
  ScrollTrigger start with GSAP ScrollTo, so chapter 05 lands in one click.
- Fixed Education's 390 px overflow by replacing the mobile year-stamp scale with a
  bounded lateral pop. FallingText now starts on real pointer movement, not
  `pointerenter`, so scrolling the title under a stationary cursor does nothing.
- Removed the retired skill tree, tool sphere, ball pit, InfiniteMenu, morph/parallax,
  HeroShader, theme code, their CSS, and `gl-matrix`. Production CSS fell from about
  43.7 kB to 30.9 kB before gzip.
- Updated Cool Mode selectors for the active Skill Signal Board and CTA.

**Verified:** `npm run build` passes (the expected lazy Spline/three chunk warning
remains); `npm audit --omit=optional` reports **0 vulnerabilities**; `vercel.json`
parses; every route has exactly one `<main>` and one correctly named `<h1>`; titles,
descriptions and canonical URLs update by route; all routes tested fit a 390 px viewport
with no broken images; the Projects rail reached ci-k8s in one click; stationary scroll
did not start FallingText while pointer movement did; the tested production-preview
pages produced no application console errors.

**Still required to ship:** commit and push, then inspect the deployed Home response
headers/console because the local Vite preview does not apply `vercel.json`. Once the
domain is purchased, add its absolute canonical/Open Graph fallback and `sitemap.xml`.

---

# Portfolio handoff notes — v21 (Vercel security + local font)

## What changed in v21

- Removed the document-level CSP meta tag. Vite can inject its development stylesheet
  again, while production still gets a CSP as an HTTP response header.
- Added root `vercel.json` with site-wide Vercel response headers: CSP,
  Referrer-Policy, Permissions-Policy, X-Content-Type-Options, X-Frame-Options,
  Cross-Origin-Opener-Policy and Cross-Origin-Resource-Policy. Removed the ineffective
  Netlify/Cloudflare `_headers` file from the working tree.
- Replaced TextPressure's runtime `@font-face` injection and dead Cloudinary Compressa
  URL with the locally bundled, OFL-licensed Roboto Flex variable font. Only its Latin
  standard-axis WOFF2 is emitted; the pressure animation now stays within the font's
  real `wdth` range (25–151).
- Ran `npm audit fix`: `source-map-js` is now 1.2.2 and `npm audit` reports
  **0 vulnerabilities**.

**Verified:** `npm run build` passes (2021 modules); `npm ls --depth=0` is healthy;
`vercel.json` parses; the production bundle contains one local Roboto Flex WOFF2 and
no legacy remote-font reference or meta CSP. In the in-app browser, `npm run dev`
renders styled (`body` is cake `#faf6ef`, nav is flex), TextPressure resolves to
Roboto Flex with live `wght`/`wdth` values, and there are no application or CSP errors.

**Still required to ship:** commit and push the working tree, then check the deployed
Home page console once so any additional Spline runtime origins can be added to the CSP.

---

# Portfolio handoff notes — v20 (security audit + packaging)

## What changed in v20

**Security audit (sandbox recovered — everything below verified by running it):**

- `npm audit`: was 3 vulnerabilities (2 low, 1 high), all from
  `face-api.js → tfjs-core → node-fetch` — the webcam feature disabled since v3.
  **face-api.js removed entirely** (dep uninstalled; GridScan's loader stubbed with a
  LOCAL PATCH note). **Now: 0 vulnerabilities.**
- Code sweep: all `target="_blank"` links carry `rel="noopener noreferrer"` ✓; no
  plaintext-HTTP loads ✓; no secrets/keys in source ✓; no `eval`/`document.write` ✓.
- `innerHTML` uses (CoolModeZone, FallingText) are constant-fed; FallingText now
  HTML-escapes words anyway (defense-in-depth).
- Added `<meta name="referrer" content="strict-origin-when-cross-origin">`.
- Runtime third-party origins (by design, both HTTPS): `prod.spline.design` (robot
  scene) and `res.cloudinary.com` (Compressa VF font). Optional hardening: self-host
  both and add a CSP header at the host.
- **`npm run build` PASSES** — first verified build; fresh `dist/` (7.3 MB) with the
  KCL lanyard images included. Big chunks (Spline runtime/physics) are lazy-loaded.

**Packaging:** everything now lives inside `portfolio/` — deleted stray
`node_modules/`, `package.json` (an old shadcn scratch install), `package-lock.json`,
and `.DS_Store` files from the `Claude/` folder root; removed the stale `dist-old`.
No imports escape the folder. The sibling folders in `Claude/` are the other projects
(RAG, fine-tune, shakespeare-gpt, minimal-agent) — untouched.

**STILL OPEN before deploy: the LinkedIn link in Contact is a placeholder (`href="#"`).**

---

# v19 notes (Experience: two rides)

## What changed in v19

**Experience split into two horizontal rides** (hook now handles any number of
`.xp-pin` sections): "Ride 1 — Professional experience" (KPMG, Batelco, unchanged) and
"Ride 2 — Leadership experience" with three new panels written from Adel's descriptions:

1. **Engagement lead** (purple) — Executive Student Engagement Associate, King's
   Business School Joint Honours, Sep 2024–May 2025: led 2nd/3rd-year associate team,
   75 first-years mentored (6–7 personally), workshops, faculty pitches + funding.
2. **Student rep** (green) — Informatics, Sep 2023–May 2025, elected ×2, 200+ cohort:
   sentiment aggregation, faculty liaison, advocacy, individual-concern handling.
3. **PhD mentee** (orange) — Informatics PhD mentorship scheme, Jan–Mar 2024, HCI:
   shadowing, progressively deeper own research, final presentation to the programme.

The "Your team?" CTA panel moved to the end of ride 2 (now red). Also this session:
FallingText hover-trigger + flex-shrink fix (`.page-header.has-bg .wrap{width:100%}`),
Education "next"+stats removed, dot grid green, Grid Scan graph-paper rework, Infinite
Menu caption moved below sphere, skill tree enlarged (wrap-wide).

---

# v18 notes (Skills page polish + Infinite Menu)

## What changed in v18.1 (Education page fixes)

- Removed the "next / AI-ML Master's" milestone and the 3-counter stats strip — the
  timeline now ends at the first-class BSc (confetti intact).
- **FallingText rewritten**: triggers on **hover** (was click); words are measured with
  `offsetLeft/offsetTop` and animated with **delta transforms** — the old
  getBoundingClientRect coords were distorted by the pinned header's transforms, which
  caused the whole title to shift on trigger. Now each word starts exactly in place.
  **↺ restart** restores the pristine static title and re-arms it (falls again on the
  next hover — pointer must leave and re-enter).
- Dot Grid (Education banner): dots now green (`#b6dcc6` base, `#2ec27e` active).

## What changed in v18

- **Liquid Ether recolored** (Skills banner): warm candles only (red/orange/yellow) —
  the blue/purple dyes went muddy-dark against the cream base (Adel's screenshot).
- **Skill tree enlarged**: viewBox 1000×620 → 1000×900, hub spacing 93 → 140, leaf
  spread 52 → 58 (adjacent branches' leaves used to collide — that was the overlap),
  labels bumped ~1.5px. Tree renders ~45% taller at the same width.
- **React Bits Infinite Menu** (`src/components/backgrounds/InfiniteMenu/`, fetched
  from the official repo) under the skill tree: a draggable WebGL2 sphere of 18
  candle-colored tool discs (canvas-generated data-URL badges, no image assets),
  snaps to the nearest disc, arrow button → /projects. Three LOCAL PATCHES marked in
  the file: alpha:true + blending (upstream renders an opaque black box), dispose()
  for the otherwise-immortal RAF loop, HashRouter navigation for internal links.
  Wrapper: `src/components/ToolSphere.jsx` (lazy, reduced-motion → hidden).
- **NEW DEP — run `npm install`**: `gl-matrix` (Infinite Menu's math lib).

---

# v17 notes (Magic UI: Cool Mode + Warp contact)

## What changed in v17.2

Grid Scan fixes after Adel's screenshot (black wobbly blurry lines, unreadable title):

- **Shader patch in `GridScan.jsx`** (2nd local patch, marked LOCAL PATCH): upstream
  fades line *color* to black with distance but leaves *alpha* opaque — fine on dark
  backgrounds, literally black lines + black tunnel-end on light ones. Alpha now carries
  the fade, so lines dissolve to transparent cream.
- Props: `lineJitter=0` (kills the hand-drawn wobble — default was 0.1), `enablePost
  =false`, `chromaticAberration=0`, `noiseIntensity=0` (kills fringing/grain → sharp
  lines), lines `#c6b89b` (visible warm tan), `scanOpacity=0.5`.
- **All banner headers** got a soft radial pool of page color behind the title text
  (`.page-header.has-bg .wrap::before`) — fixes readability over Grid Scan and helps
  Particles/Liquid Ether/Hyperspeed banners too.

## What changed in v17.1

Grid Scan title block (Projects) reworked to **"graph paper"**: black backdrop replaced
with the deeper-cream `--bg-alt` band, grid lines at faint warm-ink (`#ddd3c4`), scan
beam stays candle red. The `.on-black` header variant is gone (PageHeader + CSS) — the
Projects title is normal dark ink again like every other page.

## What changed in v17

Magic UI MCP is connected and working; both components fetched from its registry and
ported to plain CSS/JS (no new npm deps — framer-motion NOT added; warp beams became
CSS keyframes):

- **Cool Mode everywhere-ish** (`src/components/CoolModeZone.jsx`, mounted once in
  App): press-and-hold any body button/pill and candle-colored circles spray out with
  the original's physics. Implemented as ONE delegated document listener instead of
  wrapping every element — selector list at the top of the file controls coverage
  (hero quick-links, project link pills, rail buttons, xp CTA, contact links, skill-tree
  proof links). Navbar and title-block controls (e.g. FallingText's restart) are
  excluded by design, per Adel.
- **Warp Background on Contact** (`src/components/WarpBackground.jsx`): the contact
  info now sits in a single warp card — perspective grid walls with candle-colored
  beams flying past on all four sides. **Decision: one warp holding all 3 links**, not
  three separate warps (beams need surface area; three would read as noisy borders).
  To compare anyway: wrap each `<a>` in its own `<WarpBackground>` in
  `sections/Contact.jsx`. Uses container-query units (100cqi/cqh/cqmax) — fine in
  current Chrome/Safari/Firefox.
- LinkedIn placeholder is STILL in the contact links — fix before deploying.

---

# v16 notes (Skills = the skill tree)

## What changed in v16

Skills page rebuilt from scratch as a **video-game skill tree**
(`src/components/SkillTree.jsx`, plain React + SVG, no deps):

- Root "ML/AI" node → six candle-colored branches (Deep learning, Retrieval &
  embeddings, LLM systems & guardrails, Evaluation, Engineering, Delivery & ops) →
  eighteen leaf skills. Every blurb carries real numbers from the projects.
- **Locked nodes are dashed**; clicking inspects a node (fills it solid, lights its
  branch paths) and shows a sticky detail panel with description + "proven in" link to
  /projects. Keyboard accessible (tab + enter).
- **Exploration meter**: "n / 24 nodes explored" with a green progress bar; exploring
  all 24 fires a confetti burst (now shared: `src/confetti.js`, also used by the
  Education timeline).
- Header keeps liquid-ether + TextType (user-mandated); typewriter lines tease the game.
- <720px: SVG hidden, native `<details>` accordion with the same content.
- **Now-unused files** (kept in repo, harmless): `ZoomParallax.jsx`, `SkillsMorph.jsx`,
  `SkillPit.jsx`, `sections/Skills.jsx`, plus their CSS block (marked "v11 — unused").
  Delete whenever.

---

# v15 notes (skill ball pit)

## What changed in v15

Skills page got a third act: **the ball pit** (`src/components/SkillPit.jsx`, matter-js —
already a dep). When the section scrolls into view, all 18 tool chips drop into a glass
box one by one with real physics; visitors can grab and throw them (MouseConstraint).
Controls top-right: **🎈 more** (adds candle-colored balls, capped at 70 bodies),
**🚀 zero-g** (kills gravity + gives everything a shove; toggles back to 🌍),
**↺ reset**. The chip list moved to `src/data/tools.js`, shared with SkillsMorph.
Reduced motion → static chip list. Page flow is now: liquid-ether header → zoom-parallax
dive → morph cinema → playground.

Site-wide interactivity inventory (the "surprise at every point" goal): robot +
cursor-light (home), pressure-sensitive name (home), decrypt title + chapter scenes +
rail (projects), typewriter + dive + morph + ball pit (skills), falling title + physics
lanyard + confetti timeline (education), draggable ribbon + horizontal drive (experience),
particles banner (contact).

---

# v14 notes (Education timeline + Experience horizontal drive)

## What changed in v14

Both pages rebuilt as scrollytelling (all gsap, no new deps):

**Education** (`useEducationScrolly.js`) — chronological climb with the lanyard riding
sticky on the right the whole way down. A timeline line draws itself with scroll; four
milestones (Ibn Khuldoon '22 → Foundation '22–23 → BSc '23–26 → "next": master's), each
with an outlined year stamp that pops in (back-ease), a candle-colored dot on the line,
and a rising card. Counters: 3 A*, 7 modules, 75 mentees. Reaching the first-class
milestone fires a one-time **confetti burst** in candle colors (dependency-free canvas,
`burstConfetti` in the hook). All `[Add: ...]` placeholders removed — content is from the
CV; the master's entry is now a graceful "details to follow" card.

**Experience** (`useExperienceScrolly.js`) — the section pins and vertical scroll drives
a **horizontal ride** through three panels (echoes the Hyperspeed banner): KPMG (red,
five achievement lines + tech chips), Batelco (blue, big "−15% backlog" number, 1M+
subscribers), and a green "Your team?" panel with a get-in-touch CTA → /contact. Panel
contents stagger in via `containerAnimation` triggers; a "keep scrolling →" hint fades
out. The old placeholder cards ([Add: other roles]) are gone.

Both collapse to plain vertical stacks under 861px width or reduced motion.
Unverified in browser (sandbox down): check the horizontal pin length feels right and
the sticky lanyard doesn't overlap the footer on short windows.

---

# v13 notes (animated page titles)

## What changed in v13

Five React Bits text animations, one per page title, all in `src/components/text/`
(ported by hand — four are dependency-free, FallingText needs **matter-js**, added to
package.json → **run `npm install`**):

| Page | Effect | Notes |
|---|---|---|
| Home (name) | **Text Pressure** | Compressa variable font (loads from Cloudinary like the original); weight/width follow the cursor; "Mithaiwala" in candle red; real `<h1>` kept `.sr-only` |
| Projects | **Decrypted Text** | scrambles → reveals on scroll-into-view; mono font |
| Skills | **Text Type** | typewriter cycling 3 phrases, green cursor |
| Education | **Falling Text** | click → words drop with matter-js physics, draggable, **↺ restart** button; highlights blue |
| Experience | **Curved Loop** | draggable purple ribbon marquee "Experience ✦ KPMG ✦ Batelco ✦ King's ✦"; real title `.sr-only` |

All respect reduced motion (static text). Unverified in browser (sandbox down all
session). Checks: Compressa font loads (needs network), FallingText restart, Curved Loop
drag vs. page scroll on touch, TextPressure sizing at narrow widths.

---

# v12 notes ("Birthday" palette)

## What changed in v12.1

**No gradients** — `--grad` deleted; every element wears exactly ONE candle color,
variety comes from distribution: name = red, brand @ = orange, stat trios = red/blue/green,
skill-card headings cycle candles (nth-child, both grid and zoom tiles), rail bar =
orange with per-project active dots (red/orange/blue/green/purple, matching chapters),
each project section carries `--pc` (its chapter's candle) used by links, table strongs,
and card hover ring; the five hero quick-links each light a different candle on hover.

## What changed in v12

Full palette swap to **"Birthday"**: off-white cake base (`#faf6ef`), dark plum-ink text,
and six vibrant candle colors as CSS vars (`--c-red/orange/yellow/green/blue/purple`).
`--accent` = candle red, `--accent2` = candle blue, `--grad` = 6-stop candle gradient
(used by h1, brand, stat numbers, rail bar, skill headings).

Touched: `index.css` (vars, 4-color ambient blobs, glass now dark-bordered white),
`SectionBackground.jsx` (Particles use all six candles; Hyperspeed light road +
multicolor cars; DotGrid pale lilac dots; Liquid Ether red/blue/purple), chapter hues
(01 red → 05 purple), SkillsMorph arc colors darkened for contrast on light bg,
`.spline-glow` blend fixed (screen → normal, invisible on light), favicon.

Grid Scan title block deliberately **stays black** (user asked for that earlier) — it now
reads as a bold contrast band on the light site.

Unverified in browser: worth checking Particles/Liquid Ether legibility over the light
banner behind title text, and the morph chips' contrast.

---

# v11 notes (Skills page scenes: zoom parallax + morph)

## What changed in v11

Skills page rebuilt as two pinned scenes (no new deps — both gsap):

1. **Zoom Parallax** (`src/components/ZoomParallax.jsx`) — faithful port of the 21st.dev
   component (source fetched via MCP; framer-motion → gsap, images → arbitrary nodes).
   The six skill cards + a center "Six capabilities" doorway tile zoom at different
   speeds over 300vh; the center tile scales slowest, so you dive through it.
2. **SkillsMorph** (`src/components/SkillsMorph.jsx`) — recreation of 21st.dev "Scroll
   Morph Hero" (**its source hit the free tier's 2-retrievals/day paywall**, resets
   midnight UTC; rebuilt from its description: scattered → circle → scroll-driven
   rainbow arc). 18 tool chips (all grounded in CV/projects) morph through the three
   phases with per-chip rainbow hues in the arc.

- Reduced motion → the old static `.skillgrid` (kept in `src/sections/Skills.jsx`).
- The old grid section is otherwise unused now.
- Unverified in browser (sandbox down): tune scatter/radius in SkillsMorph if chips
  crowd on small screens; zoom tiles hide body text under 640px.

---

# v10 notes (Spline robot hero + background shuffle)

## What changed in v10

- **Home hero rebuilt**: text on the left, interactive 3D robot (Spline scene from the
  21st.dev "Spline Scene" component, ported to plain CSS in
  `src/components/SplineScene.jsx`) on the right, in a wider 1200px grid. Liquid Ether
  removed from the hero. Robot is skipped for reduced-motion users; scene streams from
  prod.spline.design at runtime (needs network).
- **NEW DEPS — run `npm install`**: `@splinetool/react-spline` + `@splinetool/runtime`
  (lazy-loaded, only fetched on the home page).
- **Background shuffle**: Skills title block now has **Liquid Ether** (was Particles);
  Contact title block now has **Particles** (was plain). Grid Scan / Dot Grid /
  Hyperspeed unchanged.
- Unverified in browser (sandbox down): check the robot loads, its size vs. text column,
  and mobile stacking (robot drops below text under 900px).

---

# v9 notes (chapter scenes + header pin everywhere)

## What changed in v9

- **Header pin/shrink on every page** — the pin+fade effect moved from the Projects hook
  into `PageHeader.jsx` itself, so Skills / Education / Experience / Contact titles also
  hold and shrink as you scroll past (reduced-motion safe, reverted on unmount).
- **Chapter scenes on Projects** (Apple-product-page style): before each project a
  full-viewport `ChapterIntro` pins for ~110% of a viewport and plays a scrubbed
  timeline — giant outlined chapter number (01–05, per-chapter hue via `--ch`) rises,
  the project title assembles **character by character** (gsap `SplitText`, free since
  gsap 3.13 — still no new npm deps), the kicker line fades in, then the whole scene
  shrinks away into the project card. Copy lives in `Projects.jsx`; type styles under
  `.chapter` in `index.css`.
- **Rail tracking** now spans chapter + card, so the active dot lights during the intro.
- 21st.dev MCP was **not connected** this session (user believed it was) — everything
  built with gsap directly. If connected later, its components are React/Tailwind
  snippets and would need adapting to this plain-CSS codebase anyway.
- **Unverified in a browser** (sandbox down all session): scroll Projects end to end —
  five pins + header pin is a long page now; check pins engage/release cleanly, chars
  animate, and `SplitText` imports fine from the installed gsap version (needs ≥3.13;
  package.json has ^3.15).

---

# v8 notes (scrollytelling on Projects)

## What changed in v8

GSAP ScrollTrigger scrollytelling on the Projects page (gsap was already a dependency —
ScrollTrigger ships inside it, so **no new packages**). All logic in
`src/useProjectsScrolly.js`, called only from `Projects.jsx`:

1. **Pinned intro** — the Grid Scan title block pins at the top and fades/scales out while
   the first project scrolls over it (`pinSpacing: false`).
2. **Scrubbed card entrances** — each project's `.wrap` rises ~90px tied to scroll
   position (the `.wrap`, not `.project`, so the card's CSS hover transform still works).
3. **Parallax** on `pre` / `.tablewrap` / `figure` elements inside cards.
4. **Stat counters** — new `.bigstats` strips in all five project files; numbers count up
   on first entry. Markup contains the real final values; JS zeroes then counts, so
   no-JS/reduced-motion shows correct numbers. All figures traced to the eval tables
   already on the page.
5. **Progress rail** (fixed, right side, hidden <1180px) — gradient bar scrubs with page
   progress, active project highlighted, click scrolls to section (buttons, not anchor
   hrefs — hash anchors would fight HashRouter).

Notes: `.reveal` removed from `ProjectSection`'s card so gsap owns entrances; everything
sits in a `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` branch and is
reverted on route change (`mm.revert()`); lazy image loads trigger
`ScrollTrigger.refresh()`. **Unverified in a browser (sandbox still down)** — scroll the
whole Projects page, check the pin engages/releases cleanly and the rail tracks.

---

# v7 notes (deep-sunset, single theme, lanyard restack)

## What changed in v7

- **Real KCL images on the lanyard card**: the component now loads
  `public/assets/lanyard/wordmark.png` (official wordmark → card front, on KCL red with
  Adel's name/degree beneath) and `crest.png` (coat of arms → card back, on white with
  honours text). Images are **composited aspect-preserved**, never stretched; missing
  files fall back to the fully drawn card. Adel's two screenshots are currently sitting
  in `dist/assets/` — **wrong place** (dist is wiped on every build); they must be moved
  and renamed as above. (Done — now in `public/assets/lanyard/`.)
- **Lanyard physics cleaned up** to match the react-bits demo feel: removed the fake idle
  breeze and constant rotation wobble (card now settles to a dead stop), removed the drag
  distance clamp (rope stretches and snaps back), fixed a double-gravity substep bug,
  gravity −40, damping 0.99.

- **Single theme now** — light/dark modes removed at Adel's request: no more toggle in the
  nav, `[data-theme="light"]` CSS deleted, `ThemeProvider` unplugged from `App.jsx`.
  `src/theme.jsx` is now unused (only the also-unused `HeroShader.jsx` references it) —
  both can be deleted whenever.
- **Deep-sunset palette**: burnt orange `#ff6b2c` + amber `#ffb02e` accents (+ dusk violet
  `#9d6bff` third color in Particles/Liquid Ether) on deep dusk-plum `#140f1c`.
- **Lanyard restacked**: full-width, 580px tall, hangs above the KCL degree entry instead
  of beside it (physics has room now). **AI/ML master's entry removed.**
- **Grid Scan (Projects title) always renders on black** (`#050505` on its `.bg-layer`)
  with dark grid lines — title text forced light via `.page-header.on-black`.

---

# v6 notes (KCL lanyard on Education)

## What changed in v6

- **Interactive lanyard** next to the KCL BSc entry on the Education page: an ID-style
  card hanging on a KCL-red strap — grab and throw it, it swings on rope physics.
  - Implemented in **plain three.js** (`src/components/lanyard/Lanyard.jsx`) with a verlet
    rope, mirroring the React Bits Lanyard's behavior. The real React Bits component needs
    four extra deps (@react-three/fiber/drei/rapier, meshline) plus a .glb asset that
    couldn't be installed/downloaded this session — **zero new dependencies** this way.
  - **Card faces and strap are drawn on canvas** (`kclTextures.js`): KCL red, crown,
    "King's College London" wordmark, motto, Adel's name/degree/dates, barcode. To use
    real KCL images instead, drop `front.png` / `back.png` (~640×1000) and `strap.png`
    (~1024×128, tiles) into **`public/assets/lanyard/`** — the component auto-prefers
    them and falls back to the drawn versions when absent.
  - Reduced motion / no WebGL → static card image. Code-split via `lazy()`.
- **Education page filled from the CV** (`Adel_Mithaiwala_CV_B.pdf`): BSc dates
  (Sep 2023 – Jul 2026), first-class w/ distinction, key modules, dissertation (on-device
  news summarisation app), student rep + 75 mentees; added Foundation Year (3A*) and
  Ibn Khuldoon (top of class) entries. Master's entry still has [Add: ...] placeholders.
- **Still unverified in a browser** — sandbox remained down; run `npm run dev`, open
  Education, drag the card, check both themes + mobile width.

---

# v5 notes (title-block backgrounds + sunset-pop palette)

## What changed in v5

- **Project sections no longer have animated backgrounds** — all five project cards sit on
  the plain themed background. `ProjectSection` still accepts a `background` prop if you
  ever want one back.
- **New `src/components/PageHeader.jsx`** — a banner block at the top of each page (tag +
  title + subtitle) with an optional React Bits background behind just that block:
  Projects → Grid Scan, Skills → Particles, Education → Dot Grid, Experience → Hyperspeed.
  Contact has a plain title block; Home keeps Liquid Ether behind the hero.
  Sizing/styling: `.page-header` rules in `src/index.css`.
- **Sunset-pop palette** — hot pink `#ff4d8d` + tangerine `#ffa63f` on deep plum-indigo
  `#16101f` (dark); warm blush background with deeper pink/orange accents (light). Changed
  in three places: CSS variables in `src/index.css`, the `P`/`HYPERSPEED_COLORS` tables in
  `SectionBackground.jsx`, and the inline favicon in `index.html`.
- **Not verified in a browser** — the sandbox couldn't run `npm run build` this round, so
  run `npm run dev` and click through all six pages (both themes) before deploying.

---

# v4 notes (multi-page)

Site location: `Projects/Claude/portfolio/` — a **Vite + React app**.

- Dev: `npm run dev` → http://localhost:5173
- Build: `npm run build` → static output in `dist/` (deploy that folder)

## What changed in v4

Converted from a single scrolling page to **six pages** under `src/pages/` — Home,
Projects, Skills, Education, Experience, Contact — routed with `react-router-dom`
using **HashRouter** (so `base: './'` static hosting keeps working with no server
config). Nav highlights the active page; route changes scroll to top; scroll-reveals
re-run per page via `src/useReveal.js`.

- **Liquid Ether moved to the home hero**, behind the name/description (still
  lazy-loaded, theme-aware, reduced-motion/no-WebGL safe). The hand-written
  `src/components/HeroShader.jsx` remains in the repo but is **unused**. The RAG
  section now sits on the plain themed background.
- **Education & Experience pages are new** — drafted from claims already on the site
  (KCL first-class BSc with distinction, KPMG AI intern, upcoming master's). Dashed
  `[Add: ...]` placeholders mark missing dates/modules/role details; the Experience
  page has a spare "other roles" card — fill or delete.
- **Before first run after v4:** run `npm install` once (react-router-dom was added
  from a Linux sandbox, which can prune the macOS-specific build binary).
- **`dist/` is stale** (still the v3 single-page build) — rebuild before deploying.
- v4 verification: production build compiles; pages not yet eyeballed in a browser —
  click through all six in `npm run dev`.

---

# v3 notes (React + React Bits) — still applies unless superseded above
- The old single-file site (v2) is preserved untouched in `legacy/` — open `legacy/index.html`
  directly; its handoff notes (project exclusion rationale, secrets check) are in
  `legacy/HANDOFF.md`.

## What changed in v3

Rebuilt as a React app so each project gets its own full-width section with a real
**React Bits** background (pulled from the official reactbits.dev registry, JS + plain CSS
variants, committed into `src/components/backgrounds/`):

| Background | Project | Section id |
|---|---|---|
| Liquid Ether | Bilingual RAG (LMRA) — flagship | `#project-rag` |
| Particles | Dialect embedding fine-tune (**new section**) | `#project-finetune` |
| Grid Scan | shakespeare-gpt | `#project-gpt` |
| Dot Grid | minimal-agent | `#project-agent` |
| Hyperspeed | ci-k8s | `#project-cik8s` |

All v2 content was ported verbatim (hero, skills, contact, theme toggle, scroll reveals),
and the hero kept its hand-written WebGL shader, now a React component
(`src/components/HeroShader.jsx`).

## The new fine-tune section

Content written from `fine-tuning-multilingual-model/BLOCK2_RESULTS.md` — every number
traced to that doc (dialect hit@6 59→63/68, MRR 0.707→0.766, texting register 0.33→0.62,
forgetting −0.008, civic-only negative result). The honest "proof-of-concept, not a
validated replacement" verdict is kept on the page deliberately.
**No GitHub link** — that repo isn't published; the card says "write-up available on
request". When you publish it, add the link in `src/sections/projects/FinetuneProject.jsx`.

## Performance & behavior decisions

- **Backgrounds are lazy + visibility-gated** (`src/components/SectionBackground.jsx`):
  each is its own code-split chunk, mounted only while its section is within ±25% of the
  viewport, unmounted when scrolled away — at most ~2 WebGL contexts alive at once.
- **`prefers-reduced-motion`** disables all animated backgrounds and the hero shader.
- **No WebGL → no crash**: sections fall back to the plain themed background (DotGrid,
  which is 2D canvas, still runs).
- **Theme-aware**: every background gets site-palette colors per theme (see the `P` and
  `HYPERSPEED_COLORS` tables in `SectionBackground.jsx`). Toggle is the ◐ button.
- **GridScan patched** (only local change to a React Bits component): upstream loads
  face-api.js + downloads face-detection model weights from a CDN **on every mount**, even
  with the webcam feature off. Now it's a dynamic import gated on `enableWebcam` — the
  ~660 kB chunk exists in `dist/` but is never fetched. Zero network calls at runtime.
- Liquid Ether is a fluid sim — dye builds up over ~5–10 s and drifts; it's intentionally
  ambient. Knobs: `autoSpeed`, `autoIntensity`, `cursorSize` in `SectionBackground.jsx`.

## Verified (headless Chrome, dark + light)

- All five backgrounds render; screenshots checked section by section.
- Console clean (the one 404 was the missing favicon — fixed with an inline SVG icon).
- Theme toggle re-themes backgrounds; light scheme respected on load.
- All four images resolve (`public/assets/`); `npm run build` passes.

## Still needs your eyes (carried over from v2)

- **LinkedIn URL** — still a placeholder in `src/sections/Contact.jsx` (`id="linkedinLink"`,
  marked with a TODO comment). **Fix before deploying.**
- "London", "Starting an AI/ML master's soon", and the availability line — same caveats as v2.
- npm audit shows 3 findings — all from `face-api.js`'s old dependency tree; it never ships
  to the browser (see patch above), so they're install-time noise. Removing the webcam
  feature entirely (and the dep) is an option if you want a clean audit.

## Deploying

`npm run build`, then deploy `dist/` (drag-and-drop to Netlify/Vercel, or GitHub Pages with
an action). `vite.config.js` uses `base: './'`, so it works at any URL path. A git repo is
initialized in this folder but nothing is committed yet.
