class ViewerControls extends Component {
  constructor(viewer, options) {
    super({ ...options, className: 'viewer-controls' });

    this.viewer = viewer;

    // Extent.
    let container = createElement({ container: this.container });

    createElement({ textContent: 'Show extents:', container });
    this.extentElement = createElement({
      tagName: 'select', className: 'controls', onchange: () => this.viewer.updateExtents(), container
    });

    this.extentElement.add(createElement({ tagName: 'option', textContent: 'No' }));
    this.extentElement.add(createElement({ tagName: 'option', textContent: 'Box' }));
    this.extentElement.add(createElement({ tagName: 'option', textContent: 'Sphere' }));
    this.extentElement.add(createElement({ tagName: 'option', textContent: 'Both' }));
    this.extentElement.selectedIndex = 1;

    // Run animations.
    container = createElement({ container: this.container });

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

    // Camera.
    container = createElement({ container: this.container });

    createElement({ textContent: 'Camera:', container });
    this.camerasElement = createElement({ tagName: 'select', className: 'controls', onchange: () => this.viewer.setCamera(this.camerasElement.selectedIndex - 1), container });
  }

  frame(frame) {
    this.frameElement.textContent = `${Math.floor(frame)}`;
  }

  updateInstance(instance) {
    clearSelect(this.sequencesElement);

    this.sequencesElement.add(createElement({ tagName: 'option', textContent: 'None' }));

    for (let sequence of instance.model.sequences) {
      this.sequencesElement.add(createElement({ tagName: 'option', textContent: sequence.name }));
    }

    clearSelect(this.camerasElement);

    this.camerasElement.add(createElement({ tagName: 'option', textContent: 'None' }));

    for (let camera of instance.model.cameras) {
      this.camerasElement.add(createElement({ tagName: 'option', textContent: camera.name }));
    }
  }

  setSequence(sequence) {
    if (this.sequencesElement.options.length === 1) {
      sequence = -1;
    }

    this.sequencesElement.selectedIndex = sequence + 1;
  }

  setCamera(camera) {
    this.camerasElement.selectedIndex = camera + 1;
  }
}
