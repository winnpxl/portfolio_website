# Samuel Winner — Portfolio

Personal portfolio for Samuel Winner, product designer and design engineer.
Three routes: home, a featured case study, and an image gallery.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4. Fully static —
every route prerenders at build time.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Structure

```
src/
  app/
    layout.tsx          root layout, fonts, metadata
    globals.css         design tokens + base layer
    page.tsx            home
    work/runbeta/       featured case study
    gallery/            image gallery
  components/
    Nav.tsx             sticky pill nav + the three variants
    Page.tsx            page shell and content column
    ui.tsx              Pill, Card, Panel, ButtonLink, BulletList, ImageFrame
  content/
    site.ts             home content
    runbeta.ts          case study content
    gallery.ts          gallery tiles
design-reference/       original HTML prototypes + the design handoff
```

Content lives in `src/content` as typed arrays, separate from layout. Adding a
work card, a toolkit chip, a process step or a gallery tile means editing an
array, not JSX.

## Design system

Tokens are defined once in `src/app/globals.css` under `@theme`, so they are
available as Tailwind utilities (`bg-maroon`, `shadow-hard-7`, `font-display`).

| Token | Hex | Use |
|---|---|---|
| `pink` | `#F0456F` | page ground, accent bullets |
| `maroon` | `#6B0F2C` | all text, every border, every shadow |
| `maroon-deep` | `#4E0A20` | shadow under maroon panels, hover |
| `cream` | `#FFF6EE` | card surfaces, nav, text on maroon |
| `butter` | `#F7E5A0` | highlight cards, secondary pills |
| `rose` | `#F6A8C4` | image backing, muted text on maroon |

Two rules carry most of the style: every border is `2px solid maroon`, and every
shadow is a hard offset with no blur (`shadow-hard-4` through `shadow-hard-8`,
plus `shadow-deep-*` under maroon surfaces).

Type is Baloo 2 (display) and Work Sans (text), self-hosted at build time via
`next/font`. Layout is responsive without media queries: `clamp()` type ramps and
`auto-fit` / `auto-fill` grids.

## Filling in the placeholders

The design ships with deliberate gaps. Each is a content edit, not a layout one.

1. **Images** — `ImageFrame` renders its placeholder note until a `src` is set.
   Drop a file in `public/images/` and add `src` to the matching `image` entry in
   `src/content/`. The frame already fixes the aspect ratio.
2. **Email and LinkedIn** — `contact.tiles` in `src/content/site.ts`, both marked
   with `TODO`.
3. **Writing and testimonials** — `writing` and `testimonials` in
   `src/content/site.ts` are empty arrays, so those two sections do not render.
   Add entries and they appear.
4. **The four remaining case studies** — Visio, Governance Clout, Penaid and
   Paying Friends show "Case study in progress". Build them on
   `src/app/work/runbeta/page.tsx`, add a route under `src/app/work/<slug>/`,
   and give the entry in `work` an `href`.

## Notes on the port

- The prototype's `<sc-if>` blocks became empty-array checks, which is what the
  handoff asked for: the section drops when its content collection is empty.
- The gallery's two wide tiles span two columns only once the grid actually has
  two columns. The prototype's unconditional `grid-column: span 2` forces an
  implicit second column at narrow widths and scrolls the page sideways
  (415px of content in a 360px viewport). This is the one intentional deviation.
- Focus rings were added, as the handoff requested: maroon on light surfaces,
  butter inside maroon panels.
- Prose is unchanged from the reviewed copy in `design-reference/README.md`.
