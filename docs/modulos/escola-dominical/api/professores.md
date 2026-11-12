---
title: API
sidebar_position: 1
---

# API — Professores

Tela: [Professores](../professores.md)

## Endpoints

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/professores` |
| `GET` | `/api/escola-dominical/professores` |
| `PATCH` | `/api/escola-dominical/professores/{id}/status` |

## Criar professor

```http
POST /api/escola-dominical/professores
Content-Type: application/json

{
  "nome": "Pr. Ana Paula",
  "membroId": null
}
```

`membroId` é opcional (professor externo).

## Alterar status

```http
PATCH /api/escola-dominical/professores/{id}/status
Content-Type: application/json

{ "status": "INATIVO" }
```

`status`: `ATIVO` ou `INATIVO`.
