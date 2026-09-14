# Foundations — Icons & Motion

## Icons

- **Icon set**: a single outline icon family (grease-consistent, 1.5px stroke on
  24px grid) — e.g. Lucide/Phosphor **outline** style. One set, no mixing
  filled/outlined on the same surface.
- **Sizes**: 16px (inline/dense), 20px (menus/inputs), 24px (buttons/empty
  states), 32px (page status).
- **Colors**: icons inherit `--color-icon`; state icons use semantic
  `--color-success/warning/error/info` — always with an adjacent label or tooltip
  (never hue-only).
- **Accessibility**: decorative icons `aria-hidden`; meaningful icons need an
  `aria-label` or surrounding text.

## Motion tokens

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Hover, focus, micro state changes |
| `--duration-base` | 200ms | Standard transitions, modals |
| `--duration-slow` | 320ms | Large surfaces, view transitions |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | Enter / reveal |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Exit / hide |

## Microinteractions (productivity-focused)

| Interaction | Behavior |
|---|---|
| Hover | Only for `(pointer: fine)` devices; 120ms ease-out, surface/icon color change + optional 1px inset border. Never rely on hover for critical info. |
| Press/active | 120ms; background darkens one step (e.g. primary-600 → primary-700 tone). |
| Focus | 2px outline in `--color-primary-accent` offset 2px, visible on ALL interactive elements. Never `outline: none` without a replacement. |
| List row | Hover = subtle surface wash + reveal inline actions (→ chevron); row press = 2px inset. |
| Modal | Enter: fade (100ms) + translateY(-8px→0) 200ms; exit: fade 120ms. |
| Command palette | 150ms scale(0.98→1) + fade; blur/dim overlay. |
| Progress fill | Width/color transition 320ms ease-out. |
| Async submit | Button → loading spinner (icon swap + spin 600ms linear), button disabled, optimistic content not shown until success. |

## Reducing motion

All motion respects `prefers-reduced-motion: reduce` → replace transitions with
instant 0ms swaps (no animation), except the essential loading spinner which is
permitted to spin (essential). Provide `--motion-reduced` media-driven token.