---
title: Frontend
sidebar_position: 2
---

# Frontend

SPA em **React 19 + Vite + TypeScript** que consome a API REST. Usa **Tailwind CSS v4**,
**shadcn/ui**, **TanStack Query** e **react-hook-form + zod**.

- Código: `apps/web/`
- Base da API: `VITE_API_BASE_URL` (padrão `/api`, com proxy do Vite para `http://localhost:8081`)
- Mocks: **MSW** (`VITE_USE_MOCKS=true`)

## Telas e rotas

| Rota | Tela | Módulo |
|---|---|---|
| `/` | Dashboard da igreja | `membros` |
| `/membros` | Lista de membros | `membros` |
| `/membros/novo` | Cadastro de membro | `membros` |
| `/membros/:id` | Edição de membro | `membros` |
| `/ebd` | Dashboard EBD | `escola-dominical` |
| `/turmas` | Turmas | `escola-dominical` |
| `/professores` | Professores | `escola-dominical` |
| `/alunos` | Alunos por turma | `escola-dominical` |
| `/aulas` | Aulas | `escola-dominical` |
| `/aulas/nova` | Nova aula | `escola-dominical` |
| `/aulas/:id` | Detalhe da aula | `escola-dominical` |
| `/chamadas` | Chamadas | `escola-dominical` |
| `/chamadas/:id` | Realizar chamada | `escola-dominical` |
| `/relatorios` | Relatórios CSV/PDF | `relatorios` |

Rotas desconhecidas redirecionam para `/`.

## Organização do código

```
apps/web/src/
├─ modules/
│  ├─ escola-dominical/  # pages, components e api
│  ├─ membros/           # pages e api
│  └─ relatorios/        # página e download de relatórios
├─ shared/
│  ├─ layout/            # AppShell, PageHeader, DataView, ThemeSwitcher...
│  ├─ api/               # cliente HTTP (fetch) e HttpError
│  ├─ theme/             # temas e provider
│  └─ lib/               # formatação
├─ components/ui/        # componentes shadcn/ui
└─ mocks/                # MSW: handlers e dados de teste
```

## Temas

O layout permite alternar entre temas por inquilino e modo claro/escuro/sistema
(preferência salva em `localStorage` na chave `betelhub.tema`).

| Tema | Paleta |
|---|---|
| `betel` (padrão) | Verde profundo com areia |
| `liturgico` | Azul-marinho com dourado |
| `amanhecer` | Terracota com creme |
| `advento` | Roxo com dourado |
| `oliva` | Verde-oliva com pedra |
| `neutro` | Grafite com branco |

Modos: `claro`, `escuro`, `sistema`.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe o Vite em `http://localhost:5173` (usa `.env.local`, MSW ativo) |
| `npm run dev:api` | Força o uso da API real |
| `npm run dev:mocks` | Força o uso dos mocks (MSW) |
| `npm run build` | Typecheck + build de produção |
| `npm run lint` | Lint (oxlint) |
| `npm run typecheck` | Checagem de tipos |
| `npm run test` | Testes unitários (Vitest) |
| `npm run test:e2e` | Testes E2E (Playwright) |
| `npm run test:responsive` | Testes de responsividade (Playwright) |
