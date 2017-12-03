import unique from '../../common/arrayunique';
import ModelChunk from './modelchunk';
import Sequence from './sequence';
import GlobalSequence from './globalsequence';
import Texture from './texture';
import PivotPoint from './pivotpoint';
import Material from './material';
import Layer from './layer';
import TextureAnimation from './textureanimation';
import Geoset from './geoset';
import GeosetAnimation from './geosetanimation';
import Bone from './bone';
import Light from './light';
import Helper from './helper';
import Attachment from './attachment';
import ParticleEmitter from './particleemitter';
import Particle2Emitter from './particle2emitter';
import RibbonEmitter from './ribbonemitter';
import EventObject from './eventobject';
import Camera from './camera';
import CollisionShape from './collisionshape';
import Node from './node';

// Is minVal <= x <= maxVal?
function inRange(x, minVal, maxVal) {
    return minVal <= x && x <= maxVal;
}

function initializeReferences(state) {
    let map = state.referenceMap;

    for (let collection of [state.sequences, state.globalSequences, state.textures, state.textureAnimations, state.materials, state.geosetAnimations]) {
        for (let object of collection) {
            map.set(object, 0);
        }
    }
}

function addReference(state, object) {
    let map = state.referenceMap;

    map.set(object, map.get(object) + 1);
}

function getConstructorName(object) {
    if (object instanceof ModelChunk) { return 'Model Chunk' }
    if (object instanceof Sequence) { return 'Sequence' }
    if (object instanceof GlobalSequence) { return 'Global Sequence' }
    if (object instanceof Texture) { return 'Texture' }
    if (object instanceof PivotPoint) { return 'Pivot Point' }
    if (object instanceof Material) { return 'Material' }
    if (object instanceof Layer) { return 'Layer' }
    if (object instanceof TextureAnimation) { return 'Texture Animation' }
    if (object instanceof Geoset) { return 'Geoset' }
    if (object instanceof GeosetAnimation) { return 'Geoset Animation' }
    if (object instanceof Bone) { return 'Bone' }
    if (object instanceof Light) { return 'Light' }
    if (object instanceof Helper) { return 'Helper' }
    if (object instanceof Attachment) { return 'Attachment' }
    if (object instanceof ParticleEmitter) { return 'Particle Emitter' }
    if (object instanceof Particle2Emitter) { return 'Particle 2 Emitter' }
    if (object instanceof RibbonEmitter) { return 'Ribbon Emitter' }
    if (object instanceof EventObject) { return 'Event Object' }
    if (object instanceof Camera) { return 'Camera' }
    if (object instanceof CollisionShape) { return 'Collision Shape' }
    if (object instanceof Node) { return 'Node' }
    return '';
}

function getName(object) {
    let name = getConstructorName(object);

    if (typeof object.index === 'number') {
        name += ' ' + object.index;
    }

    if (typeof object.name === 'string') {
        name += ' "' + object.name + '"';
    }

    if (object.node) {
        name += ' "' + object.node.name + '"';
    }

    return name;
}

function getElements(chunk) {
    if (chunk) {
        return chunk.elements;
    }

    return [];
}

function isExtentValid(extent) {
    let min = extent.min,
        max = extent.max;

    return (extent.radius > 0) && (max[0] - min[0] > 0) && (max[1] - min[1] > 0) && (max[2] - min[2] > 0);
}

function testExtents(state, object) {
    let extent = object.extent,
        objectName = getName(object);

    // ModelChunk, Sequence, Geoset
    if (extent) {
        assertWarning(state, isExtentValid(extent), objectName + ': Extent: radius=' + extent.radius +' min=[' + extent.min.join(',') + '] max=[' + extent.max.join(',') + ']');
    }

    let extents = object.extents;

    // Geoset
    if (extents) {
        for (let i = 0, l = extents.length; i < l; i++) {
            let extent = extents[i];

            assertWarning(state, isExtentValid(extent), objectName + ': Extent ' + i + ': radius=' + extent.radius +' min=[' + extent.min.join(',') + '] max=[' + extent.max.join(',') + ']');
        }
    }
}

// Warning: Unknown version.
function testVersion(state) {
    let version = state.version;

    assertWarning(state, version.version === 800, 'Unknown version ' + version.version);
}

