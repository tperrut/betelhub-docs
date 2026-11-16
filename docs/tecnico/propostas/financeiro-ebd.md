---
title: Financeiro da EBD — proposta
sidebar_label: Financeiro da EBD
sidebar_position: 2
---

# Proposta — Financeiro da EBD (entradas e saídas além das ofertas)

- **Status**: Em discussão (proposta, nenhuma decisão tomada)
- **Data**: 2026-11-15
- **Origem**: pedido para acrescentar à EBD o registro de entradas/saídas financeiras, além das ofertas das classes, com os campos `data`, `valor`, `entrada ou saída` e `descrição`
- **Relacionados**: ADR-0019, ADR-0004 e ADR-0007 (em `betelhub/docs/v2/adr/`), `docs/ddd/escola-dominical.md`, `docs/v2/PENDENCIAS.md` e `docs/architecture/c4_dynamic.mermaid` (repositório `betelhub`)

> **Como usar este documento**: ele registra o problema, o estado atual do código, as opções e as perguntas que precisam ser respondidas pelo grupo. Não é uma ADR. Quando as decisões abaixo forem fechadas, promover o resultado para uma ADR em `betelhub/docs/v2/adr/` e atualizar `PENDENCIAS.md` e a documentação DDD do módulo.

## 1. Resumo executivo

Queremos um caixa da EBD que registre **entradas e saídas manuais** (data, tipo, valor, descrição), além das **ofertas já capturadas por aula**. Hoje as ofertas vivem apenas dentro da `Aula` e não existe nenhum conceito financeiro no código.

As decisões em aberto são:

1. **Onde o código mora** — novo módulo `financas` versus algo dentro de `escola_dominical`.
2. **As ofertas entram no mesmo livro-caixa?** — consolidadas via evento, derivadas na leitura ou fora do financeiro por enquanto.
3. **Como corrigir um lançamento** — imutável com estorno, edição/exclusão ou edição com histórico.
4. **Quais campos entram no MVP** — só os quatro pedidos ou também método de pagamento e categoria.
5. **Onde a funcionalidade aparece** — menu principal (`/financeiro`) ou dentro do grupo EBD.

**Combinação recomendada (a validar)**: módulo `financas` enxuto, ofertas consolidadas via evento, lançamentos imutáveis com estorno, somente os quatro campos no MVP e entrada no menu principal.

## 2. Problema e motivação

A EBD arrecada ofertas por aula (PIX e dinheiro), mas também tem custos e receitas que não passam por uma aula: material didático, transporte, eventos, doações, reembolsos etc. Hoje não há onde registrar isso, nem como enxergar um saldo.

O pedido original:

> "Acrescentar na EBD, financeiro para registro de entradas/saídas além das ofertas das classes com (data, valor, entrada ou saída, descrição)."

O ponto central é decidir se esse registro é:

- um **caixa da EBD** (visão restrita à Escola Dominical), ou
- o embrião do **módulo Finanças**, que no futuro consolida também Cursos e Eventos.

## 3. Como está hoje

### 3.1 Ofertas

- Ficam **dentro da Aula**, em `aulas_ebd.oferta_pix` e `aulas_ebd.oferta_dinheiro` (`DECIMAL(10,2)`), criadas na migration `apps/api/src/main/resources/db/migration/V1__create_ebd_tables.sql`.
- São capturadas **apenas no cadastro da aula**: `POST /api/escola-dominical/aulas` (`RegistrarAulaComando` em `apps/api/.../escola_dominical/aplicacao/dto/AulaDtos.java`).
- `totalOferta` **não é persistido**: é calculado como `pix + dinheiro` (`Aula.totalOferta()`, `Oferta.total()`).
- **Não existe** endpoint para editar oferta nem para alterar a aula como um todo. Só existe `PATCH /aulas/{id}/status`.
- **Cancelar** uma aula mantém a linha e as ofertas no banco; ela apenas deixa de entrar nas somas do dashboard, que filtram `StatusAula.REALIZADA`.
- O dashboard (`ConsultarDashboardService`) **soma em Java** as ofertas das aulas realizadas do período. O relatório de aulas também expõe colunas PIX, Dinheiro e Total (`RelatorioService`).

