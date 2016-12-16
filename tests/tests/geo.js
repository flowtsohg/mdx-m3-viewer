// Retangle.
UnitTester.addTest("geo-rectangle", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 0 }
    };

    viewer.load(data, geoSolver).addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));
});

// Cube.
UnitTester.addTest("geo-cube", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitCube(),
        material: { renderMode: 0 }
    };

    viewer.load(data, geoSolver).addInstance().uniformScale(31).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));
});

// Sphere.
UnitTester.addTest("geo-sphere", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitSphere(4, 20),
        material: { renderMode: 0 }
    };

    viewer.load(data, geoSolver).addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));
});

// Cylinder.
UnitTester.addTest("geo-cylinder", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitCylinder(16),
        material: { renderMode: 0 }
    };

    viewer.load(data, geoSolver).addInstance().uniformScale(38).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));
});

// Color.
UnitTester.addTest("geo-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 0 }
    };

    viewer.load(data, geoSolver).addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8)).setColor([255, 0, 0]);
});

// Two sided.
UnitTester.addTest("geo-two-sided", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 0, twoSided: true }
    };

    viewer.load(data, geoSolver).addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI + Math.PI / 8));
});

// Texture.
UnitTester.addTest("geo-texture", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 0, texture: viewer.load("tests/compare/mdx-load.png", (path) => [path, ".png", true]) }
    };

    viewer.load(data, geoSolver).addInstance().uniformScale(44);
});
