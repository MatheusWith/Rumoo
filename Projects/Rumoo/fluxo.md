# Documentação Completa dos Fluxos e Modelo de Domínio do Sistema de Gestão

Este documento apresenta a estrutura operacional, os fluxos e o modelo de domínio do sistema de forma totalmente conceitual, descrevendo como cada processo funciona na prática, sem o uso de termos técnicos de programação ou nomenclaturas de banco de dados.

---

## Modelo de Domínio (Glossário)

### Entidades Centrais

- **Empresa (Company):** Organização que utiliza o sistema. Totalmente isolada de outras empresas.
- **Pessoa (Collaborator):** Usuário cadastrado dentro de uma empresa. Pode estar **ativa** (recebe metas e atividades) ou **inativa** (histórico preservado, sem novas atribuições).
- **Time (Team):** Agrupamento de pessoas dentro de uma empresa. Cada pessoa pertence a apenas um time por empresa. "Grupo" e "equipe" são sinônimos informais — usar apenas **Time**.
- **Meta (Goal):** Objetivo estratégico com título, descrição, período de validade e pontuação. Pode ser visível para a empresa inteira, um time específico ou uma pessoa.
- **Atividade (Activity):** Tarefa atribuída a uma pessoa ou time, vinculada opcionalmente a uma Meta. Cada atividade concluída soma pontos à meta vinculada.

### Relacionamentos

- **Empresa** contém muitos **Times**
- **Time** contém muitas **Pessoas** (1 pessoa = 1 time por empresa)
- **Meta** pertence à **Empresa**, tem escopo de visibilidade, pode conter muitas **Atividades**
- **Atividade** pertence à **Empresa**, pode estar vinculada a uma **Meta**, atribuída a uma **Pessoa** ou **Time**

### Termos-chave

- **Atribuição:** a pessoa ou time que executa a atividade
- **Permissão:** quem pode marcar a atividade como concluída (pode ser diferente de quem executa)
- **Ticket de Redenção:** solicitação do colaborador ao gerente para reavaliação de atividade não concluída em meta encerrada
- **Pontuação:** valor numérico associado a uma meta, somado proporcionalmente pelas atividades concluídas

---

## 1. Fluxo de Configuração e Estrutura Inicial (Gerente)

Responsável por estruturar a empresa dentro do sistema antes de iniciar a operação diária.

### 1.1 Cadastro de Pessoas

* O gerente cadastra os colaboradores que farão parte da organização.
* Cada pessoa nova é inserida automaticamente no ambiente daquela empresa específica.
* Pessoas saídas da empresa são marcadas como **inativas**: não recebem novas metas, mas todo o histórico é preservado como registro.

### 1.2 Criação de Times

* O gerente organiza os colaboradores em **times** (equipes ou departamentos).
* É o momento de agrupar as pessoas que trabalharão juntas e definir quem lidera cada time.
* Cada pessoa pode pertencer a apenas um time por empresa.

### 1.3 Definição de Papéis e Permissões

* O sistema possui **papéis predefinidos** (ex: Admin, Manager, Collaborator) que facilitam a atribuição de grupos de permissões.
* Papéis servem como um atalho para concessão de permissões — não substituem o controle baseado em atributos (ABAC).
* O gerente configura quais permissões cada pessoa ou grupo de colaboradores terá dentro da plataforma.

---

## 2. Fluxo de Planejamento de Metas (Estratégico)

Define os objetivos de longo, médio e curto prazo da empresa (anuais, mensais ou diárias).

### 2.1 Criação da Meta

1. O gerente preenche as informações principais da meta (título, descrição e o período de validade).
2. O gerente define o **alcance da visão** (visibilidade): quem poderá enxergar essa meta — pode ser a empresa inteira (`EMPRESA_INTEIRA`), equipes específicas (`TIME_ESPECIFICO`) ou apenas uma pessoa (`PESSOAL`).
3. O gerente define a **pontuação**: quanto vale atingir essa meta, servindo para medir o progresso e a produtividade.

### 2.2 Vinculação com Atividades

* Atividades podem ser vinculadas a uma meta.
* Cada atividade concluída dentro de uma meta soma pontos proporcionalmente ao progresso da meta.
* Meta sem atividades vinculadas = meta estratégica sem execução detalhada.

### 2.3 Encerramento da Meta

* Quando o período de validade expira, a meta entra no status `ENCERRADA`.
* Atividades vinculadas que não foram concluídas são marcadas como `NÃO_ATINGIDA`.
* Pontuação parcial é calculada automaticamente com base nas atividades concluídas.
* **Tentativa de Redenção**: O colaborador pode enviar um **ticket de redenção** ao gerente para justificar atividades não concluídas ou solicitar reavaliação. O gerente decide se aceita ou rejeita o ticket.