### 3.2 Evento existente

Existe `AulaRegistradaEvento(aulaId, turmaId, totalOferta, ocorridoEm)`, publicado de forma **síncrona** por `RegistrarAulaService` via `ApplicationEventPublisher`.

Limitações para o financeiro:

- carrega apenas o **total**, não o split PIX/dinheiro (o C4 prevê uma linha por método);
- **não tem listener** em lugar nenhum;
- **não há evento de cancelamento/reativação** de aula;
- não carrega inquilino nem autor.

### 3.3 O que não existe

- Nenhum módulo/pacote `financas` no backend ou no frontend.
- Nenhuma tabela de lançamentos/transações.
- Nenhum conceito de receita, despesa, entrada/saída financeira no código.
- Nenhum `tenant_id`, `criado_por`, autenticação ou RLS implementados (os EBD também não têm).

### 3.4 O que a documentação já prevê

- **ADR-0019** (em `betelhub/docs/v2/adr/`): `financas` é um módulo futuro de **consolidação** de ofertas/transações; não funde as fontes, apenas agrega.
- **`docs/ddd/escola-dominical.md`**: a EBD explicitamente **não** faz consolidação financeira; "ofertas detalhadas ficam em Finanças".
- **`docs/v2/PENDENCIAS.md`**, item E: prevê `transacao_financeira` com `tipo`, `metodo`, `valor`, `fonte_id`, `tenant_id`, `criado_por`, `created_at`, recibo numerado e consolidação via eventos.
- O C4 dinâmico (`docs/architecture/c4_dynamic.mermaid`) mostra o listener de Finanças criando **duas linhas** em `transacoes_financeiras` por aula (`pix` e `dinheiro`).

**Inconsistências já detectadas**: `transacoes_financeiras` (C4) versus `transacao_financeira` (PENDENCIAS); a doc diz que ofertas detalhadas ficam em Finanças, mas o relatório de aulas já expõe PIX/dinheiro; o C4 usa colunas de EBD que não existem mais.

## 4. Restrições e princípios que devem ser respeitados

- **Fronteira de módulos**: EBD é dona da oferta; Finanças agrega. Evitar que Finanças leia tabelas internas da EBD ou que a EBD passe a consolidar finanças.
- **Dinheiro**: `BigDecimal` no backend, `DECIMAL(x,2)` no banco, `RoundingMode.HALF_UP`; `number` + `formatCurrency` no frontend.
- **Datas**: `LocalDate` para data de negócio; `Instant`/timestamps com `Clock` injetado.
- **Erros**: Bean Validation nos DTOs e `ProblemDetail` (RFC 7807) via `TratadorDeErros`.
- **Arquitetura**: módulo com `dominio`, `aplicacao/caso_de_uso`, `aplicacao/dto`, `porta/saida`, `adaptador/entrada/rest`, `adaptador/saida/persistencia` (espelhar a EBD).
- **Dívidas fora de escopo**: `tenant_id`, RLS, autenticação, `criado_por` e auditoria entram junto com o trabalho de identidade/inquilino, não neste MVP.

## 5. Decisões a tomar

> Nenhuma resposta foi registrada até o momento. As perguntas abaixo são as mesmas apresentadas na sessão de análise e ficam aqui para discussão assíncrona.

### D1 — Onde o financeiro deve morar?

| Opção | Prós | Contras |
|---|---|---|
| **A. Novo módulo `financas`** | Alinhado ao ADR-0019; serve Cursos/Eventos depois; EBD continua dona da oferta; sem retrabalho de migração | Um pouco mais de estrutura inicial |
| **B. "Caixa da EBD" dentro de `escola_dominical`** | Mais rápido; tudo junto; menos cerimônia | Mistura contextos; quando Finanças nascer, exige migrar tabela/rotas/telas; contraria a doc DDD |
| **C. Só modelar por enquanto** | Fecha ADR e modelo antes de codificar | Não entrega valor imediato |

**Recomendação**: **A**, com recorte inicial restrito à EBD.