// ?
function testModel(state) {
    let model = state.model;

    testExtents(state, model);
}

// Warning: No sequences (?).
// Warning: An invalid sequence name (does nothing).
// Warning: No stand sequence (can bother some use cases of models).
// Warning: No death sequence (can bother some use cases of models).
// Warning: A zero length sequence (the sequence does nothing).
// Warning: A negative length sequence (can mess with community tools that think frames are unsigned).
function testSequences(state) {
    let sequences = state.sequences;

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
                objectName = getName(sequence);

            if (token === 'alternate') {
                token = tokens[1];
            }

            if (token === 'stand') {
                foundStand = true;
            }

            if (token === 'death') {
                foundDeath = true;
            }

            if (sequenceNames.has(token)) {
                addReference(state, sequence);
            } else {
                addWarning(state, objectName + ': Not used due to an invalid name: "' + token + '"');
            }

            assertWarning(state, length !== 0, objectName + ': Zero length');
            assertWarning(state, length > -1, objectName + ': Negative length ' + length);

            testExtents(state, sequence);
        }

        assertWarning(state, foundStand, 'Missing "Stand" sequence');
        assertWarning(state, foundDeath, 'Missing "Death" sequence');
    } else {
        addWarning(state, 'No sequences');
    }
}

// Warning: A global sequence with zero length (the first track is selected, regardless of its frame).
// Warning: A global sequence with negative length (?).
function testGlobalSequences(state) {
    let sequences = state.globalSequences;

    for (let i = 0, l = sequences.length; i < l; i++) {
        let sequence = sequences[i],
            value = sequence.value,
            objectName = getName(sequence);

        assertWarning(state, value !== 0, objectName + ': Zero length');
        assertWarning(state, value > 0, objectName + ': Negative length ' + value);
    }
}

// Error: A corrupted path (can't be loaded).
// Error: An unknown replaceable ID (?).
// Warning: A path and replaceable ID are used together (the path is ignored).
function testTextures(state) {
    let textures = state.textures;

    if (textures.length) {
        for (let i = 0, l = textures.length; i < l; i++) {
            let texture = textures[i],
                replaceableId = texture.replaceableId,
                path = texture.path.toLowerCase(),
                objectName = getName(texture);

            assertError(state, path === '' || path.endsWith('.blp') || path.endsWith('.tga'), objectName + ': Corrupted path "' + path + '"');
            assertError(state, replaceableId === 0 || replaceableIds.has(replaceableId), objectName + ': Unknown replaceable ID ' + replaceableId);
            assertWarning(state, path === '' || replaceableId === 0, objectName + ': Path "' + path + '" and replaceable ID ' + replaceableId + ' used together');
        }
    } else {
        addWarning(state, 'No textures');
    }
}

// ?
function testMaterials(state) {
    let materials = state.materials;

    if (materials.length) {
        for (let i = 0, l = materials.length; i < l; i++) {
            testMaterial(state, materials[i]);
        }
    } else {
        addWarning(state, 'No materials');
    }
}

// Warning: No layers (?).
function testMaterial(state, material) {
    let layers = material.layers;

    if (layers.length) {
        for (let i = 0, l = layers.length; i < l; i++) {
            testLayer(state, material, layers[i])
        }
    } else {
        addWarning(state, getName(material) + ': No layers');
    }
}

function getTextureIds(layer) {
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
}

// Warning: Invalid filter mode (?).
// Warning: Invalid texture id (?)
function testLayer(state, material, layer) {
    let objectName = getName(material) + ': ' + getName(layer);

    for (let textureId of getTextureIds(layer)) {
        if (inRange(textureId, 0, state.textures.length - 1)) {
            addReference(state, state.textures[textureId]);
        } else {
            addError(state, objectName + ': Invalid texture ' + textureId);
        }
    }

    let textureAnimationId = layer.textureAnimationId;

    if (textureAnimationId !== -1) {
        if (inRange(textureAnimationId, 0, state.textureAnimations.length - 1)) {
            addReference(state, state.textureAnimations[textureAnimationId]);
        } else {
            addWarning(state, objectName + ' Invalid texture animation ' + textureAnimationId);
        }
    }

    assertWarning(state, inRange(layer.filterMode, 0, 6), objectName + ' Invalid filter mode ' + layer.filterMode);
    
    testSDContainer(state, layer, material);
}

