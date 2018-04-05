import unique from '../../common/arrayunique';
import Bone from './bone';

// Is minVal <= x <= maxVal?
function inRange(x, minVal, maxVal) {
    return minVal <= x && x <= maxVal;
}

function testVersion(state) {
    let version = state.model.version;

    state.assertWarning(version === 800, `Unknown version ${version}`);
}

function testSequences(state) {
    let sequences = state.model.sequences;

    if (sequences.length) {
        let foundStand = false,
            foundDeath = false;

        for (let [index, sequence] of sequences.entries()) {
            state.push('Sequence', index);

            let name = sequence.name,
                tokens = name.toLowerCase().trim().split('-')[0].split(/\s+/),
                token = tokens[0],
                interval = sequence.interval,
                length = interval[1] - interval[0];

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
                state.addReference();
            } else {
                state.addWarning(`Not used due to an invalid name: "${token}"`);
            }

            state.assertWarning(length !== 0, 'Zero length');
            state.assertWarning(length > -1, `Negative length ${length}`);

            state.pop();
        }

        state.assertWarning(foundStand, 'Missing "Stand" sequence');
        state.assertWarning(foundDeath, 'Missing "Death" sequence');
    } else {
        state.addWarning('No sequences');
    }
}

function testGlobalSequences(state) {
    for (let [index, sequence] of state.model.globalSequences.entries()) {
        state.push('GlobalSequence', index);

        state.assertWarning(sequence !== 0, 'Zero length');
        state.assertWarning(sequence > 0, `Negative length ${sequence}`);

        state.pop();
    }
}

function testTextures(state) {
    let textures = state.model.textures;

    if (textures.length) {
        for (let [index, texture] of textures.entries()) {
            state.push('Texture', index);

            let replaceableId = texture.replaceableId,
                path = texture.path.toLowerCase();

            state.assertError(path === '' || path.endsWith('.blp') || path.endsWith('.tga'), `Corrupted path "${path}"`);
            state.assertError(replaceableId === 0 || replaceableIds.has(replaceableId), `Unknown replaceable ID ${replaceableId}`);
            state.assertWarning(path === '' || replaceableId === 0, `Path "${path}" and replaceable ID ${replaceableId} used together`);

            state.pop();
        }
    } else {
        state.addWarning('No textures');
    }
}

function testMaterials(state) {
    let materials = state.model.materials;

    if (materials.length) {
        for (let [index, material] of materials.entries()) {
            state.push('Material', index);

            testMaterial(state, material);

            state.pop();
        }
    } else {
        state.addWarning('No materials');
    }
}

function testMaterial(state, material) {
    let layers = material.layers;

    if (layers.length) {
        for (let [index, layer] of layers.entries()) {
            state.push('Layer', index);

            testLayer(state, layer);

            state.pop();
        }
    } else {
        state.addWarning('No layers');
    }
}

function getTextureIds(layer) {
    let textureIds = [];

    for (let animation of layer.animations) {
        if (animation.name === 'KMTF') {
            let values = [];

            for (let track of animation.tracks) {
                values.push(track.value);
            }

            return unique(values);
        }
    }

    return [layer.textureId];
}

function testLayer(state, layer) {
    let textures = state.model.textures,
        textureAnimations = state.model.textureAnimations;

    for (let textureId of getTextureIds(layer)) {
        if (inRange(textureId, 0, textures.length - 1)) {
            state.addReference('Texture', textureId);
        } else {
            state.addError(`Invalid texture ${textureId}`);
        }
    }

    let textureAnimationId = layer.textureAnimationId;

    if (textureAnimationId !== -1) {
        if (inRange(textureAnimationId, 0, textureAnimations.length - 1)) {
            state.addReference('TextureAnimation', textureAnimationId);
        } else {
            state.addWarning(`Invalid texture animation ${textureAnimationId}`);
        }
    }

    state.assertWarning(inRange(layer.filterMode, 0, 6), `Invalid filter mode ${layer.filterMode}`);

    testAnimations(state, layer);
}

function testTextureAnimations(state) {
    for (let [index, textureAnimation] of state.model.textureAnimations.entries()) {
        state.push('TextureAnimation', index);

        testAnimations(state, textureAnimation);

        state.pop();
    }
}

function testGeosetSkinning(state, geoset) {
    let objects = state.objects,
        vertexGroups = geoset.vertexGroups,
        matrixGroups = geoset.matrixGroups,
        matrixIndices = geoset.matrixIndices,
        slices = [];

    for (let i = 0, l = matrixGroups.length, k = 0; i < l; i++) {
        slices.push(matrixIndices.subarray(k, k + matrixGroups[i]));
        k += matrixGroups[i];
    }

    for (let i = 0, l = vertexGroups.length; i < l; i++) {
        let slice = slices[vertexGroups[i]];

        if (slice) {
            for (let bone of slice) {
                let object = objects[bone];

                if (object) {
                    state.assertWarning(object instanceof Bone, `Vertex ${i}: Attached to generic object "${object.name}" which is not a bone`);
                } else {
                    state.addError(`Vertex ${i}: Attached to generic object ${bone} which does not exist`);
                }
            }
        } else {
            state.addWarning(`Vertex ${i}: Attached to vertex group ${i} which does not exist`);
        }
    }
}

