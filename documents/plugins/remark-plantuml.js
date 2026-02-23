/**
 * Remark plugin: blocchi ```plantuml vengono sostituiti con immagini
 * generate dal server pubblico PlantUML (sistema nativo PlantUML).
 */
const { visit } = require('unist-util-visit');

const PLANTUML_SERVER = 'https://www.plantuml.com/plantuml/svg';

function remarkPlantUml() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || node.lang !== 'plantuml') return;
      try {
        const encoder = require('plantuml-encoder');
        const encoded = encoder.encode(node.value);
        const url = `${PLANTUML_SERVER}/${encoded}`;
        const imageNode = {
          type: 'image',
          url,
          alt: node.meta || 'Diagramma PlantUML',
          title: null,
          position: node.position,
        };
        parent.children[index] = imageNode;
      } catch (e) {
        // In build fallback: lasciare il blocco codice o un placeholder
        console.warn('remark-plantuml: encode failed', e?.message || e);
      }
    });
  };
}

module.exports = remarkPlantUml;
