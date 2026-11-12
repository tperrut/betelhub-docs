---
slug: /
title: Visão geral
sidebar_position: 1
---

# Betelhub

O **Betelhub** é um SaaS multi-inquilino para gestão de igrejas (membros, EBD,
eventos, finanças, pastoral e muito mais). Esta documentação cobre **apenas o que
já está implementado** hoje no repositório: o piloto dos módulos **Membros** e
**Escola Dominical (EBD)** e o frontend que consome essa API.

:::caution[Projeto em desenvolvimento]
Este é o estado atual do piloto (V2). Módulos como `identidade`, `inquilino`,
`eventos`, `cursos`, `pastoral`, `financas` e `notificacoes` já existem como
pacotes no backend, mas **ainda não têm implementação funcional**. Consulte
[Arquitetura](./arquitetura.md) para o status de cada um.
:::

## O que está funcionando

| Área | O que existe |
|---|---|
| **Membros** | Cadastro completo (dados pessoais, contato, documentos, endereço, família) com listagem, edição e alteração de status. |
| **EBD** | Turmas, professores, matrículas/alunos, aulas, chamada (presenças), dashboard com filtros e relatórios em CSV/PDF. |
| **Frontend** | SPA React com telas de Dashboard da igreja, Membros, EBD, Turmas, Professores, Alunos, Chamada, Aulas e Relatórios. |
| **Banco** | PostgreSQL com migrações Flyway (`V1` a `V5`). |
| **Qualidade** | Testes de domínio no backend e testes E2E (Playwright) no frontend. |

## Stack

- **Backend**: Java 25 + Spring Boot 4.1 + Spring Modulith (monolito modular)
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui + TanStack Query
- **Banco**: PostgreSQL 17 + Flyway
- **Relatórios**: CSV (UTF-8/BOM) + OpenPDF
- **Testes**: JUnit 5 no backend, Vitest + Playwright no frontend
- **Infra local**: Docker Compose

## Por onde começar

- [Arquitetura](./arquitetura.md) — como o monorepo e os módulos estão organizados.
- [DDD](./ddd/intro.md) — como o domínio é modelado por módulo.
- [Módulo Membros](./modulos/membros/visao-geral.md) — cadastro completo de membros.
- [Módulo Escola Dominical](./modulos/escola-dominical/visao-geral.md) — o fluxo do piloto EBD.
- [API REST](./api.md) — endpoints expostos hoje.
- [Como rodar localmente](./rodando-local.md) — subir API, banco e frontend.
