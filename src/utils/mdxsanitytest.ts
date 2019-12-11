import unique from '../common/arrayunique';
import Model from '../parsers/mdlx/model';
import Bone from '../parsers/mdlx/bone';
import animationMap from '../parsers/mdlx/animationmap';
import GenericObject from '../parsers/mdlx/genericobject';
import Material from '../parsers/mdlx/material';
import Layer from '../parsers/mdlx/layer';
import Geoset from '../parsers/mdlx/geoset';
import AnimatedObject from '../parsers/mdlx/animatedobject';
import { Animation } from '../parsers/mdlx/animations';

/**
 * The data needed for a data.
 */
class SanityTestData {
  model: Model;
  objects: any[];
  current: { children: any[]; };
  stack: any[];
  map: object;

  constructor(model: Model) {
    this.model = model;
    this.objects = [];
    this.current = { children: [] };
    this.stack = [this.current];
    this.map = {};

    this.addObjects(model.sequences, 'Sequence');
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

  /**
   * Adds nodes for all of the given objects.
   * Also handles the flat array of generic objects.
   */
  addObjects(objects: any[], objectType: string, areGeneric = false) {
    let array = [];

    for (let [index, object] of objects.entries()) {
      let name = object.name || object.path;
      let data = { objectType, index, warnings: 0, errors: 0, children: [] };

      if (name) {
        data.name = name;
      }

      if (!areGeneric) {
        data.uses = 0;
      } else {
        //data.invisibility = this.getInvisibility(object);
      }

      array.push(data);
    }

    this.map[objectType] = array;

    if (areGeneric) {
      this.objects.push(...objects);
    }
  }

  /**
   * Pushes to the stack either the node described by the parameters.
   * If this node does not exist, a new one will be created, which is used by internal nodes like material layers.
   */
  push(objectType: string, index: number) {
    let nodes = this.map[objectType];
    let node;

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

  /**
   * Pops the current node from the stack.
   */
  pop() {
    this.stack.shift();
    this.current = this.stack[0];
  }

  /**
   * Adds a child to the current node.
   */
  add(type: string, message: string) {
    this.current.children.push({ type, message });
  }

  /**
   * Adds the given message as a warning child.
   * This also propagates to all of stack that a warning was added.
   */
  addWarning(message: string) {
    this.add('warning', message);

    for (let node of this.stack) {
      node.warnings += 1;
    }
  }

  /**
   * Adds the given message as an error child.
   * This also propagates to all of stack that an error was added.
   */
  addError(message: string) {
    this.add('error', message);

    for (let node of this.stack) {
      node.errors += 1;
    }
  }

  /**
   * Adds the given message as a warning child if the condition is true.
   */
  assertWarning(condition: boolean, message: string) {
    if (!condition) {
      this.addWarning(message);
    }
  }

  /**
   * Adds the given message as an error child if the condition is true.
   */
  assertError(condition: boolean, message: string) {
    if (!condition) {
      this.addError(message);
    }
  }

  /**
   * Adds a reference to either the node described by the parameters, or the current node if nothing is passed.
   */
  addReference(objectType?: string, index?: number) {
    if (objectType) {
      this.map[objectType][index].uses += 1;
    } else {
      this.current.uses += 1;
    }
  }

  getInvisibility(object: GenericObject) {
    let segments = [];

    // If this is a bone, it has no visibility animations of its own, but it can point to a geoset animation that does.
    if (object instanceof Bone && object.geosetAnimationId !== -1) {
      object = this.model.geosetAnimations[object.geosetAnimationId];
    }

    // Look for a relevant animation.
    for (let animation of object.animations) {
      let mdxName = animation.name; // e.g. "KP2V"
      let mdlName = animationMap[mdxName][0]; // e.g. "Visibility"

      // See if this is a visibility animation.
      // In the case the object is a bone, and thus a geoset animation is checked, look for its alpha animation.
      if (mdlName === 'Visibility' || mdxName === 'KGAO') {
        let tracks = animation.tracks;

        // Go over all sequences.
        for (let sequence of this.model.sequences) {
          let [start, end] = sequence.interval;
          let startIndex = -1;
          let endIndex = -1;

          // See which keyframes are used for the current sequence.
          for (let i = 0, l = tracks.length; i < l; i++) {
            let track = tracks[i];

            if (track.frame >= start && startIndex === -1) {
              startIndex = i;
            }

            if (track.frame > end && endIndex === -1) {
              endIndex = i - 1;
              break;
            }
          }
        }

        return segments;
      }
    }

    return segments;
  }
}

/**
 * Is minVal <= x <= maxVal?
 */
function inRange(x: number, minVal: number, maxVal: number) {
  return minVal <= x && x <= maxVal;
}


/**
 * Test the version and model chunks.
 */
function testHeader(data: SanityTestData) {
  let version = data.model.version;

  data.assertWarning(version === 800, `Unknown version ${version}`);
}

/**
 * Test the sequence chunk.
 */
function testSequences(data: SanityTestData) {
  let sequences = data.model.sequences;

  if (sequences.length) {
    let foundStand = false;
    let foundDeath = false;

    for (let [index, sequence] of sequences.entries()) {
      data.push('Sequence', index);

      let name = sequence.name;
      let tokens = name.toLowerCase().trim().split('-')[0].split(/\s+/);
      let token = tokens[0];
      let interval = sequence.interval;
      let length = interval[1] - interval[0];

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
        data.addReference();
      } else {
        data.addWarning(`Unknown sequence "${token}"`);
      }

      data.assertWarning(length !== 0, 'Zero length');
      data.assertWarning(length > -1, `Negative length ${length}`);

      data.pop();
    }

    data.assertWarning(foundStand, 'Missing "Stand" sequence');
    data.assertWarning(foundDeath, 'Missing "Death" sequence');
  } else {
    data.addWarning('No sequences');
  }
}

/**
 * Test the global sequence chunk.
 */
function testGlobalSequences(data: SanityTestData) {
  for (let [index, sequence] of data.model.globalSequences.entries()) {
    data.push('GlobalSequence', index);

    data.assertWarning(sequence !== 0, 'Zero length');
    data.assertWarning(sequence >= 0, `Negative length ${sequence}`);

    data.pop();
  }
}

/**
 * Test the texture chunk.
 */
function testTextures(data: SanityTestData) {
  let textures = data.model.textures;

  if (textures.length) {
    for (let [index, texture] of textures.entries()) {
      data.push('Texture', index);

      let replaceableId = texture.replaceableId;
      let path = texture.path.toLowerCase();

      data.assertError(path === '' || path.endsWith('.blp') || path.endsWith('.tga'), `Corrupted path "${path}"`);
      data.assertError(replaceableId === 0 || replaceableIds.has(replaceableId), `Unknown replaceable ID ${replaceableId}`);
      data.assertWarning(path === '' || replaceableId === 0, `Path "${path}" and replaceable ID ${replaceableId} used together`);

      data.pop();
    }
  } else {
    data.addWarning('No textures');
  }
}

/**
 * Test the material chunk.
 */
function testMaterials(data: SanityTestData) {
  let materials = data.model.materials;

  if (materials.length) {
    for (let [index, material] of materials.entries()) {
      data.push('Material', index);

      testMaterial(data, material);

      data.pop();
    }
  } else {
    data.addWarning('No materials');
  }
}

/**
 * Test a material.
 */
function testMaterial(data: SanityTestData, material: Material) {
  let layers = material.layers;

  if (layers.length) {
    for (let [index, layer] of layers.entries()) {
      data.push('Layer', index);

      testLayer(data, layer);

      data.pop();
    }
  } else {
    data.addWarning('No layers');
  }
}

/**
 * Get all of the texture indices referenced by a layer.
 */
function getTextureIds(layer: Layer) {
  for (let animation of layer.animations) {
    if (animation.name === 'KMTF') {
      return unique([animation.values]);
    }
  }

  return [layer.textureId];
}

/**
 * Test a layer.
 */
function testLayer(data: SanityTestData, layer: Layer) {
  let textures = data.model.textures;
  let textureAnimations = data.model.textureAnimations;

  for (let textureId of getTextureIds(layer)) {
    if (inRange(textureId, 0, textures.length - 1)) {
      data.addReference('Texture', textureId);
    } else {
      data.addError(`Invalid texture ${textureId}`);
    }
  }

  let textureAnimationId = layer.textureAnimationId;

  if (textureAnimationId !== -1) {
    if (inRange(textureAnimationId, 0, textureAnimations.length - 1)) {
      data.addReference('TextureAnimation', textureAnimationId);
    } else {
      data.addError(`Invalid texture animation ${textureAnimationId}`);
    }
  }

  data.assertWarning(inRange(layer.filterMode, 0, 6), `Invalid filter mode ${layer.filterMode}`);

  testAnimations(data, layer);
}

/**
 * Test the texture animation chunk.
 */
function testTextureAnimations(data: SanityTestData) {
  for (let [index, textureAnimation] of data.model.textureAnimations.entries()) {
    data.push('TextureAnimation', index);

    testAnimations(data, textureAnimation);

    data.pop();
  }
}

/**
 * Test geoset skinning.
 */
function testGeosetSkinning(data: SanityTestData, geoset: Geoset) {
  let objects = data.objects;
  let vertexGroups = geoset.vertexGroups;
  let matrixGroups = geoset.matrixGroups;
  let matrixIndices = geoset.matrixIndices;
  let slices = [];

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
          data.assertWarning(object instanceof Bone, `Vertex ${i}: Attached to generic object "${object.name}" which is not a bone`);
        } else {
          data.addError(`Vertex ${i}: Attached to generic object ${bone} which does not exist`);
        }
      }
    } else {
      data.addWarning(`Vertex ${i}: Attached to vertex group ${vertexGroups[i]} which does not exist`);
    }
  }
}

