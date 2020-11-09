let mdxPrimitivesTests = {
  name: 'mdx-primitives',
  tests: [
    {
      name: 'rectangle',
      tests: [
        {
          name: 'faces',
          load(viewer) {
            return createPrimitive(viewer, primitives.createUnitRectangle());
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
            return createPrimitive(viewer, primitives.createUnitRectangle(), { lines: true });
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
            return createPrimitive(viewer, primitives.createUnitRectangle(), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, primitives.createUnitRectangle(), { lines: true, color: new Float32Array([0, 1, 0]) });
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
            return createPrimitive(viewer, primitives.createUnitCube());
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
            return createPrimitive(viewer, primitives.createUnitCube(), { lines: true });
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
            return createPrimitive(viewer, primitives.createUnitCube(), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, primitives.createUnitCube(), { lines: true, color: new Float32Array([0, 1, 0]) });
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
            return createPrimitive(viewer, primitives.createUnitSphere(20, 20));
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
            return createPrimitive(viewer, primitives.createUnitSphere(20, 20), { lines: true });
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
            return createPrimitive(viewer, primitives.createUnitSphere(20, 20), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, primitives.createUnitSphere(20, 20), { lines: true, color: new Float32Array([0, 1, 0]) });
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
            return createPrimitive(viewer, primitives.createUnitCylinder(20));
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
            return createPrimitive(viewer, primitives.createUnitCylinder(20), { lines: true });
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
            return createPrimitive(viewer, primitives.createUnitCylinder(20), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, primitives.createUnitCylinder(20), { lines: true, color: new Float32Array([0, 1, 0]) });
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
            return createPrimitive(viewer, primitives.createFrustum(Math.PI / 4, 0.75, 8, 120));
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
            return createPrimitive(viewer, primitives.createFrustum(Math.PI / 4, 0.75, 8, 120), { lines: true });
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
            return createPrimitive(viewer, primitives.createFrustum(Math.PI / 4, 0.75, 8, 120), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, primitives.createFrustum(Math.PI / 4, 0.75, 8, 120), { lines: true, color: new Float32Array([0, 1, 0]) });
          },
          test(viewer, scene, camera, model) {
            camera.moveToAndFace([150, 0, 200], [0, 0, 60], [0, 0, 1]);

            let instance = model.addInstance();

            scene.addInstance(instance);
          },
        },
      ],
    },
  ],
};
