let baseTests = {
  name: 'base',
  tests: [
    {
      name: 'attachments',
      load(viewer) {
        return [
          viewer.load('Units/Human/Footman/Footman.mdx', wc3Solver),
          viewer.load('Assets/Units/Zerg/Baneling/Baneling.m3', sc2Solver),
        ];
      },
      test(viewer, scene, camera, models) {
        let mountainKing = models[0];
        let baneling = models[1];

        camera.moveToAndFace([450, 0, 160], [0, 0, 160], [0, 0, 1]);

        let instance1 = mountainKing.addInstance().setSequence(1);
        let instance3 = mountainKing.addInstance().setSequence(1);
        let instance5 = mountainKing.addInstance().setSequence(1);

        let instance2 = baneling.addInstance().setSequence(0).uniformScale(100);
        let instance4 = baneling.addInstance().setSequence(0).uniformScale(100);
        let instance6 = baneling.addInstance().setSequence(0).uniformScale(100);

        instance2.setParent(instance1.getAttachment(3));
        instance3.setParent(instance2.getAttachment(4));
        instance4.setParent(instance3.getAttachment(3));
        instance5.setParent(instance4.getAttachment(4));
        instance6.setParent(instance5.getAttachment(3));

        scene.addInstance(instance1);
        scene.addInstance(instance2);
        scene.addInstance(instance3);
        scene.addInstance(instance4);
        scene.addInstance(instance5);
        scene.addInstance(instance6);
      },
    },
  ],
};
