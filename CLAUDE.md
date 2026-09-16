# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

---

## READ THIS FIRST — environment gotcha

**`ng build` and `ng serve` do not work in this environment.** Both abort with
SIGABRT (exit 134) and *zero output*. This is **not** caused by any code change —
it reproduces on a pristine copy of the upstream project, and on Node 22.14 as
well as Node 26. Do not waste a turn "fixing" it, and do not blame it on the
last edit.

**Verify work with the Angular compiler instead:**

```bash
npx ngc -p tsconfig.app.json --noEmit    # exit 0 == clean
```

`tsconfig.json` sets `strictTemplates: true`, so this performs the **full
template type-check** that `ng build` would — bindings, directive inputs,
`@if`/`@for` control flow, the lot. It is a genuine check, confirmed with a
negative control (a bogus binding makes it fail with `TS2339`).

`npx tsc --noEmit -p tsconfig.app.json` only checks `.ts` files and **misses all
template errors**. Prefer `ngc`.

**What `ngc` does NOT verify:** bundling, and anything visual — layout, CSS,
animation, overflow. Only the user can confirm those, by running `npm start` on
**Node 22** on their own machine. When reporting work, say plainly that visuals
are unconfirmed. Do not claim a change "works" or "looks right".

> Note on shell: this is **zsh**. `${PIPESTATUS[0]}` is empty — arrays are
> 1-indexed. Use `$?` after a redirect, or `${pipestatus[1]}`.

---

## Commands

```bash
npm start            # dev server :4200 — REQUIRES Node 22, broken here
npm run build        # prod build -> dist/portfolio/browser — broken here
npm test             # Karma + Jasmine, watch mode — unverified in this env
npx ngc -p tsconfig.app.json --noEmit   # <- the check that actually runs here
```

Angular 19 supports Node 18/20/22 only. The machine has Node 26 (`ng version`
flags it Unsupported). There is no lint step. Only one spec file exists
(`app.component.spec.ts`) — this project is not test-driven.

---

## What this is

A single-page developer portfolio for **Aditya Pathak** — no backend, no runtime
data fetching. Concept: **"The Workspace"**, a VS Code / editor-inspired
identity. All content is static, lives in TypeScript, and is rendered with
signals and scroll-driven UI.

**Provenance:** this started as a fork of another engineer's portfolio (Akash
Soni, `Akus0ni.github.io`). It has been fully re-authored — a scan for
`akash|akus0ni|soni|Energy Exemplar|eGain|IKS Health` returns nothing. The
untouched original may still exist at `../Akus0ni.github.io-main 2`, useful as a
diff baseline. The original author's `docs/angular19-course/` has been deleted.
`public/media/the_trial_of_the_bow.mp3` (the intro-boot soundtrack) is inherited
from them and is **deliberately kept** — the user decided this. Flag the
third-party-music licensing question once if publishing comes up, then drop it.

---

## Architecture

**Content is data, not markup.** `src/app/data/resume.ts` is the single source of
truth for all content (profile, links, roles, projects, skills, education,
achievements, `TECH_LINKS`, and the `ARCH_FLOWS` that drive the animated
architecture diagram). Components never import it directly — they inject
`ResumeService` (`src/app/core/resume.service.ts`), a thin facade. To change what
the site says, edit `resume.ts`.

> `SUMMARY` in `resume.ts` is currently **dead** — exported and exposed on the
> service but rendered nowhere. Keep it consistent or delete it; don't assume
> edits to it are visible.

**The architecture diagram is flow-driven.** `ARCH_FLOWS: ArchFlow[]` models the
signature work as three selectable flows, in this order (the first is the default
tab):

1. `platform` — **Loan origination.** The product workflow end to end:
   borrower/officer → NestJS API → application → credit & verification →
   pricing → underwriting → closing & funding, with documents/e-sign, the data
   layer, async workers, integrations and back-office hanging off it. 15 nodes.
   Deliberately models the *domain journey* with tech in the sub-labels, not a
   bare infrastructure diagram — an earlier version showed only tech boxes and
   was rejected for that. Listed first; see the content balance rule below.
2. `extraction` — the batch pipeline turning guideline PDFs into structured rules.
3. `assistant` — the authenticated RAG chat path that answers with citations.

Each flow carries `nodes` (id/label/sub/`kind`/percent `x`,`y`), `edges`
(`from`/`to`, optional `bidir`), and ordered `steps` (a caption plus the node ids
it lights). `ArchDiagramComponent` renders one flow at a time and auto-advances a
narration stepper; hovering a node pauses the tour on that node's beat. Geometry
is a pure helper — `layoutNodes`/`layoutEdges` in `src/app/utils/arch-layout.ts`
against fixed `ARCH_W`/`ARCH_H`/`BOX_W`/`BOX_H`. Direction is carried by
travelling packets + captions, not arrowheads. **Never hardcode geometry in the
component.** Each flow id also needs a tab-dot colour in
`arch-diagram.component.scss` (`.dot[data-flow='<id>']`).