function testGeosets(state) {
    let geosets = state.model.geosets,
        geosetAnimations = state.model.geosetAnimations;

    for (let i = 0, l = geosets.length; i < l; i++) {
        state.push('Geoset', i);

        let geoset = geosets[i],
            materialId = geoset.materialId;

        testGeosetSkinning(state, geoset);
        /// TODO: ADD THIS
        ///testGeosetNormals(state, geoset);

        if (geosetAnimations.length) {
            let references = [];

            for (let j = 0, k = geosetAnimations.length; j < k; j++) {
                if (geosetAnimations[j].geosetId === i) {
                    references.push(j);
                }
            }

            state.assertWarning(references.length <= 1, `Referenced by ${references.length} geoset animations (${references.join(', ')})`);
        }

        if (inRange(materialId, 0, state.model.materials.length - 1)) {
            state.addReference('Material', materialId);
        } else {
            state.addError(`Invalid material ${materialId}`);
        }

        if (geoset.faces.length) {
            state.addReference();
        } else {
            // The game and my code have no issue with geosets containing no faces, but Magos crashes, so add a warning in addition to it being useless.
            state.addWarning('Zero faces');
        }

        // The game and my code have no issue with geosets having any number of sequence extents, but Magos fails to parse, so add a warning.
        if (geoset.sequenceExtents.length !== state.model.sequences.length) {
            state.addWarning(`Number of sequence extents (${geoset.sequenceExtents.length}) does not match the number of sequences (${state.model.sequences.length})`);
        }

        state.pop();
    }
}

function testGeosetAnimations(state) {
    let geosets = state.model.geosets;

    for (let [index, geosetAnimation] of state.model.geosetAnimations.entries()) {
        state.push('GeosetAnimation', index);

        let geosetId = geosetAnimation.geosetId;

        if (inRange(geosetId, 0, geosets.length - 1)) {
            state.addReference();
        } else {
            state.addError(`Invalid geoset ${geosetId}`);
        }

        testAnimations(state, geosetAnimation);

        state.pop();
    }
}

function testBones(state) {
    let bones = state.model.bones,
        geosets = state.model.geosets,
        geosetAnimations = state.model.geosetAnimations;

    if (bones.length) {
        for (let [index, bone] of bones.entries()) {
            state.push('Bone', index);

            let geosetId = bone.geosetId,
                geosetAnimationId = bone.geosetAnimationId;

            state.assertError(geosetId === -1 || geosetId < geosets.length, `Invalid geoset ${geosetId}`);
            state.assertError(geosetAnimationId === -1 || geosetAnimationId < geosetAnimations.length, `Invalid geoset animation ${geosetAnimationId}`);

            testGenericObject(state, bone);

            state.pop();
        }
    } else {
        state.addWarning('No bones');
    }
}

function testLights(state) {
    for (let [index, light] of state.model.lights.entries()) {
        state.push('Light', index);

        let attenuation = light.attenuation;

        state.assertWarning(attenuation[0] >= 80 && attenuation[1] <= 200 && attenuation[1] - attenuation[0] > 0, `Attenuation min=${attenuation[0]} max=${attenuation[1]}`);

        testGenericObject(state, light);

        state.pop();
    }
}

function testHelpers(state) {
    for (let [index, helper] of state.model.helpers.entries()) {
        state.push('Helper', index);

        testGenericObject(state, helper);

        state.pop();
    }
}

function testAttachments(state) {
    for (let [index, attachment] of state.model.attachments.entries()) {
        state.push('Attachment', index);

        // NOTE: I can't figure out what exactly the rules for attachment names even are.
        /*
        let path = attachment.path;

        if (path === '') {
            assertWarning(state, testAttachmentName(attachment), `${objectName}: Invalid attachment "${attachment.node.name}"`);
        } else {
            let lowerCase = path.toLowerCase();

            assertError(state, lowerCase.endsWith('.mdl') || lowerCase.endsWith('.mdx'), `${objectName}: Invalid path "${path}"`);
        }
        */

        testGenericObject(state, attachment);

        state.pop();
    }
}
/*
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
*/
function testPivotPoints(state) {
    let pivotPoints = state.model.pivotPoints,
        objects = state.objects;

    state.assertWarning(pivotPoints.length === objects.length, `Expected ${objects.length} pivot points, got ${pivotPoints.length}`);
}

