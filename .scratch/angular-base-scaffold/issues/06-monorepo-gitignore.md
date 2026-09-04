# 06: Monorepo gitignore cleanup

**What to build:** Build artifacts are properly excluded from version control at both project and monorepo level.

**Blocked by:** 01 - Scaffold Angular 22 project

**Status:** ready-for-agent

- [ ] Update monorepo `.gitignore` with `frontend/dist/`, `frontend/.angular/`, `frontend/node_modules/`
- [ ] Verify `frontend/.gitignore` (created by `ng new`) excludes `dist/`, `.angular/`, `node_modules/`
