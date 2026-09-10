# Authentication and Authorization with Keycloak — Rumoo

> Architecture document. Describes the **topology**, the **flows**, and the **configuration** of
> Rumoo's authentication and authorization using Keycloak. No implementation is covered here;
> this is the reference model the implementation is built from.

---

## 1. Overview and decisions

Consolidated decisions:

| # | Decision | Value |
|---|----------|-------|
| D1 | Login flow (frontend) | **Resource Owner Password Credentials** (`grant_type=password`) against the Rumoo Realm token endpoint; client **public** |
| D2 | Login screen ownership | **SPA-owned Sign-in Form**; no Keycloak-hosted page, no redirect, no `check-sso`, no `silent-check-sso.html` |
| D3 | Backend | **Resource Server** with **JWT** validation (stateless, via JWKS) |
| D4 | Deploy topology | Keycloak on **subpath `/auth`** behind nginx (same origin) |
| D5 | Realm | **one single realm** `Rumoo` |
| D6 | Clients | `rumoo-frontend` (**public**, Direct Access Grants) + `rumoo-backend` (**confidential** + service account) |
| D7 | Authorization model | **Roles = granular permissions**; **Groups = organization + role inheritance** |
| D8 | Token content | **realm roles** in the token (via `realm_access.roles`); groups **not** in the token (management only) |
| D9 | Role granularity | **`entity:action`** (e.g. `company:create`) |
| D10 | Logout | **local only** — clears the in-memory session and routes to `/login`; no global (SSO) session end |
| D11 | Refresh | automatic by `AuthService` (`grant_type=refresh_token`) before Access Token expiry |
| D12 | Backend session | **none** — backend fully stateless, authorizes by token |

> **Notes:**
> - The move from Authorization Code + PKCE to Resource Owner Password Credentials is a
>   deliberate, documented deviation from the previous redirect-based design. See the ADR
>   (`docs/adr/0002-use-ropc-for-spa-login.md`).
> - **Q9** role format: adopted `entity:action` (D9). **Q10** backend client with service
>   account (D6).

---

## 2. Topology

```
                        ┌──────────────────────────────────────────────────┐
                        │              Domain (e.g. rumoo.app)            │
                        │                                                  │
   Browser / SPA  ───▶  │   nginx (reverse proxy)                          │
   (Angular)            │     │         │         │                        │
                        │   /app     /api      /auth                       │
                        │     │         │         │                        │
                        │     ▼         ▼         ▼                        │
                        │  frontend   backend   keycloak                   │
                        │  (Angular)  (Spring)   (Keycloak)               │
                        │             :8080                :8080 (int.)   │
                        └──────────────────────────────────────────────────┘

  - /app   → frontend container (static Angular)
  - /api   → backend container (Spring Boot resource server)
  - /auth  → Keycloak container (realm Rumoo)
```

**Key points:**

- **Single domain/host.** Keycloak is exposed on subpath `/auth` by nginx, together with the SPA
  (`/app`) and API (`/api`) routes. The SPA, the token endpoint and the API share the nginx
  origin, so the password-grant token POST is **same-origin** — no CORS work needed.
- **Dev:** the dev nginx publishes port 8080 (`deploy/docker-compose.dev.yml`); Keycloak is
  reachable at `http://localhost:8080/auth`.
- **Prod:** self-hosted Keycloak (project convention), also under `/auth`; `KEYCLOAK_URL` derived
  from the domain.

### Environment variables

| Variable | Description | Example |
|----------|-------------|---------|
| `KEYCLOAK_URL` | Public base URL of Keycloak | `http://localhost:8080/auth` |
| `KEYCLOAK_REALM` | Realm name | `Rumoo` |
| `KEYCLOAK_CLIENT_ID` | Public frontend client | `rumoo-frontend` |
| `KEYCLOAK_BACKEND_CLIENT_ID` | Confidential backend client | `rumoo-backend` |
| `KEYCLOAK_BACKEND_CLIENT_SECRET` | Confidential client secret (never in the frontend) | *(secret)* |

> The client secret **never** lives in the frontend (a public client has no secret). The
> `rumoo-backend` secret lives only in the backend/deploy, sourced from an env var.

---

## 3. Authentication Flow

### 3.1 Login (Resource Owner Password Credentials)

