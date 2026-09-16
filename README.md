# Aditya Pathak — Developer Portfolio

A single-page developer portfolio built with **Angular 19**, styled as a code
editor. No backend, no CMS, no runtime data fetching — the whole site is static
and renders from one typed content module.

**Live:** https://paditya99.github.io *(update if you deploy elsewhere)*

---

## The idea

Most portfolios look like landing pages. This one looks like the place the work
actually happens: an explorer rail down the left, a breadcrumb top bar, a status
bar pinned to the bottom, and sections numbered like files in a project. It
opens on a boot terminal that "compiles the workspace", then reveals the page.

The conceit isn't only visual — the interactive pieces are real:

- **A queryable résumé.** The `query.sql` section is a working SQL console.
  Each tab types its query out, "runs" it, and renders the result grid from live
  data — including aggregates like tech usage grouped across projects. Nothing
  is hardcoded; change the résumé data and the result set changes.
- **A command palette for skills.** `Ctrl+Shift+P`-styled fuzzy filter over every
  skill, with category chips, live match highlighting, keyboard navigation, and
  a link to the official docs for each technology.
- **An animated architecture diagram.** Three selectable request flows through
  the systems I work on, rendered as SVG with travelling packets and a narration
  stepper that lights up each node as it explains the beat. Hovering a node
  pauses the tour and focuses that step.

---

## Features

| | |
|---|---|
| **Theming** | Dark/light via CSS custom properties and a `data-theme` attribute; persisted to `localStorage`, defaults to `prefers-color-scheme` |
| **Scroll-spy** | Deterministic — recomputes the active section from absolute scroll position against a reference line, rather than reacting to IntersectionObserver events (no "stuck section" bug) |
| **Motion** | Reveal-on-scroll with stagger, stat count-up, pointer-tracked 3-D card tilt, reading-progress bar, section-header rule draw-in |
| **Accessibility** | Every animation guarded by `prefers-reduced-motion`, visible focus rings, ARIA labelling on the diagram and controls, and text colours tuned to clear **WCAG AA (4.5:1)** in both themes |
| **Responsive** | Single-column reflow, mobile nav drawer, fluid `clamp()` type scale |

---

## Tech stack

**Angular 19** · **TypeScript** · **SCSS** · SVG · Web Audio API

- **Standalone components only** — no NgModules anywhere
- **Signals throughout** — `signal()` / `computed()` for all state, no RxJS subjects
- **Modern control flow** — `@if` / `@for`, not the legacy structural directives
- Zero runtime dependencies beyond Angular itself

---

## Content is data

All copy lives in one typed module, `src/app/data/resume.ts` — profile, roles,
projects, skills, education, achievements, documentation links, and the
architecture flows. Components never import it directly; they inject a
`ResumeService` facade.

That means the résumé, the SQL console result sets, the skills palette and the
architecture diagram all derive from the same source. Editing the site is
editing one file.

```
src/app/
├── core/         # section registry, scroll-spy, layout + résumé services
├── layout/       # shell chrome — boot terminal, top bar, explorer rail, status bar
├── sections/     # one standalone component per page section
├── components/   # arch-diagram, typewriter, section-header, window-dots
├── directives/   # reveal-on-scroll, count-up
├── services/     # theme
├── utils/        # SQL tokenizer, date math, diagram geometry
└── data/         # resume.ts — the single source of truth
```

Two design decisions worth calling out:

- **Sections are a registry.** `core/sections.ts` is the ordered list that drives
  the nav, the scroll-spy targets *and* the numbered headers at once. Reordering
  it renumbers the page automatically — no index is ever hardcoded.
- **Diagram geometry is a pure function.** Node positions are percentages;
  `utils/arch-layout.ts` resolves them to SVG paths, trims edges to box borders
  and fans them at shared sources. The component draws, it doesn't compute.

---

## Running locally

Requires **Node 22** (Angular 19 supports 18 / 20 / 22 — newer runtimes will fail
to build).

```bash
git clone https://github.com/paditya99/paditya99.github.io.git
cd paditya99.github.io
npm install
npm start          # http://localhost:4200
```

```bash
npm run build      # production build -> dist/portfolio/browser
npm test           # Karma + Jasmine
```

---

## Deploy

Fully client-side, so any static host works. The included GitHub Actions workflow
builds on push to `main` and publishes to GitHub Pages, adding a `404.html` SPA
fallback.

For a repo-subpath host, build with a matching base href:

```bash
ng build --base-href /<repo-name>/
```

---

## Contact

**Aditya Pathak** — Software Engineer

[LinkedIn](https://www.linkedin.com/in/adityapathak-nitrr/) ·
[GitHub](https://github.com/paditya99) ·
[adityapathak63635@gmail.com](mailto:adityapathak63635@gmail.com)
