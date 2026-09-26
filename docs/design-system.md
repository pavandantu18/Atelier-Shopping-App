# Atelier design foundations

## Reference study

Reviewed the live [Gucci US homepage](https://www.gucci.com/us/en/), [handbag listing](https://www.gucci.com/us/en/ca/women/handbags-c-women-handbags), and a product detail page on 26 September 2026, at 1440px desktop and 390px mobile widths. The homepage was showing a runway film at the time; campaign content changes. These are visual observations, not a reproduction specification.

| Area | Observed principle | Atelier implementation |
| --- | --- | --- |
| Typography | Compact sans-serif UI; regular-weight titles; imagery carries much of the emphasis. | Independent system-font stack, 16px body, 14px supporting text, 12px labels; fluid display/title/heading sizes. No proprietary fonts. |
| Spacing | Generous editorial space, compact navigation, minimal card decoration. | 4px spacing base; fluid 16–64px page gutters and 48–112px section spacing. |
| Layout | Edge-to-edge campaign imagery alternates with structured content. | A 1440px maximum page container, a 672px reading measure, and stacked-to-split layouts. Keep full-width media outside the page container. |
| Navigation | Desktop uses an icon-led header and a spacious category drawer. Mobile retains compact icons and horizontally scrollable categories. | Scrollable navigation row, 44px link targets, current-page underline. Drawer behavior is deferred to a future component. |
| Product presentation | Image-led grid, pale packshot backgrounds, small names/prices beneath, occasional editorial tiles; two columns on mobile. | Reusable 2/3/4-column grid with narrow gutters, 3:4 contained product media. No product card or commerce behavior is implemented. |
| Imagery | Large crop-based editorial media contrasts with isolated, fully visible products. | Separate contain/cover recipes, configurable focal point, portrait mobile and landscape desktop editorial ratios. No downloaded reference assets. |
| Buttons | Rectangular black primary actions, white labels, little ornament; inspected product action was 48px high. | Square 48px controls, primary/outline/inverse variants, mobile full-width option, hover/active/disabled/busy styling. |
| Links and borders | Underlined service links, fine separators, no heavy card shadows. | Explicit text links, nav links and 1px dividers; stronger control borders where an outline identifies an action. |
| Color | Mostly black/white/very pale neutrals; photography provides the color. | Original warm canvas, white surfaces, charcoal text, stone backdrops and a blue-gray keyboard focus ring. |
| Responsive behavior | Smaller header, two-column mobile catalogue, horizontally scrolling category bar, portrait media, stacked detail content. | Mobile-first grids and sections; 640/768/1024px breakpoints; fluid spacing/type, wrapping controls and no page-width scroll suppression. |

## Files and tokens

`src/app/globals.css` imports the theme and recipes through the existing root layout. `src/styles/tokens.css` is the Tailwind v4 theme; no JavaScript Tailwind config is needed. `src/styles/primitives.css` holds reusable CSS recipes in the components layer, so Tailwind utilities can override them.

- Colors: `bg-canvas`, `bg-surface`, `bg-subtle`, `text-ink`, `text-muted`, `border-line`, `border-control`, `bg-inverse`, `text-on-dark`.
- Typography: `font-sans`, `font-display`, `text-display`, `text-title`, `text-heading`, `text-body`, `text-small`, `text-label`, `tracking-label`. Apply sizes explicitly to semantic headings; heading level does not determine visual size.
- Spacing: normal `gap-2/4/6/8/12/16` plus `px-gutter`, `py-section`, `gap-layout`, `min-h-control` and `min-h-target`.
- Sizes: `max-w-page`, `max-w-reading`, `rounded-control`, `aspect-product`, `aspect-editorial`, `aspect-landscape`.
- The palette stays light regardless of system theme. An inverse section uses `bg-inverse text-on-dark` and `[--focus-ring:var(--color-on-dark)]`.

## Recipes

```tsx
<section className="page-container section-space">
  <div className="reading-container stack gap-6">
    <p className="eyebrow text-muted">Studio notes</p>
    <h1 className="text-display">Considered objects</h1>
    <p className="text-body">Original editorial content goes here.</p>
    <div className="cluster">
      <button type="button" className="button button-responsive">Explore</button>
      <a href="/about" className="text-link">About the studio</a>
    </div>
  </div>
</section>
```

The snippet is a usage example, not an implemented page or route.

- `.page-container`: outer page width and gutters. Nest `.reading-container` inside it for short copy.
- `.stack` / `.cluster`: vertical rhythm / wrapping horizontal groups. Override spacing with `gap-*`.
- `.split-layout`: one column until `lg`, then two equal columns. Override with grid utilities if the composition needs unequal widths.
- `.product-grid`: two columns below `md`, three at `md`, four at `lg`. Use normal grid utilities to override for a different content type.
- `.navigation-row`: horizontal overflow stays inside the row; scrollbars remain available. Give the wrapping `<nav>` an accessible name.
- `.button`: primary style. Add `.button-secondary`, `.button-inverse`, `.button-icon`, or `.button-responsive` as appropriate. Icon-only buttons require an accessible label. Use a real button for an action and an anchor for navigation.
- `.text-link` / `.nav-link`: visible inline underline / understated navigation underline. Use `aria-current="page"` for the active destination.
- `.divider`: use on `<hr>` for a meaningful section break.
- `.media-product` / `.media-editorial`: wrap `<img>`, `<picture>` or Next Image. Provide alt text, intrinsic image dimensions (or `fill` with `sizes`), and locally owned/licensed imagery. Set `--media-position` when a crop needs a different focal point. For a consistently portrait editorial tile, add `aspect-editorial`.

## Interaction and accessibility rules

Keep body copy at 16px; reserve 12px uppercase labels for short controls/eyebrows. Muted text is readable on all light surfaces. Use `line` for decoration and `control` for meaningful control outlines. Do not remove keyboard outlines; inverse surfaces need a light focus ring. Controls have a minimum height, not a fixed height, so translated or zoomed labels can wrap. Hover effects apply only on hover-capable devices and transitions stop under reduced-motion preferences. High-contrast mode retains button boundaries.

CSS cannot disable an anchor or manage focus in a drawer: use native `disabled` buttons, implement `aria-disabled` behavior in the consuming component, and use `aria-busy` alongside a meaningful loading label and duplicate-submit protection. Menus need keyboard support, focus management and Escape handling. The homepage consumes these foundations with scoped styling in `src/components/home/storefront.module.css`.


Typography refinement: locally hosted Cormorant Garamond Regular for editorial headings and product titles; Jost Regular/Medium for interface text, prices and navigation. Font files and SIL Open Font Licenses are in `src/app/fonts`. The separation of display and interface type was informed by the current LOEWE site; proprietary brand fonts are not copied. Product details describe visible features without unverified materials, UV claims, fulfillment promises or manufacturing claims. Sample catalogue status remains documented in README.
