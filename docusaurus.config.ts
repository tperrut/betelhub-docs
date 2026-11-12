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
  },

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        // Site somente de documentação: os docs ficam na raiz.
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
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
          title: 'Documentação',
          items: [
            {label: 'Visão geral', to: '/'},
            {label: 'Arquitetura', to: '/arquitetura'},
            {label: 'Como rodar localmente', to: '/rodando-local'},
          ],
        },
        {
          title: 'Referência',
          items: [
            {label: 'Módulo Membros', to: '/modulos/membros/visao-geral'},
            {label: 'Módulo EBD', to: '/modulos/escola-dominical/visao-geral'},
            {label: 'API REST', to: '/api'},
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
