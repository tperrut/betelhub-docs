---
title: Escola Dominical (EBD)
sidebar_position: 3
---

# Escola Dominical (EBD) — estudo de DDD

- **Status**: modelo-alvo definido; implementação do piloto concluída.
- **Código**: `apps/api/src/main/java/com/betelhub/escola_dominical/`
- **ADRs**: ADR-0004 (arquitetura interna), ADR-0019 (módulos e isolamento), ADR-0007 (REST/RFC 7807), ADR-0015 (testes).

## Contexto delimitado

O módulo **Escola Dominical** gerencia **turmas**, **professores**, **alunos
(matrículas)** e o registro de **aulas** (conteúdo, presença e ofertas).

- **Faz**: cadastro de turmas e professores, matrícula de alunos, registro/ajuste de aula e presença, conteúdo da aula, ofertas, métricas do dashboard.
- **Não faz**: autenticação (Identidade), cadastro de membros (Membro), consolidação financeira (Finanças), envio de e-mail (Notificações).
- **Conversa com**: `Membro` via contrato público `MembroConsulta` (nomes) e `membroId` nas matrículas; `Finanças`/`Notificações` via eventos.

## Decisões de modelagem

| Tema | Decisão |
|---|---|
| Aluno | É um **Membro** já cadastrado; o vínculo com a EBD é a `Matricula` |
| Matrícula | **No máximo uma matrícula ATIVA por aluno na EBD** |
| Professor | **Entidade própria** (`Professor`) com `membroId` **opcional** (permite professor externo) |
| Professores por turma | **2–3 professores que se revezam**; papéis responsável/auxiliar |
| Professores por aula | **1 titular + 0..N auxiliares**, escolhidos entre os professores da turma |
| Visitante | **Nome livre por presença**, sem cadastro |
| Chamada | **Caso de uso sobre a Aula** (roster + presenças em lote); não é agregado próprio |
| Presença de membro | Exige **matrícula ativa na turma**; quem não é matriculado entra como visitante |
| Ajuste de presença | **PUT** (substitui a lista) e **PATCH/POST/DELETE** (operações pontuais) |
| Conteúdo da aula | **Tema + revista + capítulo** |
| Aula cancelada | **Não entra** em métricas nem arrecadação |
| Trimestre | **Calendário** (Jan–Mar, Abr–Jun, Jul–Set, Out–Dez) |
| Taxa de presença média | **Presentes ÷ matriculados** por aula, média das aulas realizadas |

### Por que “Aluno” é Membro + Matrícula?

- A pessoa existe uma única vez no **Membro** (Igreja); o vínculo com a EBD é temporal (`Matricula`).
- Evita duplicar cadastro, contato e dados sensíveis; o mesmo membro pode sair, voltar ou mudar de turma.
- Permite **uma única matrícula `ATIVA`**, histórico de `TRANCADA`/`ENCERRADA` e relatórios consistentes.
- **Visitante não é aluno**: a presença avulsa usa `VisitanteParticipante`, sem matrícula.
- A tela **Membros** cadastra a pessoa; a tela **Alunos** gerencia a matrícula.

## Linguagem ubíqua

| Termo | Significado no contexto | Evitar |
|---|---|---|
| **Turma** | Agrupamento de alunos (ex.: Berçário, Adultos, Jovens) | “classe” como nome de tela |
| **Professor** | Quem leciona; pode ser membro ou externo | “membro com função” como único modelo |
| **Aluno** | Membro matriculado em uma turma | “usuário” |
| **Matrícula** | Vínculo aluno ↔ turma (máx. 1 ativa por aluno) | “inscrição” genérica |
| **Aula** | Encontro de uma turma em uma data, com conteúdo/professor(es)/oferta | “lição” (é o conteúdo) |
| **Chamada** | Ação de registrar as presenças de uma aula já registrada | “frequência” (métrica) |
| **Presença** | Participante (membro ou visitante) × aula | “frequência” (métrica) |
| **Oferta** | Valor arrecadado na aula (PIX + dinheiro) | “dízimo” (Finanças) |

## Agregados

- **Turma** — `id`, `nome`, `faixaEtaria?`, `status`, `professores` (2..3 `ProfessorDaTurma` com papel responsável/auxiliar).
- **Professor** — `id`, `nome`, `membroId?`, `status`.
- **Matricula** — `id`, `membroId`, `turmaId`, `status`, `dataMatricula`; **única ativa por aluno**.
- **Aula** — `id`, `turmaId`, `data`, `conteudo`, `oferta`, `status`, `professores` (1 titular + 0..N auxiliares), `presencas`, `criadaEm`, `atualizadaEm`.

