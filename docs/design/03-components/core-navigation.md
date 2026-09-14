# Components — Core: Navigation

## App shell

- **Left sidebar**: 240px open / 64px collapsed (icon+tooltip). Groups with
  Overline labels. Active item: `--color-primary-subtle` fill + left 2px
  `--color-primary` + `--color-text-primary`. Collapse toggle persisted per user.
- **Top header**: 56px; breadcrumb (left) · global search trigger (center,
  shows `⌘K` hint) · density toggle + user menu (right).
- Focus: skip-to-content link as the very first focusable element.

## Tabs

- Underline style: tab label Body M 500, active underline 2px `--color-primary` +
  text primary; inactive text-secondary, hover text-primary.
- Keyboard: arrow-key navigation + `role="tablist/tab/tabpanel"`, roving
  tabindex, no auto-activate on focus (activate on Enter/Space).

## Breadcrumbs

Caption `--color-text-secondary`, separators "/", current page
`--color-text-primary` (not a link). No breadcrumb on the app home.

## Command Palette (⌘K / Ctrl+K)

The productivity keystroke of the app.

- Trigger: global `⌘K` (mac) / `Ctrl+K`; header search; first-run hint toast.
- Anatomy: input (Body L) + grouped results (Actions · Navigation · Collaborators
  · Groups) with icons, Caption meta, keyboard hints.
- Behavior: focus trap, ↑/↓ select, Enter run, Esc close, "/" filter by group
  prefix, results filtered live (200ms debounce), recent items first.
- Motion: 150ms scale+fade; `role="dialog" aria-label="Command palette"`.

## Quick Add

- Float trigger (header "+") or `Q` when list focused.
- Opens Modal (compact) with inline-add: title auto-saves on Enter, then a
  structured row (group/assignee/due) can be extended. Asana-like: one field
  first, everything becomes optional.
- Success: Toast "Created" with undo (2nd-level) link.

## Menu / Dropdown

- Trigger: button/icon with `aria-haspopup="menu"`. Panel
  `--color-surface-raised`, border, `--shadow-md`, `--radius-md`, max 320px.
- Items: icon + label, 32px rows; divider `--color-divider`; danger items red.
  ↑/↓ + Enter + Esc + focus-trap-lite (menus don't require full trap).
- Dismiss on click-outside, Esc, selection.

## Context Menu

Right-click anywhere => menu in place (`<<span role="menu">`); also reachable
via Shift+F10 / Menu key. Items disable contextually. Mobile: replaced by a
sheet (Extended).

## Pagination

Compact: `‹ Previous` `Page X of Y` `Next ›` (text buttons); dense tables may
use numeric page chips. Keyboard previous/next arrows while focused.
Prefer infinite-scroll loading for tile views; pagination for tables.

## Global keyboard shortcuts (summary)

`⌘K` palette · `Q` quick add (in lists) · `↑/↓/Enter/Esc` list & menu nav ·
`Shift+F10` context · `G` then initial letter = jump-to (go-links, future). Full
reference in `extended-interactions.md`.