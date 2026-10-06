# anneleedesigns.com

My portfolio site. Designed and hand-built in plain HTML, CSS, and JavaScript. No framework, no build step.

**Live site:** [anneleedesigns.com](https://anneleedesigns.com)

## Design approach

Swiss editorial. Neue Haas Grotesk, a strict 12-column grid. The layout design system is defined in `design.md` first, then implemented in CSS.

### Grid

| Breakpoint | Columns |
| ---------- | ------- |
| Desktop    | 12      |
| Medium     | 8       |
| Tablet     | 4       |
| Mobile     | 1       |

Every page uses the same shell:

```html
<main class="page-shell">
  <div class="grid-inner">...</div>
</main>
```

Blocks are placed with `.span-1` through `.span-12`.

## Project structure

```
index.html        Home: hero, about, project links
pockettype.html   Case study
casper.html       Case study
finde.html        Case study
verizon.html      Case study
styles.css        Global styles, nav, responsive grid
script.js         Shared navbar injection and active-page highlighting
design.md         Design system spec: columns, gutters, breakpoints, spacing
```

## How it's built

- **Shared nav.** The navbar is rendered from `script.js`, so it's defined once and reused on every page.
- **Tokens.** Font families and core values live as CSS custom properties on `:root`.
- **Spec first.** Grid and spacing decisions are written in `design.md`, then ported to `styles.css`. To change the system, update the spec, then the CSS.

## Run locally

```bash
git clone https://github.com/annelee01/Portfolio.git
cd Portfolio
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Deployment

Static site, deployed on Vercel.

## License

Code is MIT licensed. Case study content, images, and writing are © Anne Lee. All rights reserved.
