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

:::tip[API por tela]
Cada tela deste módulo tem sua própria página de **API** no submenu lateral.
:::

## Telas

- [Dashboard EBD](./dashboard.md)
- [Turmas](./turmas.md)
- [Professores](./professores.md)
- [Alunos](./alunos.md)
- [Chamada](./chamada.md)
- [Aulas](./aulas.md)
- [Relatórios](./relatorios.md)
