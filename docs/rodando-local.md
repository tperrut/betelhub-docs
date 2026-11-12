---
title: Como rodar localmente
sidebar_position: 1
---

# Como rodar localmente

## Pré-requisitos

- **JDK 25 (Temurin) + Maven** para build local da API
- **Docker + Docker Compose** (opcional, recomendado para Postgres/API)
- **Node.js 20+** para o frontend

```powershell
# Conferir a versão do Java
java -version
```

> Se o `java -version` mostrar 17, aponte o `JAVA_HOME` para o JDK 25 antes de rodar o Maven.

## Variáveis de ambiente

```bash
cp .env.example .env
```

Principais variáveis:

- `APP_ENCRYPTION_KEY`: chave AES-256-GCM (32 bytes/base64)
- `DB_PASSWORD`: senha do PostgreSQL
- `ZITADEL_MASTERKEY`: master key do Zitadel
- `BETELHUB_RELATORIOS_NOMEIGREJA` / `BETELHUB_RELATORIOS_LOGO`: cabeçalho dos PDFs

## Subir Postgres + API

```bash
docker compose up -d postgres api
```

Serviços:

- API: `http://localhost:8081/api`
- Health: `http://localhost:8081/actuator/health`
- PostgreSQL: `localhost:5432` (`betelhub` / `betelhub`)

Zitadel (opcional, não usado no piloto): `docker compose --profile auth up -d zitadel`.

## Build da API

```bash
# local (JDK 25)
cd apps/api
mvn clean package -DskipTests

# alternativa via Docker
docker compose build api
```

## Frontend

```bash
cd apps/web
npm install
npm run dev          # http://localhost:5173
npm run dev:api      # força a API real (http://localhost:8081)
npm run dev:mocks    # força os mocks (MSW)
```

O Vite faz proxy de `/api` para `http://localhost:8081`.

## Limpar dados antes do E2E real

O E2E real espera banco limpo:

```bash
docker exec betelhub-postgres psql -U betelhub -d betelhub -c "TRUNCATE presencas_ebd, aulas_professores, aulas_ebd, matriculas, turmas_professores, professores, turmas, membros RESTART IDENTITY CASCADE;"
```
