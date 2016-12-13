unitTester.addTest("mdx-team-color", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, 15, -95]);

    viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver).addInstance().setTeamColor(1);
})
