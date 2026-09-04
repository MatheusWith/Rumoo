# 03: Configure ESLint + Prettier

**What to build:** `pnpm lint` passes with zero warnings. `pnpm format` auto-formats all source files. Code quality is enforced from the start.

**Blocked by:** 01 - Scaffold Angular 22 project

**Status:** ready-for-agent

- [ ] Install ESLint, `@angular-eslint/eslint-plugin`, `@angular-eslint/template-parser`, `typescript-eslint`, Prettier, `eslint-config-prettier`, `eslint-plugin-prettier`
- [ ] Configure ESLint with Angular rules + Prettier compatibility
- [ ] Configure `.prettierrc` with project conventions (singleQuote, trailingComma, etc.)
- [ ] Add `lint` and `format` scripts to `package.json`
- [ ] `pnpm lint` passes with zero warnings
- [ ] `pnpm format` runs without errors
- [ ] `pnpm build` still succeeds
