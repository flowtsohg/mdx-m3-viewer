unitTester.addTest("mdx-particle-emitter-2", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([-100, 0, -300]);

    let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
        instance = model.addInstance().setSequence(1);

    instance.whenLoaded(() => {
        for (let i = 0; i < 90; i++) {
            viewer.update();
        }
    });
});
