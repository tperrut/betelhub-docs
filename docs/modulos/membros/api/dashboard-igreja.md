---
title: API
sidebar_position: 1
---

# API — Dashboard da igreja

Tela: [Dashboard da igreja](../dashboard-igreja.md)

## Endpoint

```http
GET /api/igreja/dashboard
```

### Resposta (campos principais)

| Campo | Descrição |
|---|---|
| `membrosAtivos` | Total de membros com status `ATIVO` |
| `membrosInativos` | Total de membros com status `INATIVO` |
| `totalMembros` | Total de membros cadastrados |
| `mes` / `ano` | Mês e ano de referência |
| `aniversariantes` | Lista com `id`, `nome`, `dataNascimento`, `dia` e `idade` |
