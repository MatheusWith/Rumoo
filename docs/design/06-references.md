# References (curadoria)

Sources that informed this system, with what to borrow. Original research note:
**Asana does not publish official design tokens**; the product identity below is
derived from public brand/product pages, not token exports.

## Asana 2026 — visual ecosystem

- Brand identity: **coral** mark + wordmark on black/white. Brand page:
  <https://asana.com/brand> · Press: <https://asana.com/press>.
- Product canvas: neutral/white with subtle grays, **high-density task lists**
  (~32–40px rows), Views switcher (List/Board/Calendar/Timeline/Gantt), Command
  palette, Quick Add (one field first), Inbox, My Tasks, AI Studio and "Command"
  orchestration. Sources: <https://asana.com/product>,
  <https://asana.com/features/project-management>, <https://asana.com/pricing>.

**What we borrow:** the *canvas philosophy* (calm neutrals + one brand accent),
density-first rows, Quick Add, Command-K, status-never-color-alone. We
**deliberately differ** on accent (Emerald vs Asana coral) and host our own dark
theme from the start (Asana web is light-first).

## Complementary references

| Reference | Source | Borrow |
|---|---|---|
| IBM Carbon — color tokens | <https://carbondesignsystem.com/elements/color/tokens/> | Role-based token naming (background/layer/field/border/text/support), grays hierarchy |
| Tailwind v4 theme | <https://tailwindcss.com/docs/theme> | `@theme` namespace mapping, oklch scales, token conventions |
| Material 3 — color roles | <https://m3.material.io/styles/color/roles> | Primary/secondary/surface role separation, dark surfaces |
| Shopify Polaris | <https://polaris.shopify.com> | Admin-tool UI density, spacing system, practical component docs |
| WCAG 2.2 quickref | <https://www.w3.org/WAI/WCAG22/quickref/> | Normative basis for 1.4.3 / 1.4.11 / 2.5.8 |
| Contrast tooling | see `05-accessibility.md` | Verified measurement chain |
| Inter typeface | <https://rsms.me/inter/> | Neutral, dense-ui-optimized font (400/500/600) |
| 8pt-grid lineage | Carbon/Material practice + Tailwind default | 4px base, 8px structural rhythm |
| Lucide / Phosphor (outline icons) | <https://lucide.dev> · <https://phosphoricons.com> | 1.5px-stroke outline family on 24px grid |

## Gaps & risks recorded

1. Asana/Linear official **tokens and type scale are not public** — we did not
   copy numbers from them; we derived our own (Inter scale 1.250, slate+emerald).
2. Linear has **no public design-system docs** — used only as a product
   reference for keyboard-first patterns, not tokens.
3. Some reference pages (Atlassian, Spectrum) were partially inaccessible at
   research time; Carbon + Tailwind + Material carry the token-model weight here.
4. Emerald/Green collision is a **known trade-off**, resolved by strict semantic
   separation + icon/label pairing (see `01-foundations/01-color.md`).