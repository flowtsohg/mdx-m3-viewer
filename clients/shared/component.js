class Component {
  constructor(options) {
    this.container = createElement({ ...options, component: this });
  }

  hide() {
    hideElement(this.container);
  }

  show() {
    showElement(this.container);
  }

  highlight() {
    this.container.classList.add('highlighted');
  }

  normal() {
    this.container.classList.remove('highlighted');
  }
}
