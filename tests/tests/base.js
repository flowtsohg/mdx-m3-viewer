// Attach instances to nodes in skeletons.
// Assumes mdx-load, mdx-sequence, mdx-team-color, m3-load, m3-sequence, and m3-team-color, all pass.
UnitTester.addTest("base-attachments", (viewer) => {
    let camera = viewer.scenes[0].camera;

    camera.resetTransformation();
    camera.move([0, -150, -300]);

    var mountainKing = viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
    var instance1 = mountainKing.addInstance().setSequence(0);
    var instance3 = mountainKing.addInstance().setSequence(0);
    var instance5 = mountainKing.addInstance().setSequence(0);

    let baneling = viewer.load("Assets/Units/Zerg/Baneling/Baneling.m3", sc2Solver);
    let instance2 = baneling.addInstance().setSequence(0);
    let instance4 = baneling.addInstance().setSequence(0);
    let instance6 = baneling.addInstance().setSequence(0);

    instance1.noCulling = true; // :(
    instance2.noCulling = true; // :(
    instance3.noCulling = true; // :(
    instance4.noCulling = true; // :(
    instance5.noCulling = true; // :(
    instance6.noCulling = true; // :(

    viewer.whenAllLoaded(() => {
        instance2.setParent(instance1.getAttachment(3));
        instance3.setParent(instance2.getAttachment(4));
        instance4.setParent(instance3.getAttachment(3));
        instance5.setParent(instance4.getAttachment(4));
        instance6.setParent(instance5.getAttachment(3));
    });
});
