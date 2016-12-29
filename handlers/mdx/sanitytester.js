function MdxSanityTester() {
    
}

MdxSanityTester.prototype = {
    test(parser) {
        let chunks = parser.chunks;

        this.output = { errors: [], warnings: [] };

        this.nodeCount = parser.nodes.length;
        this.sequences = this.getElements(chunks.SEQS);
        this.globalSequences = this.getElements(chunks.GLBS);
        this.globalSequenceCount = this.globalSequences.length;
        this.textureCount = this.getElementsCount(chunks.TEXS);
        this.materialCount = this.getElementsCount(chunks.MTLS);
        this.geosetCount = this.getElementsCount(chunks.GEOS);

        this.testVersion(chunks);
        this.testModel(chunks);
        this.testSequences(chunks);
        this.testGlobalSequences(chunks);
        this.testTextures(chunks);
        this.testMaterials(chunks);
        this.testTextureAnimations(chunks);
        this.testGeosets(chunks);
        this.testGeosetAnimations(chunks);
        this.testBones(chunks);
        this.testLights(chunks);
        this.testHelpers(chunks);
        this.testAttachments(chunks);
        this.testPivotPoints(chunks);
        this.testParticleEmitters(chunks);
        this.testParticleEmitters2(chunks);
        this.testRibbonEmitters(chunks);
        this.testEventObjects(chunks);
        this.testCameras(chunks); 
        this.testCollisionShapes(chunks);

        return this.output;
    },

    getElements(chunk) {
        if (chunk) {
            return chunk.elements;
        }

        return [];
    },

    getElementsCount(chunk) {
        if (chunk) {
            return chunk.elements.length;
        }

        return 0;
    },

    // Warning: Unknown version.
    testVersion(chunks) {
        let versionChunk = chunks.VERS;

        this.assertWarning(versionChunk.version === 800, "Unknown version " + versionChunk.version);
    },

    // ?
    testModel(chunks) {
        let modelChunk = chunks.MODL;
    },

    // Warning: No sequences (?).
    // Warning: An invalid sequence name (does nothing).
    // Warning: No stand sequence (can bother some use cases of models).
    // Warning: No death sequence (can bother some use cases of models).
    // Warning: A zero length sequence (the sequence does nothing).
    // Warning: A negative length sequence (probably used as unsigned).
    testSequences(chunks) {
        let sequenceChunk = chunks.SEQS;

        this.assertWarning(sequenceChunk && sequenceChunk.elements.length > 0, "No sequences");

        if (sequenceChunk) {
            let sequences = sequenceChunk.elements,
                foundStand = false,
                foundDeath = false;

            for (let i = 0, l = sequences.length; i < l; i++) {
                let sequence = sequences[i],
                    name = sequence.name,
                    mainToken = name.toLowerCase().split("-")[0].split(" ")[0],
                    interval = sequence.interval,
                    length = interval[1] - interval[0];

                if (mainToken === "stand") {
                    foundStand = true;
                }

                if (mainToken === "death") {
                    foundDeath = true;
                }

                this.assertWarning(this.sequenceNames[mainToken], "Sequence " + i + ": Invalid sequence name " + mainToken);
                this.assertWarning(length !== 0, "Sequence " + i + " " + name + ": Zero length");
                this.assertWarning(length > -1, "Sequence " + i + " " + name + ": Negative length " + length);
            }

            this.assertWarning(foundStand, "No stand sequence");
            this.assertWarning(foundDeath, "No death sequence");
        }
    },

    // Warning: A global sequence with zero length (does nothing?).
    // Warning: A global sequence with negative length (?).
    testGlobalSequences(chunks) {
        let globalSequenceChunk = chunks.GLBS;

        if (globalSequenceChunk) {
            let sequences = globalSequenceChunk.elements;

            for (let i = 0, l = sequences.length; i < l; i++) {
                let value = sequences[i].value;

                this.assertWarning(value !== 0, "Global sequence " + i + ": Zero length");
                this.assertWarning(value > -1, "Global sequence " + i + ": Negative length " + value);
            }
        }
    },

    // Error: A corrupted path (can't be loaded).
    // Error: An unknown replaceable ID (?).
    // Warning: A path and replaceable ID are used together (the path is ignored).
    testTextures(chunks) {
        let textureChunk = chunks.TEXS;

        if (textureChunk) {
            let textures = textureChunk.elements;

            for (let i = 0, l = textures.length; i < l; i++) {
                let texture = textures[i],
                    replaceableId = texture.replaceableId,
                    path = texture.path;

                this.assertError(path === "" || path.toLowerCase().endsWith(".blp"), "Texture " + i + ": Corrupted path " + path);
                this.assertError(replaceableId === 0 || Mdx.replaceableIdToName[replaceableId] !== undefined, "Texture " + i + ": Unknown replaceable ID " + replaceableId);
                this.assertWarning(path === "" || replaceableId === 0, "Texture " + i + ": Path " + path + " and replaceable ID " + replaceableId + " used together");
            }
        }
    },

    // ?
    testMaterials(chunks) {
        let materialChunk = chunks.MATS;

        if (materialChunk) {
            let materials = materialChunk.elements;

            for (let i = 0, l = length; i < l; i++) {
                let material = materials[i];

                this.testMaterial(material);
            }
        }
    },

    // Warning: No layers (?).
    // Warning: Invalid filter mode (?).
    testMaterial(material) {
        let layers = material.layers;

        this.assertWarning(layers.length > 0, "Material " + material.index + ": Does nothing");

        for (let i = 0, l = layers.length; i < l; i++) {
            let layer = layers[i];

            this.assertWarning(this.inRange(layer.filterMode, 0, 6), "Material " + material.index + ": Invalid filter mode " + layer.filterMode);
        }
    },

    // ?
    testTextureAnimations(chunks) {
        let textureAnimationChunk = chunks.TXAN;

        if (textureAnimationChunk) {
            let textureAnimations = textureAnimationChunk.elements;

            for (let i = 0, l = textureAnimations.length; i < l; i++) {
                this.testSDContainer(textureAnimations[i]);
            }

        }
    },

    // Warning: A vertex not attached to any bone (gets attached to a map's center instead).
    // Warning: A geoset is referenced by multiple geoset animations (?).
    testGeosets(chunks) {
        let geosetChunk = chunks.GEOS,
            geosetAnimationChunk = chunks.GEOA;

        if (geosetChunk) {
            let geosets = geosetChunk.elements;

            for (let i = 0, l = geosets.length; i < l; i++) {
                let matrixGroups = geosets[i].matrixGroups;

                for (let j = 0, k = matrixGroups.length; j < k; j++) {
                    this.assertWarning(matrixGroups[j] > 0, "Geoset " + i + ": Vertex " + j + ": Not attached to any bones");
                }

                if (geosetAnimationChunk) {
                    let geosetAnimations = geosetAnimationChunk.elements,
                        references = [];

                    for (let j = 0, k = geosetAnimations.length; j < k; j++) {
                        if (geosetAnimations[j].geosetId === i) {
                            references.push(j);
                        }
                    }

                    this.assertWarning(references.length <= 1, "Geoset " + i + ": Referenced by " + references.length + " geoset animations (" + references.join(", ") + ")");
                }
            }
        }
    },

    // Error: Referencing an invalid geoset (?).
    // Warning: Referencing no geoset (the geoset animation does nothing).
    // Warning: There are geoset animations, but no geosets.
    testGeosetAnimations(chunks) {
        let geosetAnimationChunk = chunks.GEOA;

        if (geosetAnimationChunk) {
            let geosetAnimations = geosetAnimationChunk.elements,
                geosetCount = this.geosetCount;

            if (geosetCount) {
                for (let i = 0, l = geosetAnimations.length; i < l; i++) {
                    let geosetId = geosetAnimations[i].geosetId;

                    if (geosetId === -1) {
                        this.addWarning("Geoset animation " + i + ": Does nothing");
                    } else {
                        this.assertError(geosetId >= 0 && geosetId < geosetCount, "Geoset animation " + i + ": Invalid geoset ID " + geosetId);
                    }
                }
            } else {
                this.addWarning("There are geoset animations, but no geosets");
            }

            for (let i = 0, l = geosetAnimations.length; i < l; i++) {
                this.testSDContainer(geosetAnimations[i]);
            }
        } 
    },

    // Error: Referencing an invalid geoset (?).
    // Error: Referencing an invalid geoset animation (?).
    testBones(chunks) {
        let boneChunk = chunks.BONE,
            geosetChunk = chunks.GEOS,
            geosetAnimationChunk = chunks.GEOA;

        if (boneChunk) {
            let bones = boneChunk.elements;

            for (let i = 0, l = bones.length; i < l; i++) {
                let bone = bones[i],
                    geosetId = bone.geosetId,
                    geosetAnimationId = bone.geosetAnimationId;

                if (geosetChunk) {
                    // No clue what -1 stands for.
                    // What does it even mean for a bone to reference a geoset?
                    // Vertices reference bones, not the other way around.
                    //this.assertWarning(geosetId !== -1, "Bone " + i + ": Not referencing any geoset");

                    this.assertError(geosetId === -1 || geosetId < geosetChunk.elements.length, "Bone " + i + ": Referencing an invalid geoset " + geosetId);
                }

                if (geosetAnimationChunk) {
                    this.assertError(geosetAnimationId === -1 || geosetAnimationId < geosetAnimationChunk.elements.length, "Bone " + i + ": Referencing an invalid geoset animation " + geosetAnimationId);
                }

                this.testNode(bone);
            }
        }
    },

    // Warning: Attenuation outside of the range min=80 max=200 (can mess with lighting).
    testLights(chunks) {
        let lightChunk = chunks.LITE;

        if (lightChunk) {
            let lights = lightChunk.elements;

            for (let i = 0, l = lights.length; i < l; i++) {
                let light = lights[i],
                    attenuation = light.attenuation;

                this.assertWarning(attenuation[0] >= 80 && attenuation[1] <= 200 && attenuation[1] - attenuation[0] > 0, "Light " + i + " " + light.node.name + ": Attenuation min=" + attenuation[0] + " max=" + attenuation[1]);

                this.testSDContainer(light)
                this.testNode(light);
            }
        }
    },

    // ?
    testHelpers(chunks) {
        let helperChunk = chunks.HELP;

        if (helperChunk) {
            let helpers = helperChunk.elements;

            for (let i = 0, l = helpers.length; i < l; i++) {
                this.testNode(helpers[i]);
            }

        }
    },

    // Error: Attachment path that doesn't end with ".mdl".
    testAttachments(chunks) {
        let attachmentChunk = chunks.ATCH;

        if (attachmentChunk) {
            let attachments = attachmentChunk.elements;

            for (let i = 0, l = attachments.length; i < l; i++) {
                let attachment = attachments[i],
                    path = attachment.path;

                this.assertError(path === "" || path.toLowerCase().endsWith(".mdl"), "Attachment " + i + ": Invalid path " + path);

                this.testSDContainer(attachment)
                this.testNode(attachment);
            }

        }
    },

    // Warning: No pivot points (default one created at the origin?).
    testPivotPoints(chunks) {
        let pivotPointChunk = chunks.PIVT;

        this.assertWarning(pivotPointChunk && pivotPointChunk.elements.length > 0, "No pivot points");
    },

    // Error: Corrupted path (?).
    testParticleEmitters(chunks) {
        let particleEmitterChunk = chunks.PREM;

        if (particleEmitterChunk) {
            let emitters = particleEmitterChunk.elements;

            for (let i = 0, l = emitters.length; i < l; i++) {
                let emitter = emitters[i];

                this.assertError(emitter.path.toLowerCase().endsWith(".mdl"), "Particle Emitter " + i + ": Corrupted path " + emitter);

                this.testSDContainer(emitter)
                this.testNode(emitter);
            }

        }
    },

    // Warning: Invalid filter mode (?).
    testParticleEmitters2(chunks) {
        let particleEmitterChunk2 = chunks.PRE2;

        if (particleEmitterChunk2) {
            let emitters = particleEmitterChunk2.elements;

            for (let i = 0, l = emitters.length; i < l; i++) {
                let emitter = emitters[i],
                    replaceableId = emitter.replaceableId;

                this.assertWarning(this.inRange(emitter.filterMode, 0, 4), "Particle Emitter 2 " + i + ": Invalid filter mode " + emitter.filterMode);
                this.assertWarning(this.inRange(emitter.textureId, 0, this.textureCount - 1), "Particle Emitter 2 " + i + ": Referencing invalid texture ID " + emitter.textureId);
                this.assertError(replaceableId === 0 || Mdx.replaceableIdToName[replaceableId] !== undefined, "Particle Emitter 2 " + i + ": Unknown replaceable ID " + replaceableId);

                this.testSDContainer(emitter)
                this.testNode(emitter);
            }

        }
    },

    // Error: Referencing an invalid material ID (?).
    testRibbonEmitters(chunks) {
        let ribbonEmitterChunk = chunks.RIBB;

        if (ribbonEmitterChunk) {
            let emitters = ribbonEmitterChunk.elements;

            for (let i = 0, l = emitters.length; i < l; i++) {
                let emitter = emitters[i];

                this.assertError(this.inRange(emitter.materialId, 0, this.materialCount - 1), "Ribbon Emitter " + i + ": Referencing invalid material ID " + emitter.materialId);

                this.testSDContainer(emitter)
                this.testNode(emitter);
            }

        }
    },

    // Error: Referencing an invalid global sequence (?).
    // Error: Zero keys (can't be loaded).
    testEventObjects(chunks) {
        let eventObjectChunk = chunks.EVTS;

        if (eventObjectChunk) {
            let eventObjects = eventObjectChunk.elements;

            for (let i = 0, l = eventObjects.length; i < l; i++) {
                let eventObject = eventObjects[i],
                    tracks = eventObject.tracks,
                    globalSequenceId = eventObject.globalSequenceId;

                this.assertError(globalSequenceId === -1 || globalSequenceId < this.globalSequenceCount, "Event Object " + i + ": Referencing invalid global sequence " + globalSequenceId);
                this.assertError(tracks.length > 0, "Event Object " + i + " " + eventObject.node.name + ": Zero keys");

                for (let j = 0, k = tracks.length; j < k; j++) {
                    let track = tracks[j],
                        sequenceInfo = this.getSequenceInfoFromFrame(track, globalSequenceId),
                        sequenceId = sequenceInfo[0];

                    this.assertWarning(sequenceId !== -1, "Event object " + i + " " + eventObject.node.name + ": Track " + j + ": Frame " + track + " is not in any sequence");
                }

                this.testNode(eventObject);

            }
        }
    },

    // ?
    testCameras(chunks) {
        let cameraChunk = chunks.CAMS;

        if (cameraChunk) {
            let cameras = cameraChunk.elements;

            for (let i = 0, l = cameras.length; i < l; i++) {
                this.testSDContainer(cameras[i]);
            }
        }
    },

    // ?
    testCollisionShapes(chunks) {
        let collisionShapeChunk = chunks.CLID;

        if (collisionShapeChunk) {
            let collisionShapes = collisionShapeChunk.elements;

            for (let i = 0, l = collisionShapes.length; i < l; i++) {
                this.testNode(collisionShapes[i]);
            }
        }
    },

    // Error: Invalid object ID (?).
    // Error: Invalid parent ID (?).
    // Error: Same object ID and parent ID (?).
    testNode(object) {
        let node = object.node,
            name = node.name,
            objectId = node.objectId,
            parentId = node.parentId;

        this.assertError(objectId >= 0 && objectId < this.nodeCount, "Node " + name + ": Invalid object ID " + objectId);
        this.assertError(objectId === parentId || parentId === -1 || parentId < this.nodeCount, "Node " + name + ": Invalid parent ID " + parentId);
        this.assertError(objectId !== parentId, "Node " + name + ": Same object ID and parent ID");
            
        this.testSDContainer(node);
    },

    testSDContainer(object) {
        let tracks = object.tracks,
            sds = tracks.sd,
            keys = Object.keys(sds);

        for (let i = 0, l = keys.length; i < l; i++) {
            let key = keys[i];

            this.testSD(object, key, sds[key]);
        }
    },

    // Error: Referencing an invalid global sequence (?).
    testSD(object, tag, sd) {
        let objectName = this.getIdentifier(object),
            typeInfo = this.tagToType[tag],
            globalSequenceId = sd.globalSequenceId;

        this.assertError(globalSequenceId === -1 || globalSequenceId < this.globalSequenceCount, typeInfo[0] + " " + objectName + ": Referencing invalid global sequence " + globalSequenceId);

        this.testInterpolationType(object, typeInfo, sd.interpolationType);
        this.testTracks(object, typeInfo, sd.tracks, globalSequenceId);
    },

    // Warning: Zero tracks (?).
    // Warning: Tracks used without sequences (?).
    // Warning: Track outside of any sequence (?). Ignores frame 0.
    // Warning: Negative frame (?).
    // Warning: No opening frame for a sequence (can cause weird animations).
    // Warning: No closing frame for a sequence (can cause weird animations).
    testTracks(object, typeInfo, tracks, globalSequenceId) {
        let objectName = this.getIdentifier(object),
            sequences = this.sequences,
            usageMap = {};

        this.assertWarning(tracks.length, typeInfo[0] + " " + objectName + ": " + typeInfo[1] + ": Zero tracks");
        this.assertWarning(globalSequenceId !== -1 || tracks.length === 0 || sequences.length !== 0, " " + objectName + ": " + typeInfo[1] + ": Tracks used without sequences")

        for (let i = 0, l = tracks.length; i < l; i++) {
            let track = tracks[i],
                sequenceInfo = this.getSequenceInfoFromFrame(track.frame, globalSequenceId),
                sequenceId = sequenceInfo[0],
                isBeginning = sequenceInfo[1],
                isEnding = sequenceInfo[2];

            this.assertWarning(tracks.length === 1 || sequenceId !== -1 || track.frame === 0, typeInfo[0] + " " + objectName + ": " + typeInfo[1] + ": Track " + i + ": Frame " + track.frame + " is not in any sequence");
            this.assertWarning(track.frame >= 0, typeInfo[0] + " " + objectName + ": " + typeInfo[1] + ": Track " + i + ": Negative frame");

            if (sequenceId !== -1) {
                if (!usageMap[sequenceId]) {
                    usageMap[sequenceId] = [false, false, 0];
                }

                if (isBeginning) {
                    usageMap[sequenceId][0] = true;
                }

                if (isEnding) {
                    usageMap[sequenceId][1] = true;
                }

                usageMap[sequenceId][2] += 1;
            }
        }

        let keys = Object.keys(usageMap);

        for (let i = 0, l = keys.length; i < l; i++) {
            let sequenceId = keys[i],
                sequenceInfo = usageMap[sequenceId],
                sequenceName;

            if (globalSequenceId === -1) {
                sequenceName = "sequence " + this.getIdentifier(sequences[sequenceId]);
            } else {
                sequenceName = "global sequence " + this.getIdentifier(this.globalSequences[sequenceId]);
            }

            this.assertWarning(sequenceInfo[0] || sequenceInfo[2] === 1, typeInfo[0] + " " + objectName + ": " + typeInfo[1] + ": No opening track for " + sequenceName);
            this.assertWarning(sequenceInfo[1] || sequenceInfo[2] === 1, typeInfo[0] + " " + objectName + ": " + typeInfo[1] + ": No closing track for " + sequenceName);
        }
    },

    // Warning: Interpolation used for visibility keyframes that is not None.
    testInterpolationType(object, typeInfo, interpolationType) {
        let objectName = this.getIdentifier(object);

        if (typeInfo[1] === "Visibility") {
            this.assertWarning(interpolationType === 0, typeInfo[0] + " " + objectName + ": " + typeInfo[1] + ": Interpolation type not set to None");
        }
    },

    // Given a frame, and possibly a global sequence ID, get the following information:
    // 1) What is the index (if any) of the sequence (or global sequence) that this frame is in.
    // 2) Is this frame the beginning frame of this sequence.
    // 3) Is this frame the ending frame of this sequence.
    getSequenceInfoFromFrame(frame, globalSequenceId) {
        let index = -1,
            isBeginning = false,
            isEnding = false;

        if (globalSequenceId === -1) {
            let sequences = this.sequences;

            for (let i = 0, l = sequences.length; i < l; i++) {
                let interval = sequences[i].interval;

                if (frame >= interval[0] && frame <= interval[1]) {
                    index = i;

                    if (frame === interval[0]) {
                        isBeginning = true;
                    } else if (frame === interval[1]) {
                        isEnding = true;
                    }

                    break;
                }
            }
        } else {
            let globalSequence = this.globalSequences[globalSequenceId];

            index = globalSequenceId;

            if (frame === 0) {
                isBeginning = true;
            } else if (frame === globalSequence.value) {
                isEnding = true;
            }
        }

        return [index, isBeginning, isEnding];
    },

    getIdentifier(object) {
        let id = "" + object.index;

        if (object.name) {
            id += " " + object.name;
        }

        return id;
    },

    tagToType: {
        KMTF: ["Layer", "Texture ID"],
        KMTA: ["Layer", "Alpha"],
        KTAT: ["Texture Animation", "Translation"],
        KTAR: ["Texture Animation", "Rotation"],
        KTAS: ["Texture Animation", "Scaling"],
        KGAO: ["Geoset Animation", "Alpha"],
        KGAC: ["Geoset Animation", "Color"],
        KLAS: ["Light", "Attenuation Start"],
        KLAE: ["Light", "Attenuation End"],
        KLAC: ["Light", "Color"],
        KLAI: ["Light", "Intensity"],
        KLBI: ["Light", "Ambient Intensity"],
        KLBC: ["Light", "Ambient Color"],
        KLAV: ["Light", "Visibility"],
        KATV: ["Attachment", "Visibility"],
        KPEE: ["Particle Emitter", "Emission Rate"],
        KPEG: ["Particle Emitter", "Gravity"],
        KPLN: ["Particle Emitter", "Longitude"],
        KPLT: ["Particle Emitter", "Latitude"],
        KPEL: ["Particle Emitter", "Lifespan"],
        KPES: ["Particle Emitter", "Speed"],
        KPEV: ["Particle Emitter", "Visibility"],
        KP2E: ["Particle Emitter 2", "Emission Rate"],
        KP2G: ["Particle Emitter 2", "Gravity"],
        KP2L: ["Particle Emitter 2", "Latitude"],
        KP2R: ["Particle Emitter 2", "Variation"],
        KP2N: ["Particle Emitter 2", "Length"],
        KP2W: ["Particle Emitter 2", "Width"],
        KP2S: ["Particle Emitter 2", "Speed"],
        KP2V: ["Particle Emitter 2", "Visibility"],
        KRHA: ["Ribbon Emitter", "Height Above"],
        KRHB: ["Ribbon Emitter", "Height Below"],
        KRAL: ["Ribbon Emitter", "Alpha"],
        KRCO: ["Ribbon Emitter", "Color"],
        KRTX: ["Ribbon Emitter", "Texture Slot"],
        KRVS: ["Ribbon Emitter", "Visibility"],
        KCTR: ["Camera", "Translation"],
        KTTR: ["Camera", "Rotation"],
        KCRL: ["Camera", "Target Translation"],
        KGTR: ["Node", "Translation"],
        KGRT: ["Node", "Rotation"],
        KGSC: ["Node", "Scaling"]
    },

    sequenceNames: {
        "attack": 1,
        "birth": 1,
        "cinematic": 1,
        "death": 1,
        "decay": 1,
        "dissipate": 1,
        "morph": 1,
        "portrait": 1,
        "sleep": 1,
        "spell": 1,
        "stand": 1,
        "walk": 1
    },

    inRange(x, minVal, maxVal) {
        return x >= minVal && x <= maxVal;
    },

    addError(what) {
        this.output.errors.push(what);
    },

    addWarning(what) {
        this.output.warnings.push(what);
    },

    assertError(condition, error) {
        if (!condition) {
            this.addError(error);
        }
    },

    assertWarning(condition, warning) {
        if (!condition) {
            this.addWarning(warning);
        }
    }
};

