unitTester.addTest("mdx-particle-emitter-2", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -400]);
    camera.setRotation(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
    camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-45)));
    camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-30)));

    let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
        instance = model.addInstance().setSequence(1);


    instance.whenLoaded(() => {
        for (let i = 0; i < 65; i++) {
            viewer.updateAndRender();
        }
    });
});
