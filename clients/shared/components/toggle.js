class Toggle extends Component {
  constructor(offName, onName, callback, options) {
    super({ ...options, tagName: 'button', textContent: offName, onclick: () => this.toggle() });

    this.offName = offName;
    this.onName = onName;
    this.callback = callback;
    this.clicked = false;
  }

  toggle() {
    this.clicked = !this.clicked;

    if (this.clicked) {
      this.container.textContent = this.onName;
    } else {
      this.container.textContent = this.offName;
    }

    if (this.callback) {
      this.callback(this);
    }
  }
}
