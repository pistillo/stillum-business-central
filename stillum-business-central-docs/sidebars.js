module.exports = {
  tutorialSidebar: [
    'intro',
    'roadmap',
    {
      type: 'category',
      label: 'Fasi di Sviluppo',
      items: [
        {
          type: 'category',
          label: 'Fase 0',
          items: [
            'phase-0',
            'phase0-requirements',
            'phase0-data-model',
            'phase0-tech-stack',
            'phase0-dev-environment',
          ],
        },
        {
          type: 'category',
          label: 'Fase 1',
          items: [
            'phase-1',
            'phase1-registry-api',
            'phase1-publisher',
            'phase1-storage',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Architettura',
      items: [
        'architecture/overview',
        'architecture/components',
        'architecture/runtime',
        'architecture/diagram',
      ],
    },
    {
      type: 'category',
      label: 'Moduli',
      items: [
        'modules/portal-ui',
        'modules/registry',
        'modules/publisher',
        'modules/runtime-gateway',
        'modules/authentication',
        'modules/lifecycle',
        'modules/multi-tenancy',
        'modules/catalogue',
        'modules/instances',
        'modules/developer-mode',
        'modules/deployment',
        'modules/future',
      ],
    },
  ],
};