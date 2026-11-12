import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'arquitetura',
    {
      type: 'category',
      label: 'Módulos implementados',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Membros',
          collapsed: false,
          items: [
            'modulos/membros/visao-geral',
            {
              type: 'category',
              label: 'Dashboard da igreja',
              link: {type: 'doc', id: 'modulos/membros/dashboard-igreja'},
              items: ['modulos/membros/api/dashboard-igreja'],
            },
            {
              type: 'category',
              label: 'Listagem de membros',
              link: {type: 'doc', id: 'modulos/membros/listagem'},
              items: ['modulos/membros/api/listagem'],
            },
            {
              type: 'category',
              label: 'Cadastro e edição',
              link: {type: 'doc', id: 'modulos/membros/cadastro-edicao'},
              items: ['modulos/membros/api/cadastro-edicao'],
            },
          ],
        },
        {
          type: 'category',
          label: 'Escola Dominical (EBD)',
          collapsed: false,
          items: [
            'modulos/escola-dominical/visao-geral',
            {
              type: 'category',
              label: 'Dashboard EBD',
              link: {type: 'doc', id: 'modulos/escola-dominical/dashboard'},
              items: ['modulos/escola-dominical/api/dashboard'],
            },
            {
              type: 'category',
              label: 'Turmas',
              link: {type: 'doc', id: 'modulos/escola-dominical/turmas'},
              items: ['modulos/escola-dominical/api/turmas'],
            },
            {
              type: 'category',
              label: 'Professores',
              link: {type: 'doc', id: 'modulos/escola-dominical/professores'},
              items: ['modulos/escola-dominical/api/professores'],
            },
            {
              type: 'category',
              label: 'Alunos',
              link: {type: 'doc', id: 'modulos/escola-dominical/alunos'},
              items: ['modulos/escola-dominical/api/alunos'],
            },
            {
              type: 'category',
              label: 'Chamada',
              link: {type: 'doc', id: 'modulos/escola-dominical/chamada'},
              items: ['modulos/escola-dominical/api/chamada'],
            },
            {
              type: 'category',
              label: 'Aulas',
              link: {type: 'doc', id: 'modulos/escola-dominical/aulas'},
              items: ['modulos/escola-dominical/api/aulas'],
            },
            {
              type: 'category',
              label: 'Relatórios',
              link: {type: 'doc', id: 'modulos/escola-dominical/relatorios'},
              items: ['modulos/escola-dominical/api/relatorios'],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'DDD',
      items: ['ddd/intro', 'ddd/membros', 'ddd/escola-dominical'],
    },
    {
      type: 'category',
      label: 'Referência',
      items: ['api', 'frontend'],
    },
    {
      type: 'category',
      label: 'Operação',
      items: ['rodando-local', 'testes'],
    },
  ],
};

export default sidebars;
