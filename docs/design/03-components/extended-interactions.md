# Components — Extended: Interactions & Data

Second wave. Reuse Core tokens/anatomy; every rule from Core surfaces carries.

## Filters

- Trigger: filter button with count badge. Panel: popover with field rows
  (name, status, assignee, Group, date range) + "Clear all".
- Active filter = Badge in filter bar (removable ×); state reflects in URL query
  params (shareable).
- Behavior: apply on change (optimistic, Debounced 250ms), result count updated;
  `role="listbox/option"`-style optional.

## Views Switcher

- Segmented control: List · Board · Calendar (future: Timeline/Gantt).
- Persist last view per list; keyboard: arrows within segmented (roving).
- Board cards → Core Card compact with status color dot + label.

## Inbox / Notifications

- Center top-right bell + unread badge; panel groups "Today · Earlier".
- Rows: avatar/icon + message (Body S) + time (Caption). Read state: unread dot
  only (never color-alone: dot + bold text).
- Actions: row fulfill action (mark read, open) + "Mark all read".

## Date & Range Picker

- Input mask `DD/MM/YYYY` (or locale) + calendar popover (Core surfaces).
- States: valid, invalid (danger + message), disabled dates; keyboard: arrows,
  PageUp/Down months, Enter select.
- Quick ranges: Today, This week, Custom.

## Avatar & Presence

- 24/32px initials, ring on online (green dot + tooltip, never dot-only).
- Initials = first+last letters, color derived from a safe 6-color slate/emerald
  set at 4.5:1 on its background.

## Comments / Activity Feed

- Comment: avatar + name (Medium) + relative time + body (Body S) + inline
  actions (reply/edit/delete). New row: avatar + Textarea inline + submit.
- Activity: icon + text + time, no hover states needed (read-only), divider
  groups by day.

## Drag & Drop

- For reordering rows/kanban: grab handle (6-dot) always visible on touch,
  hover-reveal on fine pointers.
- Drop target highlight `--color-primary-subtle` + 2px inset; drop = 150ms
  microtransition; announce result via live region ("Moved X after Y").
- Keyboard alternative: Alt+↑/↓ reorder (never dnd-only).

## Dashboard Widgets

- Card grid: `minmax(280px,1fr)`; each widget: title (Heading S) + metric
  (Heading L tabular) + trend (icon + Caption; trend never color alone) +
  minimal action (→). Skeleton on load.
- Progress ring for goals per widget; empty widget = Empty State slot.

## Keyboard shortcuts — full reference

| Shortcut | Action |
|---|---|
| `⌘/Ctrl+K` | Command palette |
| `Q` (in list) | Quick add |
| `↑ / ↓ / Enter / Esc` | List, menu, combobox navigation |
| `Shift+F10 / Menu` | Context menu |
| `Alt+↑ / Alt+↓` | Move row up/down (dnd alternative) |
| `⌘/Ctrl+/` | Show shortcut sheet |
| `N` | New goal (future) |

Shortcuts are visible in tooltips and the ⌘/ sheet; never the only path.