/**
 * Test the geoset chunk.
 */
function testGeosets(data: SanityTestData) {
  let geosets = data.model.geosets;
  let geosetAnimations = data.model.geosetAnimations;

  for (let i = 0, l = geosets.length; i < l; i++) {
    data.push('Geoset', i);

    let geoset = geosets[i];
    let materialId = geoset.materialId;

    testGeosetSkinning(data, geoset);
    // / TODO: ADD THIS
    // /testGeosetNormals(data, geoset);

    if (geosetAnimations.length) {
      let references = [];

      for (let j = 0, k = geosetAnimations.length; j < k; j++) {
        if (geosetAnimations[j].geosetId === i) {
          references.push(j);
        }
      }

      data.assertWarning(references.length <= 1, `Referenced by ${references.length} geoset animations (${references.join(', ')})`);
    }

    if (inRange(materialId, 0, data.model.materials.length - 1)) {
      data.addReference('Material', materialId);
    } else {
      data.addError(`Invalid material ${materialId}`);
    }

    if (geoset.faces.length) {
      data.addReference();
    } else {
      // The game and my code have no issue with geosets containing no faces, but Magos crashes, so add a warning in addition to it being useless.
      data.addWarning('Zero faces');
    }

    // The game and my code have no issue with geosets having any number of sequence extents, but Magos fails to parse, so add a warning.
    if (geoset.sequenceExtents.length !== data.model.sequences.length) {
      data.addWarning(`Number of sequence extents (${geoset.sequenceExtents.length}) does not match the number of sequences (${data.model.sequences.length})`);
    }

    data.pop();
  }
}

