@RTK.md
<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
rtk uv run <cmd>        # Compact uv project command output
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze OpenCode sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to AGENTS.md
rtk init --global       # Add RTK to ~/.config/opencode/AGENTS.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->

## Project Overview

**Rumoo** is a management system for organizational goal tracking and activity management. The system enables managers to set goals, distribute activities, and track progress across teams and individuals.

### Core Business Flows

1. **Configuration** — Manager registers people, creates teams, defines access levels
2. **Goal Planning** — Manager creates goals with visibility scope and scoring
3. **Daily Operations** — Activities distributed to collaborators, executed and marked complete
4. **Visibility & Tracking** — Context-based filtering (company → team → individual)
5. **Security** — Membership verification + ABAC permission checks on every action

For full flow documentation, see `fluxo.md` (Portuguese) or the business flows section below.

## Architecture

Target stack (planned):

| Layer | Technology |
|-------|------------|
| Frontend | Angular 22, TypeScript, Signals, SSR |
| Backend | Spring Boot 4.1.0, Java 21, Hexagonal Architecture |
| Database | PostgreSQL 17, Flyway migrations |
| Auth | Keycloak 26.7.2 (self-hosted, realm `Rumoo`) |
| Container | Docker multi-stage, docker-compose (base + dev + prod) |
| CI | GitHub Actions |

### Monorepo Structure (planned)

```
/
├── frontend/          # Angular 22 (standalone, signal-based, SSR)
├── backend/           # Spring Boot 4.1.0 (Hexagonal: interfaces/application/domain/infrastructure)
├── deploy/            # docker-compose stacks (base, dev, prod)
├── docs/              # Engineering design docs
└── .github/           # CI workflows
```

## Key Conventions

### Command Prefix

**Always use `rtk` prefix** for shell commands (see RTK section above). This reduces token usage 60-90%.

### Decision Making & Planning

- **Zero technical assumptions** — always present options with pros/cons before proceeding
- **Resolve all gaps** in plans before generating final execution plans
- When encountering uncertainty, stop and ask the user

### AI-Generated Artifacts

- **Never** commit, push, or otherwise deliver AI-generated artifacts (agents, execution plans, local information, code, docs, tickets, specs, or any other AI-produced output) unless the user **actively** requests them to be added or **explicitly approves** the delivery
- When in doubt, ask before adding any AI-generated artifact to the repository or the tracker

### Git Workflow

- Three-tier branching: `main` → `dev` → `feature/*`
- Feature branches target `dev`, never `main`
- Never push directly to `main` or `dev`
- Configure and respect **pre-commit** and **pre-push** git hooks

### Commit Message Convention (Conventional Commits)

Format: `<type>(<scope>): <description>`

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — adding or updating tests
- `docs` — documentation only
- `chore` — build process, tooling, dependencies
- `style` — formatting, semicolons, etc. (no logic change)
- `perf` — performance improvement
- `ci` — CI/CD configuration

**Scopes:**
- `backend` — backend changes
- `frontend` — frontend changes
- `infra` — infrastructure / deployment
- `db` — database / migrations

**Rules:**
- Description in **imperative mood** ("add feature" not "added feature")
- Description in **English**
- No period at end of description
- Keep description under 72 characters
- Body (optional) wraps at 80 characters

**Examples:**
```
feat(backend): scaffold Spring Boot base project
feat(backend): add Company REST API with CRUD and pagination
test(backend): add integration tests with Testcontainers
refactor(backend): English naming, UseCase pattern, JPA soft delete, domain exceptions
docs: initial project documentation
chore(backend): add Maven Wrapper
```

### Pull Request Convention

Format:
```
<type>(<scope>): <short description>

<bullet list of what changed>

Closes #<issue-number>
```

**Title:** same as commit message — `<type>(<scope>): <description>`

**Body — required sections:**
- **What** — 1–3 bullet points summarizing the change
- **Why** (optional) — only if the motivation isn't obvious from the linked issue
- **Closes** — always link the issue/ticket that triggered the work

**Rules:**
- One feature/fix per PR — don't bundle unrelated changes
- Title uses imperative mood, same as commits
- Body is plain Markdown, no YAML front-matter
- PR targets `dev`, never `main`
- Squash-merge into `dev` (keeps history clean)