```
User                  Angular (SPA)              Keycloak            Backend
   │                        │                       │                   │
   │ 1. opens /dashboard    │                       │                   │
   │───────────────────────▶│ guard: no session     │                   │
   │◀── redirect to /login ─│                       │                   │
   │ 2. submits credentials │                       │                   │
   │───────────────────────▶│ 3. POST token         │                   │
   │                        │  grant_type=password  │                   │
   │                        │──────────────────────▶│                   │
   │                        │◀── access/refresh/id tokens ──             │
   │                        │ 4. session in memory  │                   │
   │ 5. request /api        │                       │                   │
   │───────────────────────▶│                       │ (Bearer JWT) ────▶│
   │                        │                       │                   │
```

1. A signed-out user opens `/dashboard`; the `authGuard` finds no session and redirects to `/login`.
2. The user submits username and password on the **SPA-owned Sign-in Form** (no Keycloak page,
   no navigation).
3. The `AuthService` posts `grant_type=password` with the client id and credentials to the Rumoo
   Realm token endpoint (`/realms/Rumoo/protocol/openid-connect/token`).
4. On success the token set (Access + Refresh) is held **in memory**; the HTTP interceptor
   attaches `Authorization: Bearer <access_token>` to `/api/**` requests.
5. A successful login always navigates to `/dashboard`. Invalid credentials surface as an inline
   error on the Sign-in Form.

### 3.2 Refresh / expiry

- The `AuthService` derives the Access Token expiry from its `exp` claim and refreshes
  **pre-emptively** before expiry via `grant_type=refresh_token`; a rejected refresh clears the
  session and routes the user back to `/login`.
- A single `401` from the API triggers one refresh-and-retry of the failed request; repeated
  failure ends the session.
- The backend is **stateless**: every request is authorized by the JWT; **no server session and
  no per-request Keycloak call**.

### 3.3 Logout (local)

- Logout clears the in-memory session in the `AuthService` and routes to `/login`.
- There is **no OIDC end-session call**: with the redirect flow gone, Keycloak is not aware of
  the SPA logout (loss of global SSO logout — a documented consequence of the ROPC decision).

---

## 4. Keycloak Configuration

### 4.1 Realm

| Item | Value |
|------|-------|
| Realm name | `Rumoo` |
| Ingress | Realm tokens / access tokens |

A single realm serves the whole application. A new `KEYCLOAK_CLIENT_ID` does not require a new realm.

### 4.2 Clients

#### 4.2.1 `rumoo-frontend` (public)

For the Angular SPA.

| Property | Value |
|----------|-------|
| Client type | **Public** (no secret) |
| Standard flow (Authorization Code) | ❌ disabled |
| Implicit flow | ❌ disabled |
| **Direct access grants** | ✅ **enabled** (allows `grant_type=password`) |
| Redirect URIs | not required (no redirect flow) |
| Web Origins | same hosts as the SPA origin (same-origin in the dev stack) |
| Client Scopes | `rumoo-scopes` (roles) + defaults |

> **Public client =** no secret. Its only credential-exchange mechanism is Resource Owner
> Password Credentials, which the SPA drives from its own Sign-in Form. The credentials stream
> through browser JavaScript — this is the known, documented trade-off of ROPC (see ADR) and the
> reason the session is kept strictly in memory.

#### 4.2.2 `rumoo-backend` (confidential)

For Spring Boot (resource server + future m2m operations).

| Property | Value |
|----------|-------|
| Client type | **Confidential** |
| Standard flow | ❌ (does not log users in) |
| Service account roles | ✅ enabled (for future m2m/admin calls to Keycloak) |
| Client authentication | Client ID + Secret (env var) |
| Client Scopes | `rumoo-scopes` (roles) + defaults |

**Role:** validate JWTs (via JWKS) and, when needed, m2m operations (client-credentials grant) —
e.g., querying realm users/admin.

### 4.3 Client Scope `rumoo-scopes`

A single Client Scope attached to **both** clients for consistent claims:

| Mapper | Type | Claim |
|--------|------|-------|
| Realm roles | Realm roles | `realm_access.roles` (default) |

> Per **D8**, only **roles** go in the token; **groups** are not exposed as a claim (used for
> management/role inheritance only).

---

## 5. Roles and Groups (authorization model)

### 5.1 Role of each

- **Role** = atomic permission per action. This is what the **backend authorizes**.
- **Group** = grouping of users with **hierarchical role inheritance**, for management/organization.

