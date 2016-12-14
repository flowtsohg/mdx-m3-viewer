// Load a model and create an instance.
UnitTester.addTest("m3-load", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -100]);

    let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
        instance = model.addInstance().uniformScale(100);
});

// Get to a specific frame of animation in a sequence.
UnitTester.addTest("m3-sequence", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -100]);

    let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
        instance = model.addInstance().uniformScale(100).setSequence(0);

    instance.frame = 800;
});

// Change team colors.
UnitTester.addTest("m3-team-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -100]);

    let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
        instance = model.addInstance().uniformScale(100).setTeamColor(1);
});

// Change tint colors.
UnitTester.addTest("m3-tint-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -100]);

    let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
        instance = model.addInstance().uniformScale(100).setTintColor([255, 0, 0]);
});