### Editing ARCH_FLOWS — non-obvious layout constraints

`layoutEdges` assumes edges run roughly left-to-right. Violating these produces
a *visually* broken diagram that still compiles, and you cannot see it here:

- **No vertical edges.** Connected nodes need Δx ≳ 16 percentage points
  (`BOX_W + 12` canvas px). Same-x nodes produce a backwards S-curve loop.
- **One edge per direction from a source.** The `FAN` bias only distinguishes
  up / level / down, so two "up" edges from one node overlap.
- **Curves can clip unrelated boxes.** A bézier that looks fine at its midpoint
  can cut a box corner near its start.

Because none of this is visible without rendering, **verify geometry numerically**
before claiming a diagram is correct: re-implement `layoutNodes`/`layoutEdges`
in a throwaway Node script, sample each bézier at ~100 points, and assert no box
overlaps, no out-of-bounds nodes, no backward paths, no curve/box collisions, no
orphan nodes, and that every `steps[].at` id resolves. This method caught a real
clipping bug that four candidate layouts shared.

**Sections are a registry, not hardcoded.** `src/app/core/sections.ts`
(`SECTIONS: SectionMeta[]`) is the ordered list of sections — currently `home`,
`about`, `experience`, `projects`, `query`, `skills`, `education`, `contact`. It
drives the explorer-rail nav, the scroll-spy targets, and the numbered headers at
once. `SectionService` derives `01..NN` from registry order, so **reordering
`SECTIONS` renumbers headers automatically** — never hardcode an index. Each
section declares only its id: `<app-section-header id="experience" />`.

**Scroll-spy is deterministic.** `ScrollSpyService` recomputes the active section
from absolute scroll position against a line ~40% down the viewport
(rAF-throttled) rather than reacting to IntersectionObserver events — this avoids
the "stuck active section" problem. It also exposes a `progress` signal (0–100)
driving the top-bar reading-progress line. Initialised once from
`AppComponent.ngAfterViewInit`.

**`AppComponent` is a thin shell.** It composes the chrome (`layout/`) around the
ordered sections and owns only the scroll-spy init and the page-wide click
ripple. Chrome components each inject what they need rather than taking inputs.
Cross-chrome state (`menuOpen`, `activeFile`) lives in `LayoutService`. The
explorer rail sets `:host { display: contents }` so its `<aside>` stays the direct
grid item.

**Directives** (`src/app/directives/`):
- `appReveal` — IntersectionObserver adding `.is-visible` (styled globally), with
  optional `[revealDelay]` stagger.
- `appCountUp` — animates a stat from zero on first scroll into view. Takes the
  **finished formatted string** (`2.5+`, `350+`) and animates only the numeric
  run, preserving prefix/suffix/decimals.

**Layout of `src/app`:**
- `core/` — `sections.ts`, `section.service.ts`, `resume.service.ts`,
  `scroll-spy.service.ts`, `layout.service.ts`
- `layout/` — `intro-boot`, `top-bar`, `explorer-rail`, `status-bar`, `site-footer`
- `sections/` — hero, about, experience, projects, query-console, skills,
  education, contact
- `components/` — `arch-diagram`, `typewriter`, `section-header`, `window-dots`
- `services/` — `theme.service.ts` (dark/light, localStorage, respects
  `prefers-color-scheme`)
- `utils/` — `sql-highlight.ts`, `duration.ts`, `arch-layout.ts`
- `data/` — `resume.ts`

---

## Conventions

- **Standalone components only** — no NgModules. `app.config.ts` bootstraps with
  `provideRouter` + zone change detection.
- **Signals throughout** — `signal()`/`computed()`, not RxJS subjects.
- **Modern control flow** — `@for` / `@if`, never `*ngFor` / `*ngIf`.
- **External templates and styles** — every component uses `templateUrl` +
  `styleUrl` with sibling `.html`/`.scss`. Never inline `template:`/`styles:`.
- **Theming via CSS custom properties** declared at the top of `src/styles.scss`,
  switched by the `data-theme` attribute. Use `var(--accent)`, `var(--border)` —
  never hardcode a colour.
- **Accessibility floor is intentional** — focus rings, `prefers-reduced-motion`
  guards on every animation, ARIA labels. Preserve these. `--text-3` was
  deliberately re-tuned (dark `#7A8899`, light `#5F6B80`) to clear WCAG AA 4.5:1
  on every background it sits on; **verify contrast numerically before changing
  any text colour.**

