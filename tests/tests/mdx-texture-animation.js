unitTester.addTest("mdx-texture-animation", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -220]);

    let model = viewer.load("Units/Human/WaterElemental/WaterElemental.mdx", wc3Solver),
        instance = model.addInstance().setSequence(0);

    instance.frame = 800;
});
