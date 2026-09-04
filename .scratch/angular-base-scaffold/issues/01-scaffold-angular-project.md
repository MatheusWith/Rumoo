# 01: Scaffold Angular 22 project

**What to build:** A working Angular 22 project at `frontend/` with `pnpm build`, `pnpm test`, and `pnpm start` all succeeding. Standalone components, empty routing shell, and basic project structure in place.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Scaffold Angular project using `pnpm dlx @angular/cli@22.1.7 new frontend --routing --style=css --skip-git --ssr=false`
- [ ] Standalone components only (no NgModules)
- [ ] `pnpm build` succeeds
- [ ] `pnpm test --watch=false` passes (minimal `app.component.spec.ts`)
- [ ] `pnpm start` launches dev server without errors
- [ ] All dependencies pinned to exact versions (no `^` or `~` in `package.json`)
- [ ] `pnpm-lock.yaml` generated and committed
