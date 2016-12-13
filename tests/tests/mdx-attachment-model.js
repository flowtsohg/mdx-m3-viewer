unitTester.addTest("mdx-attachment-model", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([10, -130, -320]);

    let model = viewer.load("Buildings/Undead/HauntedMine/HauntedMine.mdx", wc3Solver),
        instance = model.addInstance().setSequence(0);

    viewer.whenAllLoaded(() => {
        instance.frame = 20000;

        // This update is used here, because when an attachment becomes visible for the first time, the parent instance resets its sequence.
        // If the attachment's frame was set without first updating, it will just get reset to the sequence's beginning.
        viewer.update();

        let attachment = instance.modelAttachments[0][1];

        attachment.noCulling = true;
        attachment.frame = instance.frame;
    });
})
