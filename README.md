# Portfolio

A personal portfolio website built with plain HTML, CSS, and JavaScript.

## Project structure

- `index.html` - home landing with hero, about, and project links.
- `casper.html` - project case study page.
- `finde.html` - project case study page.
- `verizon.html` - project case study page.
- `styles.css` - global styles, navbar styling, and responsive grid styling implementation.
- `design.md` - design system "skill" source of truth: column/gutter/breakpoint rules, component spacing intent, grid strategy.
- `script.js` - reusable site navbar component injection and page highlight logic.

## Key features

- Centralizable, repeatable navbar rendering from `script.js`.
- Figma-inspired style: sticky top nav, typography, spacing, and CTA button.
- 12-column responsive grid system:
  - desktop: 12 columns
  - medium: 8 columns
  - tablet: 4 columns
  - mobile: 1 column
- CSS design tokens via `:root` (font families).

## How to run

1. Clone repo:

```bash
git clone https://github.com/annelee01/Portfolio.git
cd Portfolio
```

2. Open `index.html` in a browser.

3. Or run a local dev server (recommended):

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Development notes

- Keep the nav structure in `script.js` so it’s shared and maintainable.
- Each page uses `<main class="page-shell"><div class="grid-inner">...</div></main>` for layout.
- Use `.span-1 ... .span-12` to place any block in the grid.
- Use `design.md` as the design system source of truth for column/gutter/breakpoint rules.
  - Define the column structure in `design.md` (e.g., 12 → 9 → 6 column breakpoints)
  - Internally implement those values in `styles.css` and component CSS classes.
  - When starting a new project, update `design.md` and port values into CSS/HTML layouts.

## Deployment

This is a static site and is ready for GitHub Pages.

1. In GitHub repo settings, enable Pages from `main` branch.
2. Optionally set root folder.

## License

MIT (or your preferred license)
