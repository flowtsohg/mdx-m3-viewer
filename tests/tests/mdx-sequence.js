unitTester.addTest("mdx-sequence", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -150]);

    let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
        instance = model.addInstance().setSequence(0);

    instance.frame = 800;
});
