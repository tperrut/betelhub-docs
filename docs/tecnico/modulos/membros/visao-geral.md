---
title: Visão geral
sidebar_position: 1
---

# Membros (técnico)

- **Backend**: `apps/api/src/main/java/com/betelhub/membro/`
- **Frontend**: `apps/web/src/modules/membros/`
- **Estilo**: camada fina (entidade JPA + service + controller) com value objects.

## Modelo de domínio

`Membro` (`dominio/Membro.java`) é a raiz do agregado:

| Grupo | Campos |
|---|---|
| Identificação | `id` (UUID), `nome`, `nomePai`, `nomeMae`, `sexo`, `dataNascimento` |
| Dados pessoais | `nacionalidade`, `naturalidade`, `profissao`, `estadoCivil`, `grauInstrucao` |
| Contato | `email`, `telefoneResidencial`, `telefoneComercial`, `telefoneCelular`, `whatsapp` |
| Documento | `tipoDocumento`, `numeroDocumento` |
| Endereço | `endereco` (`@Embeddable` com logradouro, complemento, número, bairro, cidade, CEP e UF) |
| Vida cristã | `dataBatismo`, `celebranteBatismo`, `igrejaBatismo`, `dataProfissaoFe`, `dataBatismoEspiritoSanto` |
| Situação | `status`, `createdAt`, `updatedAt` |

Entidades filhas (1:N, substituídas por completo na atualização):

- **`Recepcao`**: tipo, data, número do rol, igreja de origem, pastor receptor, observações.
- **`Familiar`**: tipo (`CONJUGE`/`FILHO`), nome, data de nascimento, vínculo opcional a outro membro.

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

Invariantes, casos de uso e decisões: veja [DDD — Membros](../../ddd/membros.md).

## API

- [Dashboard da igreja](./api/dashboard-igreja.md)
- [Listagem](./api/listagem.md)
- [Cadastro e edição](./api/cadastro-edicao.md)

## Telas (negócio)

- [Dashboard da igreja](/negocio/modulos/membros/dashboard-igreja)
- [Listagem de membros](/negocio/modulos/membros/listagem)
- [Cadastro e edição](/negocio/modulos/membros/cadastro-edicao)