/**
 * Test the geoset animation chunk.
 */
function testGeosetAnimations(data: SanityTestData) {
  let geosets = data.model.geosets;

  for (let [index, geosetAnimation] of data.model.geosetAnimations.entries()) {
    data.push('GeosetAnimation', index);

    let geosetId = geosetAnimation.geosetId;

    if (inRange(geosetId, 0, geosets.length - 1)) {
      data.addReference();
    } else {
      data.addError(`Invalid geoset ${geosetId}`);
    }

    testAnimations(data, geosetAnimation);

    data.pop();
  }
}

/**
 * Test the bone chunk.
 */
function testBones(data: SanityTestData) {
  let bones = data.model.bones;
  let geosets = data.model.geosets;
  let geosetAnimations = data.model.geosetAnimations;

  if (bones.length) {
    for (let [index, bone] of bones.entries()) {
      data.push('Bone', index);

      let geosetId = bone.geosetId;
      let geosetAnimationId = bone.geosetAnimationId;

      data.assertError(geosetId === -1 || geosetId < geosets.length, `Invalid geoset ${geosetId}`);
      data.assertError(geosetAnimationId === -1 || geosetAnimationId < geosetAnimations.length, `Invalid geoset animation ${geosetAnimationId}`);

      testGenericObject(data, bone);

      data.pop();
    }
  } else {
    data.addWarning('No bones');
  }
}

