---
title: Conceitos
sidebar_position: 1
---

# DDD no Betelhub

O projeto aplica **Domain-Driven Design** para separar contextos, nomear o domínio
em português e manter as regras no lugar certo. Cada módulo tem um estudo próprio
(dentro do possível, considerando o que já está implementado).

## Contextos implementados

| Módulo | Estilo | Estudo |
|---|---|---|
| **Escola Dominical (EBD)** | Hexagonal completo | [EBD](./escola-dominical.md) |
| **Membros** | Camada fina (com value objects) | [Membros](./membros.md) |

Os demais módulos (`identidade`, `inquilino`, `eventos`, `cursos`, `pastoral`,
`financas`, `notificacoes`) ainda são planejados e não têm modelagem implementada.

## Convenções do estudo

- **Agregado** protege invariantes; **value object** é imutável (record quando fizer sentido).
- **Entidade JPA** é detalhe de persistência: fica no adaptador; o domínio não depende de Spring/JPA.
- **Identidade** é gerada no domínio (factory), não no repositório/adaptador.
- **Tempo** vem de `Clock` injetado (nada de `now()` escondido no domínio).
- **Fronteira**: domínio não importa Spring/JPA; aplicação depende de portas; adaptadores implementam portas.
- **Eventos de domínio** são records publicados via Spring Modulith para integrar módulos.
- Erros de entrada → Bean Validation; erros de regra → exceções de domínio traduzidas para `ProblemDetail` (RFC 7807).
- **Português** nos termos de domínio e pacotes (`dominio`, `aplicacao`, `porta`, `adaptador`).

## Relação com a arquitetura

- Monolito modular com *bounded contexts* — veja [Arquitetura](../arquitetura.md).
- Diagramas de entidades e classes — veja [Modelo de dados](../arquitetura.md#modelo-de-dados).
- Decisões registradas em ADRs no repositório `betelhub` (`docs/v2/adr/`), principalmente:
  - **ADR-0002** — monolito modular
  - **ADR-0004** — arquitetura interna dos módulos
  - **ADR-0019** — módulos, núcleo compartilhado e isolamento
  - **ADR-0007** — contrato REST/OpenAPI e erros (RFC 7807)
  - **ADR-0015** — estratégia de testes
