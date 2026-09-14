# Components

Split in two tiers. **Core** ships in the first UI wave; **Extended** follows.

## Core

| Group | File | Components |
|---|---|---|
| Actions & forms | `core-actions-forms.md` | Button, Icon Button, Text Input, Textarea, Select, Checkbox, Radio, Toggle, Search, Inline Edit |
| Surfaces & feedback | `core-surfaces-feedback.md` | Card, List, Table, Modal, Toast, Banner, Empty State, Skeleton, Progress (bar/ring), Badge/Pill, Tooltip |
| Navigation | `core-navigation.md` | App shell, Sidebar, Top header, Tabs, Breadcrumbs, Command Palette, Quick Add, Menu/Dropdown, Context Menu, Pagination |

## Extended

| Group | File | Components |
|---|---|---|
| Interactions & data | `extended-interactions.md` | Filters, Views switcher, Inbox/Notifications, Date/Range picker, Avatar & presence, Comments/Activity feed, Drag & drop, Dashboard widgets, Keyboard shortcuts reference |

## Shared rules (all components)

1. **Semantic tokens only** — never raw color/hue in a component.
2. **Full keyboard operability** (Tab order, ↑/↓ in lists, Enter/Space activation,
   Esc for dismiss).
3. **Visible focus ring** everywhere (2px `--color-primary-accent`, offset 2px).
4. **Never disable without reason** — a disabled control explains why.
5. **State parity**: every component documents default / hover / active / focus /
   disabled (/ loading where relevant).
6. Density tokens drive geometry (`--space-*`, `--row-height-*`), never magic
   numbers.