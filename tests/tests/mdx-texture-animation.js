unitTester.addTest("mdx-texture-animation", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -400]);
    camera.setRotation(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
    camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-45)));
    camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-30)));

    let model = viewer.load("Units/Human/WaterElemental/WaterElemental.mdx", wc3Solver),
        instance = model.addInstance().setSequence(0);


    instance.whenLoaded(() => {
        for (let i = 0; i < 11; i++) {
            viewer.updateAndRender();
        }
    });
});
