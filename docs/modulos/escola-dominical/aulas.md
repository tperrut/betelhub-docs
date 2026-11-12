---
title: Aulas
sidebar_position: 7
---

# Aulas

Rotas: `/aulas` (`AulasPage`), `/aulas/nova` (`NovaAulaPage`) e `/aulas/:id` (`AulaDetalhePage`)

Registro e consulta das aulas da escola dominical.

## Lista de aulas

![Lista de aulas](./img/aulas.png)

## Nova aula

![Nova aula](./img/aula-nova.png)

## Detalhe da aula

![Detalhe da aula](./img/aula-detalhe.png)

## O que as telas permitem

- Listar aulas com turma, data, tema, presentes e oferta.
- Registrar aula com conteúdo (tema, revista, capítulo), ofertas (PIX/dinheiro), professores e presenças.
- Ver o detalhe da aula e suas presenças.
- Alterar o status da aula (`REALIZADA`/`CANCELADA`).

Consome `POST/GET /api/escola-dominical/aulas` e `PATCH .../{id}/status`.