### CSS specificity trap — read before styling links

Angular injects component styles into `<head>` **after** global `styles.scss`, so
a component rule beats a global rule of equal specificity. Global `.a-link` /
`.is-link` silently lose to component `.company`, `.chip`, `.tag`. When a
component already styles `color`/`border`, add a paired selector **in that
component's SCSS** (`.company.a-link`, `.chip.is-link`, `.tag.is-link`).

Link styling in use:
- `.a-link` (global) — inline text links: accent + soft underline.
- `.is-link` (global + per-component pairs) — linked tech chips: accent-tinted
  border at rest so they read as links before hover.
- `.sym-link` (skills palette) — dotted underline; solid across ~60 rows was a
  wall of lines.

**Hyperlinks are data.** `TECH_LINKS` in `resume.ts` maps a normalised term
(lowercased, non-alphanumerics stripped, so `Aws.Bedrock` / `AWS Bedrock` /
`aws-bedrock` collapse to one key) to official docs. Reached via
`resume.techLink(term)`. Consumed by the skills palette, project tags and
experience stack chips. Terms with **no canonical doc stay absent** and render as
plain text — do not link to a Wikipedia page just to make something blue.
`Role.url` links a company name.

---

## Content rules — IMPORTANT, these are the user's explicit instructions

**1. Balance is 60% core backend / 40% AI.** Aditya is a backend engineer first.
He builds REST APIs and features across a mortgage lending and brokerage
platform (loan origination + back-office services), fixes Jira bugs, optimises
slow endpoints, and integrates flows. The AI work sits *alongside* that. Earlier
drafts over-weighted AI and were corrected. Core backend leads in the hero
tagline, the About section, the Experience bullets, the Projects order (`los-ppe`
is first and featured), and the diagram tab order.

**2. Never leak the employer's proprietary code.** The work repo is at
`~/Desktop/ARIVE/lending-portal-be` (Wizni / ARIVE). It may be read *for
understanding only*. Portfolio copy stays at resume altitude: project type,
functionality, tech stack, industry-standard patterns. **Never write** internal
service names, endpoint paths, table/column/collection names, prompt text,
business or underwriting rules, pricing/eligibility logic, lender or customer
names, env vars, model IDs, or any borrower/loan data. Never send any of it to a
web tool. This is a GLBA/SOC 2 environment; treat all borrower, loan, credit,
income, asset, property and appraisal data as NPI.

**3. Do not overclaim AI expertise.** Aditya has worked on guardrails, vector
search, reranking and chunking but is **not** an expert and it is a team-built
system. Skill `meta` labels use `worked with` / `contributed` / `integrated` /
`applied` / `worked on` — not authority claims. The RAG assistant project is
explicitly described as team-built with his contribution scoped. Keep it that
way; do not "improve" these back into ownership language.

**4. Never invent metrics.** `STATS` holds the only quantified facts available
(`2.5+` years, `2` LLM systems, `30+` lenders, `350+` DSA problems), all
resume-backed. Do not add a fabricated backend number for balance.

**5. Titles and identity.** Title is **"Software Engineer"** (matches the resume
PDF), positioned as backend-focused. The user has hand-edited `PROFILE`
(typewriter phrases, `ctaCaption`, `availabilityComment`) — **preserve their
wording**; don't rewrite it as a side effect. Open to **on-site, hybrid or
remote** — never write "remote-friendly".

**6. Tone.** Plain, concrete, first-person. No marketing adjectives, no
"passionate about", no invented enthusiasm.

---

## Project state

**Done:** full content re-authoring; hyperlinked tech terms; SQL console at six
tabs (`experience`, `projects`, `ai`, `tech`, `education`, `stack`) with
self-typing SQL; CSS/animation pass (stat count-up, card 3-D tilt, scroll
progress bar, section-header rule draw-in, hero name sheen, palette match
highlighting); WCAG AA contrast fix; the third `platform` diagram flow.

**Open / deliberately not done:**
- A "How I work" principles strip was designed and **declined** — do not add it.
- Content is still on the long side in places; the user plans a trimming pass.
- `public/media/aditya-portrait.jpg` is only ~17 KB and may look soft; the user
  is replacing it.
- `Aditya_Pathak_Resume.pdf` is 4 MB. Swapping for a compressed copy was offered
  and **declined** — leave it.
- Nothing has been visually confirmed since the build is blocked here.

---

## Deploy

Fully client-side. `npm run build`, publish `dist/portfolio/browser`.
`.github/workflows/deploy.yml` builds with `--base-href /` and adds a
`404.html` SPA fallback — correct for a `<user>.github.io` repo. For a
repo-subpath host, change the base href to `/<repo>/`.