**Examples:**
```
feat(backend): add Company REST API

- Implements full CRUD for Company entity with soft delete
- Adds pagination, validation, and error handling
- Follows hexagonal architecture and UseCase pattern

Closes #12
```
```
fix(backend): fix soft delete not clearing JPA cache

- Adds entityManager.clear() after @Modifying query
- Adds regression test for softDelete on nonexistent ID

Closes #34
```
```
docs: add commit and PR conventions to AGENTS.md

- Documents Conventional Commits format with types, scopes, and examples
- Adds Pull Request format with title, body, and linking rules

Closes #45
```

### Dependency Pinning

- **No caret (`^`), no tilde (`~`)** — exact versions only
- Frontend: `pnpm` with committed `pnpm-lock.yaml`, CI uses `--frozen-lockfile`
- Backend: Maven Wrapper committed, `./mvnw verify` in CI

### Environment Variables

- **Never hardcode** URLs, secrets, credentials in source
- Use env vars for everything that changes between environments
- Validate at boot (fail fast)
- `.env.example` committed with empty placeholders; `.env.local` gitignored

### Architecture & Security

- **Zero Trust** — applied rigorously across all layers (Frontend, Backend, Database)
- **Single entry point** — consolidated entry point for the application
- **No caching currently** — any caching proposal is a new implementation to discuss
- **Never** add new technologies, libraries, or patterns without user approval
- **Never** auto-correct code that disagrees with established patterns — ask first

### Code Patterns & Stack

#### English as Default Language

- **All code must be in English** — error messages, log messages, variable names, class names, method names, database column names, API endpoints, configuration keys, comments, and documentation within code
- **No exceptions** — even if the business domain or user-facing content is in Portuguese (or any other language), all developer-facing identifiers, messages, and artifacts must be in English
- This is the **worldwide software engineering standard** and ensures interoperability, readability by international developers, and consistency across the entire codebase

#### General

- Follow official framework idioms and best practices for the language/version used

#### TypeScript

- Mandatory well-defined types; avoid `any` or loose typing

#### Backend (Java 21 + Spring Boot)

- Use **Lombok** to eliminate boilerplate
- Use **Records** wherever applicable
- **All queries/lists must be paginated**
- **Prefer Spring Data JPA derived queries** over custom JPQL/SQL. Use method-name keywords (`findBy`, `countBy`, `existsBy`, `deleteBy`, `findByXAndY`, `findByXOrderByYDesc`, etc.) whenever possible. Only resort to `@Query` with JPQL/SQL when the query cannot be expressed through derived query methods
- Consistent naming: `I` prefix for interfaces (e.g. `IService`, `IRepository`)
- Consistent naming for Services, Repositories, Models, Controllers, Request/Response Records

#### Frontend (Angular)

- Follow Angular architectural and coding standards strictly

### DDD & Hexagonal Architecture

All backend code follows **Domain-Driven Design** with **Hexagonal Architecture** (Ports & Adapters).

#### Bounded Contexts

The system is organized into these bounded contexts:
- **Access Management** — people, teams, access levels
- **Goal Management** — goals, scoring, visibility scope
- **Activity Management** — activities, execution, completion tracking
- **Organization** — company structure, hierarchy

#### Hexagonal Layers (Package Structure)

```
backend/src/main/java/com/rumoo/
├── domain/
│   ├── access/        # AccessAggregate, PersonAggregate, AccessLevelValueObject, IAccessRepository
│   ├── goal/          # GoalAggregate, ScoreValueObject, IGoalRepository
│   ├── activity/      # ActivityAggregate, IActivityRepository
│   └── organization/  # OrganizationAggregate, IOrganizationRepository
├── application/       # Use cases (CreateGoalUseCase, CompleteActivityUseCase, etc.)
│   ├── dto/           # Request/Response DTOs
│   └── ports/         # Inbound/Outbound port interfaces
├── infrastructure/    # JPA adapters, external service adapters, mappers
└── interfaces/        # REST controllers, security filters, incoming adapters
```

#### Layer Responsibilities

