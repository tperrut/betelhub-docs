---
title: Membros
sidebar_position: 2
---

# Membros — estudo de DDD

- **Status**: piloto (camada fina + cadastro completo).
- **Código**: `apps/api/src/main/java/com/betelhub/membro/` e `apps/web/src/modules/membros/`.
- **ADRs**: ADR-0004 (camada fina em CRUDs), ADR-0019 (módulos e isolamento), ADR-0016/0017 (LGPD/criptografia — pendente).

## Contexto delimitado

O módulo **Membros** mantém o cadastro das pessoas da igreja, incluindo a **Ficha
Cadastral de Membro** adaptada do formulário físico.

- **Faz**: cadastrar, consultar, atualizar e ativar/inativar membros; registrar dados pessoais, contato, endereço, família, histórico de recepção e dados religiosos/instrução.
- **Não faz**: autenticação (Identidade), vínculo com usuário, criptografia de dados sensíveis, financeiro.
- **Conversa com**: `Escola Dominical` (EBD) via contrato público `MembroConsulta`, para resolver nomes de alunos em matrículas e relatórios.
- **Membro ≠ Aluno**: o Membro é a pessoa cadastrada na Igreja; o Aluno é um membro **matriculado em uma turma da EBD**. A matrícula é um vínculo temporal, não um novo cadastro.

:::note[Decisão de arquitetura]
O módulo continua em **camada fina** (entidade JPA + Spring Data + service + controller),
com **value objects** (`Endereco` `@Embeddable`) e enums. Não há regra complexa que
justifique hexagonal agora; a fronteira é protegida por `MembroConsulta`. Reavaliar
quando entrar criptografia/LGPD.
:::

## Linguagem ubíqua

| Termo | Significado no contexto | Evitar |
|---|---|---|
| **Membro** | Pessoa cadastrada na igreja | “usuário” (é Identidade) |
| **Recepção** | Evento de entrada/atualização do membro (batismo, transferência, adesão, reconciliação, recadastramento) | “cadastro” (é o ato) |
| **ROL** | Número do Registro de Obreiros e Membros, informado na recepção | “matrícula” |
| **Familiar** | Cônjuge ou filho vinculado ao membro | “dependente” |
| **Ativo/Inativo** | Situação do membro no cadastro | “excluído” (não há exclusão física) |
| **Aluno** | Membro matriculado em uma turma da EBD | “membro” quando o contexto for turma |

## Modelo de domínio (camada fina)

### Entidades e valores

- **`Membro`** (JPA, tabela `membros`): dados pessoais, contato, documento, `Endereco` e dados religiosos/instrução; `status` (`ATIVO | INATIVO`); `createdAt`/`updatedAt`; coleções `recepcoes` e `familiares`.
- **`Recepcao`** (JPA, tabela `membros_recepcoes`): `tipo`, `data`, `numeroRol`, `igrejaOrigem`, `pastorReceptor`, `observacoes`. Relação 1:N com `Membro` (`ON DELETE CASCADE`).
- **`Familiar`** (JPA, tabela `membros_familiares`): `tipo` (`CONJUGE | FILHO`), `nome`, `dataNascimento` e `membroVinculadoId` opcional. Relação 1:N.
- **`Endereco`** (`@Embeddable`): `logradouro`, `complemento`, `numero`, `bairro`, `cidade`, `cep`, `uf`.
- **Enums**: `Sexo`, `TipoRecepcao`, `EstadoCivil`, `GrauInstrucao`, `TipoDocumento`, `TipoFamiliar`, `StatusMembro`.

## Invariantes

- `nome` obrigatório e normalizado (`trim`).
- Novo membro nasce `ATIVO`; status só muda por `PATCH /api/membros/{id}/status`.
- `Recepcao.tipo` e `Familiar.tipo` obrigatórios; `Familiar.nome` obrigatório e normalizado.
- Textos em branco são persistidos como `NULL`.
- `Endereco` vazio (todos os campos em branco) vira `NULL`.
- Não há exclusão física; use `INATIVO`.
- Nome não é único (homônimos permitidos); não há deduplicação automática.

## Camadas e dependências

O módulo é **package-by-feature** no topo (`com.betelhub.membro`) e organizado em camadas internas:

```
com.betelhub.membro/
├── MembroConsulta.java                 # API pública do módulo
├── dominio/
│   ├── Membro.java                     # entidade JPA (raiz)
│   ├── Recepcao.java                   # entidade filha (histórico)
│   ├── Familiar.java                   # entidade filha (cônjuge/filhos)
│   ├── Endereco.java                   # @Embeddable
│   └── StatusMembro.java, Sexo.java, TipoRecepcao.java,
│       EstadoCivil.java, GrauInstrucao.java, TipoDocumento.java, TipoFamiliar.java
├── aplicacao/
│   ├── MembroService.java              # CRUD + mapeamento
│   └── dto/MembroDtos.java             # comandos/resultados (records)
├── porta/
│   └── saida/MembroRepository.java     # porta de persistência
└── adaptador/
    ├── entrada/rest/MembroController.java
    └── saida/persistencia/
        ├── JpaMembroRepository.java    # Spring Data
        └── MembroRepositoryAdapter.java
```

Regras de dependência:

- `aplicacao` depende de `dominio` e de `porta`; **nunca** de `adaptador`.
- `adaptador` depende de `dominio`/`porta`; é a borda com HTTP e Spring Data.
- `MembroConsulta` fica na raiz do módulo como **única** API pública consumida por outros módulos (hoje a EBD).

## Casos de uso

| Caso de uso | Entrada | Saída | Regras |
|---|---|---|---|
| Criar membro | `MembroComando` | `MembroResultado` | `nome` obrigatório; nasce ativo; filhos/recepções normalizados |
| Atualizar membro | `id`, `MembroComando` | `MembroResultado` | substitui todo o cadastro, inclusive recepções e familiares |
| Listar membros | — | `MembroResumo[]` | resumo (`id`, `nome`, `status`, `email`, `telefoneCelular`) |
| Buscar membro | `id` | `MembroResultado` | 400 se não existir |
| Ativar/inativar | `id`, `status` | `MembroResultado` | status obrigatório |
| Resolver nomes | `ids` | `id → nome` | usado pela EBD; ausente fica fora do mapa |

Veja os endpoints em [API — Cadastro e edição](../modulos/membros/api/cadastro-edicao.md).

## Persistência

- Migrations: `V4__create_membros.sql` (base) e `V5__membro_cadastro_completo.sql`.
- Colunas de endereço prefixadas com `endereco_`.
- Filhos com `ON DELETE CASCADE`.
- Sem `tenant_id` ainda (pendência transversal do piloto).

## LGPD e segurança (pendente)

- Os dados de cadastro (nascimento, documento, contato, endereço) são **pessoais/sensíveis**.
- Ainda **não há criptografia de coluna** (ADR-0016) nem política de retenção/consentimento (ADR-0017).
- A API pública (`MembroConsulta`) expõe apenas nomes para a EBD.

## Decisões e trade-offs

- **Recepção 1:N** preserva histórico em vez de sobrescrever um único campo.
- **Familiares em tabela própria** acomoda N filhos e permite vincular a outro membro no futuro.
- **Camada fina + VOs**: menor custo que hexagonal, sem perder validação/normalização.
- **PUT substitui o cadastro inteiro** (incluindo filhos/recepções); previsível para o frontend.
- **Resumo na listagem** evita carregar coleções (N+1) na página de Membros.