function testParticleEmitters(state) {
    for (let [index, emitter] of state.model.particleEmitters.entries()) {
        state.push('ParticleEmitter', index);

        state.assertError(emitter.path.toLowerCase().endsWith('.mdl'), 'Invalid path');

        testGenericObject(state, emitter);

        state.pop();
    }
}

function testParticleEmitters2(state) {
    for (let [index, emitter] of state.model.particleEmitters2.entries()) {
        state.push('ParticleEmitter2', index);

        let replaceableId = emitter.replaceableId;

        if (inRange(emitter.textureId, 0, state.model.textures.length - 1)) {
            state.addReference('Texture', emitter.textureId);
        } else {
            state.addError(`Invalid texture ${emitter.textureId}`);
        }

        state.assertWarning(inRange(emitter.filterMode, 0, 4), `Invalid filter mode ${emitter.filterMode}`);
        state.assertError(replaceableId === 0 || replaceableIds.has(replaceableId), `Invalid replaceable ID ${replaceableId}`);

        testGenericObject(state, emitter);

        state.pop();
    }
}

function testRibbonEmitters(state) {
    for (let [index, emitter] of state.model.ribbonEmitters.entries()) {
        state.push('RibbonEmitter', index);

        if (inRange(emitter.materialId, 0, state.model.materials.length - 1)) {
            state.addReference('Material', emitter.materialId);
        } else {
            state.addError(`Invalid material ${emitter.materialId}`);
        }

        testGenericObject(state, emitter);

        state.pop();
    }
}

function testEventObjects(state) {
    for (let [index, eventObject] of state.model.eventObjects.entries()) {
        state.push('EventObject', index);

        let tracks = eventObject.tracks,
            globalSequenceId = eventObject.globalSequenceId;

        if (globalSequenceId !== -1) {
            if (inRange(globalSequenceId, 0, state.model.globalSequences.length - 1)) {
                state.addReference('GlobalSequence', globalSequenceId);
            } else {
                state.addError(`Invalid global sequence ${globalSequenceId}`);
            }
        }

        if (tracks.length) {
            for (let j = 0, k = tracks.length; j < k; j++) {
                let track = tracks[j];

                state.assertWarning(getSequenceInfoFromFrame(state, track, globalSequenceId)[0] !== -1, `Track ${j}: Frame ${track} is not in any sequence`);
            }
        } else {
            state.addError('Zero keys');
        }

        testGenericObject(state, eventObject);

        state.pop();
    }
}

function testCameras(state) {
    for (let [index, camera] of state.model.cameras.entries()) {
        state.push('Camera', index);

        testAnimations(state, camera);

        state.pop();
    }
}

function testCollisionShapes(state) {
    for (let [index, collisionShape] of state.model.collisionShapes.entries()) {
        state.push('CollisionShape', index);

        testGenericObject(state, collisionShape);

        state.pop();
    }
}

function testGenericObject(state, object) {
    let objectId = object.objectId,
        parentId = object.parentId;

    state.assertError(parentId === -1 || hasGenericObject(state, parentId), `Invalid parent ${parentId}`);
    state.assertError(objectId !== parentId, 'Same object and parent');

    testAnimations(state, object);
}

function hasGenericObject(state, id) {
    for (let object of state.objects) {
        if (object.objectId === id) {
            return true;
        }
    }

    return false;
}

function testAnimations(state, object) {
    let i = 0;

    for (let animation of object.animations) {
        state.push(animatedTypeNames.get(animation.name));

        testAnimation(state, object, animation);

        state.pop();
    }
}

function testAnimation(state, object, animation) {
    let globalSequenceId = animation.globalSequenceId;

    if (globalSequenceId !== -1) {
        if (inRange(globalSequenceId, 0, state.model.globalSequences.length - 1)) {
            state.addReference('GlobalSequence', globalSequenceId);
        } else {
            state.addError(`Invalid global sequence ${globalSequenceId}`);
        }
    }

    testInterpolationType(state, animation);
    testTracks(state, animation.tracks, globalSequenceId);
}

