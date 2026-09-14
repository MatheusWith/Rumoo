# Foundations — Spacing & Layout

## Spacing grid

Base unit **4px**. Use multiples of 4 for fine spacing inside components and
multiples of **8 for structural rhythm** (page sections, gutters, gaps between
sibling blocks).

| Token | px | Typical use |
|---|---|---|
| `--space-1` | 4 | Icon/gap micro inset |
| `--space-2` | 8 | Inline gap, checkbox-label gap |
| `--space-3` | 12 | Compact padding, table cell padding |
| `--space-4` | 16 | Default control padding, card padding |
| `--space-5` | 20 | Card padding (comfortable), section gap small |
| `--space-6` | 24 | Section gap, modal padding |
| `--space-8` | 32 | Page gutters, dialog-breath |
| `--space-12` | 48 | Panel/section separation |
| `--space-16` | 64 | Page-level spacing, empty states |
| `--space-20` | 80 | Max layout breathing room |

## Radius

| Token | px | Use |
|---|---|---|
| `--radius-sm` | 6 | Inputs, selects, small controls |
| `--radius-md` | 8 | Buttons, cards (compact), badges |
| `--radius-lg` | 12 | Cards (comfortable), modals, panels |
| `--radius-full` | 999px | Pills, avatars, toggles |

## Elevation (light) / (dark)

Surfaces separate content with border + subtle shadow. Dark theme favors
borders over shadows (black shadows are invisible).

| Token | Light | Dark |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(15,23,42,0.05)` | `0 1px 2px rgba(2,6,23,0.4)` |
| `--shadow-md` | `0 4px 12px rgba(15,23,42,0.08)` | `0 4px 12px rgba(2,6,23,0.6)` |
| `--shadow-lg` | `0 12px 32px rgba(15,23,42,0.14)` | `0 12px 32px rgba(2,6,23,0.7)` |

## Layout containers

- App shell: left **nav rail/sidebar** (fixed `--space-16` = 64px collapsed /
  240px open), top **header** (56px), content area with `--space-6` gutters.
- Content max-width: none (product app, not a marketing page); minimum alignment
  padding `--space-4` on < 768px.
- Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536` (tailwind
  defaults).

## Grid

- Page sections: 12-column grid, gutters `--space-6`.
- Card grids: `auto-fill, minmax(280px, 1fr)` for dashboards;
  `minmax(220px, 1fr)` for compact cards.
- Never break the 4px base inside a component; breaking it in layout is allowed
  only via container queries on ≥ `lg`.