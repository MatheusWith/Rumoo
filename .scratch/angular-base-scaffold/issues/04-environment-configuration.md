# 04: Environment configuration

**What to build:** Environment files for development and production exist with Keycloak config placeholders. `.env.example` documents required env vars. New developers know what to configure.

**Blocked by:** 01 - Scaffold Angular 22 project

**Status:** ready-for-agent

- [ ] Create `environment.ts` (development) with `keycloak` config block
- [ ] Create `environment.prod.ts` (production) with `keycloak` config block
- [ ] Configure `fileReplacements` in `angular.json`
- [ ] Create `.env.example` at monorepo root with `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID` placeholders
- [ ] Update monorepo `.gitignore` to exclude `.env.local`
