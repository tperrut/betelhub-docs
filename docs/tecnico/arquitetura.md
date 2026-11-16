---
title: Arquitetura
sidebar_position: 2
---

# Arquitetura

O Betelhub é um **monolito modular**: um único deploy, um único banco e
fronteiras internas bem definidas por módulos (*bounded contexts*). Cada módulo
vive em um pacote `com.betelhub.<modulo>` e se comunica por contratos públicos e
eventos de aplicação (Spring Modulith).

## Monorepo

```
betelhub/
├─ apps/
│  ├─ api/            # Backend Spring Boot
│  └─ web/            # SPA React + Vite
├─ collections/       # Collections HTTP (Bruno)
├─ docs/              # ADRs, DDD, diagramas C4, design system
├─ infra/             # Caddy e Terraform (Hostinger)
└─ docker-compose.yml # Ambiente local
```

## Backend

- Pacote-raiz: `com.betelhub`
- Núcleo compartilhado: `com.betelhub.nucleo` (configurações e tratamento de erros)
- Módulos com regra de negócio usam **arquitetura hexagonal** (domínio puro,
  aplicação, portas e adaptadores). CRUDs simples podem usar **camada fina**.

Estrutura interna dos módulos hexagonais implementados:

```
com.betelhub.<modulo>/
├─ dominio/       # entidades, value objects e eventos
├─ aplicacao/     # casos de uso e DTOs (records)
├─ porta/         # interfaces de saída (repositórios)
└─ adaptador/     # entrada/rest (controllers) e saida/persistencia (JPA)
```

### Status dos módulos

| Módulo | Status | Observação |
|---|---|---|
| `membro` | ✅ Piloto implementado | Cadastro completo + página própria no frontend |
| `escola_dominical` | ✅ Piloto implementado | Turmas, professores, matrículas, aulas, chamada, dashboard e relatórios |
| `identidade` | ⏳ Planejado | Auth via Zitadel/BFF ainda não implementado |
| `inquilino` | ⏳ Planejado | Multi-tenancy (RLS/`tenant_id`) ainda não implementado |
| `eventos` | ⏳ Planejado | — |
| `cursos` | ⏳ Futuro | — |
| `pastoral` | ⏳ Futuro | — |
| `financas` | ⏳ Futuro | — |
| `notificacoes` | ⏳ Planejado | — |

:::note[Autenticação no piloto]
A configuração de segurança atual libera as rotas (`permitAll`) e desliga CSRF
**temporariamente** para testes locais. O modelo final (Zitadel + BFF com sessão
opaca em cookie) ainda será implementado.
:::

## Banco de dados

PostgreSQL 17 com migrações versionadas via **Flyway**:

| Migração | Conteúdo |
|---|---|
| `V1__create_ebd_tables.sql` | Tabelas base da EBD |
| `V2__create_presencas_ebd.sql` | Presenças |
| `V3__modelo_ebd_completo.sql` | Modelo EBD completo |
| `V4__create_membros.sql` | Tabela de membros |
| `V5__membro_cadastro_completo.sql` | Campos do cadastro completo |

## Modelo de dados

Diagrama de entidades e relacionamentos das tabelas implementadas (Membros e EBD).

```mermaid
erDiagram
    MEMBRO {
        uuid id PK
        string nome
        string status
        date data_nascimento
    }
    RECEPCAO {
        uuid id PK
        uuid membro_id FK
        string tipo
        date data
        string numero_rol
    }
    FAMILIAR {
        uuid id PK
        uuid membro_id FK
        string tipo
        string nome
    }
    ENDERECO {
        string logradouro
        string cidade
        string uf
    }
    PROFESSOR {
        uuid id PK
        string nome
        uuid membro_id FK
        string status
    }
    TURMA {
        uuid id PK
        string nome
        string faixa_etaria
        string status
    }
    TURMA_PROFESSOR {
        uuid turma_id FK
        uuid professor_id FK
        string papel
    }
    MATRICULA {
        uuid id PK
        uuid membro_id FK
        uuid turma_id FK
        string status
        date data_matricula
    }
    AULA {
        uuid id PK
        uuid turma_id FK
        date data
        string tema
        string revista
        string capitulo
        numeric oferta_pix
        numeric oferta_dinheiro
        string status
    }
    AULA_PROFESSOR {
        uuid aula_id FK
        uuid professor_id FK
        string papel
    }
    PRESENCA {
        uuid id PK
        uuid aula_id FK
        uuid membro_id FK
        string visitante_nome
        boolean presente
    }

    MEMBRO ||--o{ RECEPCAO : possui
    MEMBRO ||--o{ FAMILIAR : possui
    MEMBRO ||--|| ENDERECO : tem
    MEMBRO ||--o{ MATRICULA : "aluno em"
    MEMBRO |o--o{ PROFESSOR : "pode ser"
    TURMA ||--o{ MATRICULA : tem
    TURMA ||--o{ TURMA_PROFESSOR : tem
    PROFESSOR ||--o{ TURMA_PROFESSOR : leciona
    TURMA ||--o{ AULA : realiza
    AULA ||--o{ AULA_PROFESSOR : tem
    PROFESSOR ||--o{ AULA_PROFESSOR : ministra
    AULA ||--o{ PRESENCA : registra
    MEMBRO |o--o{ PRESENCA : "presente em"
```

