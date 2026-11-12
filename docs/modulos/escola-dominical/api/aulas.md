---
title: API
sidebar_position: 1
---

# API — Aulas

Tela: [Aulas](../aulas.md)

## Endpoints

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/aulas` |
| `GET` | `/api/escola-dominical/aulas?turmaId={turmaId}` |
| `GET` | `/api/escola-dominical/aulas/{id}` |
| `PATCH` | `/api/escola-dominical/aulas/{id}/status` |

## Registrar aula

```http
POST /api/escola-dominical/aulas
Content-Type: application/json

{
  "turmaId": "uuid-da-turma",
  "data": "2026-11-08",
  "tema": "A Parábola do Semeador",
  "revista": "Vida Cristã",
  "capitulo": "3",
  "ofertaPix": 150.00,
  "ofertaDinheiro": 85.50,
  "professores": [
    { "professorId": "uuid", "papel": "TITULAR" }
  ],
  "presencas": [
    { "membroId": "uuid", "presente": true },
    { "visitanteNome": "Maria Visitante", "presente": false }
  ]
}
```

`papel` do professor na aula: `TITULAR` ou `AUXILIAR`.
Presença de membro exige matrícula ativa na turma; quem não é matriculado entra como visitante.

## Alterar status da aula

```http
PATCH /api/escola-dominical/aulas/{id}/status
Content-Type: application/json

{ "status": "CANCELADA" }
```

`status`: `REALIZADA` ou `CANCELADA`. Aulas canceladas não entram nas métricas.
