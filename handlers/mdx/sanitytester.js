/**
 * @constructor
 */
function MdxSanityTester() {
    
}

MdxSanityTester.prototype = {
    test(parser) {
        let chunks = parser.chunks;

        this.output = { errors: [], warnings: [], usage: [] };
        this.nodes = parser.nodes;
        this.nodeCount = parser.nodes.length;
        this.sequences = this.getElements(chunks.get("SEQS"));
        this.globalSequences = this.getElements(chunks.get("GLBS"));
        this.globalSequenceCount = this.globalSequences.length;
        this.textureCount = this.getElementsCount(chunks.get("TEXS"));
        this.materialCount = this.getElementsCount(chunks.get("MTLS"));
        this.geosetCount = this.getElementsCount(chunks.get("GEOS"));
        this.textureAnimationCount = this.getElementsCount(chunks.get("TXAN"));

        let textureUsage = [];
        for (let i = 0, l = this.textureCount; i < l; i++) {
            textureUsage[i] = 0;
        }
        this.textureUsage = textureUsage;

        let materialUsage = [];
        for (let i = 0, l = this.materialCount; i < l; i++) {
            materialUsage[i] = 0;
        }
        this.materialUsage = materialUsage;

        let textureAnimationUsage = [];
        for (let i = 0, l = this.textureAnimationCount; i < l; i++) {
            textureAnimationUsage[i] = 0;
        }
        this.textureAnimationUsage = textureAnimationUsage;

        let globalSequenceUsage = [];
        for (let i = 0, l = this.globalSequenceCount; i < l; i++) {
            globalSequenceUsage[i] = 0;
        }
        this.globalSequenceUsage = globalSequenceUsage;

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

        for (let i = 0, l = textureUsage.length; i < l; i++) {
            if (textureUsage[i] === 0) {
                this.addUsage("Texture " + i + ": Never used");
            }
        }

        for (let i = 0, l = materialUsage.length; i < l; i++) {
            if (materialUsage[i] === 0) {
                this.addUsage("Material " + i + ": Never used");
            }
        }

        for (let i = 0, l = textureAnimationUsage.length; i < l; i++) {
            if (textureAnimationUsage[i] === 0) {
                this.addUsage("Texture animation " + i + ": Never used");
            }
        }

        for (let i = 0, l = globalSequenceUsage.length; i < l; i++) {
            if (globalSequenceUsage[i] === 0) {
                this.addUsage("Global sequence " + i + ": Never used");
            }
        }

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
        let versionChunk = chunks.get("VERS");

        this.assertWarning(versionChunk.version === 800, "Unknown version " + versionChunk.version);
    },

    // ?
    testModel(chunks) {
        let modelChunk = chunks.get("MODL");
    },

    // Warning: No sequences (?).
    // Warning: An invalid sequence name (does nothing).
    // Warning: No stand sequence (can bother some use cases of models).
    // Warning: No death sequence (can bother some use cases of models).
    // Warning: A zero length sequence (the sequence does nothing).
    // Warning: A negative length sequence (can mess with community tools that think frames are unsigned).
    testSequences(chunks) {
        let sequenceChunk = chunks.get("SEQS");

        this.assertWarning(sequenceChunk && sequenceChunk.elements.length > 0, "No sequences");

        if (sequenceChunk) {
            let sequences = sequenceChunk.elements,
                foundStand = false,
                foundDeath = false;

            for (let i = 0, l = sequences.length; i < l; i++) {
                let sequence = sequences[i],
                    name = sequence.name,
                    tokens = name.toLowerCase().split("-")[0].split(/\s+/),
                    token = tokens[0],
                    interval = sequence.interval,
                    length = interval[1] - interval[0];

                if (token === "alternate") {
                    token = tokens[1];
                }

                if (token === "stand") {
                    foundStand = true;
                }

                if (token === "death") {
                    foundDeath = true;
                }

                this.assertUsage(this.sequenceNames[token], "Sequence " + i + ": Not used due to an invalid name: \"" + token + "\"");
                this.assertUsage(length !== 0, "Sequence " + i + " " + name + ": Not used due to zero length");
                this.assertWarning(length > -1, "Sequence " + i + " " + name + ": Negative length " + length);
            }

            this.assertWarning(foundStand, "No \"stand\" sequence");
            this.assertWarning(foundDeath, "No \"death\" sequence");
        }
    },

    // Warning: A global sequence with zero length (the first track is selected, regardless of its frame).
    // Warning: A global sequence with negative length (?).
    testGlobalSequences(chunks) {
        let globalSequenceChunk = chunks.get("GLBS");

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
        let textureChunk = chunks.get("TEXS");

        if (textureChunk) {
            let textures = textureChunk.elements;

            for (let i = 0, l = textures.length; i < l; i++) {
                let texture = textures[i],
                    replaceableId = texture.replaceableId,
                    path = texture.path.toLowerCase();

                this.assertError(path === "" || path.endsWith(".blp") || path.endsWith(".tga"), "Texture " + i + ": Corrupted path \"" + path + "\"");
                this.assertError(replaceableId === 0 || Mdx.replaceableIdToName[replaceableId] !== undefined, "Texture " + i + ": Unknown replaceable ID " + replaceableId);
                this.assertWarning(path === "" || replaceableId === 0, "Texture " + i + ": Path \"" + path + "\" and replaceable ID " + replaceableId + " used together");
            }
        }
    },

    // ?
    testMaterials(chunks) {
        let materialChunk = chunks.get("MTLS");

        if (materialChunk) {
            let materials = materialChunk.elements;

            for (let i = 0, l = materials.length; i < l; i++) {
                this.testMaterial(materials[i]);
            }
        }
    },

    // Warning: No layers (?).
    testMaterial(material) {
        let layers = material.layers;

        this.assertUsage(layers.length > 0, "Material " + material.index + ": No layers");

        for (let i = 0, l = layers.length; i < l; i++) {
            this.testLayer(material, layers[i])
        }
    },

    getTextureIds(layer) {
        let textureIds = [];

        for (let sd of layer.tracks.elements) {
            if (sd.tag === "KMTF") {
                let values = [];

                for (let track of sd.tracks) {
                    values.push(track.value);
                }

                return values.unique();
            }
        }

        return [layer.textureId];
    },

    // Warning: Invalid filter mode (?).
    // Warning: Invalid texture id (?)
    testLayer(material, layer) {
        for (let textureId of this.getTextureIds(layer)) {
            let isInRange = this.inRange(textureId, 0, this.textureCount - 1);

            if (isInRange) {
                this.textureUsage[textureId]++;
            } else {
                this.addError("Material " + material.index + ": Layer " + layer.index + ": Invalid texture id " + textureId);
            }
        }
        

        let textureAnimationId = layer.textureAnimationId;

        if (textureAnimationId !== -1) {
            let isInRange = this.inRange(textureAnimationId, 0, this.textureAnimationCount - 1);

            if (isInRange) {
                this.textureAnimationUsage[textureAnimationId]++;
            } else {
                this.addWarning("Material " + material.index + ": Layer " + layer.index + " Invalid texture animation " + textureAnimationId);
            }
        }

        this.assertWarning(this.inRange(layer.filterMode, 0, 6), "Material " + material.index + ": Layer " + layer.index + " Invalid filter mode " + layer.filterMode);
        
        this.testSDContainer(layer);
    },

    // ?
    testTextureAnimations(chunks) {
        let textureAnimationChunk = chunks.get("TXAN");

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
        let geosetChunk = chunks.get("GEOS"),
            geosetAnimationChunk = chunks.get("GEOA");

        if (geosetChunk) {
            let geosets = geosetChunk.elements;

            for (let i = 0, l = geosets.length; i < l; i++) {
                let geoset = geosets[i],
                    matrixGroups = geoset.matrixGroups,
                    materialId = geoset.materialId;

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

                if (this.inRange(materialId, 0, this.materialCount)) {
                    this.materialUsage[materialId]++;
                } else {
                    this.addError("Geoset " + i + ": Invalid material");
                }
            }
        }
    },

    // Error: Referencing an invalid geoset (?).
    // Warning: Referencing no geoset (the geoset animation does nothing).
    // Warning: There are geoset animations, but no geosets.
    testGeosetAnimations(chunks) {
        let geosetAnimationChunk = chunks.get("GEOA");

        if (geosetAnimationChunk) {
            let geosetAnimations = geosetAnimationChunk.elements,
                geosetCount = this.geosetCount;

            if (geosetCount) {
                for (let i = 0, l = geosetAnimations.length; i < l; i++) {
                    let geosetId = geosetAnimations[i].geosetId;

                    if (geosetId === -1) {
                        this.addUsage("Geoset animation " + i + ": No geoset");
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
        let boneChunk = chunks.get("BONE"),
            geosetChunk = chunks.get("GEOS"),
            geosetAnimationChunk = chunks.get("GEOA");

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
        let lightChunk = chunks.get("LITE");

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
        let helperChunk = chunks.get("HELP");

        if (helperChunk) {
            let helpers = helperChunk.elements;

            for (let i = 0, l = helpers.length; i < l; i++) {
                this.testNode(helpers[i]);
            }

        }
    },

    // Error: Attachment path that doesn't end with ".mdl".
    testAttachments(chunks) {
        let attachmentChunk = chunks.get("ATCH");

        if (attachmentChunk) {
            let attachments = attachmentChunk.elements;

            for (let i = 0, l = attachments.length; i < l; i++) {
                let attachment = attachments[i],
                    path = attachment.path;

                this.assertError(path === "" || path.toLowerCase().endsWith(".mdl"), "Attachment " + i + ": Invalid path \"" + path + "\"");

                this.testSDContainer(attachment)
                this.testNode(attachment);
            }

        }
    },

    // Warning: No pivot points (default one created at the origin?).
    testPivotPoints(chunks) {
        let pivotPointChunk = chunks.get("PIVT");

        this.assertWarning(pivotPointChunk && pivotPointChunk.elements.length > 0, "No pivot points");
    },

    // Error: Corrupted path (?).
    testParticleEmitters(chunks) {
        let particleEmitterChunk = chunks.get("PREM");

        if (particleEmitterChunk) {
            let emitters = particleEmitterChunk.elements;

            for (let i = 0, l = emitters.length; i < l; i++) {
                let emitter = emitters[i];

                this.assertError(emitter.path.toLowerCase().endsWith(".mdl"), "Particle Emitter " + i + ": Invalid path \"" + emitter.path + "\"");

                this.testSDContainer(emitter)
                this.testNode(emitter);
            }

        }
    },

    // Warning: Invalid filter mode (?).
    testParticleEmitters2(chunks) {
        let particleEmitterChunk2 = chunks.get("PRE2");

        if (particleEmitterChunk2) {
            let emitters = particleEmitterChunk2.elements;

            for (let i = 0, l = emitters.length; i < l; i++) {
                let emitter = emitters[i],
                    replaceableId = emitter.replaceableId;

                let isInRange = this.inRange(emitter.textureId, 0, this.textureCount - 1);

                if (isInRange) {
                    this.textureUsage[emitter.textureId]++;
                } else {
                    this.addError("Particle Emitter 2 " + i + ": Referencing invalid texture ID " + emitter.textureId);
                }

                this.assertWarning(this.inRange(emitter.filterMode, 0, 4), "Particle Emitter 2 " + i + ": Invalid filter mode " + emitter.filterMode);
                this.assertError(replaceableId === 0 || Mdx.replaceableIdToName[replaceableId] !== undefined, "Particle Emitter 2 " + i + ": Unknown replaceable ID " + replaceableId);

                this.testSDContainer(emitter)
                this.testNode(emitter);
            }

        }
    },

    // Error: Referencing an invalid material ID (?).
    testRibbonEmitters(chunks) {
        let ribbonEmitterChunk = chunks.get("RIBB");

        if (ribbonEmitterChunk) {
            let emitters = ribbonEmitterChunk.elements;

            for (let i = 0, l = emitters.length; i < l; i++) {
                let emitter = emitters[i];

                let isInRange = this.inRange(emitter.materialId, 0, this.materialCount - 1);

                if (isInRange) {
                    this.materialUsage[emitter.materialId]++;
                } else {
                    this.addError("Ribbon Emitter " + i + ": Referencing invalid material ID " + emitter.materialId);
                }

                this.testSDContainer(emitter)
                this.testNode(emitter);
            }

        }
    },

    // Error: Referencing an invalid global sequence (?).
    // Error: Zero keys (can't be loaded).
    testEventObjects(chunks) {
        let eventObjectChunk = chunks.get("EVTS");

        if (eventObjectChunk) {
            let eventObjects = eventObjectChunk.elements;

            for (let i = 0, l = eventObjects.length; i < l; i++) {
                let eventObject = eventObjects[i],
                    tracks = eventObject.tracks,
                    globalSequenceId = eventObject.globalSequenceId;

                if (globalSequenceId !== -1) {
                    let isInRange = this.inRange(globalSequenceId, 0, this.globalSequenceCount);

                    if (isInRange) {
                        this.globalSequenceUsage[globalSequenceId]++;
                    } else {
                        this.addError("Event Object " + i + ": Referencing invalid global sequence " + globalSequenceId);
                    }
                }
                
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
        let cameraChunk = chunks.get("CAMS");

        if (cameraChunk) {
            let cameras = cameraChunk.elements;

            for (let i = 0, l = cameras.length; i < l; i++) {
                this.testSDContainer(cameras[i]);
            }
        }
    },

    // ?
    testCollisionShapes(chunks) {
        let collisionShapeChunk = chunks.get("CLID");

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

        if (this.hasNode(parentId)) {

        }

        this.assertError(parentId === -1 || this.hasNode(parentId), "Node \"" + name + "\": Invalid parent ID " + parentId);
        this.assertError(objectId !== parentId, "Node \"" + name + "\": Same object ID and parent ID");
            
        this.testSDContainer(node);
    },

    hasNode(id) {
        let nodes = this.nodes;

        for (let i = 0, l = nodes.length; i < l; i++) {
            if (nodes[i].objectId === id) {
                return true;
            }
        }

        return false;
    },

    testSDContainer(object) {
        let elements = object.tracks.elements;

        for (let i = 0, l = elements.length; i < l; i++) {
            this.testSD(object, elements[i]);
        }
    },

    // Error: Referencing an invalid global sequence (?).
    testSD(object, sd) {
        let objectName = this.getIdentifier(object),
            typeInfo = this.tagToType[sd.tag],
            globalSequenceId = sd.globalSequenceId;

        if (globalSequenceId !== -1) {
            let isInRange = this.inRange(globalSequenceId, 0, this.globalSequenceCount);

            if (isInRange) {
                this.globalSequenceUsage[globalSequenceId]++;
            } else {
                this.addError("Event Object " + i + ": Referencing invalid global sequence " + globalSequenceId);
            }
        }

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
            id += " \"" + object.name + "\"";
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

    addError(message) {
        this.output.errors.push(message);
    },

    addWarning(message) {
        this.output.warnings.push(message);
    },

    addUsage(message) {
        this.output.usage.push(message);
    },

    assertError(condition, message) {
        if (!condition) {
            this.addError(message);
        }
    },

    assertWarning(condition, message) {
        if (!condition) {
            this.addWarning(message);
        }
    },

    assertUsage(condition, message) {
        if (!condition) {
            this.addUsage(message);
        }
    }
};

