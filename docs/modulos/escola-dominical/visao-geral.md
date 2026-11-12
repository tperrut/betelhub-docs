---
title: Visão geral
sidebar_position: 1
---

# Módulo Escola Dominical (EBD)

É o módulo piloto do projeto, implementado com arquitetura hexagonal completa.
Cobre o fluxo de uma escola dominical: **professor → turma → vínculo → matrícula →
aula → presença → dashboard → relatórios**.

- **Backend**: `apps/api/src/main/java/com/betelhub/escola_dominical/`
- **Frontend**: `apps/web/src/modules/escola-dominical/`
- **Collections HTTP**: `collections/escola-dominical/` (Bruno)

## Estrutura hexagonal

```
escola_dominical/
├─ dominio/       # modelo e regras (Turma, Professor, Aula, Matricula, Presenca...)
├─ aplicacao/     # casos de uso, DTOs e geradores de relatório
├─ porta/         # interfaces de repositório
└─ adaptador/     # entrada/rest (controllers) e saida/persistencia (JPA)
```

## Modelo de domínio

| Conceito | Papel |
|---|---|
| `Turma` | Turma da EBD, com faixa etária e status (`ATIVA`/`INATIVA`) |
| `Professor` | Professor, opcionalmente vinculado a um membro |
| `ProfessorDaTurma` | Vínculo professor ↔ turma, com papel (`RESPONSAVEL`/`AUXILIAR`) |
| `Aula` | Registro de uma aula: data, tema, revista, capítulo, ofertas e status |
| `ConteudoAula` | Tema, revista e capítulo |
| `Oferta` | Oferta em PIX e em dinheiro (com total) |
| `ProfessorDaAula` | Professores da aula com papel (`TITULAR`/`AUXILIAR`) |
| `Matricula` | Vínculo do membro com a turma, com status (`ATIVA`/`TRANCADA`/`ENCERRADA`) |
| `Presenca` | Presença de um participante na aula |
| `Participante` | Membro (`MembroParticipante`) ou visitante (`VisitanteParticipante`) |

### Enumerações

| Enum | Valores |
|---|---|
| `StatusTurma` | `ATIVA`, `INATIVA` |
| `StatusProfessor` | `ATIVO`, `INATIVO` |
| `StatusMatricula` | `ATIVA`, `TRANCADA`, `ENCERRADA` |
| `StatusAula` | `REALIZADA`, `CANCELADA` |
| `PapelNaTurma` | `RESPONSAVEL`, `AUXILIAR` |
| `PapelNaAula` | `TITULAR`, `AUXILIAR` |

## Regras de negócio

- Registrar presença de um **membro** exige matrícula ativa na turma.
- Visitantes podem ser registrados apenas com o nome.
- Cada aula tem um professor titular e auxiliares opcionais.
- Ofertas não podem ser negativas (retorna `400`).
- Relatórios usam `ProblemDetail`/validação para entradas inválidas.

## API

### Turmas

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/turmas` |
| `GET` | `/api/escola-dominical/turmas` |
| `PATCH` | `/api/escola-dominical/turmas/{id}/status` |
| `GET` | `/api/escola-dominical/turmas/{id}/alunos` |
| `POST` | `/api/escola-dominical/turmas/{id}/professores` |
| `DELETE` | `/api/escola-dominical/turmas/{id}/professores/{professorId}` |

### Professores

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/professores` |
| `GET` | `/api/escola-dominical/professores` |
| `PATCH` | `/api/escola-dominical/professores/{id}/status` |

### Matrículas

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/matriculas` |
| `GET` | `/api/escola-dominical/matriculas?turmaId={turmaId}` |
| `PATCH` | `/api/escola-dominical/matriculas/{id}/status` |

### Aulas e presenças

| Método | Rota |
|---|---|
| `POST` | `/api/escola-dominical/aulas` |
| `GET` | `/api/escola-dominical/aulas?turmaId={turmaId}` |
| `GET` | `/api/escola-dominical/aulas/{id}` |
| `PATCH` | `/api/escola-dominical/aulas/{id}/status` |
| `GET` | `/api/escola-dominical/aulas/{id}/chamada` |
| `PUT` | `/api/escola-dominical/aulas/{id}/chamada` |
| `PUT` | `/api/escola-dominical/aulas/{id}/presencas` |
| `POST` | `/api/escola-dominical/aulas/{id}/presencas` |
| `PATCH` | `/api/escola-dominical/aulas/{id}/presencas/{presencaId}` |
| `DELETE` | `/api/escola-dominical/aulas/{id}/presencas/{presencaId}` |

### Dashboard e relatórios

| Método | Rota |
|---|---|
| `GET` | `/api/escola-dominical/dashboard?periodo=MENSAL&dataReferencia=2026-11-08` |
| `GET` | `/api/escola-dominical/relatorios/{tipo}.csv?turmaId=&dataInicio=&dataFim=` |
| `GET` | `/api/escola-dominical/relatorios/{tipo}.pdf?turmaId=&dataInicio=&dataFim=` |

`{tipo}` aceita `turmas`, `alunos`, `aulas` ou `professores`.
Períodos do dashboard: `MENSAL`, `TRIMESTRAL`, `SEMESTRAL`, `ANUAL`.

Exemplo de registro de aula:

```json
{
  "turmaId": "uuid-da-turma",
  "data": "2026-11-08",
  "tema": "A Parábola do Semeador",
  "revista": "Vida Cristã",
  "capitulo": "3",
  "ofertaPix": 150.00,
  "ofertaDinheiro": 85.50,
  "professores": [{ "professorId": "uuid", "papel": "TITULAR" }],
  "presencas": [
    { "membroId": "uuid", "presente": true },
    { "visitanteNome": "Maria Visitante", "presente": false }
  ]
}
```

## Telas

- [Dashboard EBD](./dashboard.md)
- [Turmas](./turmas.md)
- [Professores](./professores.md)
- [Alunos](./alunos.md)
- [Chamada](./chamada.md)
- [Aulas](./aulas.md)
- [Relatórios](./relatorios.md)
