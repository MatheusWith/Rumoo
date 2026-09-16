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
| `--space-8` | 32 | Page gutters (≥xl), dialog-breath |
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

## Page grid system

### Container

- Max width **80rem (1280px)**, centered (`margin: 0 auto`).
- Responsive padding: `px-4` (< 768px) → `px-6` (≥ 768) → `px-8` (≥ 1280).
- Tailwind utility: `page-container`.

### Page grid

- **12-column grid** with `gap-6` (24px) between columns.
- Columns collapse to a single column below `lg` (1024px). Between `md` and `lg`
  the grid may be 1- or 2-column depending on the section.
- Always use `gap-6` (24px gutters). Minimum alignment padding for content
  below 768px is `px-4` (16px).
- Tailwind utilities: `grid grid-cols-12 gap-6`, `col-span-*`.

### Card grids

| Token | Breakpoint behavior | Use |
|---|---|---|
| `card-grid` | `auto-fit, minmax(280px, 1fr)` | Dashboards, metric cards |
| `card-grid-compact` | `auto-fit, minmax(220px, 1fr)` | Dense lists, compact cards |

Cards adapt to available width; no fixed column count.

### Breakpoints (Tailwind defaults)

| Prefix | Width |
|---|---|
| (base) | 0 → mobile-first |
| `sm` | ≥ 640px |
| `md` | ≥ 768px |
| `lg` | ≥ 1024px |
| `xl` | ≥ 1280px |
| `2xl` | ≥ 1536px |

### App-shell grid

| Region | Comfortable | Compact |
|---|---|---|
| Sidebar (open) | 240px | 240px |
| Sidebar (collapsed) | 64px (icon + tooltip) | 64px |
| Header | 56px | 48px (compact) |
| Content gutters | `space-6` (24px) | `space-4` (16px) |
| Content max-width | 80rem (1280px) | 80rem |

On mobile (<768px) the sidebar is **not rendered**; navigation moves to a bottom
tab bar or an overlay sheet. The header shrinks to 48px. This is the mobile-first
entry point — the sidebar is an *enhancement* for larger screens.

### Convention: which grid per screen kind

| Screen | Grid | Notes |
|---|---|---|
| Dashboard | `card-grid` inside `page-container` | Metric cards adapt to width |
| List (goals, activities) | `page-container` → full-width list/table inside | Table spans 12 cols |
| Form (goal/activity create) | `page-container` → 1-2 column layout depending on field count | Sidebar/panel optional for advanced fields |
| Detail (goal/activity) | `page-container` → sidebar metadata + main content area | master-detail pattern |
| Modal / panel | Fixed max-width (`sm`/`md`/`lg`), vertically centered or top-aligned | See modal component tokens |

## Layout containers (legacy — for reference)

- App shell: left **nav rail/sidebar** (fixed `--space-16` = 64px collapsed /
  240px open), top **header** (56px), content area with `--space-6` gutters.
- Content max-width: 80rem (1280px) via `page-container`; on mobile the content
  is edge-to-edge minus `--space-4`.
- Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536` (tailwind
  defaults).

## Grid (section-level)

- Page sections: 12-column grid, gutters `--space-6`.
- Card grids: `card-grid` (auto-fit minmax 280px, 1fr) or
  `card-grid-compact` (minmax 220px, 1fr).
- Never break the 4px base inside a component; breaking it in layout is allowed
  only via container queries on ≥ `lg`.