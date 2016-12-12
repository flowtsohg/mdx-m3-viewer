unitTester.addTest("mdx-particle-emitter", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -300]);

    let model = viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver),
        instance = model.addInstance().setSequence(5);


    instance.whenLoaded(() => {
        for (let i = 0; i < 20; i++) {
            viewer.update();
        }
    });
})
