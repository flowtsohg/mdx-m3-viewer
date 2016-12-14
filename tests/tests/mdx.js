// Load a model and create an instance.
UnitTester.addTest("mdx-load", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
        instance = model.addInstance();
});

// Get to a specific frame of animation in a sequence.
UnitTester.addTest("mdx-sequence", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
        instance = model.addInstance().setSequence(0);

    instance.frame = 800;
});

// Change team colors.
UnitTester.addTest("mdx-team-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 15, -95]);

    viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver).addInstance().setTeamColor(1);
});

// Change tint colors.
UnitTester.addTest("mdx-tint-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver).addInstance().setTintColor([255, 0, 0]);
});

// Texture animations (both image based and UV offset based).
UnitTester.addTest("mdx-texture-animation", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -220]);

    let model = viewer.load("Units/Human/WaterElemental/WaterElemental.mdx", wc3Solver),
        instance = model.addInstance().setSequence(0);

    instance.frame = 800;
});

// Particle emitters type 1.
UnitTester.addTest("mdx-particle-emitter", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -150]);

    let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
        instance = model.addInstance().setSequence(5);


    instance.whenLoaded(() => {
        for (let i = 0; i < 20; i++) {
            viewer.update();
        }
    });
});

// Particle emitters type 2.
UnitTester.addTest("mdx-particle-emitter-2", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([-150, 0, -120]);

    let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
        instance = model.addInstance().setSequence(1);

    instance.noCulling = true;

    instance.whenLoaded(() => {
        for (let i = 0; i < 90; i++) {
            viewer.update();
        }
    });
});

// Attachments that define model paths.
UnitTester.addTest("mdx-attachment-model", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([10, -130, -320]);

    let model = viewer.load("Buildings/Undead/HauntedMine/HauntedMine.mdx", wc3Solver),
        instance = model.addInstance().setSequence(0);

    viewer.whenAllLoaded(() => {
        instance.frame = 20000;

        // update() is used here, because when an attachment becomes visible for the first time, the parent instance resets its sequence.
        // If the attachment's frame was set without first updating, it will just get reset to the sequence's beginning.
        viewer.update();

        let attachment = instance.modelAttachments[0][1];

        attachment.noCulling = true;
        attachment.frame = instance.frame;
    });
});
