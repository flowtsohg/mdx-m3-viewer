import { quat } from "gl-matrix";
import createPrimitive from "../../../src/utils/mdlx/primitives/createprimitive";
import { createUnitRectangle, createUnitCube, createUnitSphere, createUnitCylinder, createFrustum } from "../../../src/utils/mdlx/primitives/primitives";

export const mdxPrimitivesTests = {
  name: 'mdx-primitives',
  tests: [
    {
      name: 'rectangle',
      tests: [
        {
          name: 'faces',
          load(viewer) {
            return createPrimitive(viewer, createUnitRectangle());
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
            return createPrimitive(viewer, createUnitRectangle(), { lines: true });
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
            return createPrimitive(viewer, createUnitRectangle(), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, createUnitRectangle(), { lines: true, color: new Float32Array([0, 1, 0]) });
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
            let texture = viewer.load('resources/checkers.jpg');

            return createPrimitive(viewer, createUnitRectangle(), { texture });
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
            return createPrimitive(viewer, createUnitCube());
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
            return createPrimitive(viewer, createUnitCube(), { lines: true });
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
            return createPrimitive(viewer, createUnitCube(), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, createUnitCube(), { lines: true, color: new Float32Array([0, 1, 0]) });
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
            let texture = viewer.load('resources/checkers.jpg');

            return createPrimitive(viewer, createUnitCube(), { texture });
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
            return createPrimitive(viewer, createUnitSphere(20, 20));
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
            return createPrimitive(viewer, createUnitSphere(20, 20), { lines: true });
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
            return createPrimitive(viewer, createUnitSphere(20, 20), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, createUnitSphere(20, 20), { lines: true, color: new Float32Array([0, 1, 0]) });
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
            let texture = viewer.load('resources/checkers.jpg');

            return createPrimitive(viewer, createUnitSphere(20, 20), { texture });
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
            return createPrimitive(viewer, createUnitCylinder(20));
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
            return createPrimitive(viewer, createUnitCylinder(20), { lines: true });
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
            return createPrimitive(viewer, createUnitCylinder(20), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, createUnitCylinder(20), { lines: true, color: new Float32Array([0, 1, 0]) });
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
            let texture = viewer.load('resources/checkers.jpg');

            return createPrimitive(viewer, createUnitCylinder(), { texture });
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
            return createPrimitive(viewer, createFrustum(Math.PI / 4, 0.75, 8, 120));
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
            return createPrimitive(viewer, createFrustum(Math.PI / 4, 0.75, 8, 120), { lines: true });
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
            return createPrimitive(viewer, createFrustum(Math.PI / 4, 0.75, 8, 120), { color: new Float32Array([1, 0, 0]) });
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
            return createPrimitive(viewer, createFrustum(Math.PI / 4, 0.75, 8, 120), { lines: true, color: new Float32Array([0, 1, 0]) });
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
            let texture = viewer.load('resources/checkers.jpg');

            return createPrimitive(viewer, createFrustum(Math.PI / 4, 0.75, 8, 120), { texture });
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
