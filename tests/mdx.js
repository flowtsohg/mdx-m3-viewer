let mdxTests = [
    ["mdx-base", (viewer, scene, camera) => {
        camera.move([0, -55, -140]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);
    }],

    ["mdx-sequence", (viewer, scene, camera) => {
        camera.move([0, -55, -140]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
            instance = model.addInstance().setSequence(0);

        instance.frame = 800;

        scene.addInstance(instance);
        
    }],

    ["mdx-team-color", (viewer, scene, camera) => {
        camera.move([0, -55, -140]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
            instance = model.addInstance().setTeamColor(1);

        scene.addInstance(instance);
    }],

    ["mdx-vertex-color", (viewer, scene, camera) => {
        camera.move([0, -55, -140]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);

        instance.setVertexColor([255, 0, 0, 255]);
    }],

    ["mdx-vertex-and-team-colors", (viewer, scene, camera) => {
        camera.move([0, -55, -140]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
            instance = model.addInstance().setVertexColor([255, 0, 0, 255]).setTeamColor(1);

        scene.addInstance(instance);
    }],

    ["mdx-texture-animation", (viewer, scene, camera) => {
        camera.move([0, -80, -200]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/WaterElemental/WaterElemental.mdx", wc3Solver),
            instance = model.addInstance().setSequence(0);

        instance.frame = 800;

        scene.addInstance(instance);
    }],

    ["mdx-billboarding", (viewer, scene, camera) => {
        camera.move([30, -20, -180]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-45)));

        let model = viewer.load("units/creeps/gnoll/gnoll.mdx", wc3Solver),
            instance = model.addInstance().setSequence(1).setSequenceLoopMode(2);

        // Rotate also the instance, to be sure billboarding works in all cases.
        // It happened in a past implementation that billboaring worked as long as the instance isn't rotated.
        // Needless to say, it took a long time to find that bug.
        instance.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-45)));

        instance.frame = 800;

        scene.addInstance(instance);
    }],

    ["mdx-attachment-model", (viewer, scene, camera) => {
        camera.move([0, 0, -600]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));

        let model = viewer.load("Buildings/Undead/HauntedMine/HauntedMine.mdx", wc3Solver),
            instance = model.addInstance().setSequence(0);

        scene.addInstance(instance);

        viewer.whenAllLoaded(() => {
            instance.frame = 20000;

            // update() is used here, because when an attachment becomes visible for the first time, the parent instance resets its sequence.
            // If the attachment's frame was set without first updating, it will just get reset to the sequence's beginning.
            viewer.update();

            let attachment = instance.attachments[0].internalInstance;

            attachment.frame = instance.frame;
        });
    }],

    ["mdx-particle-emitter", (viewer, scene, camera) => {
        camera.move([0, -60, -150]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
            instance = model.addInstance().setSequence(5);

        scene.addInstance(instance);

        instance.whenLoaded(() => {
            for (let i = 0; i < 30; i++) {
                viewer.update();
            }
        });
    }],

    ["mdx-particle-emitter-2", (viewer, scene, camera) => {
        camera.move([0, 20, -300]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
            instance = model.addInstance().setSequence(1);

        scene.addInstance(instance);

        instance.whenLoaded(() => {
            for (let i = 0; i < 90; i++) {
                viewer.update();
            }
        });
    }],

    ["mdx-ribbon-emitter", (viewer, scene, camera) => {
        camera.move([0, -65, -240]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/HeroPaladin/HeroPaladin.mdx", wc3Solver),
            instance = model.addInstance().setSequence(4).setSequenceLoopMode(2);

        scene.addInstance(instance);

        instance.whenLoaded(() => {
            for (let i = 0; i < 22; i++) {
                viewer.update();
            }
        });
    }]
];