```
        group: managers ────────────────► roles: company:create, company:update, ...
          └── sub-group: regional-managers ─► inherits managers roles + extras
        group: collaborators ────────────► roles: company:read, ...
```

Putting a user in a group grants **all inherited roles** — the backend authorizes only by the
**resulting roles** in the token.

### 5.2 Role catalog (`entity:action`)

Granular per-action roles, realm-scoped. Base for the current domain and roadmap:

| Entity     | Roles |
|------------|-------|
| `company`  | `company:create`, `company:read`, `company:update`, `company:delete` |
| `goal`     | `goal:create`, `goal:read`, `goal:update`, `goal:delete` *(future)* |
| `activity` | `activity:create`, `activity:read`, `activity:update`, `activity:delete`, `activity:assign` *(future)* |

**Mapping to current code (reference):**
- `CreateCompanyUseCase` → `company:create`
- `FindCompanyByIdUseCase` → `company:read`
- `ListCompaniesUseCase` → `company:read`
- `UpdateCompanyUseCase` → `company:update`
- `DeleteCompanyUseCase` → `company:delete`

### 5.3 Suggested groups (organization)

| Group | Inherited roles | Use |
|-------|-----------------|-----|
| `managers` | `company:create`, `company:update`, `company:delete` | Managers |
| `collaborators` | `company:read` | Collaborators (read access) |
| `regional-managers` (sub of `managers`) | inherits from `managers` | Future regional delegation |

> Tune the group tree as Rumoo's real organizational roles materialize (to define with the product).

---

## 6. Backend: JWT Resource Server

- Dependency: `spring-boot-starter-oauth2-resource-server`.
- Issuer config = `KEYCLOAK_URL/realms/Rumoo`; JWKS for signature validation.
- Maps `realm_access.roles` → `GrantedAuthority` (`company:create`, etc.).
- Per-endpoint authorization by the role in the token (e.g., `@PreAuthorize("hasAuthority('company:create')")`).
- **Stateless**: no session, no per-request Keycloak call.
- The `rumoo-backend` service account is available for future m2m operations.

> Implementation details (filters/security config, annotations) belong to the implementation
> phase; this document defines the model.

---

## 7. Security — Zero Trust

- **Everything.** All layers (frontend, backend, Keycloak) require authentication.
- The **public client** carries no secret; its only grant is Resource Owner Password
  Credentials, exercised from the SPA.
- The **backend does not trust the frontend** — it validates the JWT and its roles on every
  request (least privilege); `401` for unauthenticated requests, `403` for insufficient roles.
- Confidential client secret only in the backend, via env var, **fail-fast** when absent.
- **Credentials travel through browser JavaScript** to the Rumoo Realm token endpoint — the
  known trade-off of ROPC. Mitigations in force: the session lives strictly in memory, the
  password is never persisted or logged, and the backend independently validates every request.
- No session data on the client: a page reload returns the user to `/login`.
- Use TLS in production (HTTPS) for the token exchange and API traffic.

---

## 8. Open questions / pending decisions

- Definitive **Groups** tree per product roles.
- Real **prod domain** and prod `nginx.conf` (route `/auth`).
- Whether the backend needs **m2m** operations via service account in the first delivery.
- If per-resource/instance permissions are ever needed (e.g., edit only Company X), evaluate
  **Keycloak Authorization Services** — **out of scope** in this phase.

---

## 9. Glossary

| Term | Meaning |
|------|---------|
| **Realm** | Identity/security domain grouping clients, users, roles, and groups. |
| **Client** | Application (SPA or backend) requesting authentication/authorization to Keycloak. |
| **Public client** | Client without a secret (SPA). Uses Direct Access Grants. |
| **Confidential client** | Client with a secret (backend). May have a service account. |
| **Sign-in Form** | The SPA-owned credential page (username, password, submit, inline error) that exchanges Resource Owner Password Credentials with the Rumoo Realm. |
| **Resource Owner Password Credentials (ROPC)** | The `grant_type=password` exchange in which the SPA presents a username and password directly at the token endpoint. |
| **Role** | Atomic permission per action that the backend authorizes. |
| **Group** | User grouping with hierarchical role inheritance (organization). |
| **Scope** | Unit of claims/permissions attachable to clients (e.g., `rumoo-scopes`). |
| **Claim** | Field inside the JWT. |
| **JWKS** | Public key set of the issuer for validating JWT signatures. |