---
title: API
sidebar_position: 1
---

# API — Turmas

Tela: [Turmas](../turmas.md)

## Endpoints

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/turmas` |
| `GET` | `/api/escola-dominical/turmas` |
| `PATCH` | `/api/escola-dominical/turmas/{id}/status` |
| `GET` | `/api/escola-dominical/turmas/{id}/alunos` |
| `POST` | `/api/escola-dominical/turmas/{id}/professores` |
| `DELETE` | `/api/escola-dominical/turmas/{id}/professores/{professorId}` |

## Criar turma

```http
POST /api/escola-dominical/turmas
Content-Type: application/json

{
  "nome": "Adultos",
  "faixaEtaria": "30+"
}
```

## Adicionar professor à turma

```http
POST /api/escola-dominical/turmas/{id}/professores
Content-Type: application/json

{
  "professorId": "uuid-do-professor",
  "papel": "RESPONSAVEL"
}
```

`papel`: `RESPONSAVEL` ou `AUXILIAR`.

## Alterar status

```http
PATCH /api/escola-dominical/turmas/{id}/status
Content-Type: application/json

{ "status": "INATIVA" }
```

`status`: `ATIVA` ou `INATIVA`.

## Alunos da turma

```http
GET /api/escola-dominical/turmas/{id}/alunos
```
