function geoSolver(src) {
    return [src, ".geo", false];
}

let geoTests = [
    ["geo-rectangle", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitRectangle(),
            material: { renderMode: 0 }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cube", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitCube(),
            material: { renderMode: 0 }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-sphere", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitSphere(4, 20),
            material: { renderMode: 0 }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cylinder", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitCylinder(16),
            material: { renderMode: 0 }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-edges", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitRectangle(),
            material: { renderMode: 1 }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-faces-and-edges", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitRectangle(),
            material: { renderMode: 2 }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-vertex-color", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitRectangle(),
            material: { renderMode: 0 }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8)).setVertexColor([255, 0, 0, 255]);

        scene.addInstance(instance);
    }],

    ["geo-edge-color", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitRectangle(),
            material: { renderMode: 1 }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8)).setEdgeColor([255, 0, 0, 255]);

        scene.addInstance(instance);
    }],

    ["geo-both-colors", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitRectangle(),
            material: { renderMode: 2 }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8)).setVertexColor([0, 0, 255, 255]).setEdgeColor([255, 0, 0, 255]);

        scene.addInstance(instance);
    }],

    ["geo-two-sided", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitRectangle(),
            material: { renderMode: 0, twoSided: true }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI + Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-texture", (viewer, scene) => {
        let camera = scene.camera;

        camera.resetTransformation();
        camera.move([0, 0, -110]);

        let data = {
            geometry: createUnitRectangle(),
            material: { renderMode: 0, texture: viewer.load("resources/checkers.jpg", (path) => [path, ".jpg", true]) }
        };

        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40);

        scene.addInstance(instance);
    }]
];
