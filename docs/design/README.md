# Rumoo Design System

The canonical visual and interaction language for Rumoo — a goal and activity
management platform built for **density, clarity and progress**.

> Scope: **documentation only**. Tokens are specified semantically so they can
> be mapped 1:1 to Tailwind v4 `@theme` later. No implementation code ships in
> this document set.

## How to use this documentation

1. **Foundations** (`01-foundations/`) — the raw building blocks: color,
   typography, spacing/layout, density, icons & motion.
2. **Tokens** (`02-tokens/`) — the negotiation layer between foundations and
   code: naming convention + the full semantic token reference (light & dark).
3. **Components** (`03-components/`) — reusable UI building blocks, split
   **Core** (ship-first) and **Extended** (follow) with explicit anatomy, states
   and accessibility rules.
4. **Patterns** (`04-patterns/`) — multi-component behaviors: navigation,
   data management, productivity flows and feedback.
5. **Accessibility** (`05-accessibility.md`) — the WCAG 2.2 AA contract and the
   measurement toolchain.
6. **References** (`06-references.md`) — the curated external references that
   shaped this system (Asana 2026 + complementary sources).

## North star

**Asana-style canvas.** The product UI is a calm, neutral, light-first (and
dark-ready) canvas. One strong brand accent — **Emerald** — carries identity and
primary actions. Density signals "this is a productivity tool": dense lists,
tables and dashboards by default, with a documented comfortable mode on demand.

Three commitments:

1. **Dense by default, comfortable on demand.**
2. **Progress is visible** — status, progress and goals are never conveyed by
   color alone.
3. **AA is non-negotiable** — every color pairing ships pre-verified against
   WCAG 2.2, documented in the A11y section.

## Reading order for engineers

`02-tokens/token-reference.md` → `01-foundations/01-color.md` →
`02-tokens/token-naming.md` → `03-components/` (Core first) →
`04-patterns/data-productivity.md`.