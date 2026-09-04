# 01: Projeto Base

**O que constrói:** O projeto Spring Boot compila e inicia. Maven Wrapper funciona, dependências resolvidas, .gitignore configurado, classe principal existe.

**Bloqueado por:** Nenhum (pode iniciar imediatamente)

**Status:** ready-for-agent

**Pré-requisitos:**
- Criar/checkout branch `dev` a partir de `main`
- Criar branch `feature/backend-base-structure` a partir de `dev`

**O que entrega:**
- Branch `feature/backend-base-structure` criada e ativa
- `./mvnw compile` passa sem erros
- `./mvnw spring-boot:run` inicia e para sem erro
- Estrutura de pastas hexagonal criada (domain/application/infrastructure/interfaces)
- Todas as dependências do pom.xml resolvidas

**Critérios de aceite:**
- [ ] Branch `feature/backend-base-structure` existe e está ativa
- [ ] `./mvnw compile` retorna sucesso
- [ ] `./mvnw spring-boot:run` inicia o contexto Spring
- [ ] Estrutura de pastas segue arquitetura hexagonal
- [ ] .gitignore exclui target/, .idea/, etc.
