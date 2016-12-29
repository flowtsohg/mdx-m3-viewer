// Load a model and create an instance.
UnitTester.addTest("m3-load", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, -30, -90]);

    let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
        instance = model.addInstance();
});

// Get to a specific frame of animation in a sequence.
UnitTester.addTest("m3-sequence", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, -30, -90]);

    let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
        instance = model.addInstance().setSequence(0);

    instance.frame = 800;
});

// Change team colors.
UnitTester.addTest("m3-team-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, -30, -90]);

    let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
        instance = model.addInstance().setTeamColor(1);
});

// Change tint colors.
UnitTester.addTest("m3-tint-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, -30, -90]);

    let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
        instance = model.addInstance().setTintColor([255, 0, 0]);
});
