class MdlView extends Component {
  constructor(mdl) {
    super({ className: 'mdl-view' });

    this.structureElement = createElement({ className: 'mdl-structure', container: this.container });
    this.sourceElement = createElement({ tagName: 'pre', className: 'mdl-source', container: this.container });

    this.nodes = [];
    this.visibleNode = null;

    for (let node of mdl.nodes) {
      this.nodes.push(new MdlViewNode(this, node, this.structureElement));
    }
  }

  showNode(node) {
    if (this.visibleNode) {
      this.visibleNode.normal();
    }

    this.visibleNode = node;

    node.highlight();

    this.sourceElement.textContent = node.node.source;
  }
}

class MdlViewNode extends Component {
  constructor(view, node, parentElement) {
    super({ className: 'clickable highlightable', textContent: node.name, container: parentElement });

    this.container.addEventListener('click', () => view.showNode(this));

    this.node = node;
    this.nodes = [];

    if (node.nodes && node.nodes.length) {
      let container = createElement({ className: 'indent' });

      for (let child of node.nodes) {
        this.nodes.push(new MdlViewNode(view, child, container));
      }

      parentElement.appendChild(container);
    }
  }
}
