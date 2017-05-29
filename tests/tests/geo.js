// Retangle.
UnitTester.addTest("geo-rectangle", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 0 }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

    view.addInstance(instance);
    scene.addView(view);
});

// Cube.
UnitTester.addTest("geo-cube", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitCube(),
        material: { renderMode: 0 }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(31).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

    view.addInstance(instance);
    scene.addView(view);
});

// Sphere.
UnitTester.addTest("geo-sphere", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitSphere(4, 20),
        material: { renderMode: 0 }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

    view.addInstance(instance);
    scene.addView(view);
});

// Cylinder.
UnitTester.addTest("geo-cylinder", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitCylinder(16),
        material: { renderMode: 0 }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(38).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

    view.addInstance(instance);
    scene.addView(view);
});

// Edges.
UnitTester.addTest("geo-edges", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 1 }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

    view.addInstance(instance);
    scene.addView(view);
});

// Faces + edges.
UnitTester.addTest("geo-faces-and-edges", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 2 }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8));

    view.addInstance(instance);
    scene.addView(view);
});

// Color.
UnitTester.addTest("geo-color", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 0 }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8)).setColor([255, 0, 0]);

    view.addInstance(instance);
    scene.addView(view);
});

// Edge color.
UnitTester.addTest("geo-edge-color", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 1 }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI / 8)).setEdgeColor([255, 0, 0]);

    view.addInstance(instance);
    scene.addView(view);
});

// Two sided.
UnitTester.addTest("geo-two-sided", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 0, twoSided: true }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(44).rotate(quat.setAxisAngle([], vec3.UNIT_X, Math.PI + Math.PI / 8));

    view.addInstance(instance);
    scene.addView(view);
});

// Texture.
UnitTester.addTest("geo-texture", (viewer, scene) => {
    let camera = scene.camera;

    camera.resetTransformation();
    camera.move([0, 0, -110]);

    let data = {
        geometry: createUnitRectangle(),
        material: { renderMode: 0, texture: viewer.load("tests/compare/mdx-load.png", (path) => [path, ".png", true]) }
    };

    let model = viewer.load(data, geoSolver);
    let view = model.addView();
    let instance = model.addInstance().uniformScale(44);

    view.addInstance(instance);
    scene.addView(view);
});
