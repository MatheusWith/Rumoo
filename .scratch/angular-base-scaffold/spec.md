## Problem Statement

The Rumoo project has a fully functional Spring Boot backend with hexagonal architecture, but no frontend exists. The user needs a base Angular 22 frontend scaffolded in `frontend/` at the monorepo root, with all tooling configured and ready for feature development. The scaffold must follow the project's conventions (pnpm, exact dependency versions, ESLint + Prettier, TDD, conventional commits) and integrate with Keycloak for authentication.

## Solution

Scaffold a minimal Angular 22 application using the Angular CLI with standalone components, configure the full toolchain (Tailwind CSS, ESLint, Prettier, Jasmine + Karma), integrate Keycloak authentication via `keycloak-angular`, and establish a clean base structure with environment configuration — all without implementing any business features yet.

## User Stories

1. As a developer, I want to run `pnpm build` in `frontend/` and have it succeed, so that the Angular project compiles without errors
2. As a developer, I want to run `pnpm test` in `frontend/` and have the test runner start, so that the TDD workflow is ready for use
3. As a developer, I want to run `pnpm lint` in `frontend/` and have it pass with zero warnings, so that code quality is enforced from the start
4. As a developer, I want `pnpm format` to auto-format all source files, so that code style is consistent across the project
5. As a developer, I want the Angular project to use standalone components exclusively, so that there is no NgModule boilerplate and imports are explicit
6. As a developer, I want Tailwind CSS configured and working, so that I can use utility classes in templates immediately
7. As a developer, I want ESLint configured with Angular-specific rules and Prettier integration, so that linting and formatting are unified
8. As a developer, I want all dependencies pinned to exact versions (no caret, no tilde), so that builds are reproducible across machines
9. As a developer, I want Keycloak integrated via `keycloak-angular`, so that authentication, token refresh, and route guards work out of the box
10. As a developer, I want Keycloak configuration (URL, realm, client ID) sourced from environment variables, so that different environments can be configured without code changes
11. As a developer, I want a `.env.example` file with Keycloak placeholders, so that new developers know which env vars are required
12. As a developer, I want an HTTP interceptor that automatically attaches the Keycloak bearer token to outgoing API requests, so that authenticated endpoints work without manual token management
13. As a developer, I want a route guard that redirects unauthenticated users to the login page, so that protected routes are secure by default
14. As a developer, I want the app to initialize Keycloak via `APP_INITIALIZER`, so that the auth state is resolved before the application renders
15. As a developer, I want a shell layout component with `<router-outlet>`, so that feature routes can be added incrementally
16. As a developer, I want an empty `app.routes.ts` with a placeholder route, so that routing is wired up but not prescriptive
17. As a developer, I want environment files for `development` and `production`, so that API URLs and Keycloak config differ per environment
18. As a developer, I want the `frontend/.gitignore` to exclude `dist/`, `.angular/`, and `node_modules/`, so that build artifacts are not committed
19. As a developer, I want the monorepo `.gitignore` to also exclude `frontend/dist/`, `frontend/.angular/`, and `frontend/node_modules/`, so that the root git context is clean
20. As a developer, I want `pnpm install --frozen-lockfile` to work in CI, so that dependency resolution is deterministic
21. As a developer, I want the project to use SCSS (via Tailwind's PostCSS pipeline) rather than plain CSS, so that the styling toolchain is ready for complex components
22. As a developer, I want a minimal `app.component.spec.ts` that passes, so that the test infrastructure is verified end-to-end
23. As a developer, I want the Angular dev server (`pnpm start`) to launch without errors, so that the development workflow is functional
24. As a developer, I want the Keycloak init to fail gracefully with a console warning if the Keycloak server is unreachable, so that local development without Keycloak is not blocked
25. As a developer, I want the `provideHttpClient()` with `withInterceptorsFromDi()` configured, so that the Keycloak HTTP interceptor is registered via Angular's DI

## Implementation Decisions

- **Angular 22.1.7** — latest stable release, scaffolded via `pnpm dlx @angular/cli@22.1.7 new frontend --routing --style=css --skip-git --ssr=false`
- **Standalone components only** — no NgModules anywhere; all component imports are explicit in the component decorator
- **Tailwind CSS v4** — installed via `tailwindcss`, `@tailwindcss/postcss`, and `postcss`; configured through `postcss.config.json` with `@import "tailwindcss"` in `styles.css`
- **Angular CLI flat folder structure** — `components/`, `services/`, `models/` at `src/app/` level, with `core/auth/` for Keycloak integration and `environments/` for env files
- **Keycloak integration** — `keycloak-angular` (22.0.0) + `keycloak-js` (26.2.4) providing `KeycloakService` initialized via `APP_INITIALIZER`, `authGuard` for route protection, and an HTTP interceptor for token injection
- **Keycloak config from env vars** — `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID` read from `environment.ts` (which sources from `process.env` or Angular's `fileReplacements`)
- **No state management library** — Angular signals only; no NgRx, NGXS, or SignalStore
- **Empty routing shell** — `app.routes.ts` exports an empty `Routes` array; `app.component` renders `<router-outlet>`
- **HttpClient directly** — no `ApiService` wrapper; `provideHttpClient(withInterceptorsFromDi())` configured in `app.config.ts`
- **ESLint + @angular-eslint + Prettier** — `eslint-config-prettier` disables formatting rules that conflict with Prettier; `@angular-eslint/eslint-plugin` provides Angular-specific lint rules
- **Jasmine + Karma** — Angular's default test stack; `karma.conf.js` configured with `chromium` (or `chrome` headless) for CI
- **Dependency pinning** — all versions in `package.json` are exact (no `^` or `~`); `pnpm-lock.yaml` committed
- **Environment files** — `environment.ts` (development) and `environment.prod.ts` (production) with `fileReplacements` in `angular.json`
- **`.env.example`** at monorepo root with `KEYCLOAK_URL=`, `KEYCLOAK_REALM=`, `KEYCLOAK_CLIENT_ID=` placeholders
- **`APP_INITIALIZER` pattern** — Keycloak initializes before Angular bootstraps; if unreachable, logs warning and continues (non-blocking)

## Testing Decisions

- **External behavior only** — tests verify that the build succeeds, lint passes, and test runner starts; they do not test internal Angular class wiring
- **Build seam** (`pnpm build`) — catches TypeScript compilation errors, missing imports, Tailwind/PostCSS misconfiguration
- **Lint seam** (`pnpm lint`) — catches ESLint rule violations, Prettier formatting inconsistencies
- **Test seam** (`pnpm test --watch=false`) — catches Karma/Jasmine misconfiguration, missing test files
- **Keycloak seam** — `KeycloakService` can be initialized with mock config; no real Keycloak server needed for unit tests
- **Minimal passing spec** — `app.component.spec.ts` verifies the component creates successfully (the "hello world" of Angular test infrastructure)
- **No Testcontainers for frontend** — the frontend does not need database or backend integration tests at this stage; that's a future concern
- **Prior art** — backend uses three-tier testing (unit/integration/web layer); frontend starts with one tier (unit via Karma) and can expand later

## Out of Scope

- Any business feature implementation (no goal, activity, or company UI)
- Routing beyond the empty shell (no login page, no dashboard, no feature routes)
- API service layer or HTTP client abstraction beyond the Keycloak interceptor
- State management (signals-only for now; no store)
- E2E testing (no Cypress, Playwright, or Protractor setup)
- CI/CD pipeline configuration (GitHub Actions for frontend)
- Docker configuration for the frontend
- SSR/SSG configuration
- i18n or localization setup
- Accessibility (a11y) audit or setup
- Storybook or component documentation
- Performance budgets or Lighthouse configuration
- Any deployment configuration

## Further Notes

- The backend uses hexagonal architecture with `I` prefix for interfaces and UseCase-per-operation pattern. The frontend does not mirror this architecture (it uses Angular CLI defaults) but should be aware of the backend's API contract (`/api/v1/companies` etc.) when feature development begins.
- Keycloak realm is `Rumoo`, as specified in AGENTS.md. The frontend Keycloak config must use this realm name.
- The `--skip-git` flag is used because git is managed at the monorepo level, not per-project.
- The `--ssr=false` flag disables server-side rendering, which is not needed for this application.
- The `--style=css` flag in `ng new` sets the default stylesheet format; Tailwind's PostCSS pipeline overrides this at build time.
