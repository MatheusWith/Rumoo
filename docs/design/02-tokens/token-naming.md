# Tokens — Naming Convention

Two-layer model, 1:1 with Tailwind v4 `@theme` when implemented.

## Primitive layer (hue scales)

`--color-<hue>-<shade>` — generated from existing scales (emerald, slate,
green, amber, red, sky, indigo) using their canonical shade numbers.

## Semantic layer (roles)

`--color-<role>` — the ONLY tokens components consume.

Naming rules:

1. **Role first, tone second**: `--color-primary`, `--color-surface-raised`,
   `--color-text-secondary`. Never `--color-green-button`.
2. **One role = one job**: `--color-surface` (static canvas) vs
   `--color-field` (input) vs `--color-surface-raised` (popover) are distinct.
3. **State suffixes**: `-hover`, `-active`, `-disabled`, `-subtle`
   (`--color-primary-hover`, `--color-danger-subtle`).
4. **Typography tokens**: `--font-family-sans`, `--font-weight-regular`,
   `--text-body`, sized via `--text-<step>-size` / `--text-<step>-line-height`.
5. **Spacing**: `--space-*` (px values). **Radius**: `--radius-*`.
   **Easing/duration**: `--ease-*`, `--duration-*`, `--motion-reduced`.

## Mapping table (semantic → primitive — light)

| Semantic | Primitive light |
|---|---|
| `--color-primary` | `emerald-700` |
| `--color-primary-hover` | `emerald-800` |
| `--color-primary-accent` | `emerald-600` |
| `--color-primary-subtle` | `emerald-50` |
| `--color-secondary` | `indigo-700` |
| `--color-background` | `slate-50` |
| `--color-surface` | `white` |
| `--color-field` | `white` |
| `--color-border` | `slate-200` |
| `--color-text-primary` | `slate-900` |
| `--color-text-secondary` | `slate-600` |
| `--color-text-tertiary` | `slate-500` |
| `--color-success` | `green-700` |
| `--color-warning` | `amber-700` |
| `--color-danger` | `red-700` |
| `--color-info` | `sky-700` |

Full values live in the companion `token-reference.md`.