# Patterns

Multi-component behaviors. Each pattern is a workflow contract, not a new
component.

## Navigation behavior

- **One shell, three surfaces**: sidebar (places) · header (context) · command
  palette (reach *anything*). Every screen is reachable by keyboard in ≤3 keystrokes.
- **Persistent state**: active nav, view, density and filters persist per user.
- **Unsaved work**: navigating away from an edited form shows a Keep/Discard
  prompt (Modal, destructive-aware); never silent data loss.
- **Page-level loading**: skeleton for new content; skeleton retains previous
  view while refreshing (stale-while-revalidate feel) when safe.
- **Back behavior**: Backspace/back respects the in-app navigation history for
  list→detail, not the browser tab history stack, unless in a modal-less flow.

## Data & productivity management

1. **Dense-first**: task lists, tables and boards render compact (`--row-height-compact`)
   by default with the density toggle in the header.
2. **Full-row interactivity**: clicking a row opens detail; inline edit is one
   Enter away; primary content reachable with zero clicks after filter.
3. **Filters + URL**: all filters reflected in the URL query string; shareable,
   refresh-safe, and Command-K searchable.
4. **Keyboard over pointing**: arrows/Enter/Esc cover list, menu, combobox and
   context menu; drag & drop always has an Alt+arrow alternative.
5. **Optimistic updates**: toggles, status changes and inline edits apply
   immediately with Toast rollback on failure.
6. **Quick add first, structure second**: Quick Add commits on the first field;
   assignee/group/due grow after. Mirrors Asana's Quick Add philosophy.

## Feedback & async states

| State | Pattern |
|---|---|
| In-flight (load) | Skeleton geometry; never a blank flash |
| In-flight (action) | Button → spinner; disabled; no double-submit |
| Success | Toast (4s) + inline success on forms (check + label) |
| Failure | Toast `role="alert"` (8s) + field-level danger on forms; never silent |
| Empty | Content-aware Empty State with one CTA |
| Partial/fetch-stale | Banner (persistent) + re-validate link |
| Offline | Banner persistent + optimistic queue with sync Toast |

## Microinteractions contract

- 120ms for state flips (hover/active/focus), 200ms for reveal (cards/modals),
  320ms for value transitions (progress). `prefers-reduced-motion` → instant.
- One dominant motion per interaction; never animate layout-affecting props
  (width/height) without reduce-motion care.