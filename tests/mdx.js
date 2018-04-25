let mdxTests = {
    name: "mdx",
    tests: [
        {
            name: "base",
            load(viewer) {
                return viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([0, -45, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-90)));

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
                camera.move([0, -45, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-90)));

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
                camera.move([0, -45, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-90)));

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
                camera.move([0, -45, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-90)));

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
                camera.move([0, -45, -140]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-90)));

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
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-90)));

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
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-45)));

                let instance = model.addInstance().setSequence(1).setSequenceLoopMode(2);

                // Rotate also the instance, to be sure billboarding works in all cases.
                // It happened in a past implementation that billboaring worked as long as the instance isn't rotated.
                // Needless to say, it took a long time to find that bug.
                instance.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-45)));

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
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));

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
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-90)));

                let instance = model.addInstance().setSequence(5);

                scene.addInstance(instance);

                for (let i = 0; i < 30; i++) {
                    viewer.update();
                }
            }
        },

        {
            name: "particle-2-emitter",
            tests: [
                {
                    name: "base",
                    load(viewer) {
                        return viewer.load("Units/Creeps/AzureDragon/AzureDragon.mdx", wc3Solver);
                    },
                    test(viewer, scene, camera, model) {
                        camera.move([0, 20, -300]);
                        camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));
                        camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-90)));

                        let instance = model.addInstance().setSequence(1);

                        scene.addInstance(instance);

                        for (let i = 0; i < 90; i++) {
                            viewer.update();
                        }
                    }
                },

                {
                    name: "squirt",
                    load(viewer) {
                        return viewer.load("Abilities/Spells/Human/Thunderclap/ThunderclapCaster.mdx", wc3Solver);
                    },
                    test(viewer, scene, camera, model) {
                        camera.move([0, 0, -250]);

                        let instance = model.addInstance().setSequence(1);

                        scene.addInstance(instance);

                        for (let i = 0; i < 4; i++) {
                            viewer.update();
                        }
                    }
                },

                {
                    name: "line-emitter",
                    load(viewer) {
                        return viewer.load("Abilities/Spells/Human/Thunderclap/ThunderclapCaster.mdx", wc3Solver);
                    },
                    test(viewer, scene, camera, model) {
                        camera.move([-50, 0, -200]);
                        camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(90)));

                        let instance = model.addInstance().setSequence(1);

                        scene.addInstance(instance);

                        for (let i = 0; i < 4; i++) {
                            viewer.update();
                        }
                    }
                },

                {
                    name: "tail",
                    load(viewer) {
                        return viewer.load("Doodads/Dungeon/Props/ForceWall/ForceWall.mdx", wc3Solver);
                    },
                    test(viewer, scene, camera, model) {
                        camera.move([0, -50, -200]);
                        camera.rotate(quat.setAxisAngle([], [1, 0, 0], math.degToRad(-90)));

                        let instance = model.addInstance().setSequence(0).setSequenceLoopMode(2);

                        scene.addInstance(instance);

                        for (let i = 0; i < 100; i++) {
                            viewer.update();
                        }
                    }
                },

                {
                    name: "repeat",
                    load(viewer) {
                        return viewer.load("Doodads/Cinematic/EnergyField/EnergyField.mdx", wc3Solver);
                    },
                    test(viewer, scene, camera, model) {
                        camera.move([0, 0, -300]);
                        camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(90)));
                        camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(45)));

                        let instance = model.addInstance().setSequence(0).setSequenceLoopMode(2);

                        scene.addInstance(instance);

                        for (let i = 0; i < 50; i++) {
                            viewer.update();
                        }
                    }
                }
            ]
            
        },

        {
            name: "ribbon-emitter",
            load(viewer) {
                return viewer.load("Units/Human/HeroPaladin/HeroPaladin.mdx", wc3Solver);
            },
            test(viewer, scene, camera, model) {
                camera.move([10, -60, -200]);
                camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));
                camera.rotate(quat.setAxisAngle([], [0, 1, 0], math.degToRad(-90)));

                let instance = model.addInstance().setSequence(4).setSequenceLoopMode(2);

                scene.addInstance(instance);

                for (let i = 0; i < 22; i++) {
                    viewer.update();
                }
            }
        },

        {
            name: "event-object",
            tests: [
                {
                    name: "spn",
                    load(viewer) {
                        return viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
                    },
                    test(viewer, scene, camera, model) {
                        camera.move([0, -55, -140]);
                        camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));

                        let instance = model.addInstance().setSequence(9);

                        scene.addInstance(instance);

                        for (let i = 0; i < 50; i++) {
                            viewer.update();
                        }
                    }
                },

                {
                    name: "spl",
                    load(viewer) {
                        return viewer.load("Units/Human/Footman/Footman.mdx", wc3Solver);
                    },
                    test(viewer, scene, camera, model) {
                        camera.move([0, 0, -140]);
                        camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));

                        let instance = model.addInstance().setSequence(9);

                        scene.addInstance(instance);

                        for (let i = 0; i < 205; i++) {
                            viewer.update();
                        }
                    }
                },

                {
                    name: "ubr",
                    load(viewer) {
                        return viewer.load("Abilities/Spells/Human/Thunderclap/ThunderclapCaster.mdx", wc3Solver);
                    },
                    test(viewer, scene, camera, model) {
                        camera.move([0, 0, -500]);
                        camera.rotate(quat.setAxisAngle([], [0, 0, 1], math.degToRad(-90)));

                        let instance = model.addInstance().setSequence(1);

                        scene.addInstance(instance);

                        for (let i = 0; i < 20; i++) {
                            viewer.update();
                        }
                    }
                }
            ]
        }
    ]
};
