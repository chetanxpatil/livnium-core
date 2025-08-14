import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'overview',
    'getting-started',
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/alphabet',
        'concepts/grid-and-metrics',
        'concepts/energy-model',
        'concepts/projections',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/alphabet',
        'api/energy',
        'api/grid',
        'api/rotation-moves',
        'api/coupler',
        'api/potts',
        'api/tree-corebit',
        'api/projection',
        'api/arith27',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/encode',
        'examples/energy-demo',
        'examples/moves',
        'examples/coupler',
        'examples/hierarchy-corebit',
        'examples/projections',
      ],
    },
  ],
};
export default sidebars;
