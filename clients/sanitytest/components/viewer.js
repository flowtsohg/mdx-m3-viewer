class Viewer extends Component {
  constructor(tester, options) {
    super({ ...options, className: 'viewer' });

    this.tester = tester;
    this.messages = [];

    let canvas = createElement({ tagName: 'canvas', style: 'width:100%;height:100%', container: this.container });
    this.controls = new ViewerControls(this, { container: this.container });

    let viewer = new ModelViewer.default.viewer.ModelViewer(canvas);
    let scene = viewer.addScene();

    this.viewer = viewer;
    this.scene = scene;

    scene.color.fill(0.2);

    setupCamera(scene);

    viewer.on('loadstart', (e) => {
      tester.logger.log(`[Viewer] Loading ${e.fetchUrl}`);
    });

    viewer.on('loadend', (e) => {
      tester.logger.log(`[Viewer] Loaded ${e.fetchUrl}`);
    });

    viewer.on('error', (e) => {
      if (e.fetchUrl) {
        tester.logger.error(`[Viewer] ${e.error}: ${e.fetchUrl}`);
      } else {
        tester.logger.error(`[Viewer] ${e.error}`);
      }
    });

    viewer.addHandler(ModelViewer.default.viewer.handlers.mdx, localOrHive, false);
    viewer.addHandler(ModelViewer.default.viewer.handlers.blp);
    viewer.addHandler(ModelViewer.default.viewer.handlers.dds);
    viewer.addHandler(ModelViewer.default.viewer.handlers.tga);

    ModelViewer.default.utils.mdlx.createPrimitive(viewer, ModelViewer.default.utils.mdlx.primitives.createUnitRectangle())
      .then((model) => {
        this.textureModel = model;
      });

    let step = () => {
      requestAnimationFrame(step);

      viewer.updateAndRender();

      if (this.visibleInstance) {
        let instance = this.visibleInstance;

        if (instance.sequenceEnded && !this.controls.cycleToggle.clicked) {
          let sequence = instance.sequence + 1;

          if (sequence === instance.model.sequences.length) {
            sequence = 0;
          }

          this.setSequence(sequence);
        }

        this.controls.frame(instance.frame);
      }
    };

    step();
  }

  load(test) {
    this.viewer.load(test.parser, (src) => {
      if (src === test.parser) {
        return src;
      }

      // Used for tests via the API.
      if (test.pathSolver) {
        return test.pathSolver(src);
      }

      return localOrHive(src);
    })
      .then((modelOrTexture) => {
        if (modelOrTexture) {
          let instance;

          if (modelOrTexture instanceof ModelViewer.default.viewer.Model) {
            instance = modelOrTexture.addInstance();
          } else {
            instance = this.textureModel.addInstance();

            instance.scale([modelOrTexture.width, modelOrTexture.height, 1]);
            instance.setTexture(0, modelOrTexture);
          }

          instance.hide();
          instance.setSequenceLoopMode(2);
          instance.setScene(this.scene);

          test.resource = modelOrTexture;
          test.instance = instance;

          this.tryToInjectCustomTextures(test);

          if (test === this.tester.visibleTest) {
            this.render(test);
          }
        }
      });
  }

  render(test) {
    if (test.instance) {
      if (this.visibleInstance) {
        this.visibleInstance.hide();
      }

      this.visibleInstance = test.instance;

      this.controls.updateSequences(test.instance);

      if (test.instance.sequence === -1) {
        this.setSequence(0);
      } else {
        this.setSequence(test.instance.sequence)
      }

      test.instance.show();
    }
  }

  setSequence(index, manual) {
    this.visibleInstance.setSequence(index);
    this.controls.setSequence(index);

    this.viewer.clearEmittedObjects();

    if (manual) {
      this.controls.cycle(false);
    }

  }

  tryToInjectCustomTextures(customTest) {
    // If the given test is a texture, inject it into all of the model tests.
    if (customTest.resource instanceof ModelViewer.default.viewer.Texture) {
      for (let test of this.tester.tests) {
        if (test !== customTest && test.instance && test.resource instanceof ModelViewer.default.viewer.Model) {
          let textures = test.parser.textures;

          for (let i = 0, l = textures.length; i < l; i++) {
            let a = ModelViewer.default.common.path.basename(textures[i].path).toLowerCase();
            let b = ModelViewer.default.common.path.basename(customTest.name).toLowerCase();

            if (a === b) {
              test.instance.setTexture(i, customTest.resource);


              this.tester.logger.info(`Injected ${customTest.name} as a custom texture for ${test.name}`);
            }
          }
        }
      }
    } else {
      // Otherwise, if it's a model test, inject all of the texture tests into it.
      for (let test of this.tester.tests) {
        if (test !== customTest && test.instance && test.resource instanceof ModelViewer.default.viewer.Texture) {
          let textures = customTest.parser.textures;

          for (let i = 0, l = textures.length; i < l; i++) {
            let a = ModelViewer.default.common.path.basename(textures[i].path).toLowerCase();
            let b = ModelViewer.default.common.path.basename(test.name).toLowerCase();

            if (a === b) {
              customTest.instance.setTexture(i, test.resource);

              this.tester.logger.info(`Injected ${test.name} as a custom texture for ${customTest.name}`);
            }
          }
        }
      }
    }
  }
}
