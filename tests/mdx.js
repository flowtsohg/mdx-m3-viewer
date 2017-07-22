let mdxTests = {
    name: "mdx",
    tests: [
        {
            name: "base",
            load(viewer) {
                return viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -55, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

                let instance = model.addInstance();

                scene.addInstance(instance);
            }
        },

        {
            name: "sequence",
            load(viewer) {
                return viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -55, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

                let instance = model.addInstance().setSequence(0);

                instance.frame = 800;

                scene.addInstance(instance);
            }
        },

        {
            name: "team-color",
            load(viewer) {
                return viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -55, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

                let instance = model.addInstance().setTeamColor(1);

                scene.addInstance(instance);
            }
        },

        {
            name: "vertex-color",
            load(viewer) {
                return viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -55, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

                let instance = model.addInstance().setVertexColor([255, 0, 0, 255]);

                scene.addInstance(instance);
            }
        },

        {
            name: "vertex-and-team-colors",
            load(viewer) {
                return viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -55, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

                let instance = model.addInstance().setVertexColor([255, 0, 0, 255]).setTeamColor(1);

                scene.addInstance(instance);
            }
        },

        {
            name: "texture-animation",
            load(viewer) {
                return viewer.load("Units/Human/WaterElemental/WaterElemental.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -80, -200]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

                let instance = model.addInstance().setSequence(0);

                instance.frame = 800;

                scene.addInstance(instance);
            }
        },

        {
            name: "billboarding",
            load(viewer) {
                return viewer.load("Units/Creeps/Gnoll/Gnoll.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([30, -20, -180]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-45)));

                let instance = model.addInstance().setSequence(1).setSequenceLoopMode(2);

                // Rotate also the instance, to be sure billboarding works in all cases.
                // It happened in a past implementation that billboaring worked as long as the instance isn't rotated.
                // Needless to say, it took a long time to find that bug.
                instance.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-45)));

                instance.frame = 800;

                scene.addInstance(instance);
            }
        },

        {
            name: "attachment-model",
            load(viewer) {
                return viewer.load("Buildings/Undead/HauntedMine/HauntedMine.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, 0, -600]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));

                let instance = model.addInstance().setSequence(0);

                scene.addInstance(instance);

                instance.frame = 20000;

                // update() is used here, because when an attachment becomes visible for the first time, the parent instance resets its sequence.
                // If the attachment's frame was set without first updating, it will just get reset to the sequence's beginning.
                viewer.update();

                let attachment = instance.attachments[0].internalInstance;

                attachment.frame = instance.frame;
            }
        },

        {
            name: "particle-emitter",
            load(viewer) {
                return viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -60, -150]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

                let instance = model.addInstance().setSequence(5);

                scene.addInstance(instance);

                for (let i = 0; i < 30; i++) {
                    viewer.update();
                }
            }
        },

        {
            name: "particle-2-emitter",
            load(viewer) {
                return viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, 20, -300]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

                let instance = model.addInstance().setSequence(1);

                scene.addInstance(instance);

                for (let i = 0; i < 90; i++) {
                    viewer.update();
                }
            }
        },

        {
            name: "ribbon-emitter",
            load(viewer) {
                return viewer.load("Units/Human/HeroPaladin/HeroPaladin.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -65, -240]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], Math.toRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], Math.toRad(-90)));

                let instance = model.addInstance().setSequence(4).setSequenceLoopMode(2);

                scene.addInstance(instance);

                for (let i = 0; i < 22; i++) {
                    viewer.update();
                }
            }
        }
    ]
};
