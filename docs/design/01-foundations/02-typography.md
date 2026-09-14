# Foundations — Typography

## Family

- **UI & text**: **Inter** (weights 400 Regular, 500 Medium, 600 Semibold).
  Self-hosted, with the system stack as fallback:
  `Inter, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- No display/custom family in v1 (keeps the neutral Asana-style canvas and
  avoids load-perf cost in dense UIs).

## Type scale (modular 1.250 — Major Third)

Base **14px**. Only three weights are legal in UI copy.

| Step | Size | Line-height | Weight | Letter-spacing | Use |
|---|---|---|---|---|---|
| Display | 31px | 1.2 | 600 | -0.02em | Product empty states, onboarding hero |
| Heading L | 25px | 1.25 | 600 | -0.01em | Page titles, dashboard headers |
| Heading M | 20px | 1.3 | 600 | 0 | Section titles, modal titles |
| Heading S | 16px | 1.4 | 600 | 0 | Card titles, group headers |
| Body L | 16px | 1.5 | 400 | 0 | Reading content, modal body |
| **Body M** | **14px** | **1.5** | **400** | **0** | **Default UI text (forms, tables, menus)** |
| Body S | 13px | 1.5 | 400 | 0 | Dense/compact mode, table cells |
| Caption | 12px | 1.4 | 500 | +0.02em | Metadata, timestamps, field hints |
| Overline | 11px | 1.4 | 600 | +0.06em | Uppercase section labels, nav groups |

## Rules

1. **One size step max** between related elements (`Body M → Caption` is ok;
   `Body M → Display` on the same card is not).
2. Items with equal hierarchy share the same step, weight and color — never two
   competing sizes in one row unless in a data table.
3. **Semibold (600)** is the highest weight in product UI; Brand/marketing copy
   may use 700 but never below 20px and never for body text.
4. Do not manually letter-space body text. The scale owns it.
5. Numerals for scores/amounts should use `font-variant-numeric: tabular-nums`.

## Readability minimums

- Body text min 14px in **comfortable** density, 13px in **compact** density.
- Caption never below 12px.
- Line-height never below 1.4 for any step (multi-line safety).

## Theming

Dark theme keeps the exact same scale and weights; contrast is carried by the
`--color-text-*` tokens, never by size/weight changes.