> **Pergunta registrada**: "Onde o financeiro deve morar?"
>
> - Novo módulo `financas` (Recomendado) — cria `com.betelhub.financas` com recorte inicial só EBD; alinhado ao ADR-0019 e sem retrabalho quando Cursos/Eventos entrarem.
> - Dentro do módulo EBD — caixa da EBD junto de aulas/ofertas. Mais rápido agora, mas mistura contextos e exigirá migração depois.
> - Só modelar por enquanto — não implementar ainda; fechar ADR e modelo de dados primeiro.

### D2 — As ofertas das aulas devem aparecer no mesmo livro-caixa das entradas/saídas manuais?

| Opção | Como funciona | Prós | Contras |
|---|---|---|---|
| **A. Consolidar via evento** | Listener de `AulaRegistradaEvento` cria lançamentos derivados (`origem=OFERTA_EBD`, `fonte_id=aulaId`, um por método) | Saldo único, auditável, relatórios simples, preparado para Cursos/Eventos | Exige ampliar o evento, idempotência e tratamento de cancelamento/reativação |
| **B. Derivar na leitura** | Financeiro consulta aulas realizadas do EBD e une aos lançamentos manuais em memória | Zero duplicação; cancelamento reflete sozinho | Sem livro-caixa único; conciliação/recibo/auditoria limitados; junta duas fontes em toda leitura |
| **C. Só lançamentos manuais** | Ofertas continuam apenas no dashboard EBD; financeiro registra somente entradas/saídas digitadas | Menor esforço; entrega o pedido literal | Não responde "saldo real" da EBD; provável retrabalho |

**Recomendação**: **A**, com listener **síncrono na mesma transação** (`@EventListener`), para aula e lançamentos commitarem juntos. Async/outbox fica para quando volume/desacoplamento exigirem.

> **Pergunta registrada**: "As ofertas das aulas devem aparecer no mesmo livro-caixa das entradas/saídas manuais?"
>
> - Consolidar via evento (Recomendado) — listener síncrono cria lançamentos derivados por PIX/dinheiro com origem/fonte_id. Exige ampliar o evento e tratar cancelamento, mas dá saldo único e auditável.
> - Derivar na leitura — o financeiro lê aulas realizadas do EBD e junta com lançamentos manuais em tempo de execução. Sem duplicação, mas sem ledger único.
> - Só lançamentos manuais — ofertas continuam apenas no dashboard EBD; o financeiro registra somente entradas/saídas digitadas.

### D3 — Como corrigir um lançamento errado?

| Opção | Prós | Contras |
|---|---|---|
| **A. Imutável + estorno** | Preserva auditoria e conciliação; prática contábil | Exige campo de vínculo com o lançamento estornado e regra de UI |
| **B. Editar e excluir** | CRUD simples, menor esforço | Perde rastro do que foi lançado; dificulta conferência |
| **C. Editar com histórico** | Mantém versões | Mais complexo para o MVP |

**Recomendação**: **A**. O estorno é um novo lançamento com o tipo oposto, referenciando o original; o original vira `ESTORNADO` e não entra em saldos.

> **Pergunta registrada**: "Como corrigir um lançamento errado?"
>
> - Imutável + estorno (Recomendado) — não edita nem apaga; gera lançamento de estorno. Preserva auditoria e conciliação.
> - Editar e excluir — CRUD simples, menor esforço, porém perde rastro do que foi lançado.
> - Editar com histórico — mantém versões do lançamento; mais complexo para o MVP.

### D4 — Além de data, tipo, valor e descrição, o que entra já no MVP?

| Opção | Observação |
|---|---|
| **A. Só os 4 campos** | Exatamente o escopo pedido; método e categoria ficam para uma segunda iteração |
| **B. 4 campos + método de pagamento** | PIX/dinheiro/transferência, útil para conciliar com as ofertas |
| **C. 4 campos + categoria** | Classificação fixa de receita/despesa desde o início |
| **D. 4 campos + método + categoria** | Modelo mais completo desde já, com mais campos no formulário |

**Recomendação**: **A**. Manter o MVP enxuto e adicionar campos quando houver uso real. Se as ofertas forem consolidadas (D2-A), o `metodo` já virá nas linhas derivadas mesmo que o formulário manual não o peça.

