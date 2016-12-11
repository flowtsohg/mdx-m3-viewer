unitTester.addTest("mdx-sequence", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -300]);
    camera.setRotation(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
    camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-45)));
    camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-30)));

    let model = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver),
        instance = model.addInstance().setSequence(0);

    instance.whenLoaded(() => {
        for (let i = 0; i < 20; i++) {
            viewer.updateAndRender();
        }
    });
});
