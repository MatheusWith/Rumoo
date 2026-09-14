# Components — Core: Surfaces & Feedback

## Card

Surface: `--color-surface`, border `--color-border`, `--radius-lg`, padding
`--space-5` (comfortable) / `--space-3` (compact). Optional header row:
title (Heading S) + actions (icon buttons). Interactive cards: hover border
darkens + optional 2px `--shadow-sm`; clickable region = whole card; focus ring
on focusable wrapper.

## List (task/rows)

- Row height from Density (`--row-height-compact:32px`, comfortable 40px).
- Row anatomy: checkbox/status · title (Body M / S, ellipsis) · metadata
  (Caption `--color-text-secondary`) · trailing in-row actions (reveal on
  hover/focus).
- States: hover = `--color-primary-subtle` wash (fine-pointer only) + reveal
  actions; selected = `--color-primary-subtle` + left 2px `--color-primary`;
  active/press = 2px inset.
- Status inside rows uses icon + label pill (`Badge`), never color alone.
- Keyboard: ↑/↓ move focus, Enter open, Space toggle checkbox, Tab to actions.

## Table

- Header: Overline uppercase `--color-text-tertiary`, sticky on scroll.
- Cells: Body S/Compact both densities; numeric `tabular-nums`.
- Row hover/selected identical semantics to List. Column sort controls:
  chevron rotation 120ms. Right-align numbers & dates.
- Density toggle + sticky first column + horizontal scroll on < `lg`.

## Modal

- Overlay (`--color-overlay`), surface `--color-surface-raised`, `--radius-lg`,
  `--shadow-lg`, max-width 480 (default) / 640 (large) / 360 (confirm).
- Anatomy: header (Heading M + close X), body (`--space-5`, body scroll max 70vh),
  footer (right-aligned: Cancel ghost + primary Confirm).
- Behavior: Esc close, click-outside close (opt-out on destructive), **focus
  trap**, restore focus on close; motion 100ms fade + 200ms translateY.
- Destructive configs show Danger button + explanation; never confirm-destructive
  without "This cannot be undone" copy.
- **No modal-on-modal.** Stacked dialogs are prohibited — use confirm inside.

## Toast

- Position: bottom-center/right (`> lg`), top-center full-width on mobile.
- Stack max 3; duration 4s success/info, 8s warning/error; manual close always.
- Anatomy: icon (semantic) + message (Body S) + optional action link `primary-accent`.
- Roles: `role="status"` for success/info, `role="alert"` for error.
- Motion: slide-up 200ms; reduced-motion: fade only.

## Banner (page/panel-level)

For persistent conditions (plan limits, offline, migration). Icon + text + action,
Contrast surface (`--color-*-subtle` + border `--color-*`), radius `--radius-md`,
inline top of content. Single occurrence per view.

## Empty State

- Center: illustration/icon 32px + title (Heading M) + body (Body M secondary) +
  max one primary CTA. Breathing padding `--space-16`.
- Prefer content-aware empty ("No activities yet") over generic ("Nothing here").
- Skeleton loading ≠ empty state: skeletons show shape-of-content that is
  expected to arrive.

## Skeleton

`--color-border` blocks, shimmer animation 1.2s ease-in-out 3 iterations
(respects reduced-motion → static). Always same container geometry as real
content.

## Progress (bar & ring)

- **Bar**: track `--color-border` 6px, fill `--color-primary` for goals;
  status colors only when progress means status (e.g. overdue → danger) —
  always with % label.
- **Ring**: 32px/56px for cards, stroke 4px, fill `--color-primary`.
- Transition fill 320ms ease-out. ARIA: `role="progressbar"` +
  `aria-valuenow/max`. Never rely on color for state (icon/label available).

## Badge / Pill (roles, status)

- Compact: `--radius-full`, padding 2px 8px, Caption 12px.
- Variants: neutral (surface-raised + border), primary-subtle, success,
  warning, danger, info — each with optional leading dot/icon.
- Semantics: `Group Role` Member/Leader pills use primary-subtle and a
  distinct icon (`MEMBER`/`LEADER` glyph) + label (never color alone).

## Tooltip

- Text-only, max 280px, Caption on `--color-surface-raised` (elevated),
  `--role=tooltip` anchored to the described element, appears 300ms
  (fast on focus), dismissible via Esc. Rich content → use Popover (Extended).