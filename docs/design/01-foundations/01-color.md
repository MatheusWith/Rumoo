# Foundations — Color

## Model

Color is layered the **Carbon way**: tokens are named by *role* (background,
layer, field, border, text, interactive, success, warning, error), not by color
name. Implementations map roles to concrete hues; components never reference a
hue directly.

Two token layers:

- **Primitive** — raw scales (e.g. `emerald-500`, `slate-200`, `amber-100`).
- **Semantic** — role tokens (e.g. `--color-primary`, `--color-surface`,
  `--color-success`). Components only use semantic tokens.

## Brand palette

| Role | Light token | Hex (light surface) | Dark token | Hex (dark surface) |
|---|---|---|---|---|
| Primary (solid) | `--color-primary` | `#047857` (emerald-700) | `--color-primary` | `#34d399` (emerald-400) |
| Primary (hover) | `--color-primary-hover` | `#065f46` (emerald-800) | `--color-primary-hover` | `#10b981` (emerald-500) |
| Primary (resting accent / icons) | `--color-primary-accent` | `#059669` (emerald-600) | `--color-primary-accent` | `#10b981` (emerald-500) |
| Primary (soft surface) | `--color-primary-subtle` | `#ecfdf5` (emerald-50) | `--color-primary-subtle` | `#052e1b` (emerald-950) |

**Rule:** `--color-primary` (solid button / high-contrast accent) is always the
*darker* emerald on light and the *lighter* emerald on dark, so `primary vs
background` keeps ≥ 4.5:1 in every theme (verified in the a11y section).

## Secondary (support) palette

Support accent for elements that must sit *opposite* the brand (nav selection
contrast, links in dense context, chart series differentiation). Use sparingly.

| Role | Light | Dark |
|---|---|---|
| `--color-secondary` | `#4338ca` (indigo-700) | `#a5b4fc` (indigo-300) |
| `--color-secondary-subtle` | `#eef2ff` (indigo-50) | `#1e1b4b` (indigo-950) |

Secondary never replaces primary as the main action color.

## Neutrals (cool slate)

| Role | Light | Dark |
|---|---|---|
| `--color-background` | `#f8fafc` (slate-50) | `#0f172a` (slate-900) |
| `--color-surface` | `#ffffff` | `#1e293b` (slate-800) |
| `--color-surface-raised` | `#ffffff` | `#334155` (slate-700) |
| `--color-field` | `#ffffff` | `#0f172a` (slate-900) |
| `--color-border` | `#e2e8f0` (slate-200) | `#475569` (slate-600) |
| `--color-divider` | `#e2e8f0` (slate-200) | `#334155` (slate-700) |
| `--color-text-primary` | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) |
| `--color-text-secondary` | `#475569` (slate-600) | `#cbd5e1` (slate-300) |
| `--color-text-tertiary` | `#64748b` (slate-500) | `#94a3b8` (slate-400) |
| `--color-icon` | `#334155` (slate-700) | `#cbd5e1` (slate-300) |
| `--color-disabled-text` | `#94a3b8` (slate-400) | `#64748b` (slate-500) |
| `--color-overlay` | `rgba(15,23,42,0.45)` | `rgba(2,6,23,0.6)` |

## Semantic states

| State | Text/icon (on light) | Soft surface | Solid (white text) | Dark text/icon | Dark solid |
|---|---|---|---|---|---|
| Success | `#15803d` (green-700) | `#f0fdf4` (green-50) | `#16a34a` (green-600) | `#4ade80` (green-400) | `#052e16` (green-950) |
| Warning | `#b45309` (amber-700) | `#fffbeb` (amber-50) | `#d97706` (amber-600) | `#fbbf24` (amber-400) | `#451a03` (amber-950) |
| Error | `#b91c1c` (red-700) | `#fef2f2` (red-50) | `#dc2626` (red-600) | `#f87171` (red-400) | `#450a0a` (red-950) |
| Info | `#0369a1` (sky-700) | `#f0f9ff` (sky-50) | `#0284c7` (sky-600) | `#38bdf8` (sky-400) | `#082f49` (sky-950) |

### Brand vs Success (the Emerald/Green collision)

The brand accent (Emerald `#059669/#047857`) and the Success state
(Green `#16a34a/#15803d`) are **close but semantically disjoint**:

- Emerald is **identity + action**: buttons, links, nav focus, selected states.
- Green is **status**: completeness, "done", positive progress.

Enforcement rules:

1. Never use `--color-primary*` to mean "success" and never use
   `--color-success*` for action accents.
2. Status is **never color alone** — a success/error/warning always pairs an
   icon, a label, or both (WCAG 2.1.1 / 1.4.1).
3. In tooltips/badges where hue is the only differentiator, add a glyph.

## Usage percentages

- Neutrals: ~80% of a screen.
- Primary accent: ~10% (one primary action per view, nav focus).
- Secondary + states: ~10% combined. Vibrancy comes from restraint.

## Dark theme

Dark is a **token variant**, not a separate design: same roles, same contrast
targets, inverted luminance curve on the slate scale. Components are
theme-agnostic; `--color-*` swaps values.