---

## 3. Fluxo de Operação e Execução de Atividades (Diário)

Trata do dia a dia da operação, conectando as tarefas simples às grandes metas.

### 3.1 Status de Atividade

Uma atividade pode estar em um dos seguintes status:

| Status | Descrição |
|--------|-----------|
| `PENDENTE` | Criada, aguardando início |
| `EM_ANDAMENTO` | Em execução pelo colaborador |
| `CONCLUIDA` | Finalizada com sucesso |
| `BLOQUEADA` | Impedimento controlado pelo gerente (ex: falta de recurso, dependência externa) |
| `NÃO_ATINGIDA` | Vinculada a meta encerrada sem conclusão |

### 3.2 Distribuição de Atividades

1. O gerente cria uma nova atividade.
2. O gerente define a **visibilidade** da atividade: `EMPRESA_INTEIRA`, `TIME_ESPECIFICO` ou `PESSOAL`.
3. O gerente **atribui** a atividade a um colaborador específico, a um time inteiro ou a um grupo de pessoas.
4. O gerente define quem terá a **permissão** de marcar essa atividade como finalizada (pode ser o próprio colaborador, um líder de time, ou o gerente).

### 3.3 Execução e Conclusão

1. O colaborador acessa o sistema e consegue visualizar apenas as atividades que foram liberadas para o seu escopo (conforme sua visibilidade e atribuição).
2. O colaborador executa a tarefa e altera o status para `EM_ANDAMENTO`.
3. Quando finalizada, o colaborador (ou quem tenha permissão) altera o status para `CONCLUIDA`.
4. Caso exista impedimento, o gerente pode alterar o status para `BLOQUEADA`.

---

## 4. Fluxo de Visibilidade e Acompanhamento

Define como o progresso é exibido e monitorado.

### 4.1 Visibilidade (escopo de visualização)

Cada item (meta ou atividade) possui uma **visibilidade** que define quem pode enxergá-lo:

| Visibilidade | Quem vê |
|--------------|---------|
| `EMPRESA_INTEIRA` | Todos os colaboradores da empresa |
| `TIME_ESPECIFICO` | Apenas membros do time designado |
| `PESSOAL` | Apenas o colaborador atribuído |

* O sistema garante que os dados de uma empresa fiquem totalmente isolados e nunca se misturem com os de outra organização.
* O que cada usuário enxerga na tela muda conforme a sua posição: o gerente tem uma visão global de toda a empresa, enquanto o colaborador enxerga apenas o que é público (`EMPRESA_INTEIRA`), o que pertence ao seu time (`TIME_ESPECIFICO`) ou as suas próprias tarefas (`PESSOAL`).

### 4.2 Histórico de Conclusão

* Ao consultar uma meta ou atividade finalizada, o sistema mostra quem realizou a conclusão, respeitando sempre as regras de visibilidade e o nível de permissão permitido para quem está olhando.

---

## 5. Fluxo de Segurança e Validação de Acesso

Ocorre em segundo plano em todas as ações executadas no sistema.

### 5.1 Verificação de Pertencimento

* O sistema sempre valida se a pessoa que está tentando acessar um dado pertence realmente àquela empresa.

### 5.2 Controle Baseado em Atributos (ABAC)

* Antes de permitir qualquer ação, o sistema avalia:
  - **Papel do usuário** (role): Admin, Manager, Collaborator
  - **Propriedade do recurso**: a quem pertence (empresa, time, pessoa)
  - **Ação solicitada**: visualizar, criar, editar, concluir, excluir
  - **Contexto**: tempo, local, condições específicas
* **Papéis** (roles) servem como facilitadores para atribuição de grupos de permissões, mas a decisão final é sempre dinâmica com base nos atributos acima.
* Exemplo: um líder de time pode concluir apenas atividades do seu time, não de outros times.

### 5.3 Exemplos de Regras ABAC

| Papel | Ação | Recurso | Restrição |
|-------|------|---------|-----------|
| Admin | Qualquer | Qualquer | Acesso total |
| Manager | Criar meta | Meta | Apenas sua empresa |
| Manager | Concluir atividade | Atividade | Apenas do seu time |
| Collaborator | Concluir atividade | Atividade | Apenas as que lhe foram atribuídas |
| Collaborator | Visualizar meta | Meta | Apenas visibilidade `EMPRESA_INTEIRA` ou `TIME_ESPECIFICO` do seu time |
