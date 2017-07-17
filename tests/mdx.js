function wc3Solver(path) {
    return ["../resources/warcraft/" + path, path.substr(path.lastIndexOf(".")), true];
}


let mdxTests = [
    ["mdx-load", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -50, -90]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);

        instance.noCulling = true; // :(
    }],

    ["mdx-sequence", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -50, -90]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);

        instance.setSequence(0);
        instance.frame = 800;

        instance.noCulling = true; // :(
    }],

    ["mdx-team-color", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -50, -90]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);

        instance.setTeamColor(1);

        instance.noCulling = true; // :(
    }],

    ["mdx-vertex-color", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -50, -90]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);

        instance.setVertexColor([255, 0, 0, 255]);

        instance.noCulling = true; // :(
    }],

    ["mdx-texture-animation", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -50, -90]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Human/WaterElemental/WaterElemental.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);

        instance.setSequence(0);
        instance.frame = 800;

        instance.noCulling = true; // :(
    }],

    ["mdx-billboarding", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([30, -20, -180]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-45)));

        let model = viewer.load("units/creeps/gnoll/gnoll.mdx", wc3Solver),
            instance = model.addInstance().setSequence(1).setSequenceLoopMode(2);

        scene.addInstance(instance);

        // Rotate also the instance, to be sure billboarding works in all cases.
        // It happened in a past implementation that billboaring worked as long as the instance isn't rotated.
        // Needless to say, it took a long time to find that bug.
        instance.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-45)));

        instance.frame = 800;
    }],

    ["mdx-attachment-model", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -400]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Buildings/Undead/HauntedMine/HauntedMine.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);

        instance.setSequence(0);

        viewer.whenAllLoaded(() => {
            instance.frame = 20000;

            // update() is used here, because when an attachment becomes visible for the first time, the parent instance resets its sequence.
            // If the attachment's frame was set without first updating, it will just get reset to the sequence's beginning.
            viewer.update();

            let attachment = instance.attachments[0].internalInstance;

            attachment.noCulling = true; // :(
            attachment.frame = instance.frame;
        });
    }],

    ["mdx-particle-emitter", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -60, -70]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);

        instance.setSequence(5);

        instance.noCulling = true; // :(

        instance.whenLoaded(() => {
            for (let i = 0; i < 20; i++) {
                viewer.update();
            }
        });
    }],

    ["mdx-particle-emitter-2", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 20, -200]);
        camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
        camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

        let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
            instance = model.addInstance();

        scene.addInstance(instance);

        instance.setSequence(1);

        instance.noCulling = true; // :(

        instance.whenLoaded(() => {
            for (let i = 0; i < 90; i++) {
                viewer.update();
            }
        });
    }],

    ["mdx-ribbon-emitter", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -50, -200]);
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