> **Pergunta registrada**: "Além de data, tipo, valor e descrição, o que entra já no MVP?"
>
> - Só os 4 campos (Recomendado) — exatamente o escopo pedido; método e categoria ficam para uma segunda iteração.
> - 4 campos + método de pagamento — PIX/dinheiro/transferência, útil para conciliar com as ofertas.
> - 4 campos + categoria — classificação fixa de receita/despesa desde o início.
> - 4 campos + método + categoria — modelo mais completo desde já, com mais campos no formulário.

### D5 — Onde o financeiro deve aparecer na navegação?

| Opção | Prós | Contras |
|---|---|---|
| **A. Menu principal, `/financeiro`** | Visão consolidada, preparada para outros módulos | Pode parecer maior que o escopo atual |
| **B. Dentro do grupo EBD, `/ebd/financeiro`** | Deixa claro que é o caixa da Escola Dominical | Precisa mudar de lugar quando Finanças crescer |

**Recomendação**: **B** se a decisão D1 for "dentro da EBD"; **A** se D1 for o módulo `financas`. Pela recomendação de D1, usar `/financeiro`.

> **Pergunta registrada**: "Onde o financeiro deve aparecer na navegação?"
>
> - Menu principal `/financeiro` (Recomendado) — visão financeira consolidada, com as ofertas da EBD incluídas; preparado para outros módulos.
> - Dentro do grupo EBD — rota `/ebd/financeiro`, deixando explícito que é o caixa da Escola Dominical.

## 6. Modelo de dados proposto (a validar)

```
lancamento_financeiro
  id             UUID PK
  data           DATE NOT NULL             -- data de caixa/competência
  tipo           VARCHAR(10) NOT NULL      -- ENTRADA | SAIDA (enum)
  valor          DECIMAL(12,2) NOT NULL    -- sempre positivo (> 0)
  descricao      VARCHAR(255) NOT NULL
  origem         VARCHAR(20) NOT NULL      -- MANUAL | OFERTA_EBD
  fonte_id       UUID NULL                 -- aulaId quando origem = OFERTA_EBD
  metodo         VARCHAR(20) NULL          -- PIX | DINHEIRO | TRANSFERENCIA | OUTRO
  categoria      VARCHAR(40) NULL          -- somente se D4 incluir categoria
  status         VARCHAR(15) NOT NULL      -- ATIVO | ESTORNADO
  estorno_de_id  UUID NULL                 -- somente se D3 = imutável + estorno
  criado_em      TIMESTAMP NOT NULL
  atualizado_em  TIMESTAMP NOT NULL
```

Regras propostas:

- `valor > 0`; o sinal vem de `tipo`, nunca de valor negativo (`CHECK (valor > 0)`).
- `descricao` obrigatória e normalizada com `trim`.
- `data` é `LocalDate`; não há restrição de data futura no MVP.
- Lançamentos manuais não são vinculados a turma (é caixa da EBD, não por classe).
- Para ofertas consolidadas: `UNIQUE (origem, fonte_id, metodo)` parcial, garantindo idempotência; ofertas com valor zero não geram linha.
- `tenant_id` e `criado_por` **não entram agora**: nenhuma tabela do projeto os tem. Devem entrar junto com o trabalho de identidade/inquilino, sem mudança estrutural no modelo.
- Próxima migration Flyway: `V6__create_lancamento_financeiro.sql`.

## 7. API e interface propostas (a validar)

Backend (`/api/financas`):

- `POST /lancamentos` — `{ data, tipo, valor, descricao, metodo?, categoria? }`
- `GET /lancamentos?inicio=&fim=&tipo=` — lista no padrão atual (sem paginação)
- `GET /resumo?inicio=&fim=` — `totalEntradas`, `totalSaidas`, `saldo`, quebra por origem/dia
- `POST /lancamentos/{id}/estorno` — se D3 = imutável + estorno

Frontend (`src/modules/financas/`):

- Página com cards **Entradas**, **Saídas** e **Saldo** do período.
- Filtro por período e tipo.
- Tabela via `DataView` com data, descrição, origem, tipo e valor.
- Dialog "Novo lançamento" com toggle Entrada/Saída.
- Se ofertas consolidadas, a mesma lista mostra `origem = Oferta EBD`; não haverá tela separada de ofertas no financeiro.
- Nova entrada no `AppShell` e rota no `App.tsx` conforme D5.

