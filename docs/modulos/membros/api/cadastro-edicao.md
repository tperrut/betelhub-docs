---
title: API
sidebar_position: 1
---

# API — Cadastro e edição

Tela: [Cadastro e edição](../cadastro-edicao.md)

## Endpoints

| Método | Rota |
|---|---|
| `POST` | `/api/membros` |
| `GET` | `/api/membros/{id}` |
| `PUT` | `/api/membros/{id}` |
| `PATCH` | `/api/membros/{id}/status` |

## Cadastrar membro

```http
POST /api/membros
Content-Type: application/json

{
  "nome": "Maria da Silva",
  "sexo": "FEMININO",
  "dataNascimento": "1990-05-20",
  "email": "maria@exemplo.com",
  "telefoneCelular": "11999998888",
  "estadoCivil": "CASADO",
  "endereco": { "cidade": "São Paulo", "uf": "SP" },
  "recepcoes": [{ "tipo": "BATISMO", "data": "2010-03-14" }],
  "familiares": [{ "tipo": "CONJUGE", "nome": "João da Silva" }]
}
```

## Detalhar / atualizar

```http
GET /api/membros/{id}
PUT /api/membros/{id}
```

O `PUT` substitui o cadastro inteiro, incluindo as listas de `recepcoes` e `familiares`.

## Alterar status

```http
PATCH /api/membros/{id}/status
Content-Type: application/json

{ "status": "ATIVO" }
```