## Value objects

- **`ConteudoAula(tema, revista, capitulo)`** — conteúdo da lição.
- **`Oferta(pix, dinheiro)`** — normaliza nulos, rejeita negativos, escala 2, `total()`.
- **`Presenca(id, Participante, presente)`** — identidade própria para operações incrementais.
- **`ProfessorDaTurma(professorId, papel)`** — `PapelNaTurma = RESPONSAVEL | AUXILIAR`.
- **`ProfessorDaAula(professorId, papel)`** — `PapelNaAula = TITULAR | AUXILIAR`.

### Participante (sealed interface)

```java
public sealed interface Participante permits MembroParticipante, VisitanteParticipante {
    String nome();
}
public record MembroParticipante(UUID membroId, String nome) implements Participante {}
public record VisitanteParticipante(String nome) implements Participante {}
```

> Modela “membro **ou** visitante” sem campos nulos e sem `if` espalhado.
> Na persistência: colunas `membro_id` e `visitante_nome` anuláveis + `CHECK` de exatamente uma preenchida.

## Invariantes e regras

- **Matrícula**: no máximo uma `ATIVA` por `membroId` (índice único parcial); exige **membro cadastrado**.
- **Professor**: `nome` obrigatório; `membroId` opcional e único quando presente.
- **Turma**: `nome` obrigatório; **até 3 professores** com papel (responsável/auxiliar).
- **Aula**: única por `(turma, data)`; conteúdo obrigatório; oferta não negativa; **1 titular + 0..N auxiliares** (professores da turma).
- **Presença**: identidade própria (`id`); membro sem duplicidade na mesma aula; visitantes podem repetir nomes.
- **Aula `CANCELADA`**: fora de métricas e arrecadação.
- **Presença de membro**: exige **matrícula ativa na turma**; quem não estiver matriculado entra como **visitante**.

## Dashboard (consultas de leitura)

| Métrica | Regra |
|---|---|
| Professores ativos | `count(Professor status = ATIVO)` |
| Turmas ativas | `count(Turma status = ATIVA)` |
| Alunos matriculados | `count(distinct membroId)` de `Matricula ATIVA` |
| Ofertas (últimas) | soma das ofertas das aulas `REALIZADA` do **mês atual** |
| Total de aulas registradas | `count(Aula status = REALIZADA)` (**global**) |
| Aulas no período | `count(Aula status = REALIZADA)` dentro do período selecionado |
| Taxa de presença média | média, por aula realizada, de `presentes / matriculados` (0–100) |
| Arrecadação | soma das ofertas de aulas `REALIZADA` no período, com detalhe por aula |
| Últimas aulas | **10** aulas `REALIZADA` mais recentes |

## Eventos de domínio

| Evento | Quando | Consumidores |
|---|---|---|
| `AulaRegistradaEvento(aulaId, turmaId, totalOferta, ocorridoEm)` | após salvar aula `REALIZADA` | Finanças e Notificações |
| `PresencaAjustadaEvento(aulaId, turmaId, ocorridoEm)` | ao ajustar presença | Auditoria/Notificações |
| `MatriculaRealizadaEvento(matriculaId, membroId, turmaId, ocorridoEm)` | ao ativar matrícula | Notificações |

## Persistência

- `turmas` (id, nome, faixa_etaria, status, created_at, updated_at)
- `professores` (id, nome, membro_id nullable, status)
- `matriculas` (id, membro_id, turma_id, status, data_matricula) + índice único parcial para `ATIVA`
- `turmas_professores` (turma_id, professor_id, papel)
- `aulas_ebd` (id, turma_id, data, tema, revista, capitulo, oferta_pix, oferta_dinheiro, status, created_at, updated_at) + unique (turma_id, data)
- `aulas_professores` (aula_id, professor_id, papel)
- `presencas_ebd` (id, aula_id, membro_id nullable, visitante_nome nullable, presente, created_at, updated_at) + check de exatamente um participante

## Decisões e trade-offs

- **Aluno = Membro + Matrícula** evita duplicar dados pessoais e preserva histórico.
- **Chamada como caso de uso** (não agregado) simplifica o modelo; a `Aula` é a raiz.
- **Oferta como value object** concentra validação (não negativa, escala) e cálculo do total.
- **Participante selado** elimina estados inválidos (membro e visitante ao mesmo tempo).
- **Aulas canceladas fora das métricas** mantém os indicadores confiáveis.
