---
title: API REST
sidebar_position: 1
---

# API REST

A API roda em `http://localhost:8081/api` no ambiente local. Os controllers já
usam o prefixo `/api/...` (não configure `context-path`).

- Health check: `GET http://localhost:8081/actuator/health`
- Erros seguem o formato `ProblemDetail` (RFC 7807).

:::tip[API por tela]
Cada tela tem sua própria página de **API** no submenu lateral. Use os atalhos abaixo.
:::

## Membros

- [Dashboard da igreja](./modulos/membros/api/dashboard-igreja.md)
- [Listagem de membros](./modulos/membros/api/listagem.md)
- [Cadastro e edição](./modulos/membros/api/cadastro-edicao.md)

## Escola Dominical (EBD)

- [Dashboard EBD](./modulos/escola-dominical/api/dashboard.md)
- [Turmas](./modulos/escola-dominical/api/turmas.md)
- [Professores](./modulos/escola-dominical/api/professores.md)
- [Alunos e matrículas](./modulos/escola-dominical/api/alunos.md)
- [Chamada e presenças](./modulos/escola-dominical/api/chamada.md)
- [Aulas](./modulos/escola-dominical/api/aulas.md)
- [Relatórios](./modulos/escola-dominical/api/relatorios.md)

## Collections HTTP (Bruno)

O fluxo completo está em `collections/escola-dominical/`, com ambientes em
`collections/escola-dominical/environments/Local.bru`. Importe a pasta no
[Bruno](https://www.usebruno.com/) para testar os endpoints.

Também há a collection `collections/membros/` com o CRUD de membros.
