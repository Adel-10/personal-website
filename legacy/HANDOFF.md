# Portfolio handoff notes

Site location: `Projects/Claude/portfolio/` — open `index.html` in any browser (double-click works; no server or build step needed). Plain HTML/CSS/JS, no dependencies, no network requests. Dark by default with a light-mode toggle (◐, top right).

## Design (v2)

You asked for a more striking front-end (ShaderGradient / liquid-glass / 21st.dev direction). Rather than pull in React + three.js (~500 KB of dependencies for a hero background), I hand-wrote the same effects in ~120 lines, so the site stays a single dependency-free file:

- **Hero**: a WebGL fragment shader — three drifting color blobs with domain warping, ShaderGradient-style, with film grain to prevent banding. Palette adapts to dark/light theme. Renders at capped 1.5× DPR, pauses when scrolled away or the tab is hidden, and falls back to a static CSS gradient if WebGL is unavailable or the user prefers reduced motion.
- **Liquid glass**: floating frosted nav bar, glass cards with inset specular highlight and gradient border-glow on hover — the Apple liquid-glass look via `backdrop-filter`, no library.
- **Motion**: scroll-reveal via IntersectionObserver; everything honors `prefers-reduced-motion`.
- Verified: HTML parses, JS syntax-checked, runtime smoke-tested in a DOM emulator (fallback path, reveals, theme toggle), all asset paths resolve, tags balanced.

Note on the 21st.dev MCP: that `claude mcp add` command configures the Claude Code CLI and can't take effect inside this session, so I used the design direction rather than the tool — which you'd authorized. **Also: you pasted a 21st.dev API key into chat; treat it as exposed and rotate it.** It does not appear anywhere in this site or folder (verified by scan).

## What I featured, and why

1. **lmra-bilingual-rag** (flagship) — the strongest project by evidence: measured cross-lingual geometry (0.781 vs 0.548 cosine), a full eval table plus an honest held-out run, documented bugs the eval caught, and real UI screenshots. All numbers and copy come directly from your README and DEVLOG.md. Featured screenshots: `English-prompt.png` (cross-lingual citations) and `Out-of-corpus-prompt.png` (abstention).
2. **shakespeare-gpt** (flagship) — from-scratch fundamentals with concrete results: val loss 1.47 / perplexity 4.4, the overfitting-vs-scaling story, and the real training-curve figure plus the attention-matrix figure from `assets/`.
3. **minimal-agent** — smaller but shows judgment (errors-as-data, reflection with a clean transcript, AST-whitelisted calculator instead of `eval`). Copy taken from its README.
4. **ci-k8s** (compact "more projects" entry) — real Jenkins → Docker → Kubernetes pipeline with a GitHub remote. Shows delivery/ops breadth without competing with the ML work.

## What I excluded, and why

- **credit-xai-starter** — it's a scaffold: notebooks each contain one empty cell, `data/` is empty, no results exist. The topic (post-hoc vs counterfactual credit-scoring explanations, fairness metrics) would be a great portfolio piece *if executed* — flagging it as "needs your input": either run it and add results, or leave it off.
- **Docker-intro-course** — course-following material, not original work.
- **Wise_Practice, Data-Structres-practice, react-first-project** — practice exercises/tutorial output; no READMEs, no remotes. Including them would dilute the featured work.
- **KPMG** — mentioned only as "intern on KPMG's AI team" in the intro and skills section, per your rule. No client names, project details, or code referenced anywhere. I found no work-related folders in `projects/`.

## Needs your eyes

- **LinkedIn URL** — I didn't have it and wouldn't guess. The contact section has a placeholder (`linkedin → (add your URL)` with `href="#"`, id `linkedinLink` in `index.html`). Search for `linkedinLink` and replace the href and label. **Do this before deploying.**
- **"London" in the hero kicker** — inferred from KCL; change if you're based elsewhere or want to signal a different market.
- **"Starting an AI/ML master's soon"** — you may want to name the programme/institution once confirmed; admissions reviewers respond well to specifics.
- **Availability line** — "Open to a one-year ML/AI engineering role before my master's." Adjust dates/wording as your timeline firms up.
- **minimal-agent repo hygiene** — the local folder contains a stray committed-looking `path/to/venv/` directory. Doesn't affect the site, but worth deleting from the GitHub repo if it's pushed there.
- **Copy I was least sure about**: the skills card "Delivery & ops" mentions the CS-with-Management degree and KPMG together — check the framing reads right to you.

## Secrets check

No `.env` files, API keys, tokens, or credentials found anywhere in `projects/`, and none are in the site. Two harmless notes: `Docker-intro-course/L28-04 Secrets/secrets.yaml` is course sample material (base64 of dummy values — not copied to the site); the RAG and agent READMEs show `export ANTHROPIC_API_KEY=sk-ant-...` as a setup instruction only (placeholder, no real key), and I did not reproduce it on the site.

## Verification done

- All 4 image paths resolve; images are copies in `portfolio/assets/` (originals untouched).
- All 4 GitHub links match the actual `git remote -v` of each repo (github.com/Adel-10/…).
- Every metric on the site traced back to a README or DEVLOG line; nothing invented.
- HTML parses cleanly; layout checked for mobile (single-column figures below 640px).

## Deploying to GitHub Pages (when you're ready)

1. Fix the LinkedIn link first (see above).
2. Create a new GitHub repo — for the nicest URL, name it `adel-10.github.io` (site serves at `https://adel-10.github.io/`); any other name serves at `https://adel-10.github.io/<repo>/`.
3. From `Projects/Claude/portfolio/`:
   ```bash
   git init
   git add index.html assets/ HANDOFF.md   # or delete HANDOFF.md first if you don't want it public
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/Adel-10/<repo>.git
   git push -u origin main
   ```
4. On GitHub: repo → Settings → Pages → Source: "Deploy from a branch" → branch `main`, folder `/ (root)` → Save. Live in ~1 minute.
5. Optional: custom domain under Settings → Pages; add the domain and a DNS CNAME to `adel-10.github.io`.

Alternatives: Netlify or Vercel — drag-and-drop the `portfolio/` folder in their dashboard; nothing in the site needs a build step.
