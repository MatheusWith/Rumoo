# 03: Company API REST

**O que constrói:** O endpoint CRUD de Company funciona. É possível criar, listar, buscar, atualizar e "deletar" uma empresa via HTTP.

**Bloqueado por:** 02 (Company Domain + Persistência)

**Status:** ready-for-agent

**O que entrega:**
- DTOs `CompanyRequest` (entrada) e `CompanyResponse` (saída) com validações Jakarta
- `CompanyService` com casos de uso CRUD
- `CompanyController` com endpoints REST em `/api/v1/companies`
- `GlobalExceptionHandler` para erros padronizados
- Profiles de configuração (local, dev, prod)

**Critérios de aceite:**
- [ ] `POST /api/v1/companies` cria uma empresa (retorna 201)
- [ ] `GET /api/v1/companies/{id}` busca por ID (retorna 200)
- [ ] `GET /api/v1/companies` lista paginado (retorna 200)
- [ ] `PUT /api/v1/companies/{id}` atualiza (retorna 200)
- [ ] `DELETE /api/v1/companies/{id}` faz soft delete (retorna 204)
- [ ] Validação: `POST` com campos obrigatórios vazios retorna 400
- [ ] Erros retornam resposta padronizada via GlobalExceptionHandler