- **Domain**: Entities (Aggregates), Value Objects, Aggregate Roots, Domain Events, Domain Exceptions, Repository interfaces (`I` prefix). This is where all business rules live.
- **Application**: Use Cases (orchestration only — no business logic), DTOs (Request/Response), Port interfaces.
- **Infrastructure**: JPA/Hibernate adapters, external service implementations, mappers between domain and persistence models.
- **Interfaces**: REST controllers, security filters, incoming adapters. Thin layer — delegates to Application layer.

#### Naming Conventions

- **Aggregate Roots**: `*Aggregate` suffix (ex: `GoalAggregate`, `ActivityAggregate`)
- **Value Objects**: `*ValueObject` suffix (ex: `ScoreValueObject`, `AccessLevelValueObject`)
- **Repository interfaces**: `I` prefix in Domain layer (ex: `IGoalRepository`, `IActivityRepository`)
- **Use Cases**: `*UseCase` suffix in Application layer (ex: `CreateGoalUseCase`, `CompleteActivityUseCase`)

#### Domain Events

- Use Domain Events **only when there is cross-aggregate impact** (ex: `ActivityCompletedEvent` affecting a Goal's progress)
- Events are defined in the Domain layer, dispatched via Application layer

#### Anti-Corruption Layer (ACL)

- Use ACL when one bounded context needs to read data from another
- ACL converts external models into the local domain model
- Only introduce when direct repository access is insufficient

#### Golden Rule

> **All business rules must live in the Domain layer.** Never place business logic in controllers, Use Cases, or infrastructure.

#### Example — Goal Aggregate

```java
// Domain - GoalAggregate.java
public class GoalAggregate {
    private GoalId id;
    private String title;
    private ScoreValueObject currentScore;
    private GoalStatus status;

    public void complete(ScoreValueObject earnedScore) {
        if (this.status == GoalStatus.COMPLETED) {
            throw new DomainException("Goal already completed");
        }
        this.currentScore = this.currentScore.add(earnedScore);
        if (this.currentScore.isAboveTarget()) {
            this.status = GoalStatus.COMPLETED;
        }
    }
}

// Domain - ScoreValueObject.java
public record ScoreValueObject(int value) {
    public ScoreValueObject {
        if (value < 0) throw new DomainException("Score cannot be negative");
    }
    public ScoreValueObject add(ScoreValueObject other) {
        return new ScoreValueObject(this.value + other.value);
    }
    public boolean isAboveTarget() {
        return this.value >= 100;
    }
}

// Domain - IGoalRepository.java
public interface IGoalRepository {
    Optional<GoalAggregate> findById(GoalId id);
    GoalAggregate save(GoalAggregate goal);
}

// Application - CreateGoalUseCase.java
public class CreateGoalUseCase {
    private final IGoalRepository goalRepository;

    public GoalAggregate execute(CreateGoalRequest request) {
        GoalAggregate goal = GoalAggregate.create(request.title(), request.initialScore());
        return goalRepository.save(goal);
    }
}
```

### Testing (TDD)

- **TDD is mandatory** — red-green-refactor cycle
- Minimum **80% code coverage**
- Tests must cover: success, failure, and edge cases
- **Never delete existing tests** without asking the user first
- Never alter a test solely to make it pass — fix the production code

### Code Metrics & Complexity

- Respect strict limits on maximum function/method size
- Respect maximum cyclomatic complexity thresholds

### UX / UI & Responsiveness

- **Destructive actions** — require explicit confirmation (checkbox or dedicated modal)
- **Async operations** — show visual loading indicators for long-running processes
- **Responsive** — ensure fluid adaptation across viewports

### Docker

- Multi-stage builds (build + runtime only)
- Non-root user (UID 10001)
- Layer caching: deps before source
- No secrets in images — env vars at runtime
- Pin base images (no `:latest`)

### Twelve-Factor App

Follow [12factor.net](https://12factor.net) methodology:
- Stateless processes
- Config via env vars
- Build/released/run separation
- Logs to stdout
- Backing services as attached resources

## AGENTS.md Maintenance

This is a **living document**. Edit freely when:
- New conventions are adopted
- Content becomes outdated
- Cross-references would improve navigation
- Inconsistencies arise with the codebase

Keep the `##` / `###` hierarchy intact. Prefer moving/consolidating over removing content. Note significant changes at the end of relevant sections.