:::note
`Endereco` é `@Embeddable` (colunas `endereco_*` na tabela `membros`), não uma tabela própria.
Em `presencas_ebd`, exatamente uma coluna entre `membro_id` e `visitante_nome` é preenchida (`CHECK`).
:::

### Classes — Membros

```mermaid
classDiagram
    class Membro {
      +UUID id
      +String nome
      +StatusMembro status
      +LocalDate dataNascimento
      +String email
      +String telefoneCelular
      +EstadoCivil estadoCivil
      +GrauInstrucao grauInstrucao
      +substituirRecepcoes()
      +substituirFamiliares()
    }
    class Recepcao {
      +UUID id
      +TipoRecepcao tipo
      +LocalDate data
      +String numeroRol
      +String igrejaOrigem
    }
    class Familiar {
      +UUID id
      +TipoFamiliar tipo
      +String nome
      +LocalDate dataNascimento
    }
    class Endereco {
      <<embeddable>>
      +String logradouro
      +String cidade
      +String uf
    }
    Membro "1" o-- "0..*" Recepcao
    Membro "1" o-- "0..*" Familiar
    Membro *-- Endereco
```

### Classes — Escola Dominical (EBD)

```mermaid
classDiagram
    class Turma {
      +UUID id
      +String nome
      +String faixaEtaria
      +StatusTurma status
    }
    class Professor {
      +UUID id
      +String nome
      +UUID membroId
      +StatusProfessor status
    }
    class Matricula {
      +UUID id
      +UUID membroId
      +UUID turmaId
      +StatusMatricula status
      +LocalDate dataMatricula
    }
    class Aula {
      +UUID id
      +UUID turmaId
      +LocalDate data
      +ConteudoAula conteudo
      +Oferta oferta
      +StatusAula status
    }
    class ConteudoAula {
      <<record>>
      +String tema
      +String revista
      +String capitulo
    }
    class Oferta {
      <<record>>
      +BigDecimal pix
      +BigDecimal dinheiro
      +total() BigDecimal
    }
    class Presenca {
      <<record>>
      +UUID id
      +Participante participante
      +boolean presente
    }
    class Participante {
      <<sealed>>
    }
    class MembroParticipante {
      <<record>>
      +UUID membroId
      +String nome
    }
    class VisitanteParticipante {
      <<record>>
      +String nome
    }
    Turma "1" --> "0..*" Matricula
    Turma "1" --> "0..*" Aula
    Professor "0..*" --> "0..*" Turma : leciona
    Aula "1" *-- "1" ConteudoAula
    Aula "1" *-- "1" Oferta
    Aula "1" *-- "0..*" Presenca
    Presenca --> Participante
    Participante <|.. MembroParticipante
    Participante <|.. VisitanteParticipante
```

## Frontend

SPA React que consome a API REST em `/api`. Organização por módulo:

```
apps/web/src/
├─ modules/
│  ├─ escola-dominical/   # pages, components e api da EBD
│  ├─ membros/            # pages e api de membros
│  └─ relatorios/         # página de relatórios
├─ shared/                # layout, tema, http e utilitários
├─ components/ui/         # componentes shadcn/ui
└─ mocks/                 # MSW (modo mock para desenvolvimento)
```

Detalhes em [Frontend](./frontend.md).
