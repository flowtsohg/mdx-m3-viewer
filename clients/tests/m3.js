let m3Tests = {
  name: 'm3',
  tests: [
    {
      name: 'base',
      load(viewer) {
        return viewer.load('Assets/Units/Zerg/Baneling/Baneling.m3', sc2Solver);
      },
      test(viewer, scene, camera, model) {
        camera.moveToAndFace([0, 5, 100], [0, 5, 0], [0, 1, 0]);

        let instance = model.addInstance().uniformScale(50);

        scene.addInstance(instance);
      },
    },

    {
      name: 'sequence',
      load(viewer) {
        return viewer.load('Assets/Units/Zerg/Baneling/Baneling.m3', sc2Solver);
      },
      test(viewer, scene, camera, model) {
        camera.moveToAndFace([0, 5, 100], [0, 5, 0], [0, 1, 0]);

        let instance = model.addInstance().uniformScale(50).setSequence(0);

        instance.frame = 800;

        scene.addInstance(instance);
      },
    },

    {
      name: 'team-color',
      load(viewer) {
        return viewer.load('Assets/Units/Zerg/Baneling/Baneling.m3', sc2Solver);
      },
      test(viewer, scene, camera, model) {
        camera.moveToAndFace([0, 5, 100], [0, 5, 0], [0, 1, 0]);

        let instance = model.addInstance().uniformScale(50).setTeamColor(1);

        scene.addInstance(instance);
      },
    },

    {
      name: 'vertex-color',
      load(viewer) {
        return viewer.load('Assets/Units/Zerg/Baneling/Baneling.m3', sc2Solver);
      },
      test(viewer, scene, camera, model) {
        camera.moveToAndFace([0, 5, 100], [0, 5, 0], [0, 1, 0]);

        let instance = model.addInstance().uniformScale(50).setVertexColor([255, 0, 0, 255]);

        scene.addInstance(instance);
      },
    },

    {
      name: 'vertex-and-team-colors',
      load(viewer) {
        return viewer.load('Assets/Units/Zerg/Baneling/Baneling.m3', sc2Solver);
      },
      test(viewer, scene, camera, model) {
        camera.moveToAndFace([0, 5, 100], [0, 5, 0], [0, 1, 0]);

        let instance = model.addInstance().uniformScale(50).setVertexColor([255, 0, 0, 255]).setTeamColor(1);

        scene.addInstance(instance);
      },
    },

    {
      name: 'texture-overriding',
      load(viewer) {
        return viewer.load('Assets/Units/Zerg/Baneling/Baneling.m3', sc2Solver);
      },
      test(viewer, scene, camera, model) {
        camera.moveToAndFace([0, 5, 140], [0, 5, 0], [0, 1, 0]);

        let instance = model.addInstance().uniformScale(50).move([25, 0, 0]);
        let instance2 = model.addInstance().uniformScale(50).move([-25, 0, 0]);
        let material = model.materials[1][0];

        instance.setTexture(material.layers[0].texture, material.layers[10].texture);

        scene.addInstance(instance);
        scene.addInstance(instance2);
      },
    },
  ],
};
