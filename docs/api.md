---
title: API REST
sidebar_position: 1
---

# API REST

A API roda em `http://localhost:8081/api` no ambiente local. Os controllers já
usam o prefixo `/api/...` (não configure `context-path`).

- Health check: `GET http://localhost:8081/actuator/health`
- Erros seguem o formato `ProblemDetail` (RFC 7807).

## Endpoints implementados

### Membros

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/membros` | Cadastra membro |
| `GET` | `/api/membros` | Lista membros |
| `GET` | `/api/membros/{id}` | Detalha membro |
| `PUT` | `/api/membros/{id}` | Atualiza membro |
| `PATCH` | `/api/membros/{id}/status` | Altera status |
| `GET` | `/api/igreja/dashboard` | Dashboard da igreja |

### EBD — Turmas

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/turmas` |
| `GET` | `/api/escola-dominical/turmas` |
| `PATCH` | `/api/escola-dominical/turmas/{id}/status` |
| `GET` | `/api/escola-dominical/turmas/{id}/alunos` |
| `POST` | `/api/escola-dominical/turmas/{id}/professores` |
| `DELETE` | `/api/escola-dominical/turmas/{id}/professores/{professorId}` |

### EBD — Professores

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/professores` |
| `GET` | `/api/escola-dominical/professores` |
| `PATCH` | `/api/escola-dominical/professores/{id}/status` |

### EBD — Matrículas

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/matriculas` |
| `GET` | `/api/escola-dominical/matriculas?turmaId={turmaId}` |
| `PATCH` | `/api/escola-dominical/matriculas/{id}/status` |

### EBD — Aulas e presenças

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/aulas` |
| `GET` | `/api/escola-dominical/aulas?turmaId={turmaId}` |
| `GET` | `/api/escola-dominical/aulas/{id}` |
| `PATCH` | `/api/escola-dominical/aulas/{id}/status` |
| `GET` | `/api/escola-dominical/aulas/{id}/chamada` |
| `PUT` | `/api/escola-dominical/aulas/{id}/chamada` |
| `PUT` | `/api/escola-dominical/aulas/{id}/presencas` |
| `POST` | `/api/escola-dominical/aulas/{id}/presencas` |
| `PATCH` | `/api/escola-dominical/aulas/{id}/presencas/{presencaId}` |
| `DELETE` | `/api/escola-dominical/aulas/{id}/presencas/{presencaId}` |

### EBD — Dashboard e relatórios

| Método | Rota |
|---|---|
| `GET` | `/api/escola-dominical/dashboard?periodo=MENSAL&dataReferencia=2026-11-08` |
| `GET` | `/api/escola-dominical/relatorios/{tipo}.csv?turmaId=&dataInicio=&dataFim=` |
| `GET` | `/api/escola-dominical/relatorios/{tipo}.pdf?turmaId=&dataInicio=&dataFim=` |

## Collections HTTP (Bruno)

O fluxo completo está em `collections/escola-dominical/`, com ambientes em
`collections/escola-dominical/environments/Local.bru`. Importe a pasta no
[Bruno](https://www.usebruno.com/) para testar os endpoints.

Também há a collection `collections/membros/` com o CRUD de membros.
