# Portfolio Design System (Grid Skill)

This file is the single source-of-truth for layout, grids, columns, and gutters in the portfolio and derived projects. It is influenced by grid principles from Josef Müller-Brockmann's "Grid Systems in Graphic Design" and the local project strategy (12/9/6 columns, 24px margin, 16px gutters, responsive behavior).

## Intent

- Keep typography and spacing consistent across breakpoints.
- Keep a single source of truth for grid structure used by CSS implementation.
- Make it easy to update for new projects by editing this document first, then applying to styles.

## Lockdown variables

- baseline: 4px (can be scaled via a modular `4x` grid)
- margin: 24px (constant outer page padding)
- gutter: 16px (fixed column gap)
- max content width: 1440px (desktop)

## Core grid definitions

- **Desktop (>= 1440px)**: 12-column grid.
- **Large tablet (>= 1024px)**: 9-column grid.
- **Small tablet (>= 768px)**: 6-column grid.
- **Mobile (>= 425px)**: 6-column grid.
- **Mini mobile (< 425px)**: 6-column grid (still retains internal structure for text/buttons).

### Common class mapping

- `.span-1` ... `.span-12` in desktop references 12 columns.
- On narrower breakpoints, `.span-N` is reinterpreted at active column count (i.e., 6 columns at mobile, `.span-6` = full width).

### Component sizing

- Full-width cards: `.span-6` on mobile, `.span-12` on desktop.
- Text block width: `.span-4` on mobile, `.span-8` on desktop.
- Buttons/etc: `.span-2` / `.span-3` etc., as needed.

## Breakpoint behavior

- The physics of hierarchy:
  - `min-content` width is 320px.
  - `padding` is always 24px to honor margin.
  - Column count reduces by design layer but doesn't collapse to gapless order; it retains modular subgrid control.

## Typography tokens

- display: `var(--font-display)` from styles.
- body: `var(--font-text)`.
- Phrase-scale ratio: use geometric steps and modular rhythms (1rem base / 16px).

### Type scale (from Figma)

- H1 / display:
  - font-size: 96px
  - font-family: Neue Haas Grotesk Display Pro 55 Roman
  - font-weight: 450
  - line-height: 104px
  - letter-spacing: 0

- H3:
  - font-size: 48px
  - font-family: Neue Haas Grotesk Display Pro 55 Roman
  - font-weight: 500
  - line-height: 56px
  - letter-spacing: -1

- Title Large:
  - font-size: 40px
  - font-family: Neue Haas Grotesk Display Pro 55 Roman
  - font-weight: 450
  - line-height: 48px
  - letter-spacing: 0

- Title Medium:
  - font-size: 32px
  - font-family: Neue Haas Grotesk Display Pro 55 Roman
  - font-weight: 450
  - line-height: 40px
  - letter-spacing: 0

- Title Small:
  - font-size: 24px
  - font-family: Neue Haas Grotesk Text Pro 55 Roman
  - font-weight: 400
  - line-height: 1.2
  - letter-spacing: 0

- Body Base:
  - font-size: 16px
  - font-family: Neue Haas Grotesk Text Pro 55 Roman
  - font-weight: 400
  - line-height: 22px
  - letter-spacing: -1

- Body Small:
  - font-size: 11px
  - font-family: Neue Haas Grotesk Text Pro 65 Medium
  - font-weight: 500
  - line-height: 100% (11px)
  - letter-spacing: 3

### Font files & @font-face

Fonts live in `./fonts/Neue Haas Grotesk/`. Both families must be declared with `@font-face` rules in `styles.css` — without them the browser falls back to Helvetica Neue and never loads the `.woff2` files.

**Naming convention:** `NHaasGrotesk{DS|TX}Pro-{weight}{style}.woff2`
- `DS` = Display Pro, `TX` = Text Pro
- First digit of the weight code = weight class; second digit: `5` = Roman (upright), `6` = Italic

**CSS `font-weight` → file mapping:**

| `font-weight` | Display Pro file | Text Pro file |
|---|---|---|
| 100 | `DSPro-15UltTh` | — |
| 200 | `DSPro-25Th` | — |
| 300 | `DSPro-35XLt` | — |
| 400 | `DSPro-45Lt` | `TXPro-55Rg` |
| **450** | **`DSPro-55Rg`** ← "55 Roman" | — |
| 500 | `DSPro-65Md` | `TXPro-65Md` |
| 700 | `DSPro-75Bd` | `TXPro-75Bd` |
| 900 | `DSPro-95Blk` | — |

> `font-weight: 450` is intentional — Neue Haas Grotesk's "55 Roman" is the primary display weight used in Figma. Without an explicit `@font-face` at weight 450, browsers round to the nearest defined weight and load the wrong file.

### Type token mapping

- `--type-display`: 96px
- `--type-h3`: 48px
- `--type-title-large`: 40px
- `--type-title-medium`: 32px
- `--type-title-small`: 24px
- `--type-body`: 16px
- `--type-body-sm`: 11px

### Typography layout principles

- Maintain baseline multiple of 4px for line-height and vertical rhythm.
- Headings should scale in a modular ratio (`96 → 48 → 40 → 32 → 24 → 16 → 11`).
- Use `line-height` 1.1–1.2 for display/headings and 1.35–1.5 for body text.
- Ensure minimum readable font-size 11px (secondary text) and 16px for primary body copy.

## Spacing tokens

All spacing is on an **8px grid** — every value is a whole multiple of 8. The token name is the multiplier (`--space-1` = 1 × 8 = 8px).

| Token       | Value  | Typical use                                      |
|-------------|--------|--------------------------------------------------|
| `--space-1` | 8px    | Inline gap, icon padding, tight text spacing     |
| `--space-2` | 16px   | Grid gutter, list item gap, small component pad  |
| `--space-3` | 24px   | Card padding, nav gap, between name & bio        |
| `--space-4` | 32px   | Section inner padding, between related groups    |
| `--space-5` | 40px   | Component vertical rhythm                        |
| `--space-6` | 48px   | Stacked mobile hero gap, between sections        |
| `--space-7` | 56px   | Hero column internal gap (role → tagline)        |
| `--space-8` | 64px   | Hero vertical padding, large component spacing   |
| `--space-9` | 72px   | Medium section padding                           |
| `--space-10`| 80px   | Generous section breathing room                  |
| `--space-11`| 88px   | —                                                |
| `--space-12`| 96px   | Large page section padding                       |
| `--space-13`| 104px  | —                                                |
| `--space-14`| 112px  | —                                                |
| `--space-15`| 120px  | Maximum section / hero padding                   |

### Spacing principles

- Never use a value that isn't a multiple of 8.
- For micro-adjustments (e.g. 4px optical corrections), use `calc(var(--space-1) / 2)` — do not introduce a free value.
- Prefer larger tokens for vertical rhythm between sections, smaller tokens within components.
- The grid margin (24px) and gutter (16px) are fixed; do not substitute spacing tokens for them.

## Implementation check

- The CSS file `styles.css` should match these numbers and media query thresholds.
- When a new project needs new column breakpoints, update this file and then replicate to `styles.css`.

## 