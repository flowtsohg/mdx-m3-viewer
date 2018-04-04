import unique from '../../common/arrayunique';
import Sequence from './sequence';
import Texture from './texture';
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
import ParticleEmitter2 from './particleemitter2';
import RibbonEmitter from './ribbonemitter';
import EventObject from './eventobject';
import Camera from './camera';
import CollisionShape from './collisionshape';

function getConstructorName(object) {
    if (object instanceof Sequence) { return 'Sequence' }
    if (!isNaN(object)) { return 'Global sequence' } // Global sequences are stored directly as numbers.
    if (object instanceof Texture) { return 'Texture' }
    if (object instanceof Material) { return 'Material' }
    if (object instanceof Layer) { return 'Layer' }
    if (object instanceof TextureAnimation) { return 'Texture animation' }
    if (object instanceof Geoset) { return 'Geoset' }
    if (object instanceof GeosetAnimation) { return 'Geoset animation' }
    if (object instanceof Bone) { return 'Bone' }
    if (object instanceof Light) { return 'Light' }
    if (object instanceof Helper) { return 'Helper' }
    if (object instanceof Attachment) { return 'Attachment' }
    if (object instanceof ParticleEmitter) { return 'Particle emitter' }
    if (object instanceof ParticleEmitter2) { return 'Particle emitter 2' }
    if (object instanceof RibbonEmitter) { return 'Ribbon emitter' }
    if (object instanceof EventObject) { return 'Event object' }
    if (object instanceof Camera) { return 'Camera' }
    if (object instanceof CollisionShape) { return 'Collision shape' }
    return '';
}

function getName(object, index) {
    let name = getConstructorName(object);

    if (typeof index === 'number') {
        name += ` ${index}`;
    }

    if (typeof object.name === 'string') {
        name += ` "${object.name}"`;
    }

    return name;
}

// Is minVal <= x <= maxVal?
function inRange(x, minVal, maxVal) {
    return minVal <= x && x <= maxVal;
}

function initializeReferences(state) {
    let model = state.model,
        map = state.referenceMap;

    for (let collection of [model.sequences, model.globalSequences, model.textures, model.textureAnimations, model.materials, model.geosets, model.geosetAnimations]) {
        for (let object of collection) {
            map.set(object, 0);
        }
    }
}

function addReference(state, object) {
    let map = state.referenceMap;

    map.set(object, map.get(object) + 1);
}

function testVersion(state) {
    let version = state.model.version;

    assertWarning(state, version === 800, `Unknown version ${version}`);
}

function testSequences(state) {
    let sequences = state.model.sequences;

    if (sequences.length) {
        let foundStand = false,
            foundDeath = false;

        for (let [index, sequence] of sequences.entries()) {
            let name = sequence.name,
                tokens = name.toLowerCase().trim().split('-')[0].split(/\s+/),
                token = tokens[0],
                interval = sequence.interval,
                length = interval[1] - interval[0],
                objectName = `Sequence ${index} "${name}"`;

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
                addWarning(state, `${objectName}: Not used due to an invalid name: "${token}"`);
            }

            assertWarning(state, length !== 0, `${objectName}: Zero length`);
            assertWarning(state, length > -1, `${objectName}: Negative length ${length}`);
        }

        assertWarning(state, foundStand, 'Missing "Stand" sequence');
        assertWarning(state, foundDeath, 'Missing "Death" sequence');
    } else {
        addWarning(state, 'No sequences');
    }
}

function testGlobalSequences(state) {
    for (let [index, sequence] of state.model.globalSequences.entries()) {
        let objectName = `Global sequence ${index}`;

        assertWarning(state, sequence !== 0, `${objectName} ${index}: Zero length`);
        assertWarning(state, sequence > 0, `${objectName} ${index}: Negative length ${sequence}`);
    }
}

function testTextures(state) {
    let textures = state.model.textures;

    if (textures.length) {
        for (let [index, texture] of textures.entries()) {
            let replaceableId = texture.replaceableId,
                path = texture.path.toLowerCase(),
                objectName = `Texture ${index} "${path.substr(path.lastIndexOf('\\') + 1)}"`;

            assertError(state, path === '' || path.endsWith('.blp') || path.endsWith('.tga'), `${objectName}: Corrupted path "${path}"`);
            assertError(state, replaceableId === 0 || replaceableIds.has(replaceableId), `${objectName}: Unknown replaceable ID ${replaceableId}`);
            assertWarning(state, path === '' || replaceableId === 0, `${objectName}: Path "${path}" and replaceable ID ${replaceableId} used together`);
        }
    } else {
        addWarning(state, 'No textures');
    }
}

