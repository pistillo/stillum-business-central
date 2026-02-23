module.exports = {
  tutorialSidebar: [
    'intro',
    'roadmap',
    'piano-di-sviluppo',
    {
      type: 'category',
      label: 'Fasi di Sviluppo',
      items: [
        {
          type: 'category',
          label: 'Setup e Fondamenta',
          items: [
            'epic0-stato',
            'epic0-obiettivo',
            'epic0-requisiti',
            'epic0-modello-dati',
            'epic0-stack-tecnologico',
            'epic0-ambiente-di-sviluppo',
          ],
        },
        {
          type: 'category',
          label: 'Fase 1',
          items: [
            'phase1-overview',
            'phase1-registry-api',
            'phase1-publisher',
            'phase1-storage',
          ],
        },
        {
          type: 'category',
          label: 'Fase 2',
          items: [
            'phase2-overview',
            'phase2-portal-ui',
          ],
        },
        {
          type: 'category',
          label: 'Fase 3',
          items: [
            'phase3-overview',
          ],
        },
        {
          type: 'category',
          label: 'Fase 4',
          items: [
            'phase4-overview',
          ],
        },
        {
          type: 'category',
          label: 'Fase 5',
          items: [
            'phase5-overview',
          ],
        },
        {
          type: 'category',
          label: 'Fase 6',
          items: [
            'phase6-overview',
          ],
        },
        {
          type: 'category',
          label: 'Fase 7',
          items: [
            'phase7-overview',
          ],
        },
        {
          type: 'category',
          label: 'Fase 8',
          items: [
            'phase8-overview',
          ],
        },
        {
          type: 'category',
          label: 'Fase 9',
          items: [
            'phase9-overview',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Architettura',
      items: [
        'architecture/architecture-overview',
        'architecture/architecture-components',
        'architecture/architecture-runtime',
        'architecture/architecture-diagram',
      ],
    },
    {
      type: 'category',
      label: 'Moduli',
      items: [
        'modules/modules-portal-ui',
        'modules/modules-registry',
        'modules/modules-publisher',
        'modules/modules-runtime-gateway',
        'modules/modules-authentication',
        'modules/modules-lifecycle',
        'modules/modules-multi-tenancy',
        'modules/modules-catalogue',
        'modules/modules-instances',
        'modules/modules-developer-mode',
        'modules/modules-deployment',
        'modules/modules-future',
      ],
    },
  ],
};
