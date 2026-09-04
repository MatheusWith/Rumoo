## Problem Statement

O projeto Rumoo não possui nenhuma estrutura de código backend. É um projeto greenfield com apenas documentação de planejamento (`AGENTS.md` e `fluxo.md`). O usuário precisa de uma base sólida e bem estruturada para começar o desenvolvimento, seguindo a arquitetura hexagonal definida no projeto.

## Solution

Criar a estrutura base completa do backend Spring Boot com:
- Arquitetura hexagonal limpa (domain/application/infrastructure/interfaces)
- Entidade Company simplificada como validação da estrutura
- Configuração PostgreSQL com Flyway para migrations
- Testes de integração com Testcontainers
- Profiles de configuração para diferentes ambientes
- CRUD completo com soft delete e tratamento de erros

## User Stories

1. As a developer, I want a well-organized hexagonal architecture structure, so that the codebase remains maintainable as it grows
2. As a developer, I want a Company entity with basic fields (id, nome, cnpj, ativa), so that I can validate the domain layer works correctly
3. As a developer, I want soft delete on Company, so that historical data is preserved
4. As a developer, I want a CompanyRepository port (interface) in the domain layer, so that the domain is independent of infrastructure
5. As a developer, I want a CompanyRepository implementation in the infrastructure layer, so that persistence is properly abstracted
6. As a developer, I want CompanyRequest and CompanyResponse DTOs, so that the API contract is clean and validated
7. As a developer, I want a CompanyService with CRUD use cases, so that business logic is separated from infrastructure
8. As a developer, I want a CompanyController with REST endpoints, so that the API is accessible via HTTP
9. As a developer, I want a GlobalExceptionHandler, so that errors are handled consistently across the API
10. As a developer, I want Flyway migrations, so that database schema changes are versioned and repeatable
11. As a developer, I want PostgreSQL configuration, so that the database is properly set up
12. As a developer, I want multiple Spring profiles (local, dev, prod), so that configuration is environment-specific
13. As a developer, I want Testcontainers for integration tests, so that tests run against a real database
14. As a developer, I want Lombok, so that boilerplate code is minimized
15. As a developer, I want Jakarta Validation on DTOs, so that input is validated at the API layer
16. As a developer, I want BIGINT auto-increment IDs, so that entity identification is simple and efficient
17. As a developer, I want a paginated list endpoint for Company, so that large datasets can be handled
18. As a developer, I want Maven Wrapper included, so that the build is reproducible across environments
19. As a developer, I want a proper .gitignore, so that build artifacts and IDE files are not committed
20. As a developer, I want the domain layer to have zero infrastructure dependencies, so that business logic remains pure and testable
21. As a developer, I want a CompanyMapper to convert between domain and persistence entities, so that layers are properly decoupled
22. As a developer, I want application.yml as base configuration, so that common settings are shared across environments
23. As a developer, I want application-local.yml for local development, so that I can run the app locally without affecting other environments
24. As a developer, I want application-dev.yml for development environment, so that dev-specific settings are isolated
25. As a developer, I want application-prod.yml for production, so that production settings are managed separately
26. As a developer, I want Spring Boot 4.1.0 with Java 21, so that I have access to modern language features and framework capabilities
27. As a developer, I want the package base to be `com.rumo`, so that the project follows consistent naming conventions
28. As a developer, I want a RumooApplication main class, so that the Spring Boot application can be started
29. As a developer, I want a CompanyServiceTest with integration tests, so that the service layer is verified against a real database
30. As a developer, I want a RumooApplicationTests to verify context loads, so that Spring configuration is valid

## Implementation Decisions

### Architecture
- **Hexagonal Architecture** with strict layer separation: domain → application → infrastructure → interfaces
- **Domain layer** has zero external dependencies (no Spring, no JPA annotations)
- **Infrastructure layer** implements domain ports (adapters pattern)
- **Interfaces layer** handles HTTP concerns (REST controllers, exception handling)

### Domain Model
- **Company entity** (simplified): id (Long), nome (String), cnpj (String), ativa (Boolean), deletadoEm (LocalDateTime for soft delete)
- **ICompanyRepository** port in domain layer defines persistence contract
- **BIGINT auto-increment** for ID generation (not UUID)

### API Design
- **REST endpoints** under `/api/v1/companies`
- **CRUD operations**: POST, GET /{id}, GET (paginated), PUT, DELETE (soft)
- **Soft delete** preserves historical data
- **Jakarta Validation** on DTOs for input validation
- **GlobalExceptionHandler** for consistent error responses

### Infrastructure
- **PostgreSQL 17** as primary database
- **Flyway** for database migrations (versioned schema changes)
- **Testcontainers** for integration tests with real PostgreSQL
- **Lombok** for boilerplate reduction

### Configuration
- **4 profiles**: application.yml (base), application-local.yml, application-dev.yml, application-prod.yml
- **Database name**: `rumoo`
- **Maven** as build tool with Maven Wrapper

### Dependencies
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-validation
- postgresql
- flyway-core + flyway-database-postgresql
- lombok
- spring-boot-starter-test
- testcontainers (junit-jupiter + postgresql)

## Testing Decisions

### Testing Philosophy
- **Test external behavior**, not implementation details
- **Integration tests** preferred over unit tests for service and repository layers
- **Testcontainers** provides real PostgreSQL for reliable testing

### Test Seam Locations
1. **CompanyServiceTest** — Tests use cases by mocking ICompanyRepository port (highest seam in application layer)
2. **CompanyRepositoryTest** — Tests persistence against real PostgreSQL via Testcontainers (infrastructure layer seam)
3. **CompanyControllerTest** — Tests REST endpoints with MockMvc + Testcontainers (interfaces layer seam)
4. **RumooApplicationTests** — Verifies Spring context loads correctly (application boot seam)

### Prior Art
- No existing tests in codebase (greenfield project)
- Follows Spring Boot testing conventions with @SpringBootTest, @DataJpaTest, @WebMvcTest

## Out of Scope

- Authentication/Keycloak integration (deferred to future iteration)
- Other domain entities (Pessoa, Time, Meta, Atividade)
- Frontend implementation
- Docker Compose configuration
- CI/CD pipeline setup
- API documentation (SpringDoc/OpenAPI)
- Mapping libraries beyond Lombok (MapStruct, etc.)
- Caching layer
- Event-driven architecture
- Internationalization (i18n)

## Further Notes

### Domain Glossary (from fluxo.md)
- **Empresa (Company)**: Organização que utiliza o sistema. Totalmente isolada de outras empresas.
- **Pessoa (Collaborator)**: Usuário cadastrado dentro de uma empresa.
- **Time (Team)**: Agrupamento de pessoas dentro de uma empresa.
- **Meta (Goal)**: Objetivo estratégico com título, descrição, período de validade e pontuação.
- **Atividade (Activity)**: Tarefa atribuída a uma pessoa ou time.

### Next Steps After This Spec
1. Implement the backend base structure as specified
2. Create CONTEXT.md with domain glossary
3. Plan subsequent features (Pessoa entity, Team entity, etc.)