function testTracks(state, tracks, globalSequenceId) {
    let sequences = state.model.sequences,
        usageMap = {};

    state.assertWarning(tracks.length, 'Zero tracks');
    state.assertWarning(globalSequenceId !== -1 || tracks.length === 0 || sequences.length !== 0, 'Tracks used without sequences');

    for (let i = 0, l = tracks.length; i < l; i++) {
        let track = tracks[i],
            sequenceInfo = getSequenceInfoFromFrame(state, track.frame, globalSequenceId),
            sequenceId = sequenceInfo[0],
            isBeginning = sequenceInfo[1],
            isEnding = sequenceInfo[2];

        state.assertWarning(tracks.length === 1 || sequenceId !== -1 || track.frame === 0, `Track ${i}: Frame ${track.frame} is not in any sequence`);
        state.assertWarning(track.frame >= 0, `Track ${i}: Negative frame`);

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

    for (let sequenceId of Object.keys(usageMap)) {
        let sequenceInfo = usageMap[sequenceId];

        if (globalSequenceId === -1) {
            let sequence = sequences[sequenceId];

            state.assertWarning(sequenceInfo[0] || sequenceInfo[2] === 1, `No opening track for "${sequence.name}" at frame ${sequence.interval[0]}`);
            state.assertWarning(sequenceInfo[1] || sequenceInfo[2] === 1, `No closing track for "${sequence.name}" at frame ${sequence.interval[1]}`);
        }
    }
}

function testInterpolationType(state, animation) {
    if (animatedTypeNames.get(animation.name) === 'Visibility' && animation.interpolationType !== 0) {
        state.addWarning('Interpolation type not set to None');
    }
}

function getSequenceInfoFromFrame(state, frame, globalSequenceId) {
    let index = -1,
        isBeginning = false,
        isEnding = false;

    if (globalSequenceId === -1) {
        let sequences = state.model.sequences;

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
        let globalSequence = state.model.globalSequences[globalSequenceId];

        index = globalSequenceId;

        if (frame === 0) {
            isBeginning = true;
        } else if (frame === globalSequence) {
            isEnding = true;
        }
    }

    return [index, isBeginning, isEnding];
}

let animatedTypeNames = new Map([
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

class State {
    constructor(model) {
        this.model = model;
        this.objects = [];
        this.current = { children: [] };
        this.stack = [this.current];
        this.map = {};

        this.addObjects(model.sequences, 'Sequence', );
        this.addObjects(model.globalSequences, 'GlobalSequence');
        this.addObjects(model.textures, 'Texture');
        this.addObjects(model.materials, 'Material');
        this.addObjects(model.textureAnimations, 'TextureAnimation');
        this.addObjects(model.geosets, 'Geoset');
        this.addObjects(model.geosetAnimations, 'GeosetAnimation');
        this.addObjects(model.bones, 'Bone', true);
        this.addObjects(model.lights, 'Light', true);
        this.addObjects(model.helpers, 'Helper', true);
        this.addObjects(model.attachments, 'Attachment', true);
        this.addObjects(model.particleEmitters, 'ParticleEmitter', true);
        this.addObjects(model.particleEmitters2, 'ParticleEmitter2', true);
        this.addObjects(model.ribbonEmitters, 'RibbonEmitter', true);
        this.addObjects(model.cameras, 'Camera');
        this.addObjects(model.eventObjects, 'EventObject', true);
        this.addObjects(model.collisionShapes, 'CollisionShape', true);
    }

    addObjects(objects, objectType, areGeneric) {
        let array = [];

        for (let [index, object] of objects.entries()) {
            let name = object.name || object.path,
                data = { objectType, index, warnings: 0, errors: 0, children: [] };

            if (name) {
                data.name = name;
            }

            if (!areGeneric) {
                data.uses = 0;
            }

            array.push(data);
        }

        this.map[objectType] = array;

        if (areGeneric) {
            this.objects.push(...objects);
        }
    }

    push(objectType, index) {
        let nodes = this.map[objectType],
            node;

        // Internal objects like material layers are not added at initialization, but rather added as internal nodes here when needed.
        if (nodes) {
            node = nodes[index];
        } else {
            node = { objectType, warnings: 0, errors: 0, children: [] };

            // Animations don't need the index.
            if (typeof index === 'number') {
                node.index = index;
            }
        }

        this.current.children.push(node);

        this.current = node;

        this.stack.unshift(node);
    }

    pop() {
        this.stack.shift();
        this.current = this.stack[0];
    }

    add(type, message) {
        this.current.children.push({ type, message });
    }

    addWarning(message) {
        this.add('warning', message);

        for (let node of this.stack) {
            node.warnings += 1;
        }
    }

    addError(message) {
        this.add('error', message);

        for (let node of this.stack) {
            node.errors += 1;
        }
    }

    assertWarning(condition, message) {
        if (!condition) {
            this.addWarning(message);
        }
    }

    assertError(condition, message) {
        if (!condition) {
            this.addError(message);
        }
    }

    addReference(objectType, index) {
        if (objectType) {
            this.map[objectType][index].uses += 1;
        } else {
            this.current.uses += 1;
        }
    }
}

export default function sanityTest(model) {
    let state = new State(model);

    testVersion(state);
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

    let nodes = state.stack[0].children,
        warnings = 0,
        errors = 0,
        unused = 0;

    for (let node of nodes) {
        if (node.warnings) {
            warnings += node.warnings;
        }

        if (node.errors) {
            errors += node.errors;
        }

        if (node.uses === 0) {
            unused += 1;
        }
    }

    return { nodes, warnings, errors, unused };
};
