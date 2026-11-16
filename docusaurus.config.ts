import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Betelhub',
  tagline: 'Documentação do sistema de gestão de igrejas',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages (projeto): https://tperrut.github.io/betelhub-docs/
  url: 'https://tperrut.github.io',
  baseUrl: '/betelhub-docs/',

  organizationName: 'tperrut',
  projectName: 'betelhub-docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    format: 'mdx',
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'tecnico',
        path: 'docs/tecnico',
        routeBasePath: 'tecnico',
        sidebarPath: './sidebars-tecnico.ts',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs/negocio',
          routeBasePath: 'negocio',
          sidebarPath: './sidebars-negocio.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Betelhub',
      logo: {
        alt: 'Betelhub',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'negocioSidebar',
          position: 'left',
          label: 'Negócio',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tecnicoSidebar',
          docsPluginId: 'tecnico',
          position: 'left',
          label: 'Técnico',
        },
        {
          href: 'https://github.com/tperrut/betelhub',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Negócio',
          items: [
            {label: 'Visão geral', to: '/negocio'},
            {label: 'Membros', to: '/negocio/modulos/membros/visao-geral'},
            {label: 'Escola Dominical', to: '/negocio/modulos/escola-dominical/visao-geral'},
            {label: 'Glossário', to: '/negocio/glossario'},
          ],
        },
        {
          title: 'Técnico',
          items: [
            {label: 'Arquitetura', to: '/tecnico/arquitetura'},
            {label: 'DDD', to: '/tecnico/ddd/intro'},
            {label: 'API REST', to: '/tecnico/api'},
            {label: 'Rodar localmente', to: '/tecnico/operacao/rodando-local'},
          ],
        },
        {
          title: 'Projeto',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/tperrut/betelhub',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Betelhub.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'bash', 'json', 'sql'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
