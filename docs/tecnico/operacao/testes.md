---
title: Testes
sidebar_position: 2
---

# Testes

## Backend (JUnit 5)

Testes de domínio e casos de uso em `apps/api/src/test/`, incluindo:

- `AulaTest`, `OfertaTest` — regras de domínio
- `RegistrarAulaServiceTest`, `RegistrarChamadaServiceTest`, `ConsultarChamadaServiceTest`
- `GerenciarMatriculaServiceTest`, `ConsultarDashboardServiceTest`
- `RelatorioServiceTest`, `RelatorioCsvWriterTest`, `RelatorioPdfWriterTest`
- `MembroServiceTest`, `DashboardIgrejaServiceTest`

```bash
cd apps/api
mvn test
```

## Frontend

### Unitários (Vitest)

```bash
cd apps/web
npm run test
```

### E2E (Playwright)

```bash
npm run test:e2e
```

O Playwright sobe o Vite na porta `5174` com `VITE_USE_MOCKS=false` e executa os
fluxos reais (Alunos, presença, dashboard e relatórios CSV/PDF). Ele espera banco
limpo — veja [Como rodar localmente](./rodando-local.md#limpar-dados-antes-do-e2e-real).

Evidências (screenshots, `resumo.json`, chamadas de API e console) são salvas em
`apps/web/evidencias/e2e/<timestamp>/`.

### Responsividade (Playwright)

```bash
npm run test:responsive
```