function testMaterials(state) {
    let materials = state.model.materials;

    if (materials.length) {
        for (let [index, material] of materials.entries()) {
            testMaterial(state, `Material ${index}`, material);
        }
    } else {
        addWarning(state, 'No materials');
    }
}

function testMaterial(state, objectName, material) {
    let layers = material.layers;

    if (layers.length) {
        for (let [index, layer] of layers.entries()) {
            testLayer(state, `${objectName} Layer ${index}`, layer)
        }
    } else {
        addWarning(state, `${objectName}: No layers`);
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

function testLayer(state, objectName, layer) {
    let textures = state.model.textures,
        textureAnimations = state.model.textureAnimations; 

    for (let textureId of getTextureIds(layer)) {
        if (inRange(textureId, 0, textures.length - 1)) {
            addReference(state, textures[textureId]);
        } else {
            addError(state, `${objectName}: Invalid texture ${textureId}`);
        }
    }

    let textureAnimationId = layer.textureAnimationId;

    if (textureAnimationId !== -1) {
        if (inRange(textureAnimationId, 0, textureAnimations.length - 1)) {
            addReference(state, textureAnimations[textureAnimationId]);
        } else {
            addWarning(state, `${objectName}: Invalid texture animation ${textureAnimationId}`);
        }
    }

    assertWarning(state, inRange(layer.filterMode, 0, 6), `${objectName}: Invalid filter mode ${layer.filterMode}`);

    testAnimations(state, objectName, layer);
}

function testTextureAnimations(state) {
    for (let [index, textureAnimation] of state.model.textureAnimations.entries()) {
        testAnimations(state, `Texture animation ${index}`, textureAnimation);
    }
}

function testGeosetSkinning(state, objectName, geoset) {
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
                    assertWarning(state, object instanceof Bone, `${objectName}: Vertex ${i}: Attached to "${object.name}" which is not a bone`);
                } else {
                    addError(state, `${objectName}: Vertex ${i}: Attached to generic object ${bone} which does not exist`);
                }
            }
        } else {
            addWarning(state, `${objectName}: Vertex ${i}: Attached to vertex group ${i} which does not exist`);
        }
    }
}

function testGeosets(state) {
    let geosets = state.model.geosets,
        geosetAnimations = state.model.geosetAnimations;

    for (let i = 0, l = geosets.length; i < l; i++) {
        let geoset = geosets[i],
            materialId = geoset.materialId,
            objectName = `Geoset ${i}`;

        testGeosetSkinning(state, objectName, geoset);
        /// TODO: ADD THIS
        ///testGeosetNormals(state, geoset);

        if (geosetAnimations.length) {
            let references = [];

            for (let j = 0, k = geosetAnimations.length; j < k; j++) {
                if (geosetAnimations[j].geosetId === i) {
                    references.push(j);
                }
            }

            assertWarning(state, references.length <= 1, `${objectName}: Referenced by ${references.length} geoset animations (${references.join(', ')})`);
        }

        if (inRange(materialId, 0, state.model.materials.length - 1)) {
            addReference(state, state.model.materials[materialId]);
        } else {
            addError(state, `${objectName}: Invalid material ${materialId}`);
        }

        if (geoset.faces.length) {
            addReference(state, geoset);
        } else {
            // The game and my code have no issue with geosets containing no faces, but Magos crashes, so add a warning in addition to it being useless.
            addWarning(state, `${objectName}: Zero faces`);
        }

        // The game and my code have no issue with geosets having any number of sequence extents, but Magos fails to parse, so add a warning.
        if (geoset.sequenceExtents.length !== state.model.sequences.length) {
            addWarning(state, `${objectName}: Number of sequence extents (${geoset.sequenceExtents.length}) does not match the number of sequences (${state.model.sequences.length})`);
        }
    }
}

function testGeosetAnimations(state) {
    let geosets = state.model.geosets;

    for (let [index, geosetAnimation] of state.model.geosetAnimations.entries()) {
        let geosetId = geosetAnimation.geosetId,
            objectName = `Geoset animation ${index}`;

        if (inRange(geosetId, 0, geosets.length - 1)) {
            addReference(state, geosetAnimation);
        } else {
            addError(state, `${objectName}: Invalid geoset ${geosetId}`);
        }

        testAnimations(state, objectName, geosetAnimation);
    }
}

