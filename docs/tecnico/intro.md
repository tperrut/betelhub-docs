---
slug: /
title: Documentação técnica
sidebar_position: 1
---

# Documentação técnica

Esta frente reúne a visão de implementação do Betelhub: arquitetura, modelo de
dados, DDD, API, frontend, operação e testes.

:::note[Escopo]
Cobrimos apenas o que está implementado hoje: os módulos **Membros** e
**Escola Dominical (EBD)**.
:::

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Java 25 + Spring Boot 4.1 + Spring Modulith |
| Banco | PostgreSQL 17 + Flyway |
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui + TanStack Query |
| Relatórios | CSV (UTF-8/BOM) + OpenPDF |
| Testes | JUnit 5 (backend) + Vitest/Playwright (frontend) |
| Infra local | Docker Compose |

## Módulos implementados

| Módulo | Estilo |
|---|---|
| `membro` | Camada fina (com value objects) |
| `escola_dominical` | Hexagonal completo |

Os demais módulos (`identidade`, `inquilino`, `eventos`, `cursos`, `pastoral`,
`financas`, `notificacoes`) ainda são planejados.

## Por onde começar

- [Arquitetura](./arquitetura.md) — monorepo, backend, banco e modelo de dados.
- [DDD](./ddd/intro.md) — conceitos, Membros e Escola Dominical.
- [API REST](./api.md) — índice dos endpoints por recurso.
- [Frontend](./frontend.md) — organização do código e rotas.
- [Rodar localmente](./operacao/rodando-local.md) e [Testes](./operacao/testes.md).
