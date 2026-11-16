---
title: API
sidebar_position: 1
---

# API — Listagem de membros

Tela: [Listagem de membros](/negocio/modulos/membros/listagem)

## Endpoints

| Método | Rota |
|---|---|
| `GET` | `/api/membros` |
| `PATCH` | `/api/membros/{id}/status` |

## Listar membros

```http
GET /api/membros
```

Retorna um resumo com `id`, `nome`, `status`, `email` e `telefoneCelular`.

## Alterar status

```http
PATCH /api/membros/{id}/status
Content-Type: application/json

{ "status": "INATIVO" }
```

`status`: `ATIVO` ou `INATIVO`.