function testBones(state) {
    let bones = state.model.bones,
        geosets = state.model.geosets,
        geosetAnimations = state.model.geosetAnimations;

    if (bones.length) {
        for (let [index, bone] of bones.entries()) {
            let geosetId = bone.geosetId,
                geosetAnimationId = bone.geosetAnimationId,
                objectName = `Bone ${index} "${bone.name}"`;

            assertError(state, geosetId === -1 || geosetId < geosets.length, `${objectName}: Invalid geoset ${geosetId}`);
            assertError(state, geosetAnimationId === -1 || geosetAnimationId < geosetAnimations.length, `${objectName}: Invalid geoset animation ${geosetAnimationId}`);
            
            testGenericObject(state, objectName, bone);
        }
    } else {
        addWarning(state, 'No bones');
    }
}

function testLights(state) {
    for (let [index, light] of state.model.lights.entries()) {
        let attenuation = light.attenuation,
            objectName = `Light ${index} "${light.name}"`;

        assertWarning(state, attenuation[0] >= 80 && attenuation[1] <= 200 && attenuation[1] - attenuation[0] > 0, `${objectName}: Attenuation min=${attenuation[0]} max=${attenuation[1]}`);

        testGenericObject(state, objectName, light);
    }
}

function testHelpers(state) {
    for (let [index, helper] of state.model.helpers.entries()) {
        testGenericObject(state, `Helper ${index} "${helper.name}"`, helper);
    }
}

