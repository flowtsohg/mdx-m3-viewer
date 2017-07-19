let m3Tests = [
    ["m3-base", (viewer, scene, camera) => {
        camera.move([0, -5, -100]);

        let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
            instance = model.addInstance().uniformScale(50);

        scene.addInstance(instance);
    }],

    ["m3-sequence", (viewer, scene, camera) => {
        camera.move([0, -5, -100]);

        let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
            instance = model.addInstance().uniformScale(50).setSequence(0);

        instance.frame = 800;

        scene.addInstance(instance);
    }],

    ["m3-team-color", (viewer, scene, camera) => {
        camera.move([0, -5, -100]);

        let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
            instance = model.addInstance().uniformScale(50).setTeamColor(1);

        scene.addInstance(instance);
    }],

    ["m3-vertex-color", (viewer, scene, camera) => {
        camera.move([0, -5, -100]);

        let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
            instance = model.addInstance().uniformScale(50).setVertexColor([255, 0, 0, 255]);

        scene.addInstance(instance);
    }],

    ["m3-vertex-and-team-colors", (viewer, scene, camera) => {
        camera.move([0, -5, -100]);

        let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
            instance = model.addInstance().uniformScale(50).setVertexColor([255, 0, 0, 255]).setTeamColor(1);

        scene.addInstance(instance);
    }]
];