// ?
function testTextureAnimations(state) {
    let textureAnimations = state.textureAnimations;

    for (let i = 0, l = textureAnimations.length; i < l; i++) {
        testSDContainer(state, textureAnimations[i]);
    }
}

// Warning: A vertex not attached to any bone (gets attached to a map's center instead).
// Warning: A geoset is referenced by multiple geoset animations (?).
function testGeosets(state) {
    let geosets = state.geosets,
        geosetAnimations = state.geosetAnimations;

    for (let i = 0, l = geosets.length; i < l; i++) {
        let geoset = geosets[i],
            matrixGroups = geoset.matrixGroups,
            materialId = geoset.materialId,
            objectName = getName(geoset);

        for (let j = 0, k = matrixGroups.length; j < k; j++) {
            assertWarning(state, matrixGroups[j] > 0, objectName + ': Vertex ' + j + ': Not attached to any bones');
        }

        if (geosetAnimations.length) {
            let references = [];

            for (let j = 0, k = geosetAnimations.length; j < k; j++) {
                if (geosetAnimations[j].geosetId === i) {
                    references.push(j);
                }
            }

            assertWarning(state, references.length <= 1, objectName + ': Referenced by ' + references.length + ' geoset animations (' + references.join(', ') + ')');
        }

        if (inRange(materialId, 0, state.materials.length - 1)) {
            addReference(state, state.materials[materialId]);
        } else {
            addError(state, objectName + ': Invalid material ' + materialId);
        }

        testExtents(state, geoset);
    }
}

// Error: Referencing an invalid geoset (?).
// Warning: Referencing no geoset (the geoset animation does nothing).
// Warning: There are geoset animations, but no geosets.
function testGeosetAnimations(state) {
    let geosets = state.geosets,
        geosetAnimations = state.geosetAnimations;

    for (let i = 0, l = geosetAnimations.length; i < l; i++) {
        let geosetAnimation = geosetAnimations[i],
            geosetId = geosetAnimation.geosetId,
            objectName = getName(geosetAnimation);

        if (inRange(geosetId, 0, state.geosets.length - 1)) {
            addReference(state, geosetAnimation);
        } else {
            addError(state, objectName + ': Invalid geoset ' + geosetId);
        }

        testSDContainer(state, geosetAnimations[i]);
    }
}

// Error: Referencing an invalid geoset (?).
// Error: Referencing an invalid geoset animation (?).
function testBones(state) {
    let bones = state.bones,
        geosets = state.geosets,
        geosetAnimations = state.geosetAnimations;

    if (bones.length) {
        for (let i = 0, l = bones.length; i < l; i++) {
            let bone = bones[i],
                geosetId = bone.geosetId,
                geosetAnimationId = bone.geosetAnimationId,
                objectName = getName(bone);

            assertError(state, geosetId === -1 || geosetId < geosets.length, objectName + ': Invalid geoset ' + geosetId);
            assertError(state, geosetAnimationId === -1 || geosetAnimationId < geosetAnimations.length, objectName + ': Invalid geoset animation ' + geosetAnimationId);
            testNode(state, bone);
        }
    } else {
        addWarning(state, 'No bones');
    }
}

// Warning: Attenuation outside of the range min=80 max=200 (can mess with lighting).
function testLights(state) {
    let lights = state.lights;

    for (let i = 0, l = lights.length; i < l; i++) {
        let light = lights[i],
            attenuation = light.attenuation,
            objectName = getName(light);

        assertWarning(state, attenuation[0] >= 80 && attenuation[1] <= 200 && attenuation[1] - attenuation[0] > 0, objectName + ': Attenuation min=' + attenuation[0] + ' max=' + attenuation[1]);

        testSDContainer(state, light)
        testNode(state, light);
    }
}

// ?
function testHelpers(state) {
    let helpers = state.helpers;

    for (let i = 0, l = helpers.length; i < l; i++) {
        testNode(state, helpers[i]);
    }
}

