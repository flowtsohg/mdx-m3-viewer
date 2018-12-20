let geoTests = {
  name: 'geo',
  tests: [
    {
      name: 'rectangle',
      tests: [
        {
          name: 'faces',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitRectangle(), material: {renderMode: 0}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitRectangle(), material: {renderMode: 1}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'faces-and-edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitRectangle(), material: {renderMode: 2}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitRectangle(), material: {renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'edge-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitRectangle(), material: {renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-and-edge-colors',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitRectangle(), material: {renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'texture',
          load(viewer) {
            let texture = viewer.load('resources/checkers.jpg', (path) => [path, '.jpg', true]);

            return viewer.load({geometry: geometry.createUnitRectangle(), material: {texture}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },
      ],
    },

    {
      name: 'cube',
      tests: [
        {
          name: 'faces',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCube(), material: {renderMode: 0}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 160]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCube(), material: {renderMode: 1}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 160]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'faces-and-edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCube(), material: {renderMode: 2}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 160]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCube(), material: {renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 160]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'edge-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCube(), material: {renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 160]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-and-edge-colors',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCube(), material: {renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 160]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'texture',
          load(viewer) {
            let texture = viewer.load('resources/checkers.jpg', (path) => [path, '.jpg', true]);

            return viewer.load({geometry: geometry.createUnitCube(), material: {texture}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 160]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },
      ],
    },

    {
      name: 'sphere',
      tests: [
        {
          name: 'faces',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitSphere(20, 20), material: {renderMode: 0}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitSphere(20, 20), material: {renderMode: 1}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'faces-and-edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitSphere(20, 20), material: {renderMode: 2}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitSphere(20, 20), material: {renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'edge-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitSphere(20, 20), material: {renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-and-edge-colors',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitSphere(20, 20), material: {renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'texture',
          load(viewer) {
            let texture = viewer.load('resources/checkers.jpg', (path) => [path, '.jpg', true]);

            return viewer.load({geometry: geometry.createUnitSphere(20, 20), material: {texture}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 120]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },
      ],
    },

    {
      name: 'cylinder',
      tests: [
        {
          name: 'faces',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCylinder(20), material: {renderMode: 0}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 150]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCylinder(20), material: {renderMode: 1}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 150]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'faces-and-edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCylinder(20), material: {renderMode: 2}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 150]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCylinder(20), material: {renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 150]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'edge-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCylinder(20), material: {renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 150]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-and-edge-colors',
          load(viewer) {
            return viewer.load({geometry: geometry.createUnitCylinder(20), material: {renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 150]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },

        {
          name: 'texture',
          load(viewer) {
            let texture = viewer.load('resources/checkers.jpg', (path) => [path, '.jpg', true]);

            return viewer.load({geometry: geometry.createUnitCylinder(20), material: {texture}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.move([0, 0, 150]);

            let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], [1, 0, 0], Math.PI / 8));

            scene.addInstance(instance);
          },
        },
      ],
    },

    {
      name: 'frustum',
      tests: [
        {
          name: 'faces',
          load(viewer) {
            return viewer.load({geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: {renderMode: 0}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.moveToAndFace([150, 0, 200], [0, 0, 60], [0, 0, 1]);

            let instance = model.addInstance();

            scene.addInstance(instance);
          },
        },

        {
          name: 'edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: {renderMode: 1}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.moveToAndFace([150, 0, 200], [0, 0, 60], [0, 0, 1]);

            let instance = model.addInstance();

            scene.addInstance(instance);
          },
        },

        {
          name: 'faces-and-edges',
          load(viewer) {
            return viewer.load({geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: {renderMode: 2}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.moveToAndFace([150, 0, 200], [0, 0, 60], [0, 0, 1]);

            let instance = model.addInstance();

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: {renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.moveToAndFace([150, 0, 200], [0, 0, 60], [0, 0, 1]);

            let instance = model.addInstance();

            scene.addInstance(instance);
          },
        },

        {
          name: 'edge-color',
          load(viewer) {
            return viewer.load({geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: {renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.moveToAndFace([150, 0, 200], [0, 0, 60], [0, 0, 1]);

            let instance = model.addInstance();

            scene.addInstance(instance);
          },
        },

        {
          name: 'vertex-and-edge-colors',
          load(viewer) {
            return viewer.load({geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: {renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255])}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.moveToAndFace([150, 0, 200], [0, 0, 60], [0, 0, 1]);

            let instance = model.addInstance();

            scene.addInstance(instance);
          },
        },

        {
          name: 'texture',
          load(viewer) {
            let texture = viewer.load('resources/checkers.jpg', (path) => [path, '.jpg', true]);

            return viewer.load({geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: {texture}}, geoSolver);
          },
          test(viewer, scene, camera, model) {
            camera.moveToAndFace([150, 0, 200], [0, 0, 60], [0, 0, 1]);

            let instance = model.addInstance();

            scene.addInstance(instance);
          },
        },
      ],
    },

    {
      name: 'texture-overriding',
      load(viewer) {
        let texture = viewer.load('resources/checkers.jpg', (path) => [path, '.jpg', true]);
        let texture2 = viewer.load('resources/colored-checkers.jpg', (path) => [path, '.jpg', true]);

        return [texture, texture2];
      },
      test(viewer, scene, camera, textures) {
        let model = viewer.load({geometry: geometry.createUnitRectangle(), material: {texture: textures[0]}}, geoSolver);

        camera.move([0, 0, 200]);

        let instance = model.addInstance().move([-41, 0, 0]).uniformScale(40);
        let instance2 = model.addInstance().move([41, 0, 0]).uniformScale(40);

        instance2.setTexture(null, textures[1]);

        scene.addInstance(instance);
        scene.addInstance(instance2);
      },
    },
  ],
};