function testAttachments(state) {
    for (let [index, attachment] of state.model.attachments.entries()) {
        let path = attachment.path,
            objectName = `Attachment ${index} "${attachment.name}"`;

        // NOTE: I can't figure out what exactly the rules for attachment names even are.
        /*
        if (path === '') {
            assertWarning(state, testAttachmentName(attachment), `${objectName}: Invalid attachment "${attachment.node.name}"`);
        } else {
            let lowerCase = path.toLowerCase();

            assertError(state, lowerCase.endsWith('.mdl') || lowerCase.endsWith('.mdx'), `${objectName}: Invalid path "${path}"`);
        }
        */

        testGenericObject(state, objectName, attachment);
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

    assertWarning(state, pivotPoints.length === objects.length, `Expected ${objects.length} pivot points, got ${pivotPoints.length}`);
}

function testParticleEmitters(state) {
    for (let [index, emitter] of state.model.particleEmitters.entries()) {
        let objectName = `Particle emitter ${index} "${emitter.name}"`;

        assertError(state, emitter.path.toLowerCase().endsWith('.mdl'), `${objectName}: Invalid path "${emitter.path}"`);

        testGenericObject(state, objectName, emitter);
    }
}

function testParticleEmitters2(state) {
    for (let [index, emitter] of state.model.particleEmitters2.entries()) {
        let replaceableId = emitter.replaceableId,
            objectName = `Particle emitter 2 ${index} "${emitter.name}"`;

        if (inRange(emitter.textureId, 0, state.model.textures.length - 1)) {
            addReference(state, state.model.textures[emitter.textureId]);
        } else {
            addError(state, `${objectName}: Invalid texture ${emitter.textureId}`);
        }

        assertWarning(state, inRange(emitter.filterMode, 0, 4), `${objectName}: Invalid filter mode ${emitter.filterMode}`);
        assertError(state, replaceableId === 0 || replaceableIds.has(replaceableId), `${objectName}: Invalid replaceable ID ${replaceableId}`);

        testGenericObject(state, objectName, emitter);
    }
}

function testRibbonEmitters(state) {
    for (let [index, emitter] of state.model.ribbonEmitters.entries()) {
        let objectName = `Ribbon emitter ${index} "${emitter.name}"`;

        if (inRange(emitter.materialId, 0, state.model.materials.length - 1)) {
            addReference(state, state.model.materials[emitter.materialId]);
        } else {
            addError(state, `${objectName}: Invalid material ${emitter.materialId}`);
        }

        testGenericObject(state, objectName, emitter);
    }
}

function testEventObjects(state) {
    for (let [index, eventObject] of state.model.eventObjects.entries()) {
        let tracks = eventObject.tracks,
            globalSequenceId = eventObject.globalSequenceId,
            objectName = `Event object ${index} "${eventObject.name}"`;

        if (globalSequenceId !== -1) {
            if (inRange(globalSequenceId, 0, state.model.globalSequences.length - 1)) {
                addReference(state, state.model.globalSequences[globalSequenceId]);
            } else {
                addError(state, `${objectName}: Invalid global sequence ${globalSequenceId}`);
            }
        }

        if (tracks.length) {
            for (let j = 0, k = tracks.length; j < k; j++) {
                let track = tracks[j],
                    sequenceInfo = getSequenceInfoFromFrame(state, track, globalSequenceId),
                    sequenceId = sequenceInfo[0];

                assertWarning(state, sequenceId !== -1, `${objectName}: Track ${j}: Frame ${track} is not in any sequence`);
            }
        } else {
            addError(state, `${objectName}: Zero keys`);
        }

        testGenericObject(state, objectName, eventObject);
    }
}

function testCameras(state) {
    for (let [index, camera] of state.model.cameras.entries()) {
        testAnimations(state, `Camera ${index} "${camera.name}"`, camera);
    }
}

function testCollisionShapes(state) {
    for (let [index, collisionShape] of state.model.collisionShapes.entries()) {
        testGenericObject(state, `Collision shape ${index} "${collisionShape.name}"`, collisionShape);
    }
}

function testGenericObject(state, objectName, object) {
    let objectId = object.objectId,
        parentId = object.parentId;

    assertError(state, parentId === -1 || hasGenericObject(state, parentId), `${objectName}: Invalid parent ${parentId}`);
    assertError(state, objectId !== parentId, `${objectName}: Same object and parent`);

    testAnimations(state, objectName, object);
}

function hasGenericObject(state, id) {
    for (let object of state.objects) {
        if (object.objectId === id) {
            return true;
        }
    }

    return false;
}

function testAnimations(state, objectName, object) {
    for (let animation of object.animations) {
        testAnimation(state, objectName, object, animation);
    }
}

function testAnimation(state, objectName, object, animation) {
    let animatedTypeName = animatedTypeNames.get(animation.name),
        globalSequenceId = animation.globalSequenceId;

    if (globalSequenceId !== -1) {
        if (inRange(globalSequenceId, 0, state.model.globalSequences.length - 1)) {
            addReference(state, state.model.globalSequences[globalSequenceId]);
        } else {
            addError(state, `${objectName}: ${animatedType}: Invalid global sequence ${globalSequenceId}`);
        }
    }

    testInterpolationType(state, objectName, animatedTypeName, animation.interpolationType);
    testTracks(state, objectName, animatedTypeName, animation.tracks, globalSequenceId);
}

function testTracks(state, objectName, animatedTypeName, tracks, globalSequenceId) {
    let sequences = state.model.sequences,
        usageMap = {};

    assertWarning(state, tracks.length, `${objectName}: ${animatedTypeName}: Zero tracks`);
    assertWarning(state, globalSequenceId !== -1 || tracks.length === 0 || sequences.length !== 0, `${objectName}: ${animatedTypeName}: Tracks used without sequences`);

    for (let i = 0, l = tracks.length; i < l; i++) {
        let track = tracks[i],
            sequenceInfo = getSequenceInfoFromFrame(state, track.frame, globalSequenceId),
            sequenceId = sequenceInfo[0],
            isBeginning = sequenceInfo[1],
            isEnding = sequenceInfo[2];

        assertWarning(state, tracks.length === 1 || sequenceId !== -1 || track.frame === 0, `${objectName}: ${animatedTypeName}: Track ${i}: Frame ${track.frame} is not in any sequence`);
        assertWarning(state, track.frame >= 0, `${objectName}: ${animatedTypeName}: Track ${i}: Negative frame`);

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
        let sequenceInfo = usageMap[sequenceId],
            sequence;

        if (globalSequenceId === -1) {
            sequence = sequences[sequenceId];
        } else {
            sequence = state.model.globalSequences[sequenceId];
        }

        assertWarning(state, sequenceInfo[0] || sequenceInfo[2] === 1, `${objectName}: ${animatedTypeName}: No opening track for "${sequence.name}"`);
        assertWarning(state, sequenceInfo[1] || sequenceInfo[2] === 1, `${objectName}: ${animatedTypeName}: No closing track for "${sequence.name}"`);
    }
}

function testInterpolationType(state, objectName, animatedTypeName, interpolationType) {
    if (animatedTypeName === 'Visibility') {
        assertWarning(state, interpolationType === 0, `${objectName}: ${animatedTypeName}: Interpolation type not set to None`);
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

export default function sanityTest(model) {
    let state = {
        model,
        objects: [...model.bones, ...model.lights, ...model.helpers, ...model.attachments, ...model.particleEmitters, ...model.particleEmitters2, ...model.ribbonEmitters, ...model.cameras, ...model.eventObjects, ...model.collisionShapes],
        referenceMap: new Map(),
        output: { errors: [], warnings: [], unused: [] }
    };

    // Initialize all of the reference-counted objects to 0 references.
    initializeReferences(state);

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

    // If any reference-counted object has no references, report it.
    for (let [object, references] of state.referenceMap) {
        if (references === 0) {
            addUnused(state, object.name);
        }
    }

    return state.output;
};
