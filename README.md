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
available as Tailwind utilities (`bg-parchment-cream`, `shadow-card`,
`font-display`). The full reference lives in `design-reference/DESIGN.md`.

| Token | Hex | Use |
|---|---|---|
| `ink-black` | `#1d1d1c` | primary text and structural ink, never pure black |
| `parchment-cream` | `#f8f7f2` | page canvas, never pure white |
| `paper-white` | `#ffffff` | elevated cards, inputs, button fills |
| `linen-beige` | `#edeae4` | secondary surface, one step above canvas |
| `sand-gray` | `#d8d6ce` | hairline borders and dividers |
| `ash-gray` / `slate-warm` | `#99978f` / `#7a7974` | muted and secondary text |
| `twilight-indigo` | `#190922` | dark section base, the hero and contact bands |
| `electric-violet` | `#b26bf5` | primary chromatic accent |

Two rules carry most of the style, and both are the inverse of a hard-edged
system: borders are **1px warm hairlines**, and shadows are **layered
oklch warm tints** with no hard offsets. The shape vocabulary is exactly four
values — 12px (cards, buttons, inputs), 16px (large panels), 24px (special
panels), and 9999px (pills and chips only).

Type is **PP Palma** for display (28px and up) and **PP Mori** for UI and body;
the two never mix at body sizes. The display face stays at its lighter cut on
purpose — size and tight letter-spacing do the work, not weight.

Both are self-hosted from `src/fonts` as woff2 via `next/font/local` (249KB
for seven faces, down from 542KB of OTF). Weights are declared as ranges so
the Tailwind utilities land on the right cut: `font-normal` and `font-medium`
both resolve to Palma Medium, and `font-bold` resolves to Mori Semibold rather
than falling through to a heavier weight than intended.

The rainbow accent set (violet, pink, tangerine, aqua, sky, yellow, mint) is
punctuation, used as card fills in rotation — see `accentRotation` in
`src/components/ui.tsx`, which drives the process cards. Primary actions stay
neutral (ink or white); there is deliberately no solid-violet CTA.

Layout is responsive without media queries beyond the nav breakpoint:
`clamp()` type ramps and `auto-fit` / `auto-fill` grids.

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
- Focus rings use deep violet on light surfaces and pale violet inside the
  twilight bands.
- Prose is unchanged from the reviewed copy in `design-reference/README.md`.
