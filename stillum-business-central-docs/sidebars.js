module.exports = {
  tutorialSidebar: [
    'intro',
    'roadmap',
    {
      type: 'category',
      label: 'Fasi di Sviluppo',
      items: [
        'phase-0',
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