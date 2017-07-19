let geoTests = [
    ["geo-rectangle-base", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitRectangle(), material: { } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-rectangle-faces", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitRectangle(), material: { renderMode: 0 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-rectangle-edges", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitRectangle(), material: { renderMode: 1 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-rectangle-faces-and-edges", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitRectangle(), material: { renderMode: 2 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-rectangle-vertex-color", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitRectangle(), material: { renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-rectangle-edge-color", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitRectangle(), material: { renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-rectangle-vertex-and-edge-colors", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitRectangle(), material: { renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-rectangle-texture", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitRectangle(), material: { texture: viewer.load("resources/checkers.jpg", (path) => [path, ".jpg", true]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40);

        scene.addInstance(instance);
    }],

    ["geo-cube-base", (viewer, scene, camera) => {
        camera.move([0, 0, -160]);

        let data = { geometry: geometry.createUnitCube(), material: { } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cube-faces", (viewer, scene, camera) => {
        camera.move([0, 0, -160]);

        let data = { geometry: geometry.createUnitCube(), material: { renderMode: 0 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cube-edges", (viewer, scene, camera) => {
        camera.move([0, 0, -160]);

        let data = { geometry: geometry.createUnitCube(), material: { renderMode: 1 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cube-faces-and-edges", (viewer, scene, camera) => {
        camera.move([0, 0, -160]);

        let data = { geometry: geometry.createUnitCube(), material: { renderMode: 2 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cube-vertex-color", (viewer, scene, camera) => {
        camera.move([0, 0, -160]);

        let data = { geometry: geometry.createUnitCube(), material: { renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cube-edge-color", (viewer, scene, camera) => {
        camera.move([0, 0, -160]);

        let data = { geometry: geometry.createUnitCube(), material: { renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cube-vertex-and-edge-colors", (viewer, scene, camera) => {
        camera.move([0, 0, -160]);

        let data = { geometry: geometry.createUnitCube(), material: { renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cube-texture", (viewer, scene, camera) => {
        camera.move([0, 0, -160]);

        let data = { geometry: geometry.createUnitCube(), material: { texture: viewer.load("resources/checkers.jpg", (path) =>[path, ".jpg", true]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-sphere-base", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitSphere(20, 20), material: {} };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-sphere-faces", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitSphere(20, 20), material: { renderMode: 0 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-sphere-edges", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitSphere(20, 20), material: { renderMode: 1 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-sphere-faces-and-edges", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitSphere(20, 20), material: { renderMode: 2 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-sphere-vertex-color", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitSphere(20, 20), material: { renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-sphere-edge-color", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitSphere(20, 20), material: { renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-sphere-vertex-and-edge-colors", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitSphere(20, 20), material: { renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-sphere-texture", (viewer, scene, camera) => {
        camera.move([0, 0, -120]);

        let data = { geometry: geometry.createUnitSphere(20, 20), material: { texture: viewer.load("resources/checkers.jpg", (path) =>[path, ".jpg", true]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cylinder-base", (viewer, scene, camera) => {
        camera.move([0, 0, -150]);

        let data = { geometry: geometry.createUnitCylinder(20), material: {} };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cylinder-faces", (viewer, scene, camera) => {
        camera.move([0, 0, -150]);

        let data = { geometry: geometry.createUnitCylinder(20), material: { renderMode: 0 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cylinder-edges", (viewer, scene, camera) => {
        camera.move([0, 0, -150]);

        let data = { geometry: geometry.createUnitCylinder(20), material: { renderMode: 1 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cylinder-faces-and-edges", (viewer, scene, camera) => {
        camera.move([0, 0, -150]);

        let data = { geometry: geometry.createUnitCylinder(20), material: { renderMode: 2 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cylinder-vertex-color", (viewer, scene, camera) => {
        camera.move([0, 0, -150]);

        let data = { geometry: geometry.createUnitCylinder(20), material: { renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cylinder-edge-color", (viewer, scene, camera) => {
        camera.move([0, 0, -150]);

        let data = { geometry: geometry.createUnitCylinder(20), material: { renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cylinder-vertex-and-edge-colors", (viewer, scene, camera) => {
        camera.move([0, 0, -150]);

        let data = { geometry: geometry.createUnitCylinder(20), material: { renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-cylinder-texture", (viewer, scene, camera) => {
        camera.move([0, 0, -150]);

        let data = { geometry: geometry.createUnitCylinder(20), material: { texture: viewer.load("resources/checkers.jpg", (path) =>[path, ".jpg", true]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().uniformScale(40).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-frustum-base", (viewer, scene, camera) => {
        camera.move([0, -70, -200]);

        let data = { geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: {} };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-frustum-faces", (viewer, scene, camera) => {
        camera.move([0, -70, -200]);

        let data = { geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: { renderMode: 0 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-frustum-edges", (viewer, scene, camera) => {
        camera.move([0, -70, -200]);

        let data = { geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: { renderMode: 1 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-frustum-faces-and-edges", (viewer, scene, camera) => {
        camera.move([0, -70, -200]);

        let data = { geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: { renderMode: 2 } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-frustum-vertex-color", (viewer, scene, camera) => {
        camera.move([0, -70, -200]);

        let data = { geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: { renderMode: 0, vertexColor: new Uint8Array([255, 0, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-frustum-edge-color", (viewer, scene, camera) => {
        camera.move([0, -70, -200]);

        let data = { geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: { renderMode: 1, edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-frustum-vertex-and-edge-colors", (viewer, scene, camera) => {
        camera.move([0, -70, -200]);

        let data = { geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: { renderMode: 2, vertexColor: new Uint8Array([255, 0, 0, 255]), edgeColor: new Uint8Array([0, 255, 0, 255]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance().rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

        scene.addInstance(instance);
    }],

    ["geo-frustum-texture", (viewer, scene, camera) => {
        camera.move([0, -70, -200]);

        let data = { geometry: geometry.createFrustum(Math.PI / 4, 0.75, 8, 120), material: { texture: viewer.load("resources/checkers.jpg", (path) =>[path, ".jpg", true]) } };
        let model = viewer.load(data, geoSolver);
        let instance = model.addInstance();

        scene.addInstance(instance);
    }]
];
