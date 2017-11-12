import unique from '../../common/unique';
import MdxParserModelChunk from './modelchunk';
import MdxParserSequence from './sequence';
import MdxParserGlobalSequence from './globalsequence';
import MdxParserTexture from './texture';
import MdxParserPivotPoint from './pivotpoint';
import MdxParserMaterial from './material';
import MdxParserLayer from './layer';
import MdxParserTextureAnimation from './textureanimation';
import MdxParserGeoset from './geoset';
import MdxParserGeosetAnimation from './geosetanimation';
import MdxParserBone from './bone';
import MdxParserLight from './light';
import MdxParserHelper from './helper';
import MdxParserAttachment from './attachment';
import MdxParserParticleEmitter from './particleemitter';
import MdxParserParticle2Emitter from './particle2emitter';
import MdxParserRibbonEmitter from './ribbonemitter';
import MdxParserEventObject from './eventobject';
import MdxParserCamera from './camera';
import MdxParserCollisionShape from './collisionshape';
import MdxParserNode from './node';

// Is minVal <= x <= maxVal?
function inRange(x, minVal, maxVal) {
    return minVal <= x && x <= maxVal;
}

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
        this.versionChunk = chunks.get('VERS');
        this.modelChunk = chunks.get('MODL');
        this.sequences = this.getElements(chunks.get('SEQS'));
        this.globalSequences = this.getElements(chunks.get('GLBS')),
        this.textures = this.getElements(chunks.get('TEXS')),
        this.textureAnimations = this.getElements(chunks.get('TXAN')),
        this.materials = this.getElements(chunks.get('MTLS')),
        this.geosets = this.getElements(chunks.get('GEOS')),
        this.geosetAnimations = this.getElements(chunks.get('GEOA')),
        this.bones = this.getElements(chunks.get('BONE')),
        this.lights = this.getElements(chunks.get('LITE')),
        this.helpers = this.getElements(chunks.get('HELP')),
        this.attachments = this.getElements(chunks.get('ATCH')),
        this.pivotPoints = this.getElements(chunks.get('PIVT')),
        this.particleEmitters = this.getElements(chunks.get('PREM')),
        this.particle2Emitters = this.getElements(chunks.get('PRE2')),
        this.ribbonEmitters = this.getElements(chunks.get('RIBB')),
        this.eventObjects = this.getElements(chunks.get('EVTS')),
        this.cameras = this.getElements(chunks.get('CAMS')),
        this.collisionShapes = this.getElements(chunks.get('CLID'));
        
        this.referenceMap = new Map();

        // Objects being reference counted.
        this.initializeReferences([this.sequences, this.globalSequences, this.textures, this.textureAnimations, this.materials, this.geosetAnimations]);

        this.testVersion();
        this.testModel();
        this.testSequences();
        this.testGlobalSequences();
        this.testTextures();
        this.testMaterials();
        this.testTextureAnimations();
        this.testGeosets();
        this.testGeosetAnimations();
        this.testBones();
        this.testLights();
        this.testHelpers();
        this.testAttachments();
        this.testPivotPoints();
        this.testParticleEmitters();
        this.testParticleEmitters2();
        this.testRibbonEmitters();
        this.testEventObjects();
        this.testCameras(); 
        this.testCollisionShapes();

        for (let [object, references] of this.referenceMap) {
            if (references === 0) {
                this.addUsage(this.getName(object));
            }
        }

        return this.output;
    },

    initializeReferences(collections) {
        let map = this.referenceMap;

        for (let collection of collections) {
            for (let object of collection) {
                map.set(object, 0);
            }
        }
    },

    addReference(object) {
        let map = this.referenceMap;

        map.set(object, map.get(object) + 1);
    },

    getConstructorName(object) {
        if (object instanceof MdxParserModelChunk) { return 'Model Chunk' }
        if (object instanceof MdxParserSequence) { return 'Sequence' }
        if (object instanceof MdxParserGlobalSequence) { return 'Global Sequence' }
        if (object instanceof MdxParserTexture) { return 'Texture' }
        if (object instanceof MdxParserPivotPoint) { return 'Pivot Point' }
        if (object instanceof MdxParserMaterial) { return 'Material' }
        if (object instanceof MdxParserLayer) { return 'Layer' }
        if (object instanceof MdxParserTextureAnimation) { return 'Texture Animation' }
        if (object instanceof MdxParserGeoset) { return 'Geoset' }
        if (object instanceof MdxParserGeosetAnimation) { return 'Geoset Animation' }
        if (object instanceof MdxParserBone) { return 'Bone' }
        if (object instanceof MdxParserLight) { return 'Light' }
        if (object instanceof MdxParserHelper) { return 'Helper' }
        if (object instanceof MdxParserAttachment) { return 'Attachment' }
        if (object instanceof MdxParserParticleEmitter) { return 'Particle Emitter' }
        if (object instanceof MdxParserParticle2Emitter) { return 'Particle 2 Emitter' }
        if (object instanceof MdxParserRibbonEmitter) { return 'Ribbon Emitter' }
        if (object instanceof MdxParserEventObject) { return 'Event Object' }
        if (object instanceof MdxParserCamera) { return 'Camera' }
        if (object instanceof MdxParserCollisionShape) { return 'Collision Shape' }
        if (object instanceof MdxParserNode) { return 'Node' }
        return '';
    },

    getName(object) {
        let name = this.getConstructorName(object);

        if (typeof object.index === 'number') {
            name += ' ' + object.index;
        }

        if (typeof object.name === 'string') {
            name += ' \'' + object.name + '\'';
        }

        if (object.node) {
            name += ' \'' + object.node.name + '\'';
        }

        return name;
    },

    getElements(chunk) {
        if (chunk) {
            return chunk.elements;
        }

        return [];
    },

    isExtentValid(extent) {
        let min = extent.min,
            max = extent.max;

        return (extent.radius > 0) && (max[0] - min[0] > 0) && (max[1] - min[1] > 0) && (max[2] - min[2] > 0);
    },

    testExtents(object) {
        let extent = object.extent,
        objectName = this.getName(object);

        // ModelChunk, Sequence, Geoset
        if (extent) {
            this.assertWarning(this.isExtentValid(extent), objectName + ': Extent: radius=' + extent.radius +' min=[' + extent.min.join(',') + '] max=[' + extent.max.join(',') + ']');
        }

        let extents = object.extents;

        // Geoset
        if (extents) {
            for (let i = 0, l = extents.length; i < l; i++) {
                let extent = extents[i];

                this.assertWarning(this.isExtentValid(extent), objectName + ': Extent ' + i + ': radius=' + extent.radius +' min=[' + extent.min.join(',') + '] max=[' + extent.max.join(',') + ']');
            }
        }
    },

    // Warning: Unknown version.
    testVersion() {
        let versionChunk = this.versionChunk;

        this.assertWarning(versionChunk.version === 800, 'Unknown version ' + versionChunk.version);
    },

    // ?
    testModel() {
        let modelChunk = this.modelChunk;

        this.testExtents(modelChunk);
    },

    // Warning: No sequences (?).
    // Warning: An invalid sequence name (does nothing).
    // Warning: No stand sequence (can bother some use cases of models).
    // Warning: No death sequence (can bother some use cases of models).
    // Warning: A zero length sequence (the sequence does nothing).
    // Warning: A negative length sequence (can mess with community tools that think frames are unsigned).
    testSequences() {
        let sequences = this.sequences;

        if (sequences.length) {
            let foundStand = false,
                foundDeath = false;

            for (let i = 0, l = sequences.length; i < l; i++) {
                let sequence = sequences[i],
                    name = sequence.name,
                    tokens = name.toLowerCase().trim().split('-')[0].split(/\s+/),
                    token = tokens[0],
                    interval = sequence.interval,
                    length = interval[1] - interval[0],
                    objectName = this.getName(sequence);

                if (token === 'alternate') {
                    token = tokens[1];
                }

                if (token === 'stand') {
                    foundStand = true;
                }

                if (token === 'death') {
                    foundDeath = true;
                }

                if (this.sequenceNames.has(token)) {
                    this.addReference(sequence);
                } else {
                    this.addWarning(objectName + ': Not used due to an invalid name: \'' + token + '\'');
                }

                this.assertWarning(length !== 0, objectName + ': Zero length');
                this.assertWarning(length > -1, objectName + ': Negative length ' + length);

                this.testExtents(sequence);
            }

            this.assertWarning(foundStand, 'Missing \'Stand\' sequence');
            this.assertWarning(foundDeath, 'Missing \'Death\' sequence');
        } else {
            this.addWarning('No sequences');
        }
    },

    // Warning: A global sequence with zero length (the first track is selected, regardless of its frame).
    // Warning: A global sequence with negative length (?).
    testGlobalSequences() {
        let sequences = this.globalSequences;

        for (let i = 0, l = sequences.length; i < l; i++) {
            let sequence = sequences[i],
                value = sequence.value,
                objectName = this.getName(sequence);

            this.assertWarning(value !== 0, objectName + ': Zero length');
            this.assertWarning(value > 0, objectName + ': Negative length ' + value);
        }
    },

    // Error: A corrupted path (can't be loaded).
    // Error: An unknown replaceable ID (?).
    // Warning: A path and replaceable ID are used together (the path is ignored).
    testTextures() {
        let textures = this.textures;

        if (textures.length) {
            for (let i = 0, l = textures.length; i < l; i++) {
                let texture = textures[i],
                    replaceableId = texture.replaceableId,
                    path = texture.path.toLowerCase(),
                    objectName = this.getName(texture);

                this.assertError(path === '' || path.endsWith('.blp') || path.endsWith('.tga'), objectName + ': Corrupted path \'' + path + '\'');
                this.assertError(replaceableId === 0 || this.replaceableIds.has(replaceableId), objectName + ': Unknown replaceable ID ' + replaceableId);
                this.assertWarning(path === '' || replaceableId === 0, objectName + ': Path \'' + path + '\' and replaceable ID ' + replaceableId + ' used together');
            }
        } else {
            this.addWarning('No textures');
        }
    },

    // ?
    testMaterials() {
        let materials = this.materials;

        if (materials.length) {
            for (let i = 0, l = materials.length; i < l; i++) {
                this.testMaterial(materials[i]);
            }
        } else {
            this.addWarning('No materials');
        }
    },

    // Warning: No layers (?).
    testMaterial(material) {
        let layers = material.layers;

        if (layers.length) {
            for (let i = 0, l = layers.length; i < l; i++) {
                this.testLayer(material, layers[i])
            }
        } else {
            this.addWarning(this.getName(material) + ': No layers');
        }
    },

    getTextureIds(layer) {
        let textureIds = [];

        for (let sd of layer.tracks.elements) {
            if (sd.tag === 'KMTF') {
                let values = [];

                for (let track of sd.tracks) {
                    values.push(track.value);
                }

                return unique(values);
            }
        }

        return [layer.textureId];
    },

    // Warning: Invalid filter mode (?).
    // Warning: Invalid texture id (?)
    testLayer(material, layer) {
        let objectName = this.getName(material) + ': ' + this.getName(layer);

        for (let textureId of this.getTextureIds(layer)) {
            if (inRange(textureId, 0, this.textures.length - 1)) {
                this.addReference(this.textures[textureId]);
            } else {
                this.addError(objectName + ': Invalid texture ' + textureId);
            }
        }

        let textureAnimationId = layer.textureAnimationId;

        if (textureAnimationId !== -1) {
            if (inRange(textureAnimationId, 0, this.textureAnimations.length - 1)) {
                this.addReference(this.textureAnimations[textureAnimationId]);
            } else {
                this.addWarning(objectName + ' Invalid texture animation ' + textureAnimationId);
            }
        }

        this.assertWarning(inRange(layer.filterMode, 0, 6), objectName + ' Invalid filter mode ' + layer.filterMode);
        
        this.testSDContainer(layer, material);
    },

    // ?
    testTextureAnimations() {
        let textureAnimations = this.textureAnimations;

        for (let i = 0, l = textureAnimations.length; i < l; i++) {
            this.testSDContainer(textureAnimations[i]);
        }
    },

    // Warning: A vertex not attached to any bone (gets attached to a map's center instead).
    // Warning: A geoset is referenced by multiple geoset animations (?).
    testGeosets() {
        let geosets = this.geosets,
            geosetAnimations = this.geosetAnimations;

        for (let i = 0, l = geosets.length; i < l; i++) {
            let geoset = geosets[i],
                matrixGroups = geoset.matrixGroups,
                materialId = geoset.materialId,
                objectName = this.getName(geoset);

            for (let j = 0, k = matrixGroups.length; j < k; j++) {
                this.assertWarning(matrixGroups[j] > 0, objectName + ': Vertex ' + j + ': Not attached to any bones');
            }

            if (geosetAnimations.length) {
                let references = [];

                for (let j = 0, k = geosetAnimations.length; j < k; j++) {
                    if (geosetAnimations[j].geosetId === i) {
                        references.push(j);
                    }
                }

                this.assertWarning(references.length <= 1, objectName + ': Referenced by ' + references.length + ' geoset animations (' + references.join(', ') + ')');
            }

            if (inRange(materialId, 0, this.materials.length - 1)) {
                this.addReference(this.materials[materialId]);
            } else {
                this.addError(objectName + ': Invalid material ' + materialId);
            }

            this.testExtents(geoset);
        }
    },

    // Error: Referencing an invalid geoset (?).
    // Warning: Referencing no geoset (the geoset animation does nothing).
    // Warning: There are geoset animations, but no geosets.
    testGeosetAnimations() {
        let geosets = this.geosets,
            geosetAnimations = this.geosetAnimations;

        for (let i = 0, l = geosetAnimations.length; i < l; i++) {
            let geosetAnimation = geosetAnimations[i],
                geosetId = geosetAnimation.geosetId,
                objectName = this.getName(geosetAnimation);

            if (inRange(geosetId, 0, this.geosets.length - 1)) {
                this.addReference(geosetAnimation);
            } else {
                this.addError(objectName + ': Invalid geoset ' + geosetId);
            }

            this.testSDContainer(geosetAnimations[i]);
        }
    },

    // Error: Referencing an invalid geoset (?).
    // Error: Referencing an invalid geoset animation (?).
    testBones() {
        let bones = this.bones,
            geosets = this.geosets,
            geosetAnimations = this.geosetAnimations;

        if (bones.length) {
            for (let i = 0, l = bones.length; i < l; i++) {
                let bone = bones[i],
                    geosetId = bone.geosetId,
                    geosetAnimationId = bone.geosetAnimationId,
                    objectName = this.getName(bone);

                this.assertError(geosetId === -1 || geosetId < geosets.length, objectName + ': Invalid geoset ' + geosetId);
                this.assertError(geosetAnimationId === -1 || geosetAnimationId < geosetAnimations.length, objectName + ': Invalid geoset animation ' + geosetAnimationId);
                this.testNode(bone);
            }
        } else {
            this.addWarning('No bones');
        }
    },

    // Warning: Attenuation outside of the range min=80 max=200 (can mess with lighting).
    testLights() {
        let lights = this.lights;

        for (let i = 0, l = lights.length; i < l; i++) {
            let light = lights[i],
                attenuation = light.attenuation,
                objectName = this.getName(light);

            this.assertWarning(attenuation[0] >= 80 && attenuation[1] <= 200 && attenuation[1] - attenuation[0] > 0, objectName + ': Attenuation min=' + attenuation[0] + ' max=' + attenuation[1]);

            this.testSDContainer(light)
            this.testNode(light);
        }
    },

    // ?
    testHelpers() {
        let helpers = this.helpers;

        for (let i = 0, l = helpers.length; i < l; i++) {
            this.testNode(helpers[i]);
        }
    },

    // Error: Attachment path that doesn't end with '.mdl'.
    testAttachments() {
        let attachments = this.attachments;

        for (let i = 0, l = attachments.length; i < l; i++) {
            let attachment = attachments[i],
                path = attachment.path,
                objectName = this.getName(attachment);

            if (path === '') {
                this.assertWarning(this.testAttachmentName(attachment), objectName + ': Invalid attachment \'' + attachment.node.name + '\'');
            } else {
                this.assertError(path.toLowerCase().endsWith('.mdl'), objectName + ': Invalid path \'' + path + '\'');
            }

            this.testSDContainer(attachment)
            this.testNode(attachment);
        }
    },

    testAttachmentName(attachment) {
        let tokens = attachment.node.name.toLowerCase().trim().split(/\s+/),
            valid = true;

        if (tokens.length > 1) {
            let names = this.attachmentNames,
                firstToken = tokens[0],
                lastToken = tokens[tokens.length - 1];

            if (!names.has(tokens[0]) || lastToken !== 'ref') {
                valid = false;
            }

            if (tokens.length > 2) {
                let qualifiers = this.attachmentQualifiers;

                for (let i = 1, l = tokens.length - 1; i < l; i++) {
                    if (!qualifiers.has(tokens[i])) {
                        valid = false;
                    }
                }
            }
        } else {
            valid = false;
        }

        return valid;
    },

    // Warning: No pivot points (default one created at the origin?).
    testPivotPoints() {
        let pivotPoints = this.pivotPoints,
            nodes = this.nodes;

        this.assertWarning(pivotPoints.length === nodes.length, 'Expected ' + nodes.length + ' pivot points, got ' + pivotPoints.length);
    },

    // Error: Corrupted path (?).
    testParticleEmitters() {
        let emitters = this.particleEmitters;

        for (let i = 0, l = emitters.length; i < l; i++) {
            let emitter = emitters[i],
                objectName = this.getName(emitter);

            this.assertError(emitter.path.toLowerCase().endsWith('.mdl'), objectName + ': Invalid path \'' + emitter.path + '\'');

            this.testSDContainer(emitter)
            this.testNode(emitter);
        }
    },

    // Warning: Invalid filter mode (?).
    testParticleEmitters2() {
        let emitters = this.particle2Emitters;

        for (let i = 0, l = emitters.length; i < l; i++) {
            let emitter = emitters[i],
                replaceableId = emitter.replaceableId,
                objectName = this.getName(emitter);

            if (inRange(emitter.textureId, 0, this.textures.length - 1)) {
                this.addReference(this.textures[emitter.textureId]);
            } else {
                this.addError(objectName + ': Invalid texture ' + emitter.textureId);
            }

            this.assertWarning(inRange(emitter.filterMode, 0, 4), objectName + ': Invalid filter mode ' + emitter.filterMode);
            this.assertError(replaceableId === 0 || this.replaceableIds.has(replaceableId), objectName + ': Invalid replaceable ID ' + replaceableId);

            this.testSDContainer(emitter)
            this.testNode( emitter);
        }
    },

    // Error: Referencing an invalid material ID (?).
    testRibbonEmitters() {
        let emitters = this.ribbonEmitters;

        for (let i = 0, l = emitters.length; i < l; i++) {
            let emitter = emitters[i],
                objectName = this.getName(emitter);

            if (inRange(emitter.materialId, 0, this.materials.length - 1)) {
                this.addReference(this.materials[emitter.materialId]);
            } else {
                this.addError(objectName + ': Invalid material ' + emitter.materialId);
            }

            this.testSDContainer(emitter)
            this.testNode(emitter);
        }
    },

    // Error: Referencing an invalid global sequence (?).
    // Error: Zero keys (can't be loaded).
    testEventObjects() {
        let eventObjects = this.eventObjects;

        for (let i = 0, l = eventObjects.length; i < l; i++) {
            let eventObject = eventObjects[i],
                tracks = eventObject.tracks,
                globalSequenceId = eventObject.globalSequenceId,
                objectName = this.getName(eventObject);

            if (globalSequenceId !== -1) {
                if (inRange(globalSequenceId, 0, this.globalSequences.length - 1)) {
                    this.addReference(this.globalSequences[globalSequenceId]);
                } else {
                    this.addError(objectName + ': Invalid global sequence ' + globalSequenceId);
                }
            }

            if (tracks.length) {
                for (let j = 0, k = tracks.length; j < k; j++) {
                    let track = tracks[j],
                        sequenceInfo = this.getSequenceInfoFromFrame(track, globalSequenceId),
                        sequenceId = sequenceInfo[0];

                    this.assertWarning(sequenceId !== -1, objectName + ': Track ' + j + ': Frame ' + track + ' is not in any sequence');
                }
            } else {
                this.addError(objectName + ': Zero keys');
            }

            this.testNode(eventObject);

        }
    },

    // ?
    testCameras() {
        let cameras = this.cameras;

        for (let i = 0, l = cameras.length; i < l; i++) {
            this.testSDContainer(cameras[i]);
        }
    },

    // ?
    testCollisionShapes() {
        let collisionShapes = this.collisionShapes;

        for (let i = 0, l = collisionShapes.length; i < l; i++) {
            this.testNode(collisionShapes[i]);
        }
    },

    // Error: Invalid object ID (?).
    // Error: Invalid parent ID (?).
    // Error: Same object ID and parent ID (?).
    testNode(object) {
        let node = object.node,
            name = node.name,
            objectId = node.objectId,
            parentId = node.parentId,
            objectName = this.getName(node);

        this.assertError(parentId === -1 || this.hasNode(parentId), objectName + ': Invalid parent ' + parentId);
        this.assertError(objectId !== parentId, objectName + ': Same object and parent');
            
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

    testSDContainer(object, parent) {
        let elements = object.tracks.elements;

        for (let i = 0, l = elements.length; i < l; i++) {
            this.testSD(object, elements[i], parent);
        }
    },

    // Error: Referencing an invalid global sequence (?).
    testSD(object, sd, parent) {
        let objectName = this.getName(object),
            animatedTypeName = this.animatedTypeNames.get(sd.tag),
            globalSequenceId = sd.globalSequenceId;

        if (globalSequenceId !== -1) {
            if (inRange(globalSequenceId, 0, this.globalSequences.length - 1)) {
                this.addReference(this.globalSequences[globalSequenceId]);
            } else {
                this.addError(objectName + ': ' + animatedType + ': Invalid global sequence ' + globalSequenceId);
            }
        }

        this.testInterpolationType(objectName, animatedTypeName, sd.interpolationType);
        this.testTracks(objectName, animatedTypeName, sd.tracks, globalSequenceId);
    },

    // Warning: Zero tracks (?).
    // Warning: Tracks used without sequences (?).
    // Warning: Track outside of any sequence (?). Ignores frame 0.
    // Warning: Negative frame (?).
    // Warning: No opening frame for a sequence (can cause weird animations).
    // Warning: No closing frame for a sequence (can cause weird animations).
    testTracks(objectName, animatedTypeName, tracks, globalSequenceId) {
        let sequences = this.sequences,
            usageMap = {};

        this.assertWarning(tracks.length, objectName + ': ' + animatedTypeName + ': Zero tracks');
        this.assertWarning(globalSequenceId !== -1 || tracks.length === 0 || sequences.length !== 0, objectName + ': ' + animatedTypeName + ': Tracks used without sequences')

        for (let i = 0, l = tracks.length; i < l; i++) {
            let track = tracks[i],
                sequenceInfo = this.getSequenceInfoFromFrame(track.frame, globalSequenceId),
                sequenceId = sequenceInfo[0],
                isBeginning = sequenceInfo[1],
                isEnding = sequenceInfo[2];

            this.assertWarning(tracks.length === 1 || sequenceId !== -1 || track.frame === 0, objectName + ': ' + animatedTypeName + ': Track ' + i + ': Frame ' + track.frame + ' is not in any sequence');
            this.assertWarning(track.frame >= 0, objectName + ': ' + animatedTypeName + ': Track ' + i + ': Negative frame');

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
                sequence,
                sequenceName;

            if (globalSequenceId === -1) {
                sequence = sequences[sequenceId];
            } else {
                sequence = this.globalSequences[sequenceId];
            }

            sequenceName = this.getName(sequence);

            this.assertWarning(sequenceInfo[0] || sequenceInfo[2] === 1, objectName + ': ' + animatedTypeName + ': No opening track for ' + sequenceName);
            this.assertWarning(sequenceInfo[1] || sequenceInfo[2] === 1, objectName + ': ' + animatedTypeName + ': No closing track for ' + sequenceName);
        }
    },

    // Warning: Interpolation used for visibility keyframes that is not None.
    testInterpolationType(objectName, animatedTypeName, interpolationType) {
        if (animatedTypeName === 'Visibility') {
            this.assertWarning(interpolationType === 0, objectName + ': ' + animatedTypeName + ': Interpolation type not set to None');
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

    animatedTypeNames: new Map ([
        ['KMTF', 'Texture ID'],
        ['KMTA', 'Alpha'],
        ['KTAT', 'Translation'],
        ['KTAR', 'Rotation'],
        ['KTAS', 'Scaling'],
        ['KGAO', 'Alpha'],
        ['KGAC', 'Color'],
        ['KLAS', 'Attenuation Start'],
        ['KLAE', 'Attenuation End'],
        ['KLAC', 'Color'],
        ['KLAI', 'Intensity'],
        ['KLBI', 'Ambient Intensity'],
        ['KLBC', 'Ambient Color'],
        ['KLAV', 'Visibility'],
        ['KATV', 'Visibility'],
        ['KPEE', 'Emission Rate'],
        ['KPEG', 'Gravity'],
        ['KPLN', 'Longitude'],
        ['KPLT', 'Latitude'],
        ['KPEL', 'Lifespan'],
        ['KPES', 'Speed'],
        ['KPEV', 'Visibility'],
        ['KP2E', 'Emission Rate'],
        ['KP2G', 'Gravity'],
        ['KP2L', 'Latitude'],
        ['KP2R', 'Variation'],
        ['KP2N', 'Length'],
        ['KP2W', 'Width'],
        ['KP2S', 'Speed'],
        ['KP2V', 'Visibility'],
        ['KRHA', 'Height Above'],
        ['KRHB', 'Height Below'],
        ['KRAL', 'Alpha'],
        ['KRCO', 'Color'],
        ['KRTX', 'Texture Slot'],
        ['KRVS', 'Visibility'],
        ['KCTR', 'Translation'],
        ['KTTR', 'Rotation'],
        ['KCRL', 'Target Translation'],
        ['KGTR', 'Translation'],
        ['KGRT', 'Rotation'],
        ['KGSC', 'Scaling']
    ]),

    sequenceNames: new Set([
        'attack',
        'birth',
        'cinematic',
        'death',
        'decay',
        'dissipate',
        'morph',
        'portrait',
        'sleep',
        'spell',
        'stand',
        'walk'
    ]),

    attachmentNames: new Set([
        'chest',
        'feet',
        'foot',
        'hand',
        'head',
        'origin',
        'overhead',
        'sprite',
        'weapon'
    ]),

    attachmentQualifiers: new Set([
        'alternate',
        'left',
        'mount',
        'right',
        'rear',
        'smart',
        'first',
        'second',
        'third',
        'fourth',
        'fifth',
        'sixth',
        'small',
        'medium',
        'large',
        'gold',
        'rallypoint',
        'eattree'
    ]),

    replaceableIds: new Set([
        1,
        2,
        11,
        21,
        31,
        32,
        33,
        34,
        35,
        36,
        37
    ]),

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

export default MdxSanityTester;
