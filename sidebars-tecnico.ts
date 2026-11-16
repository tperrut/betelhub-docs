import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tecnicoSidebar: [
    'intro',
    'arquitetura',
    {
      type: 'category',
      label: 'Módulos',
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
              label: 'API',
              items: [
                'modulos/membros/api/dashboard-igreja',
                'modulos/membros/api/listagem',
                'modulos/membros/api/cadastro-edicao',
              ],
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
              label: 'API',
              items: [
                'modulos/escola-dominical/api/dashboard',
                'modulos/escola-dominical/api/turmas',
                'modulos/escola-dominical/api/professores',
                'modulos/escola-dominical/api/alunos',
                'modulos/escola-dominical/api/chamada',
                'modulos/escola-dominical/api/aulas',
                'modulos/escola-dominical/api/relatorios',
              ],
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
      label: 'Propostas e decisões',
      items: ['propostas/intro', 'propostas/financeiro-ebd'],
    },
    'frontend',
    'api',
    {
      type: 'category',
      label: 'Operação',
      items: ['operacao/rodando-local', 'operacao/testes'],
    },
  ],
};

export default sidebars;
