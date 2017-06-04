// Load a model and create an instance.
UnitTester.addTest("mdx-load", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, -50, -90]);

    let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
        view = model.addView(),
        instance = model.addInstance();

    view.addInstance(instance);
    scene.addView(view);

    instance.noCulling = true; // :(
});

// Get to a specific frame of animation in a sequence.
UnitTester.addTest("mdx-sequence", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, -50, -90]);

    let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
        view = model.addView(),
        instance = model.addInstance();

    view.addInstance(instance);
    scene.addView(view);

    instance.setSequence(0);
    instance.frame = 800;

    instance.noCulling = true; // :(
});

// Change team colors.
UnitTester.addTest("mdx-team-color", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, -50, -90]);

    let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
        view = model.addView(),
        instance = model.addInstance();

    view.addInstance(instance);
    scene.addView(view);

    instance.setTeamColor(1);

    instance.noCulling = true; // :(
});

// Change tint colors.
UnitTester.addTest("mdx-tint-color", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, -50, -90]);

    let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
        view = model.addView(),
        instance = model.addInstance();

    view.addInstance(instance);
    scene.addView(view);

    instance.setTintColor([255, 0, 0]);

    instance.noCulling = true; // :(
});

// Texture animations (both image based and UV offset based).
UnitTester.addTest("mdx-texture-animation", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, -50, -90]);

    let model = viewer.load("Units/Human/WaterElemental/WaterElemental.mdx", wc3Solver),
        view = model.addView(),
        instance = model.addInstance();

    view.addInstance(instance);
    scene.addView(view);

    instance.setSequence(0);
    instance.frame = 800;

    instance.noCulling = true; // :(
});

// Particle emitters type 1.
UnitTester.addTest("mdx-particle-emitter", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, -60, -70]);

    let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
        view = model.addView(),
        instance = model.addInstance();

    view.addInstance(instance);
    scene.addView(view);

    instance.setSequence(5);

    instance.noCulling = true; // :(

    instance.whenLoaded(() => {
        for (let i = 0; i < 20; i++) {
            viewer.update();
        }
    });
});

// Particle emitters type 2.
UnitTester.addTest("mdx-particle-emitter-2", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 20, -200]);

    let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
        view = model.addView(),
        instance = model.addInstance();

    view.addInstance(instance);
    scene.addView(view);

    instance.setSequence(1);

    instance.noCulling = true; // :(

    instance.whenLoaded(() => {
        for (let i = 0; i < 90; i++) {
            viewer.update();
        }
    });
});

// Attachments that define model paths.
UnitTester.addTest("mdx-attachment-model", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -400]);

    let model = viewer.load("Buildings/Undead/HauntedMine/HauntedMine.mdx", wc3Solver),
        view = model.addView(),
        instance = model.addInstance();

    view.addInstance(instance);
    scene.addView(view);

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
});
