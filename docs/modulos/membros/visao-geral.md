---
title: Visão geral
sidebar_position: 1
---

# Módulo Membros

Cadastro completo de membros da igreja, com dados pessoais, contato, documentos,
endereço, informações de batismo/recepção e familiares. É consumido pelo módulo
EBD (a EBD usa o membro como aluno/professor).

- **Backend**: `apps/api/src/main/java/com/betelhub/membro/`
- **Frontend**: `apps/web/src/modules/membros/`
- **Endpoints**: `/api/membros` e `/api/igreja/dashboard`

## Modelo de domínio

`Membro` (`dominio/Membro.java`) é a raiz do agregado. Um membro possui:

| Grupo | Campos |
|---|---|
| Identificação | `id` (UUID), `nome`, `nomePai`, `nomeMae`, `sexo`, `dataNascimento` |
| Dados pessoais | `nacionalidade`, `naturalidade`, `profissao`, `estadoCivil`, `grauInstrucao` |
| Contato | `email`, `telefoneResidencial`, `telefoneComercial`, `telefoneCelular`, `whatsapp` |
| Documento | `tipoDocumento`, `numeroDocumento` |
| Endereço | `endereco` (value object com logradouro, complemento, número, bairro, cidade, CEP e UF) |
| Vida cristã | `dataBatismo`, `celebranteBatismo`, `igrejaBatismo`, `dataProfissaoFe`, `dataBatismoEspiritoSanto` |
| Situação | `status`, `createdAt`, `updatedAt` |

Entidades filhas (um-para-muitos, substituídas por completo na atualização):

- **Recepções** (`Recepcao`): tipo, data, número do rol, igreja de origem, pastor receptor e observações.
- **Familiares** (`Familiar`): tipo (`CONJUGE`/`FILHO`), nome, data de nascimento e vínculo opcional com outro membro.

### Enumerações

| Enum | Valores |
|---|---|
| `StatusMembro` | `ATIVO`, `INATIVO` |
| `Sexo` | `FEMININO`, `MASCULINO` |
| `EstadoCivil` | `SOLTEIRO`, `CASADO`, `VIUVO`, `DIVORCIADO`, `SEPARADO`, `OUTRO` |
| `GrauInstrucao` | `ANALFABETO`, `FUNDAMENTAL_INCOMPLETO`, `FUNDAMENTAL_COMPLETO`, `MEDIO_INCOMPLETO`, `MEDIO_COMPLETO`, `SUPERIOR_INCOMPLETO`, `SUPERIOR_COMPLETO`, `POS_GRADUACAO` |
| `TipoDocumento` | `RG`, `CNH`, `PASSAPORTE` |
| `TipoRecepcao` | `BATISMO`, `TRANSFERENCIA`, `ADESAO`, `RECONCILIACAO`, `RECADASTRAMENTO` |
| `TipoFamiliar` | `CONJUGE`, `FILHO` |

## Regras de negócio

- `nome` é obrigatório; o membro é criado com status `ATIVO`.
- Atualizações de recepções e familiares **substituem a lista inteira**.
- Alteração de status é feita por operação dedicada (`PATCH /status`).

:::tip[API por tela]
Cada tela deste módulo tem sua própria página de **API** no submenu lateral.
:::

## Telas

- [Dashboard da igreja](./dashboard-igreja.md)
- [Listagem de membros](./listagem.md)
- [Cadastro e edição](./cadastro-edicao.md)
