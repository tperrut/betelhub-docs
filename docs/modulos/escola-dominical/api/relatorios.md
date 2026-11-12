---
title: API
sidebar_position: 1
---

# API — Relatórios

Tela: [Relatórios](../relatorios.md)

## Endpoints

| Método | Rota |
|---|---|
| `GET` | `/api/escola-dominical/relatorios/{tipo}.csv` |
| `GET` | `/api/escola-dominical/relatorios/{tipo}.pdf` |

### Parâmetros

| Parâmetro | Descrição |
|---|---|
| `tipo` | `turmas`, `alunos`, `aulas` ou `professores` |
| `turmaId` | Filtro por turma (alunos/aulas) |
| `dataInicio` | Data inicial ISO (aulas) |
| `dataFim` | Data final ISO (aulas) |

### Exemplos

```http
GET /api/escola-dominical/relatorios/aulas.csv?turmaId={turmaId}&dataInicio=2026-11-01&dataFim=2026-11-30
GET /api/escola-dominical/relatorios/aulas.pdf?turmaId={turmaId}
```

- **CSV**: UTF-8 com BOM, separador `;`, datas `dd/MM/yyyy` e vírgula decimal (Excel pt-BR).
- **PDF**: A4 paisagem, cabeçalho com nome da igreja + logo opcional, filtros, data/hora de geração e rodapé com paginação.
