unitTester.addTest("mdx-team-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 0, -300]);
    camera.setRotation(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
    camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-45)));
    camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-30)));

    viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver).addInstance().setTeamColor(1);
})