// Error: Attachment path that doesn't end with '.mdl'.
function testAttachments(state) {
    let attachments = state.attachments;

    for (let i = 0, l = attachments.length; i < l; i++) {
        let attachment = attachments[i],
            path = attachment.path,
            objectName = getName(attachment);

        if (path === '') {
            assertWarning(state, testAttachmentName(attachment), objectName + ': Invalid attachment "' + attachment.node.name + '"');
        } else {
            assertError(state, path.toLowerCase().endsWith('.mdl'), objectName + ': Invalid path "' + path + '"');
        }

        testSDContainer(state, attachment)
        testNode(state, attachment);
    }
}

function testAttachmentName(attachment) {
    let tokens = attachment.node.name.toLowerCase().trim().split(/\s+/),
        valid = true;

    if (tokens.length > 1) {
        let names = attachmentNames,
            firstToken = tokens[0],
            lastToken = tokens[tokens.length - 1];

        if (!names.has(tokens[0]) || lastToken !== 'ref') {
            valid = false;
        }

        if (tokens.length > 2) {
            let qualifiers = attachmentQualifiers;

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
}

// Warning: No pivot points (default one created at the origin?).
function testPivotPoints(state) {
    let pivotPoints = state.pivotPoints,
        nodes = state.nodes;

    assertWarning(state, pivotPoints.length === nodes.length, 'Expected ' + nodes.length + ' pivot points, got ' + pivotPoints.length);
}

// Error: Corrupted path (?).
function testParticleEmitters(state) {
    let emitters = state.particleEmitters;

    for (let i = 0, l = emitters.length; i < l; i++) {
        let emitter = emitters[i],
            objectName = getName(emitter);

        assertError(state, emitter.path.toLowerCase().endsWith('.mdl'), objectName + ': Invalid path "' + emitter.path + '"');

        testSDContainer(state, emitter)
        testNode(state, emitter);
    }
}

// Warning: Invalid filter mode (?).
function testParticleEmitters2(state) {
    let emitters = state.particle2Emitters;

    for (let i = 0, l = emitters.length; i < l; i++) {
        let emitter = emitters[i],
            replaceableId = emitter.replaceableId,
            objectName = getName(emitter);

        if (inRange(emitter.textureId, 0, state.textures.length - 1)) {
            addReference(state, state.textures[emitter.textureId]);
        } else {
            addError(state, objectName + ': Invalid texture ' + emitter.textureId);
        }

        assertWarning(state, inRange(emitter.filterMode, 0, 4), objectName + ': Invalid filter mode ' + emitter.filterMode);
        assertError(state, replaceableId === 0 || replaceableIds.has(replaceableId), objectName + ': Invalid replaceable ID ' + replaceableId);

        testSDContainer(state, emitter)
        testNode(state, emitter);
    }
}

// Error: Referencing an invalid material ID (?).
function testRibbonEmitters(state) {
    let emitters = state.ribbonEmitters;

    for (let i = 0, l = emitters.length; i < l; i++) {
        let emitter = emitters[i],
            objectName = getName(emitter);

        if (inRange(emitter.materialId, 0, state.materials.length - 1)) {
            addReference(state, state.materials[emitter.materialId]);
        } else {
            addError(state, objectName + ': Invalid material ' + emitter.materialId);
        }

        testSDContainer(state, emitter)
        testNode(state, emitter);
    }
}

// Error: Referencing an invalid global sequence (?).
// Error: Zero keys (can't be loaded).
function testEventObjects(state) {
    let eventObjects = state.eventObjects;

    for (let i = 0, l = eventObjects.length; i < l; i++) {
        let eventObject = eventObjects[i],
            tracks = eventObject.tracks,
            globalSequenceId = eventObject.globalSequenceId,
            objectName = getName(eventObject);

        if (globalSequenceId !== -1) {
            if (inRange(globalSequenceId, 0, state.globalSequences.length - 1)) {
                addReference(state, state.globalSequences[globalSequenceId]);
            } else {
                addError(state, objectName + ': Invalid global sequence ' + globalSequenceId);
            }
        }

        if (tracks.length) {
            for (let j = 0, k = tracks.length; j < k; j++) {
                let track = tracks[j],
                    sequenceInfo = getSequenceInfoFromFrame(state, track, globalSequenceId),
                    sequenceId = sequenceInfo[0];

                assertWarning(state, sequenceId !== -1, objectName + ': Track ' + j + ': Frame ' + track + ' is not in any sequence');
            }
        } else {
            addError(state, objectName + ': Zero keys');
        }

        testNode(state, eventObject);
    }
}

// ?
function testCameras(state) {
    let cameras = state.cameras;

    for (let i = 0, l = cameras.length; i < l; i++) {
        testSDContainer(state, cameras[i]);
    }
}

// ?
function testCollisionShapes(state) {
    let collisionShapes = state.collisionShapes;

    for (let i = 0, l = collisionShapes.length; i < l; i++) {
        testNode(state, collisionShapes[i]);
    }
}

// Error: Invalid object ID (?).
// Error: Invalid parent ID (?).
// Error: Same object ID and parent ID (?).
function testNode(state, object) {
    let node = object.node,
        name = node.name,
        objectId = node.objectId,
        parentId = node.parentId,
        objectName = getName(node);

    assertError(state, parentId === -1 || hasNode(state, parentId), objectName + ': Invalid parent ' + parentId);
    assertError(state, objectId !== parentId, objectName + ': Same object and parent');
        
    testSDContainer(state, node);
}

function hasNode(state, id) {
    let nodes = state.nodes;

    for (let i = 0, l = nodes.length; i < l; i++) {
        if (nodes[i].objectId === id) {
            return true;
        }
    }

    return false;
}

function testSDContainer(state, object, parent) {
    let elements = object.tracks.elements;

    for (let i = 0, l = elements.length; i < l; i++) {
        testSD(state, object, elements[i], parent);
    }
}

// Error: Referencing an invalid global sequence (?).
function testSD(state, object, sd, parent) {
    let objectName,
        animatedTypeName = animatedTypeNames.get(sd.tag),
        globalSequenceId = sd.globalSequenceId;

    if (parent) {
        objectName = getName(parent) + ': ' + getName(object);
    } else {
        objectName = getName(object);
    }

    if (globalSequenceId !== -1) {
        if (inRange(globalSequenceId, 0, state.globalSequences.length - 1)) {
            addReference(state, state.globalSequences[globalSequenceId]);
        } else {
            addError(state, objectName + ': ' + animatedType + ': Invalid global sequence ' + globalSequenceId);
        }
    }

    testInterpolationType(state, objectName, animatedTypeName, sd.interpolationType);
    testTracks(state, objectName, animatedTypeName, sd.tracks, globalSequenceId);
}

// Warning: Zero tracks (?).
// Warning: Tracks used without sequences (?).
// Warning: Track outside of any sequence (?). Ignores frame 0.
// Warning: Negative frame (?).
// Warning: No opening frame for a sequence (can cause weird animations).
// Warning: No closing frame for a sequence (can cause weird animations).
function testTracks(state, objectName, animatedTypeName, tracks, globalSequenceId) {
    let sequences = state.sequences,
        usageMap = {};

    assertWarning(state, tracks.length, objectName + ': ' + animatedTypeName + ': Zero tracks');
    assertWarning(state, globalSequenceId !== -1 || tracks.length === 0 || sequences.length !== 0, objectName + ': ' + animatedTypeName + ': Tracks used without sequences')

    for (let i = 0, l = tracks.length; i < l; i++) {
        let track = tracks[i],
            sequenceInfo = getSequenceInfoFromFrame(state, track.frame, globalSequenceId),
            sequenceId = sequenceInfo[0],
            isBeginning = sequenceInfo[1],
            isEnding = sequenceInfo[2];

        assertWarning(state, tracks.length === 1 || sequenceId !== -1 || track.frame === 0, objectName + ': ' + animatedTypeName + ': Track ' + i + ': Frame ' + track.frame + ' is not in any sequence');
        assertWarning(state, track.frame >= 0, objectName + ': ' + animatedTypeName + ': Track ' + i + ': Negative frame');

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
            sequence = state.globalSequences[sequenceId];
        }

        sequenceName = getName(sequence);

        assertWarning(state, sequenceInfo[0] || sequenceInfo[2] === 1, objectName + ': ' + animatedTypeName + ': No opening track for ' + sequenceName);
        assertWarning(state, sequenceInfo[1] || sequenceInfo[2] === 1, objectName + ': ' + animatedTypeName + ': No closing track for ' + sequenceName);
    }
}

// Warning: Interpolation used for visibility keyframes that is not None.
function testInterpolationType(state, objectName, animatedTypeName, interpolationType) {
    if (animatedTypeName === 'Visibility') {
        assertWarning(state, interpolationType === 0, objectName + ': ' + animatedTypeName + ': Interpolation type not set to None');
    }
}

// Given a frame, and possibly a global sequence ID, get the following information:
// 1) What is the index (if any) of the sequence (or global sequence) that this frame is in.
// 2) Is this frame the beginning frame of this sequence.
// 3) Is this frame the ending frame of this sequence.
function getSequenceInfoFromFrame(state, frame, globalSequenceId) {
    let index = -1,
        isBeginning = false,
        isEnding = false;

    if (globalSequenceId === -1) {
        let sequences = state.sequences;

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
        let globalSequence = state.globalSequences[globalSequenceId];

        index = globalSequenceId;

        if (frame === 0) {
            isBeginning = true;
        } else if (frame === globalSequence.value) {
            isEnding = true;
        }
    }

    return [index, isBeginning, isEnding];
}

let animatedTypeNames = new Map ([
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
]);

let sequenceNames = new Set([
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
]);

let attachmentNames = new Set([
    'chest',
    'feet',
    'foot',
    'hand',
    'head',
    'origin',
    'overhead',
    'sprite',
    'weapon'
]);

let attachmentQualifiers = new Set([
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
]);

let replaceableIds = new Set([
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
]);

function addError(state, message) {
    state.output.errors.push(message);
}

function addWarning(state, message) {
    state.output.warnings.push(message);
}

function addUnused(state, message) {
    state.output.unused.push(message);
}

function assertError(state, condition, message) {
    if (!condition) {
        addError(state, message);
    }
}

function assertWarning(state, condition, message) {
    if (!condition) {
        addWarning(state, message);
    }
}

export default function sanityTest(parser) {
    let chunks = parser.chunks,
        state = {
            output: { errors: [], warnings: [], unused: [] },
            referenceMap: new Map(),
            nodes: parser.nodes,
            version: chunks.get('VERS'),
            model: chunks.get('MODL'),
            sequences: getElements(chunks.get('SEQS')),
            globalSequences: getElements(chunks.get('GLBS')),
            textures: getElements(chunks.get('TEXS')),
            textureAnimations: getElements(chunks.get('TXAN')),
            materials: getElements(chunks.get('MTLS')),
            geosets: getElements(chunks.get('GEOS')),
            geosetAnimations: getElements(chunks.get('GEOA')),
            bones: getElements(chunks.get('BONE')),
            lights: getElements(chunks.get('LITE')),
            helpers: getElements(chunks.get('HELP')),
            attachments: getElements(chunks.get('ATCH')),
            pivotPoints: getElements(chunks.get('PIVT')),
            particleEmitters: getElements(chunks.get('PREM')),
            particle2Emitters: getElements(chunks.get('PRE2')),
            ribbonEmitters: getElements(chunks.get('RIBB')),
            eventObjects: getElements(chunks.get('EVTS')),
            cameras: getElements(chunks.get('CAMS')),
            collisionShapes: getElements(chunks.get('CLID'))
        };

    // Initialize all of the reference-counted objects to 0 references.
    initializeReferences(state);

    testVersion(state);
    testModel(state);
    testSequences(state);
    testGlobalSequences(state);
    testTextures(state);
    testMaterials(state);
    testTextureAnimations(state);
    testGeosets(state);
    testGeosetAnimations(state);
    testBones(state);
    testLights(state);
    testHelpers(state);
    testAttachments(state);
    testPivotPoints(state);
    testParticleEmitters(state);
    testParticleEmitters2(state);
    testRibbonEmitters(state);
    testEventObjects(state);
    testCameras(state); 
    testCollisionShapes(state);

    // If any reference-counted object has no references, report it.
    for (let [object, references] of state.referenceMap) {
        if (references === 0) {
            addUnused(state, getName(object));
        }
    }

    return state.output;
}
