# Tokens — Semantic Reference (Light & Dark)

This is the handoff contract. Every value below has been pre-checked against
WCAG 2.2 AA where relevant (see `05-accessibility.md` for the matrix and tools).

## Color — Light

```css
/* Brand */
--color-primary:            #047857;  /* emerald-700 — solid buttons, strong accents */
--color-primary-hover:      #065f46;  /* emerald-800 */
--color-primary-active:     #064e3b;  /* emerald-900 */
--color-primary-accent:     #059669;  /* emerald-600 — focus rings, icons, links */
--color-primary-subtle:     #ecfdf5;  /* emerald-50 — selected rows, soft states */
--color-secondary:          #4338ca;  /* indigo-700 */
--color-secondary-subtle:   #eef2ff;  /* indigo-50 */
--color-on-primary:         #ffffff;

/* Neutrals */
--color-background:         #f8fafc;  /* slate-50 */
--color-surface:            #ffffff;
--color-surface-raised:     #ffffff;
--color-field:              #ffffff;
--color-border:             #e2e8f0;  /* slate-200 */
--color-divider:            #e2e8f0;
--color-text-primary:       #0f172a;  /* slate-900 */
--color-text-secondary:     #475569;  /* slate-600 */
--color-text-tertiary:      #64748b;  /* slate-500 */
--color-text-disabled:      #94a3b8;  /* slate-400 */
--color-icon:               #334155;  /* slate-700 */
--color-overlay:            rgba(15,23,42,0.45);

/* States */
--color-success:            #15803d;  /* green-700 */
--color-success-subtle:     #f0fdf4;  /* green-50 */
--color-success-solid:      #16a34a;  /* green-600 */
--color-warning:            #b45309;  /* amber-700 */
--color-warning-subtle:     #fffbeb;  /* amber-50 */
--color-warning-solid:      #d97706;  /* amber-600 */
--color-danger:             #b91c1c;  /* red-700 */
--color-danger-subtle:      #fef2f2;  /* red-50 */
--color-danger-solid:       #dc2626;  /* red-600 */
--color-info:               #0369a1;  /* sky-700 */
--color-info-subtle:        #f0f9ff;  /* sky-50 */
--color-info-solid:         #0284c7;  /* sky-600 */
```

## Color — Dark

```css
/* Brand */
--color-primary:            #34d399;  /* emerald-400 — light-on-dark primary */
--color-primary-hover:      #10b981;  /* emerald-500 */
--color-primary-active:     #059669;
--color-primary-accent:     #10b981;
--color-primary-subtle:     #052e1b;  /* emerald-950 */
--color-on-primary:         #022c22;
--color-secondary:          #a5b4fc;  /* indigo-300 */
--color-secondary-subtle:   #1e1b4b;  /* indigo-950 */

/* Neutrals */
--color-background:         #0f172a;  /* slate-900 */
--color-surface:            #1e293b;  /* slate-800 */
--color-surface-raised:     #334155;  /* slate-700 */
--color-field:              #0f172a;
--color-border:             #475569;  /* slate-600 */
--color-divider:            #334155;
--color-text-primary:       #f1f5f9;  /* slate-100 */
--color-text-secondary:     #cbd5e1;  /* slate-300 */
--color-text-tertiary:      #94a3b8;  /* slate-400 */
--color-text-disabled:      #64748b;  /* slate-500 */
--color-icon:               #cbd5e1;
--color-overlay:            rgba(2,6,23,0.6);

/* States */
--color-success:            #4ade80;  /* green-400 */
--color-success-subtle:     #052e16;  /* green-950 */
--color-success-solid:      #16a34a;
--color-warning:            #fbbf24;  /* amber-400 */
--color-warning-subtle:     #451a03;  /* amber-950 */
--color-warning-solid:      #d97706;
--color-danger:             #f87171;  /* red-400 */
--color-danger-subtle:      #450a0a;  /* red-950 */
--color-danger-solid:       #dc2626;
--color-info:               #38bdf8;  /* sky-400 */
--color-info-subtle:        #082f49;  /* sky-950 */
--color-info-solid:         #0284c7;
```

## Typography

```css
--font-family-sans: Inter, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-weight-regular: 400;
--font-weight-medium:  500;
--font-weight-semibold:600;

--text-display-size:31px;  --text-display-line-height:1.2;   --text-display-weight:600;
--text-heading-l:25px;     --text-heading-l-height:1.25;
--text-heading-m:20px;     --text-heading-m-height:1.3;
--text-heading-s:16px;     --text-heading-s-height:1.4;
--text-body-l:16px;        --text-body-l-height:1.5;
--text-body:14px;          --text-body-height:1.5;
--text-body-s:13px;        --text-body-s-height:1.5;
--text-caption:12px;       --text-caption-height:1.4;   --text-caption-weight:500; --text-caption-spacing:0.02em;
--text-overline:11px;      --text-overline-height:1.4;  --text-overline-weight:600;--text-overline-spacing:0.06em; --text-overline-transform:uppercase;
```

## Spacing, radius, elevation, motion

```css
--space-1:4px;  --space-2:8px;  --space-3:12px; --space-4:16px;
--space-5:20px; --space-6:24px; --space-8:32px; --space-12:48px; --space-16:64px; --space-20:80px;

--radius-sm:6px; --radius-md:8px; --radius-lg:12px; --radius-full:999px;

/* light */
--shadow-sm:0 1px 2px rgba(15,23,42,.05);
--shadow-md:0 4px 12px rgba(15,23,42,.08);
--shadow-lg:0 12px 32px rgba(15,23,42,.14);
/* dark overrides */
--dark-shadow-sm:0 1px 2px rgba(2,6,23,.4);
--dark-shadow-md:0 4px 12px rgba(2,6,23,.6);
--dark-shadow-lg:0 12px 32px rgba(2,6,23,.7);

--duration-fast:120ms; --duration-base:200ms; --duration-slow:320ms;
--ease-out:cubic-bezier(0.2,0,0,1);
--ease-in-out:cubic-bezier(0.65,0,0.35,1);

/* density */
--density:compact;           /* compact | comfortable */
--row-height-compact:32px;   --row-height-comfortable:40px;
--row-height:var(--row-height-compact);
```

> When implemented in Tailwind v4, these map into `@theme` (`--color-*`,
> `--font-*`, `--text-*`, `--space-*`, `--radius-*`, `--shadow-*`,
> `--ease-*`, `--duration-*`). Dark values swap via `[data-theme="dark"]`
> overrides on the same variable names.