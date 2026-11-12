---
title: API
sidebar_position: 1
---

# API — Dashboard EBD

Tela: [Dashboard EBD](../dashboard.md)

## Endpoint

```http
GET /api/escola-dominical/dashboard?periodo=MENSAL&dataReferencia=2026-11-08
```

### Parâmetros

| Parâmetro | Valores | Obrigatório |
|---|---|---|
| `periodo` | `MENSAL`, `TRIMESTRAL`, `SEMESTRAL`, `ANUAL` | não |
| `dataReferencia` | data ISO (`AAAA-MM-DD`) | não |

### Resposta (campos principais)

| Campo | Descrição |
|---|---|
| `professoresAtivos` | Professores com status `ATIVO` |
| `turmasAtivas` | Turmas com status `ATIVA` |
| `alunosMatriculados` | Pessoas distintas com matrícula `ATIVA` |
| `ofertasMesAtual` | Soma das ofertas das aulas realizadas no mês atual |
| `totalAulas` | Total de aulas `REALIZADA` (global) |
| `aulasNoPeriodo` | Aulas `REALIZADA` no período selecionado |
| `taxaPresencaMedia` | Média de presentes ÷ matriculados (0–100) |
| `arrecadacaoTotal` | Soma das ofertas no período |
| `arrecadacaoPorAula` | Detalhe da arrecadação por aula |
| `ultimasAulas` | Últimas aulas (turma, data, tema, presentes, oferta) |
