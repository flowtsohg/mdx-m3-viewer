let m3Tests = {
    name: "m3",
    tests: [
        {
            name: "m3-base",
            load(viewer) {
                return viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -5, -100]);

                let instance = model.addInstance().uniformScale(50);

                scene.addInstance(instance);
            }
        },

        {
            name: "m3-sequence",
            load(viewer) {
                return viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -5, -100]);

                let instance = model.addInstance().uniformScale(50);

                instance.frame = 800;

                scene.addInstance(instance);
            }
        },

        {
            name: "m3-team-color",
            load(viewer) {
                return viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -5, -100]);

                let instance = model.addInstance().uniformScale(50).setTeamColor(1);

                scene.addInstance(instance);
            }
        },

        {
            name: "m3-vertex-color",
            load(viewer) {
                return viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -5, -100]);

                let instance = model.addInstance().uniformScale(50).setVertexColor([255, 0, 0, 255]);

                scene.addInstance(instance);
            }
        },

        {
            name: "m3-vertex-and-team-colors",
            load(viewer) {
                return viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -5, -100]);

                let instance = model.addInstance().uniformScale(50).setVertexColor([255, 0, 0, 255]).setTeamColor(1);

                scene.addInstance(instance);
            }
        }
    ]
};
