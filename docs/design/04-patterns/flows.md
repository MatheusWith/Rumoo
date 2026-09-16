# Patterns — Flow Patterns & Click Budgets

Every pattern below is grounded in a flow from `fluxo.md` (the canonical product
spec). Each has a grid composition, a component recipe, and an explicit **click
budget** — the maximum number of clicks/taps to complete the action.

> Principle: **dense by default, comfortable on demand**. Interactions are
> designed for a keyboard+mouse productivity environment; touch targets
> still meet WCAG ≥ 32 px recommended.

---

## 1. Quick Create (Goal / Activity)

**Flows:** 2.1 "Criação da Meta", 3.2 "Distribuição de Atividades"
**Grid:** `page-container` → modal or slide-out panel (`ui-modal size="lg"`)
**Click budget:** ≤ 4 clicks to create

| Step | Click | Component |
|---|---|---|
| 1 | Trigger | Header action button `ui-button` ("New goal") or `⌘K` |
| 2 | Fill | Multi-section form (Details · Visibility · Scoring) in a scrollable modal body |
| 3 | Submit | `ui-button` primary ("Create") |
| 4 | Confirm | Optional: confirm dialog for destructive/existing conflicts; toast "Created" |

**Density:** form fields use the compact input height in list contexts; modal uses comfortable padding (`--space-5`).

---

## 2. Dense Activity Table

**Flow:** 3.2 "Distribuição de Atividades", 4.1 "Visibilidade"
**Grid:** full-width `page-container` → 12-column table spanning all cols
**Click budget:** status change ≤ 2 clicks; edit row ≤ 1 click

Components: `ui-table` (bordered + striped variants), `ui-icon-button` (inline actions), `ui-badge` (status pills), `ui-checkbox` (row selection), `ui-pagination`.

Row anatomy: checkbox · title (ellipsis) · assignee avatar + name · status badge · progress % · trailing action icons (reveal on hover).

---

## 3. Master-Detail Drill-Down

**Flow:** Goal list → Goal detail → Activities
**Grid:** `page-container` → sidebar metadata (4 cols) + main content (8 cols) on ≥ `lg`; stacked on mobile.
**Click budget:** 1 click to open detail (row click or "View" icon).

Pattern: list row is a link (keyboard accessible, full-row clickable). Detail
view loads as a page, not a modal. Breadcrumbs show Goal → Activity path.

---

## 4. Inline Status Transitions

**Flow:** 3.3 "Execução e Conclusão"
**Click budget:** ≤ 2 clicks to change status

Statuses: `PENDENTE` · `EM_ANDAMENTO` · `CONCLUIDA` · `BLOQUEADA` · `NAO_ATINGIDA`.

UI: status badge in the table row + a dropdown/icon action (`ui-icon-button` menu) showing allowed transitions. A single click on the action reveals the menu; a second click picks the new status.

---

## 5. Visibility Selector

**Flows:** 2.1 (Goal creation), 3.2 (Activity distribution)
**Click budget:** part of the create form (≤ 4 total clicks including the form)

A `ui-radio` group with three options: `EMPRESA_INTEIRA` / `TIME_ESPECIFICO` / `PESSOAL`.
When `TIME_ESPECIFICO` is chosen, a secondary picker (group/team dropdown) appears. When
`PESSOAL` is chosen, a person-picker appears. Always scoped inside the create/edit modal.

---

## 6. Redemption Ticket

**Flow:** 2.3 "Encerramento da Meta"
**Click budget (collaborator):** ≤ 3 clicks to send. **Manager:** ≤ 2 clicks to review.

- **Send:** From a closed Goal detail → "Request review" button → modal with justification
  textarea + "Send" primary button.
- **Review:** From ticket list/detail → Accept / Reject action buttons in the header or
  row-level action icons.

---

## 7. Shared Productivity Patterns

| Pattern | Description | Where used |
|---|---|---|
| **Dense default** | Compact rows, tight gaps, toggle to comfortable | All tables and lists |
| **Skeleton loading** | Content-sized placeholders on page load | All data views |
| **Empty states** | Icon + title + single CTA when no data exists | Every list/table |
| **⌘K Command Palette** | Reach anything with keyboard-first navigation | Global, persistent |
| **Toast feedback** | Optimistic UI with undo on success; error with retry | All async actions |
| **Keep/Discard prompt** | Modal on navigation away from unsaved form | Goal/Activity forms |

---

## Grid convention by screen kind (summary)

| Kind | Grid class | Example |
|---|---|---|
| Dashboard | `card-grid` inside `page-container` | Metrics, charts |
| List | Full-width table in `page-container` | Goal list, Activity table |
| Form | `page-container` + max-width 640px centered | Goal/Activity create |
| Detail | `page-container` + sidebar 4 cols / main 8 cols | Goal detail |
| Modal | Fixed `max-w-*`, centered or top-aligned | Quick Create, Delete Confirm |

All responsive: single-column on mobile, multi-column at `md`/`lg` via the page grid.