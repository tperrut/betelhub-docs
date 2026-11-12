---
title: API
sidebar_position: 1
---

# API — Chamada e presenças

Tela: [Chamada](../chamada.md)

## Endpoints

| Método | Rota |
|---|---|
| `GET` | `/api/escola-dominical/aulas/{id}/chamada` |
| `PUT` | `/api/escola-dominical/aulas/{id}/chamada` |
| `PUT` | `/api/escola-dominical/aulas/{id}/presencas` |
| `POST` | `/api/escola-dominical/aulas/{id}/presencas` |
| `PATCH` | `/api/escola-dominical/aulas/{id}/presencas/{presencaId}` |
| `DELETE` | `/api/escola-dominical/aulas/{id}/presencas/{presencaId}` |

## Consultar a chamada

```http
GET /api/escola-dominical/aulas/{id}/chamada
```

Retorna o roster (alunos matriculados, visitantes e outros) com as presenças.

## Gravar a chamada em lote

```http
PUT /api/escola-dominical/aulas/{id}/chamada
Content-Type: application/json

{
  "alunos": [
    { "membroId": "uuid", "presente": true }
  ],
  "visitantes": [
    { "nome": "João Visitante", "presente": true }
  ]
}
```

## Substituir presenças

```http
PUT /api/escola-dominical/aulas/{id}/presencas
Content-Type: application/json

{
  "presencas": [
    { "membroId": "uuid", "presente": true },
    { "visitanteNome": "Maria Visitante", "presente": true }
  ]
}
```

## Adicionar presença

```http
POST /api/escola-dominical/aulas/{id}/presencas
Content-Type: application/json

{
  "presenca": {
    "visitanteNome": "João Visitante",
    "presente": true
  }
}
```

## Ajustar presença

```http
PATCH /api/escola-dominical/aulas/{id}/presencas/{presencaId}
Content-Type: application/json

{ "presente": true }
```