/**
 * Test the light chunk.
 */
function testLights(data: SanityTestData) {
  for (let [index, light] of data.model.lights.entries()) {
    data.push('Light', index);

    let attenuation = light.attenuation;

    data.assertWarning(attenuation[0] >= 80 && attenuation[1] <= 200 && attenuation[1] - attenuation[0] > 0, `Attenuation min=${attenuation[0]} max=${attenuation[1]}`);

    testGenericObject(data, light);

    data.pop();
  }
}

/**
 * Test the helper chunk.
 */
function testHelpers(data: SanityTestData) {
  for (let [index, helper] of data.model.helpers.entries()) {
    data.push('Helper', index);

    testGenericObject(data, helper);

    data.pop();
  }
}

/**
 * Test the attachment chunk.
 */
function testAttachments(data: SanityTestData) {
  for (let [index, attachment] of data.model.attachments.entries()) {
    data.push('Attachment', index);

    // NOTE: I can't figure out what exactly the rules for attachment names even are.
    /*
    let path = attachment.path;

    if (path === '') {
        assertWarning(data, testAttachmentName(attachment), `${objectName}: Invalid attachment "${attachment.node.name}"`);
    } else {
        let lowerCase = path.toLowerCase();

        assertError(data, lowerCase.endsWith('.mdl') || lowerCase.endsWith('.mdx'), `${objectName}: Invalid path "${path}"`);
    }
    */

    testGenericObject(data, attachment);

    data.pop();
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
/**
 * Test the pivot point chunk.
 */
function testPivotPoints(data: SanityTestData) {
  let pivotPoints = data.model.pivotPoints;
  let objects = data.objects;

  data.assertWarning(pivotPoints.length === objects.length, `Expected ${objects.length} pivot points, got ${pivotPoints.length}`);
}

/**
 * Test the particle emitter chunk.
 */
function testParticleEmitters(data: SanityTestData) {
  for (let [index, emitter] of data.model.particleEmitters.entries()) {
    data.push('ParticleEmitter', index);

    data.assertError(emitter.path.toLowerCase().endsWith('.mdl'), 'Invalid path');

    testGenericObject(data, emitter);

    data.pop();
  }
}

/**
 * Test the particle emitter 2 chunk.
 */
function testParticleEmitters2(data: SanityTestData) {
  for (let [index, emitter] of data.model.particleEmitters2.entries()) {
    data.push('ParticleEmitter2', index);

    let replaceableId = emitter.replaceableId;

    if (inRange(emitter.textureId, 0, data.model.textures.length - 1)) {
      data.addReference('Texture', emitter.textureId);
    } else {
      data.addError(`Invalid texture ${emitter.textureId}`);
    }

    data.assertWarning(inRange(emitter.filterMode, 0, 4), `Invalid filter mode ${emitter.filterMode}`);
    data.assertError(replaceableId === 0 || replaceableIds.has(replaceableId), `Invalid replaceable ID ${replaceableId}`);

    testGenericObject(data, emitter);

    data.pop();
  }
}

/**
 * Test the ribbon emitter chunk.
 */
function testRibbonEmitters(data: SanityTestData) {
  for (let [index, emitter] of data.model.ribbonEmitters.entries()) {
    data.push('RibbonEmitter', index);

    if (inRange(emitter.materialId, 0, data.model.materials.length - 1)) {
      data.addReference('Material', emitter.materialId);
    } else {
      data.addError(`Invalid material ${emitter.materialId}`);
    }

    testGenericObject(data, emitter);

    data.pop();
  }
}

/**
 * Test the event object chunk.
 */
function testEventObjects(data: SanityTestData) {
  for (let [index, eventObject] of data.model.eventObjects.entries()) {
    data.push('EventObject', index);

    let tracks = eventObject.tracks;
    let globalSequenceId = eventObject.globalSequenceId;

    if (globalSequenceId !== -1) {
      if (inRange(globalSequenceId, 0, data.model.globalSequences.length - 1)) {
        data.addReference('GlobalSequence', globalSequenceId);
      } else {
        data.addError(`Invalid global sequence ${globalSequenceId}`);
      }
    }

    if (tracks.length) {
      for (let j = 0, k = tracks.length; j < k; j++) {
        let track = tracks[j];

        data.assertWarning(getSequenceInfoFromFrame(data, track, globalSequenceId)[0] !== -1, `Track ${j}: Frame ${track} is not in any sequence`);
      }
    } else {
      data.addError('Zero keys');
    }

    testGenericObject(data, eventObject);

    data.pop();
  }
}

/**
 * Test the camera chunk.
 */
function testCameras(data: SanityTestData) {
  for (let [index, camera] of data.model.cameras.entries()) {
    data.push('Camera', index);

    // I don't know what the rules are as to when cameras are used for portraits.
    // Therefore, for now never report them as not used.
    data.addReference();

    testAnimations(data, camera);

    data.pop();
  }
}

/**
 * Test the collision shape chunk.
 */
function testCollisionShapes(data: SanityTestData) {
  for (let [index, collisionShape] of data.model.collisionShapes.entries()) {
    data.push('CollisionShape', index);

    testGenericObject(data, collisionShape);

    data.pop();
  }
}

/**
 * Test a generic object.
 */
function testGenericObject(data: SanityTestData, object: GenericObject) {
  let objectId = object.objectId;
  let parentId = object.parentId;

  data.assertError(parentId === -1 || hasGenericObject(data, parentId), `Invalid parent ${parentId}`);
  data.assertError(objectId !== parentId, 'Same object and parent');

  testAnimations(data, object);
}

/**
 * Is the given ID a valid generic object?
 */
function hasGenericObject(data: SanityTestData, id: number) {
  for (let object of data.objects) {
    if (object.objectId === id) {
      return true;
    }
  }

  return false;
}

/**
 * Test all of the animations in the given animated object.
 */
function testAnimations(data: SanityTestData, object: AnimatedObject) {
  for (let animation of object.animations) {
    data.push(animatedTypeNames.get(animation.name));

    testAnimation(data, animation);

    data.pop();
  }
}

/**
 * Test an animation.
 */
function testAnimation(data: SanityTestData, animation: Animation) {
  let globalSequenceId = animation.globalSequenceId;

  if (globalSequenceId !== -1) {
    if (inRange(globalSequenceId, 0, data.model.globalSequences.length - 1)) {
      data.addReference('GlobalSequence', globalSequenceId);
    } else {
      data.addError(`Invalid global sequence ${globalSequenceId}`);
    }
  }

  if (animation.name === 'KP2R') {
    // Particle emitter 2 variation animations are not implemented in Magos for the MDX format.
    data.addWarning('Using a variation animation.');
  }

  if (animation.name === 'KP2G') {
    // Particle emitter 2 gravity animations are not implemented in Magos for the MDX format.
    data.addWarning('Using a gravity animation.');
  }

  testInterpolationType(data, animation);
  testTracks(data, animation, globalSequenceId);
}

/**
 * Test an animation's tracks.
 */
function testTracks(data: SanityTestData, animation: Animation, globalSequenceId: number) {
  let sequences = data.model.sequences;
  let usageMap = {};
  let frames = animation.frames;

  data.assertWarning(frames.length, 'Zero tracks');
  data.assertWarning(globalSequenceId !== -1 || frames.length === 0 || sequences.length !== 0, 'Tracks used without sequences');

  for (let i = 0, l = frames.length; i < l; i++) {
    let frame = frames[i];
    let sequenceInfo = getSequenceInfoFromFrame(data, frame, globalSequenceId);
    let sequenceId = sequenceInfo[0];
    let isBeginning = sequenceInfo[1];
    let isEnding = sequenceInfo[2];

    data.assertWarning(frames.length === 1 || sequenceId !== -1 || frame === 0, `Track ${i}: Frame ${frame} is not in any sequence`);
    data.assertWarning(frame >= 0, `Track ${i}: Negative frame`);

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

      data.assertWarning(sequenceInfo[0] || sequenceInfo[2] === 1, `No opening track for "${sequence.name}" at frame ${sequence.interval[0]}`);
      data.assertWarning(sequenceInfo[1] || sequenceInfo[2] === 1, `No closing track for "${sequence.name}" at frame ${sequence.interval[1]}`);
    }
  }
}

/**
 * Test an animation's interpolation type.
 */
function testInterpolationType(data: SanityTestData, animation: Animation) {
  if (animatedTypeNames.get(animation.name) === 'Visibility' && animation.interpolationType !== 0) {
    data.addWarning('Interpolation type not set to None');
  }
}

/**
 * Get metadata about a frame in an animation.
 * This includes whether it starts a sequence, ends a sequence, and the keyframe it belongs to.
 */
function getSequenceInfoFromFrame(data: SanityTestData, frame: number, globalSequenceId: number) {
  let index = -1;
  let isBeginning = false;
  let isEnding = false;

  if (globalSequenceId === -1) {
    let sequences = data.model.sequences;

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
    let globalSequence = data.model.globalSequences[globalSequenceId];

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
  ['KGSC', 'Scaling'],
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
  'walk',
]);
/*
let attachmentNames = new Set([
    'chest',
    'feet',
    'foot',
    'hand',
    'head',
    'origin',
    'overhead',
    'sprite',
    'weapon',
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
    'eattree',
]);
*/
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
  37,
]);

/**
 * Run a sanity test on the model and return the results.
 */
export default function sanityTest(model: Model) {
  let data = new SanityTestData(model);

  testHeader(data);
  testSequences(data);
  testGlobalSequences(data);
  testTextures(data);
  testMaterials(data);
  testTextureAnimations(data);
  testGeosets(data);
  testGeosetAnimations(data);
  testBones(data);
  testLights(data);
  testHelpers(data);
  testAttachments(data);
  testPivotPoints(data);
  testParticleEmitters(data);
  testParticleEmitters2(data);
  testRibbonEmitters(data);
  testEventObjects(data);
  testCameras(data);
  testCollisionShapes(data);

  let nodes = data.stack[0].children;
  let warnings = 0;
  let errors = 0;
  let unused = 0;

  for (let node of nodes) {
    // There are some top-level warnings.
    if (node.type === 'warning') {
      warnings += 1;
    } else if (node.warnings) {
      warnings += node.warnings;
    }

    // There are some top-level errors.
    if (node.type === 'error') {
      errors += 1;
    } else if (node.errors) {
      errors += node.errors;
    }

    if (node.uses === 0) {
      unused += 1;
    }
  }

  return { nodes, warnings, errors, unused };
}
