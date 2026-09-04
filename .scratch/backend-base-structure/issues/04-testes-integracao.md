# 04: Testes de Integração

**O que constrói:** A Company passa por testes automatizados que validam o comportamento completo usando um banco real via Testcontainers.

**Bloqueado por:** 03 (Company API REST)

**Status:** ready-for-agent

**O que entrega:**
- `RumooApplicationTests` verifica contexto Spring
- `CompanyServiceTest` testa casos de uso com mock do repositório
- `CompanyRepositoryTest` testa persistência com PostgreSQL real
- `CompanyControllerTest` testa endpoints com MockMvc

**Critérios de aceite:**
- [ ] `./mvnw test` passa com todos os testes
- [ ] `RumooApplicationTests` verifica contexto carrega
- [ ] `CompanyServiceTest` testa criar, buscar, listar, atualizar, deletar
- [ ] `CompanyRepositoryTest` usa Testcontainers PostgreSQL
- [ ] `CompanyControllerTest` testa todos os endpoints REST
