# 05: Integrate Keycloak authentication

**What to build:** Keycloak auth is fully wired: `APP_INITIALIZER` initializes Keycloak before bootstrap, HTTP interceptor attaches bearer tokens, route guard protects routes, graceful fallback when Keycloak is unreachable.

**Blocked by:** 04 - Environment configuration

**Status:** ready-for-agent

- [ ] Install `keycloak-angular` and `keycloak-js`
- [ ] Configure `KeycloakService` with `APP_INITIALIZER` in `app.config.ts`
- [ ] Create route guard using `keycloak-angular`
- [ ] Create HTTP interceptor for bearer token injection
- [ ] Register interceptor via `provideHttpClient(withInterceptorsFromDi())`
- [ ] Configure graceful fallback (console warning if Keycloak unreachable, app continues)
- [ ] Update `app.config.ts` to wire all providers
- [ ] `pnpm build` succeeds
- [ ] `pnpm test --watch=false` passes
- [ ] `pnpm lint` passes