## 8. Riscos e pontos de atenção

1. **Fonte da verdade duplicada**: dashboard EBD e relatório continuam somando de `Aula`; o financeiro teria outra agregação. Definir explicitamente que o dashboard EBD permanece como está no MVP e o financeiro é a consolidação.
2. **Cancelamento/reativação de aula**: com D2-A é preciso estornar/reativar as linhas derivadas. Hoje não existe evento de mudança de status; será necessário criar um (`AulaStatusAlteradoEvento`) ou chamar um caso de uso público de Finanças.
3. **Edição de oferta**: não existe hoje. Se existir no futuro, o ledger precisa de upsert/estorno.
4. **Atomicidade**: listener síncrono garante consistência, mas acopla o cadastro da aula ao financeiro. Async exigiria outbox/idempotência.
5. **Semântica de saldo**: saldo do período versus saldo acumulado; decidir antes da tela.
6. **Sem paginação**: listas grandes de lançamentos podem exigir paginação (hoje o projeto não tem paginação em nenhum endpoint).
7. **Divergência de nomenclatura**: escolher `lancamento_financeiro` (proposto) ou alinhar com `transacao_financeira`/`transacoes_financeiras` da documentação antiga.
8. **Multi-inquilino e autoria**: adiados; registrar como dívida e planejar a migration de `tenant_id`/`criado_por` junto com auth.

## 9. Impacto se aprovado

| Camada | Mudanças |
|---|---|
| **Banco** | Migration `V6` com `lancamento_financeiro`, constraints, índices e (se D2-A) índice único parcial por origem/fonte/método |
| **Backend** | Novo pacote `com.betelhub.financas` (domínio, casos de uso, DTOs, porta, adaptador REST e JPA); ampliação de `AulaRegistradaEvento`; listener; evento de status de aula; testes unitários |
| **Frontend** | Novo `src/modules/financas` (api/hooks/types/pages), rota, item de menu, handlers MSW e mocks do Playwright |
| **E2E** | Novo spec de lançamentos e extensão do `real-flow` se a consolidação de ofertas for usada |
| **Docs** | Promover esta proposta a ADR; criar `docs/ddd/financas.md`; atualizar `escola-dominical.md`, `PENDENCIAS.md` e o C4 |
| **Fora de escopo** | `tenant_id`, RLS, autenticação, auditoria, recibos numerados, categorias (se D4 = A) |

## 10. Próximos passos sugeridos

1. Responder às cinco decisões (D1–D5) com o grupo.
2. Fechar as questões secundárias: saldo do período ou acumulado; exportação CSV/PDF; vínculo com turma; comportamento de ofertas ao cancelar aula.
3. Transformar as respostas em ADR (proposta: `ADR-0024 — Finanças: lançamentos e consolidação de ofertas`).
4. Implementar na ordem: domínio e migration → caso de uso manual → API → tela → consolidação de ofertas → testes.
5. Atualizar `PENDENCIAS.md` marcando o item E de Finanças.

## 11. Registro de decisões

Preencher conforme o grupo decidir.

| ID | Decisão | Data | Responsável | Status |
|---|---|---|---|---|
| D1 | Onde o financeiro mora | — | — | Em aberto |
| D2 | Ofertas no livro-caixa | — | — | Em aberto |
| D3 | Correção de lançamento | — | — | Em aberto |
| D4 | Campos do MVP | — | — | Em aberto |
| D5 | Menu e rota | — | — | Em aberto |

## 12. Questões secundárias (não bloqueiam o MVP)

- Ofertas de aula cancelada devem gerar estorno automático ou apenas sair do saldo?
- O saldo exibido é do período selecionado, acumulado até a data, ou ambos?
- Lançamentos precisam de exportação CSV/PDF como os relatórios da EBD?
- Algum lançamento deve ser vinculado a turma ou a evento específico?
- Categorias de receita/despesa são necessárias já no primeiro uso real?
- Quem pode criar/estornar lançamentos (perfis/permissões) quando a autenticação existir?
