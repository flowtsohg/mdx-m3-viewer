unitTester.addTest("mdx-tint-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver).addInstance().setTintColor([255, 0, 0]);
})
