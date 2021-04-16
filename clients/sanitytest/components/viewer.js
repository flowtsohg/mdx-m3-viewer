class Viewer extends Component {
  constructor(tester, options) {
    super({ ...options, className: 'viewer' });

    this.tester = tester;
    this.messages = [];

    this.canvas = createElement({ tagName: 'canvas', style: 'width:100%;height:100%', container: this.container });
    this.controls = new ViewerControls(this, { container: this.container });

    let viewer = new ModelViewer.default.viewer.ModelViewer(this.canvas);
    let scene = viewer.addScene();

    this.viewer = viewer;
    this.scene = scene;

    this.visibleTest = null;

    scene.color.fill(0.2);

    this.orbitCamera = setupCamera(scene, {
      onManualChange: () => {
        this.setCamera(-1);
        this.controls.setCamera(-1);
      },
    });

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

    viewer.addHandler(ModelViewer.default.viewer.handlers.mdx, localOrHive, true);
    viewer.addHandler(ModelViewer.default.viewer.handlers.blp);
    viewer.addHandler(ModelViewer.default.viewer.handlers.dds);
    viewer.addHandler(ModelViewer.default.viewer.handlers.tga);

    this.textureModel = null;
    this.boxModel = null;
    this.sphereModel = null;

    ModelViewer.default.utils.mdlx.createPrimitive(viewer, ModelViewer.default.utils.mdlx.primitives.createUnitRectangle(), { twoSided: true })
      .then((model) => {
        this.textureModel = model;
      });

    ModelViewer.default.utils.mdlx.createPrimitive(viewer, ModelViewer.default.utils.mdlx.primitives.createUnitCube(), { lines: true })
      .then((model) => {
        this.boxModel = model;
      });

    ModelViewer.default.utils.mdlx.createPrimitive(viewer, ModelViewer.default.utils.mdlx.primitives.createUnitSphere(12, 12), { lines: true })
      .then((model) => {
        this.sphereModel = model;
      });

    let lastTime = performance.now();

    let step = () => {
      requestAnimationFrame(step);

      let now = performance.now();
      let dt = now - lastTime;

      lastTime = now;

      if (this.controls.animationToggle.clicked) {
        viewer.updateAndRender(0);
      } else {
        viewer.updateAndRender(dt);
      }

      if (this.visibleTest) {
        let instance = this.visibleTest.instance;

        if (instance.sequenceEnded) {
          let sequence = instance.sequence;

          if (!this.controls.cycleToggle.clicked) {
            sequence += 1;

            if (sequence === instance.model.sequences.length) {
              sequence = 0;
            }

            this.setSequence(sequence);
          }
        }

        this.controls.frame(instance.frame);
      }
    };

    step();
  }

  load(test) {
    this.viewer.load(test.parser, (src, params) => {
      if (src === test.parser) {
        return src;
      }

      // Used for map and API tests.
      if (test.pathSolver) {
        return test.pathSolver(src, params);
      }

      return localOrHive(src, params);
    })
      .then((modelOrTexture) => {
        if (modelOrTexture) {
          let instance;

          if (modelOrTexture instanceof ModelViewer.default.viewer.Model) {
            instance = modelOrTexture.addInstance();

            let boundingBox = this.boxModel.addInstance();
            boundingBox.hide();
            boundingBox.setScene(this.scene);
            boundingBox.setParent(instance);

            let boundingSphere = this.sphereModel.addInstance();
            boundingSphere.hide();
            boundingSphere.setScene(this.scene);
            boundingSphere.setParent(instance);

            test.boundingBox = boundingBox;
            test.boundingSphere = boundingSphere;

            // let cameraPromises = [];

            // for (let camera of modelOrTexture.cameras) {
            //   console.log(camera)
            //   cameraPromises.push(ModelViewer.default.utils.mdlx.createPrimitive(this.viewer, ModelViewer.default.utils.mdlx.primitives.createFrustum(camera.fieldOfView, this.canvas.width / this.canvas.height, camera.nearClippingPlane, camera.farClippingPlane), { lines: true }));
            // }

            // Promise.all(cameraPromises)
            //   .then((cameraModels) => {
            //     for (let i = 0, l = cameraModels.length; i < l; i++) {
            //       let model = cameraModels[i];
            //       let instance = model.addInstance();

            //       //instance.hide();
            //       instance.setScene(this.scene);

            //       instance.setLocation(modelOrTexture.cameras[i].position);
            //       instance.face(modelOrTexture.cameras[i].targetPosition, [0, 0, 1]);

            //       test.cameras.push(instance);
            //     }
            //   });
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
      if (this.visibleTest) {
        this.visibleTest.instance.hide();

        if (this.visibleTest.boundingBox) {
          this.visibleTest.boundingBox.hide();
          this.visibleTest.boundingSphere.hide();
        }

        // for (let camera of this.visibleTest.cameras) {
        //   camera.hide();
        // }
      }

      this.visibleTest = test;

      if (test.instance.model.sequences.length) {
        this.controls.updateInstance(test.instance);

        if (test.instance.sequence === -1) {
          this.setSequence(0);
        } else {
          this.setSequence(test.instance.sequence)
        }

        this.controls.show();
      } else {
        this.controls.hide();
      }

      test.instance.show();

      this.updateExtents();

      // for (let camera of test.cameras) {
      //   camera.show();
      // }
    }
  }

  updateExtents() {
    if (this.visibleTest && this.visibleTest.boundingBox) {
      let mode = this.controls.extentElement.selectedIndex;

      if (mode === 0 || mode === 2) {
        this.visibleTest.boundingBox.hide();
      } else {
        this.visibleTest.boundingBox.show();
      }

      if (mode === 0 || mode === 1) {
        this.visibleTest.boundingSphere.hide();
      } else {
        this.visibleTest.boundingSphere.show();
      }
    }
  }

  setSequence(index) {
    this.viewer.clearEmittedObjects();

    this.visibleTest.instance.setSequence(index);

    if (this.visibleTest.boundingBox) {
      let extent;

      if (index === -1) {
        extent = this.visibleTest.parser.extent;
      } else {
        extent = this.visibleTest.parser.sequences[index].extent;

        let { max, min } = extent;

        // If this sequence has no extent, use the model extent instead.
        if (max[0] === 0 && max[1] === 0 && max[2] === 0 && min[0] === 0 && min[1] === 0 && min[2] === 0) {
          extent = this.visibleTest.parser.extent;
        }
      }

      let { max, min } = extent;
      let x = (max[0] + min[0]) / 2;
      let y = (max[1] + min[1]) / 2;
      let z = (max[2] + min[2]) / 2;
      let w = (max[0] - min[0]) / 2;
      let d = (max[1] - min[1]) / 2;
      let h = (max[2] - min[2]) / 2;

      this.visibleTest.boundingBox.setLocation([x, y, z]);
      this.visibleTest.boundingBox.setScale([w, d, h]);

      this.visibleTest.boundingSphere.setLocation([x, y, z]);
      this.visibleTest.boundingSphere.setUniformScale(extent.boundsRadius);
    }

    this.controls.setSequence(index);
  }

  setCamera(index) {
    if (index === -1) {
      this.orbitCamera.instance = null;
    } else {
      this.orbitCamera.applyInstanceCamera(this.visibleTest.instance);
    }
  }

  tryToInjectCustomTextures(customTest) {
    // If the given test is a texture, inject it into all of the model tests.
    if (customTest.resource instanceof ModelViewer.default.viewer.Texture) {
      for (let test of this.tester.tests) {
        if (test !== customTest && test.instance && test.resource instanceof ModelViewer.default.viewer.Model) {
          let textures = test.parser.textures;

          for (let i = 0, l = textures.length; i < l; i++) {
            let a = ModelViewer.default.common.path.name(textures[i].path).toLowerCase();
            let b = ModelViewer.default.common.path.name(customTest.name).toLowerCase();

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
            let a = ModelViewer.default.common.path.name(textures[i].path).toLowerCase();
            let b = ModelViewer.default.common.path.name(test.name).toLowerCase();

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
