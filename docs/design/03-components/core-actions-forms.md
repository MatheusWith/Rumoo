# Components — Core: Actions & Forms

## Button

Anatomy: container + optional trailing icon + label.

| Variant | Fill | Border | Text |
|---|---|---|---|
| Primary | `--color-primary` | — | `--color-on-primary` |
| Secondary (outline) | transparent | `--color-border` | `--color-text-primary` |
| Tertiary (ghost) | transparent | transparent | `--color-primary-accent` (text) |
| Danger | `--color-danger-solid` | — | white → `--color-on-primary` |

States: default · hover (one tone darker / border darkens) · active (2px inset) ·
focus (2px ring) · disabled (text `--color-text-disabled`, fill `--color-border`)
· **loading** (icon swaps to spinner, width stable — no jump).

Sizes: `md` (40px h, `--space-4` px) · `sm` (32px) · `lg` (48px). Full-width on
mobile under 480px. Minimum touch target 32×32, recommended 40×40; row height
rules from Density apply when inline.

Micro: primary hover 120ms; press 120ms inset; loading spinner 600ms linear.

## Icon Button

Min 32×32 (24px icon, `--radius-md`). Variants: subtle (default transparent,
hover `--color-primary-subtle`), outlined, solid (rare). Same states + `aria-label`
mandatory.

## Text Input & Textarea

- Height: 40px (md) / 32px (sm, dense). Radius `--radius-sm`. Border
  `--color-border`; background `--color-field`; text `--color-text-primary`.
- Focus: 2px ring `--color-primary-accent` + border same = composite, never
  `outline: none` bare.
- Invalid: border + inset icon `--color-danger` and an `aria-describedby` message
  (never border-red alone). Valid: no special border (green only for explicit
  "validated" moments, with a check icon).
- Placeholder: `--color-text-tertiary`. Disabled: `--color-text-disabled`,
  bg `--color-background`.
- Labels: Body M 500; hint Caption `--color-text-secondary`; error Caption
  `--color-danger`.

## Select & Combo

Native select, 40/32px, chevron icon `--color-icon`. Combo (filterable) —
Core wait-list: use native select until combs land in Extended. Always label
(`aria-label` if icon-only).

## Checkbox / Radio

16×16, `--radius-sm` for checkbox / full pill for radio. Checked fill
`--color-primary`, border same; unselected border `--color-border`. Focus ring
outer 2px. Label Caption/Body S with margin-left 8px. Minimum hit area 24×24
(the control), recommended 32 for touch.

## Toggle (Switch)

Track 36×20, knob 16, radius full. On: `--color-primary`; off: `--color-border`.
Focus offset 2px. `role="switch"` + label. Loading not allowed — toggles are
immediate or optimistic with rollback UI in Toast on failure.

## Search (field)

Input + leading magnifier `--color-text-tertiary`; Esc clears; disabled shows
no results. Variants: input (page) and compact (30px h) for command palette /
list filters. Clear "×" appears on input.

## Inline Edit

Row shows text; focus/enter converts to an input of the same font & width;
Esc reverts; Enter commits; success = subtle surface flash (emerald-50) 200ms.
Failure reverts + Toast error with the reason. This is the Asana-like "edit in
place" productivity microinteraction.