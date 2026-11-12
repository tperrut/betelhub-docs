# Documentação do Betelhub

Site de documentação construído com [Docusaurus](https://docusaurus.io/).

Publicado em: **https://tperrut.github.io/betelhub-docs/**

## Desenvolvimento

```bash
npm install
npm run start
```

Abre em `http://localhost:3000/betelhub-docs/` e recarrega ao editar os arquivos em `docs/`.

## Build

```bash
npm run build
npm run serve
```

O conteúdo está em `docs/`. A configuração fica em `docusaurus.config.ts` e a
navegação lateral em `sidebars.ts`.

## Deploy

O deploy é automático via GitHub Actions (`.github/workflows/deploy-docs.yml`)
sempre que houver push na branch `main`.

Para publicar, no GitHub do repositório: **Settings → Pages → Build and deployment**
e selecione **Source: GitHub Actions**. Também é possível disparar manualmente em
**Actions → Deploy docs → Run workflow**.
