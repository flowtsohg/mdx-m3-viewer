function sc2Solver(path) {
    return ["../resources/starcraft2/" + path, path.substr(path.lastIndexOf(".")), true];
}

let m3Tests = [
    ["m3-load", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -5, -100]);

        let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
            instance = model.addInstance().uniformScale(50);

        scene.addInstance(instance);
    }],

    ["m3-sequence", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -5, -100]);

        let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
            instance = model.addInstance().uniformScale(50);

        scene.addInstance(instance);

        instance.setSequence(0);
        instance.frame = 800;
    }],

    ["m3-team-color", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -5, -100]);

        let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
            instance = model.addInstance().uniformScale(50);

        scene.addInstance(instance);

        instance.setTeamColor(1);
    }],

    ["m3-vertex-color", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, -5, -100]);

        let model = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver),
            instance = model.addInstance().uniformScale(50);

        scene.addInstance(instance);

        instance.setVertexColor([255, 0, 0, 255]);
    }]
];
