---
title: API
sidebar_position: 1
---

# API — Alunos e Matrículas

Tela: [Alunos](../alunos.md)

## Endpoints

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/matriculas` |
| `GET` | `/api/escola-dominical/matriculas?turmaId={turmaId}` |
| `PATCH` | `/api/escola-dominical/matriculas/{id}/status` |
| `GET` | `/api/escola-dominical/turmas/{id}/alunos` |

## Matricular aluno

```http
POST /api/escola-dominical/matriculas
Content-Type: application/json

{
  "membroId": "uuid-do-membro",
  "turmaId": "uuid-da-turma"
}
```

## Listar matrículas

```http
GET /api/escola-dominical/matriculas?turmaId={turmaId}
```

## Alterar status da matrícula

```http
PATCH /api/escola-dominical/matriculas/{id}/status
Content-Type: application/json

{ "status": "TRANCADA" }
```

`status`: `ATIVA`, `TRANCADA` ou `ENCERRADA`.
