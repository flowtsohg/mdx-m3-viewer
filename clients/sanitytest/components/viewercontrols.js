class ViewerControls extends Component {
  constructor(viewer, options) {
    super({ ...options, className: 'viewer-controls' });

    this.viewer = viewer;

    // Run animations.
    let container = createElement({ container: this.container });

    createElement({ textContent: 'Run Animations:', container });
    this.animationToggle = new Toggle('Yes', 'No', (e) => {
      if (e.clicked) {
        this.viewer.viewer.frameTime = 0;
      } else {
        this.viewer.viewer.frameTime = 1000 / 60;
      }
    }, { className: 'controls', container });

    // Cycle animations.
    container = createElement({ container: this.container });

    createElement({ textContent: 'Cycle Animations:', container });
    this.cycleToggle = new Toggle('Yes', 'No', null, { className: 'controls', container });

    // Select animations.
    container = createElement({ container: this.container });

    createElement({ textContent: 'Animations:', container });
    this.sequencesElement = createElement({
      tagName: 'select', className: 'controls', onchange: () => {
        if (!this.cycleToggle.clicked) {
          this.cycleToggle.toggle();
        }

        this.viewer.setSequence(this.sequencesElement.selectedIndex - 1);
      }, container
    });

    // Frame.
    container = createElement({ container: this.container });

    createElement({ textContent: 'Frame:', container });
    this.frameElement = createElement({ container });
  }

  frame(frame) {
    this.frameElement.textContent = `${Math.floor(frame)}`;
  }

  updateSequences(instance) {
    let select = this.sequencesElement;

    for (let l = select.options.length - 1, i = l; i >= 0; i--) {
      select.remove(i);
    }

    select.add(createElement({ tagName: 'option', textContent: 'None' }));

    for (let sequence of instance.model.sequences) {
      select.add(createElement({ tagName: 'option', textContent: sequence.name }));
    }
  }

  setSequence(sequence) {
    if (this.sequencesElement.options.length === 1) {
      sequence = -1;
    }

    this.sequencesElement.selectedIndex = sequence + 1;
  }
}
