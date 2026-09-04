# 02: Company Domain + Persistência

**O que constrói:** A entidade Company existe no domínio, o banco de dados cria a tabela via Flyway, e o repositório JPA funciona com soft delete.

**Bloqueado por:** 01 (Projeto Base)

**Status:** ready-for-agent

**O que entrega:**
- Tabela `companies` criada no PostgreSQL via Flyway migration
- Entidade de domínio `Company` com campos: id, nome, cnpj, ativa, deletadoEm
- Porta `ICompanyRepository` no domínio (independente de JPA)
- Implementação JPA `CompanyRepository` com soft delete
- Mapper entre entidade de domínio e entidade JPA

**Critérios de aceite:**
- [ ] Migration V1 cria tabela `companies` com BIGINT auto-increment
- [ ] `ICompanyRepository` não importa de Spring nem JPA
- [ ] `CompanyRepository` implementa `ICompanyRepository`
- [ ] Soft delete: `deletadoEm` é preenchido ao invés de deletar registro
- [ ] `./mvnw compile` continua passando
