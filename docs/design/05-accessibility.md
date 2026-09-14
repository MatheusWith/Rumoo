# Accessibility

WCAG 2.2 **AA is the contract** for every shipped pairing, in **light and dark**.
AAA targets are documented as optional ("nice-to-have") for specific cases.

## Mandatory (AA)

- Text: **4.5:1** (normal), **3:1** (≥24px or ≥19px bold) — WCAG 1.4.3.
- Non-text UI (icons, focus rings, input borders, progress): **3:1** — 1.4.11.
- State not conveyed by color alone — 1.4.1. Pair with icon/label/underline.
- Focus visible on all interactive elements — 2.4.7.
- Minimum target size 24×24 — 2.5.8 (we recommend ≥32 in dense rows).
- Keyboard: full operability + no keyboard trap — 2.1.1 / 2.1.2.
- Motion can be fully disabled — 2.3.3 (`prefers-reduced-motion`).

## Nice-to-have (AAA / spot)

- Body text at **7:1** in marketing/first-run screens only.
- Caption/overlabel at 4.5:1 even for tertiary text inside Elevated surfaces.

## Contrast matrix (pre-verified pairs)

Ratios below computed against their background; **always re-verify** with the
tools when a token changes.

| Pair | Ratio | Verdict |
|---|---|---|
| `text-primary` on `surface` (L) | ≈ 19:1 | AA + AAA |
| `text-secondary` on `surface` (L) | ≈ 7:1 | AA + AAA |
| `text-primary` on `primary` (solid, white ✓) | ≈ 5.5:1 | AA |
| `text-primary-accent` (link) on `surface` | ≈ 4.7:1 | AA |
| `on-primary` (white) on `primary` | ≈ 5.5:1 | AA for all text |
| `danger` on `danger-subtle` | ≥ 4.5:1 | AA |
| `warning` on `warning-subtle` | ≥ 4.5:1 | AA |
| `success` on `success-subtle` | ≥ 4.5:1 | AA |
| non-text: `primary-accent` icon on `background` | ≥ 3:1 | AA (1.4.11) |
| non-text: `border` (input) on `surface` | **< 3:1** → inputs use 2px focus ring instead; resting border is fine for non-required fields because focus ring guarantees 3:1 | guidance |
| dark theme equivalents | mirror the same ratios with dark tokens | AA |

Legend: every *state* and *interactive* token is required to hit the column it
is listed under; decorative-only tokens have no ratio obligation.

## Measurement toolchain

- **[axe-core](https://www.deque.com/axe/)** — the single automated check:
  focus, aria and contrast heuristics, run in CI (via `@axe-core/cli`,
  `jest-axe`, Playwright or the Storybook a11y addon) and in DevTools for local
  debugging. Contrast math follows WCAG 2.2 (1.4.3 / 1.4.11).

### CI/commit gate

- All new color tokens land with their expected ratio in this matrix.
- Component PRs run axe-core (0 critical/serious).
- Contrast regressions "fix forward" — never lower a ratio to ship.