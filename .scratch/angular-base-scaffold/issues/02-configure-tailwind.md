# 02: Configure Tailwind CSS

**What to build:** Tailwind CSS utility classes work in any component template. `pnpm build` still succeeds with Tailwind processing.

**Blocked by:** 01 - Scaffold Angular 22 project

**Status:** ready-for-agent

- [ ] Install `tailwindcss`, `@tailwindcss/postcss`, `postcss`
- [ ] Configure `postcss.config.json` with `@tailwindcss/postcss` plugin
- [ ] Add `@import "tailwindcss"` to global styles
- [ ] Verify a utility class renders correctly in a component template
- [ ] `pnpm build` succeeds
- [ ] `pnpm test --watch=false` still passes
