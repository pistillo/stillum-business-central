module.exports = {
  tutorialSidebar: [
    'intro',
    'roadmap',
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