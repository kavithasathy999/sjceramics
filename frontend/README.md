# SJ Ceramics — React Home Page

A React 19 + Vite conversion of the SJ Ceramics HTML template's homepage.

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build -> dist/
```

## Project structure

```
src/
  components/   Reusable UI pieces (Header, HeroSlider, Footer, SkillBar, ...)
  pages/        Home.jsx assembles the homepage from components
  hooks/        useStickyHeader, useScrollProgress, useInView, useFormState
  utils/        Shared data (navigation.js)
  styles/       global.css (ported theme CSS + Google Fonts)
  assets/       Images, fonts, and the original vendor CSS (bootstrap, icons, animate.css)
```

## Notes on the conversion

- All jQuery DOM logic (mobile menu, sticky header, back-to-top progress ring,
  search popup, scroll-reveal animations, animated skill bars) has been
  rewritten as React hooks/state — no jQuery, no `document.querySelector`.
- The hero and testimonial sliders use the official `swiper/react` package
  instead of the legacy jQuery Swiper build.
- Skipped on purpose (not core homepage content): the RTL/boxed "color
  palate" theme-demo switcher and the dummy shopping-cart sidebar widget —
  both were ThemeForest demo scaffolding, not real site features.
- Styling: the original CSS is heavily interdependent (global grid classes,
  BEM-ish component classes, shared utility classes), so it's kept as
  plain, well-organized global CSS rather than CSS Modules, which would
  have required rewriting/duplicating selectors across files without
  benefit. Ask if you'd like a CSS Modules or Tailwind pass instead.
