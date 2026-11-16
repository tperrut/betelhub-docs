---
title: Visão geral
sidebar_position: 2
---

# Escola Dominical (EBD) — técnico

Módulo piloto, implementado com arquitetura hexagonal completa.

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

Invariantes, eventos e decisões: veja [DDD — Escola Dominical](../../ddd/escola-dominical.md).

## API

- [Dashboard EBD](./api/dashboard.md)
- [Turmas](./api/turmas.md)
- [Professores](./api/professores.md)
- [Alunos e matrículas](./api/alunos.md)
- [Chamada e presenças](./api/chamada.md)
- [Aulas](./api/aulas.md)
- [Relatórios](./api/relatorios.md)

## Telas (negócio)

- [Dashboard EBD](/negocio/modulos/escola-dominical/dashboard)
- [Turmas](/negocio/modulos/escola-dominical/turmas)
- [Professores](/negocio/modulos/escola-dominical/professores)
- [Alunos](/negocio/modulos/escola-dominical/alunos)
- [Chamada](/negocio/modulos/escola-dominical/chamada)
- [Aulas](/negocio/modulos/escola-dominical/aulas)
- [Relatórios](/negocio/modulos/escola-dominical/relatorios)
