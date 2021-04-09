class TestResults extends Component {
  constructor(results, mipmaps = null) {
    super();

    this.results = results;
    this.nodes = [];

    if (mipmaps) {
      for (let mipmap of mipmaps) {
        let { width, height, data } = mipmap;

        // Remove alpha.
        for (let i = 0, l = width * height * 4; i < l; i += 4) {
          data[i + 3] = 255;
        }

        let image = ModelViewer.default.common.canvas.imageDataToImage(mipmap);

        image.className = 'padded';

        this.container.appendChild(image);
      }
    }

    let nodes = results.nodes;

    if (nodes.length) {
      for (let node of nodes) {
        this.nodes.push(new TestResultsNode(node, this.container));
      }
    } else {
      this.nodes.push(new TestResultsNode({ type: 'bold', message: 'Passed' }, this.container));
    }
  }

  filter(unused, warnings, severe, errors) {
    for (let node of this.nodes) {
      node.filter(unused, warnings, severe, errors);
    }
  }
}

class TestResultsNode extends Component {
  constructor(node, parentElement) {
    super();

    let className = '';
    let textContent = '';

    if (node.type === 'node') {
      className = 'bold';
      textContent = node.name;
    } else {
      className = node.type;
      textContent = node.message;
    }

    createElement({ className, textContent, container: this.container });

    this.node = node;
    this.nodes = [];

    if (node.type === 'node') {
      if (node.nodes.length || node.uses === 0) {
        let container = createElement({ className: 'indent', container: this.container });

        if (node.uses === 0) {
          this.nodes.push(new TestResultsNode({ type: 'unused', message: 'Not used' }, container));
        }

        for (let child of node.nodes) {
          this.nodes.push(new TestResultsNode(child, container));
        }
      }
    }

    parentElement.appendChild(this.container);
  }

  filter(unused, warnings, severe, errors) {
    if (this.matchFilters(unused, warnings, severe, errors)) {
      if (this.node.type === 'node') {
        for (let child of this.nodes) {
          child.filter(unused, warnings, severe, errors);
        }
      }

      this.show();
    } else {
      this.hide();
    }
  }

  matchFilters(unused, warnings, severe, errors) {
    let node = this.node;

    if (node.type === 'node') {
      return ((node.unused || node.uses === 0) && !unused) || (node.warnings && !warnings) || (node.severe && !severe) || (node.errors && !errors);
    } else {
      let type = node.type;

      return (type === 'unused' && !unused) || (type === 'warning' && !warnings) || (type === 'severe' && !severe) || (type === 'error' && !errors) || type === 'bold';
    }
  }
}
