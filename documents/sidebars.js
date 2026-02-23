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
            'EPIC0/epic0-stato',
            'EPIC0/epic0-obiettivo',
            'EPIC0/epic0-requisiti',
            'EPIC0/epic0-modello-dati',
            'EPIC0/epic0-stack-tecnologico',
            'EPIC0/epic0-ambiente-di-sviluppo',
          ],
        },
        {
          type: 'category',
          label: 'EPIC 1 – MVP Backend',
          items: [
            'EPIC1/epic1-stato',
            'EPIC1/epic1-obiettivo',
            'EPIC1/epic1-requisiti',
            'EPIC1/epic1-modello-dati',
            'EPIC1/epic1-implementazione',
          ],
        },
        {
          type: 'category',
          label: 'EPIC 2 – Portal UI (v0)',
          items: [
            'EPIC2/epic2-stato',
            'EPIC2/epic2-obiettivo',
            'EPIC2/epic2-requisiti',
            'EPIC2/epic2-modello-dati',
            'EPIC2/epic2-implementazione',
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
