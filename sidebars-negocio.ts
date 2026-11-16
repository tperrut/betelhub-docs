import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  negocioSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Membros',
      collapsed: false,
      items: [
        'modulos/membros/visao-geral',
        'modulos/membros/dashboard-igreja',
        'modulos/membros/listagem',
        'modulos/membros/cadastro-edicao',
      ],
    },
    {
      type: 'category',
      label: 'Escola Dominical (EBD)',
      collapsed: false,
      items: [
        'modulos/escola-dominical/visao-geral',
        'modulos/escola-dominical/dashboard',
        'modulos/escola-dominical/turmas',
        'modulos/escola-dominical/professores',
        'modulos/escola-dominical/alunos',
        'modulos/escola-dominical/chamada',
        'modulos/escola-dominical/aulas',
        'modulos/escola-dominical/relatorios',
      ],
    },
    'glossario',
  ],
};

export default sidebars;
