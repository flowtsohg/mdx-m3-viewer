let baseTests = [
    ["attachments", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -150, -400]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        var mountainKing = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
        var instance1 = mountainKing.addInstance().setSequence(1);
        var instance3 = mountainKing.addInstance().setSequence(1);
        var instance5 = mountainKing.addInstance().setSequence(1);

        let baneling = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver);
        let instance2 = baneling.addInstance().setSequence(0).uniformScale(100);
        let instance4 = baneling.addInstance().setSequence(0).uniformScale(100);
        let instance6 = baneling.addInstance().setSequence(0).uniformScale(100);

        scene.addInstance(instance1);
        scene.addInstance(instance2);
        scene.addInstance(instance3);
        scene.addInstance(instance4);
        scene.addInstance(instance5);
        scene.addInstance(instance6);

        instance1.noCulling = true; // :(
        instance2.noCulling = true; // :(
        instance3.noCulling = true; // :(
        instance4.noCulling = true; // :(
        instance5.noCulling = true; // :(
        instance6.noCulling = true; // :(

        viewer.whenAllLoaded(() => {
            instance2.setParent(instance1.getAttachment(3));
            instance3.setParent(instance2.getAttachment(4));
            instance4.setParent(instance3.getAttachment(3));
            instance5.setParent(instance4.getAttachment(4));
            instance6.setParent(instance5.getAttachment(3));
        });
    }]
];
