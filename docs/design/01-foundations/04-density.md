# Foundations — Density

Density is a **first-class UX pattern**, not an afterthought. It is what makes
Rumoo feel like a tool instead of a website.

## Model: dense by default, comfortable on demand

Two density modes, defaults:

| Attribute | Comfortable | Compact (default for lists/tables) |
|---|---|---|
| List/table row height | 40px | 32px |
| Button padding-y | 10px | 6px |
| Input padding-y | 10px | 6px |
| Card padding | `--space-5` / 20px | `--space-3` / 12px |
| Section gap | `--space-6` / 24px | `--space-4` / 16px |
| Body type | 14px | 13px (Body S) |

Implement as a single `--density` CSS variable that all component tokens read
(e.g. `--control-y = calc(10px * var(--density-ratio))`), and expose a **density
toggle** in the app shell header. Persist the choice per user.

## Rules

1. **Default to compact** for row-heavy surfaces (task lists, tables, boards);
   switch to comfortable when the user asks, never silently.
2. Never shrink below **minimum touch targets**: interactive inline controls.
   min **24×24px** (WCAG 2.5.8), recommended **32×32px** in compact rows. Full
   rows (32–40px) naturally exceed the minimum — keep the row itself clickable.
3. Type inside compact rows never goes below 13px; metadata uses Caption.
4. Density affects *padding and row height only* — never hit areas of primary
   actions, never spacing of modals, never a11y contrast tokens.
5. `prefers-reduced-motion` does not influence density, but the toggle must be
   keyboard- and switch-accessible (role="switch" + label).

## When NOT to compress

- Modals and their body (keep `--space-5` padding).
- Empty states and first-run screens (keep breathing room).
- Error/success feedback that must be noticed (never cram feedback).
- Navigation items that serve as large click targets (60px sidebar items).

## Multiplica of productivity

Dense lists + full-row click + inline edit + keyboard nav (`↑/↓`, `Enter`,
`Tab`-less flows) = the Asana-like feel we adopt. Detail in
`04-patterns/data-productivity.md`.