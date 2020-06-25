import Sequence from '../../parsers/mdlx/sequence';
import Texture from '../../parsers/mdlx/texture';
import Material from '../../parsers/mdlx/material';
import Layer from '../../parsers/mdlx/layer';
import Geoset from '../../parsers/mdlx/geoset';
import GeosetAnimation from '../../parsers/mdlx/geosetanimation';
import Bone from '../../parsers/mdlx/bone';
import Light from '../../parsers/mdlx/light';
import Attachment from '../../parsers/mdlx/attachment';
import ParticleEmitter from '../../parsers/mdlx/particleemitter';
import ParticleEmitter2 from '../../parsers/mdlx/particleemitter2';
import ParticleEmitterPopcorn from '../../parsers/mdlx/particleemitterpopcorn';
import RibbonEmitter from '../../parsers/mdlx/ribbonemitter';
import EventObject from '../../parsers/mdlx/eventobject';
import Camera from '../../parsers/mdlx/camera';
import SanityTestData from './data';
import { sequenceNames, replaceableIds, testObjects, testReference, getTextureIds, testGeosetSkinning, hasAnimation } from './utils';
import testTracks from './tracks';

export function testHeader(data: SanityTestData) {
  let version = data.model.version;

  if (version !== 800 && version !== 900 && version !== 1000) {
    data.addWarning(`Unknown version: ${version}`)
  }

  if (version === 900) {
    data.addError('Version 900 is not supported by Warcrft 3')
  }

  if (data.model.animationFile !== '') {
    data.addWarning(`The animation file should probably be empty, currently set to: "${data.model.animationFile}"`);
  }
}

export function testSequences(data: SanityTestData) {
  let sequences = data.model.sequences;

  if (sequences.length) {
    testObjects(data, sequences, testSequence);

    data.assertSevere(data.foundStand, 'Missing "Stand" sequence');
    data.assertSevere(data.foundDeath, 'Missing "Death" sequence');
  } else {
    data.addWarning('No sequences');
  }
}

function testSequence(data: SanityTestData, sequence: Sequence) {
  let name = sequence.name;
  let tokens = name.toLowerCase().trim().split('-')[0].split(/\s+/);
  let token = tokens[0];
  let interval = sequence.interval;
  let length = interval[1] - interval[0];
  let sequences = data.model.sequences;
  let index = sequences.indexOf(sequence);

  for (let i = 0; i < index; i++) {
    let otherSequence = sequences[i];
    let otherInterval = otherSequence.interval;

    if (interval[0] < otherInterval[1]) {
      data.addSevere(`This sequence starts before sequence ${i} "${otherSequence.name}" ends`);
    }
  }

  if (token === 'alternate') {
    token = tokens[1];
  }

  if (token === 'stand') {
    data.foundStand = true;
  }

  if (token === 'death') {
    data.foundDeath = true;
  }

  data.addImplicitReference();

  data.assertWarning(sequenceNames.has(token), `"${token}" is not a standard name`);
  data.assertWarning(length !== 0, 'Zero length');
  data.assertWarning(length > -1, `Negative length: ${length}`);
}

export function testGlobalSequence(data: SanityTestData, sequence: number) {
  data.assertWarning(sequence !== 0, 'Zero length');
  data.assertWarning(sequence >= 0, `Negative length: ${sequence}`);
}

export function testTextures(data: SanityTestData) {
  let textures = data.model.textures;

  if (textures.length) {
    testObjects(data, textures, testTexture);
  } else {
    data.addWarning('No textures');
  }
}

function testTexture(data: SanityTestData, texture: Texture) {
  let replaceableId = texture.replaceableId;
  let path = texture.path.toLowerCase();
  let ext = path.slice(path.lastIndexOf('.'));

  data.assertError(path === '' || ext === '.blp' || ext === '.tga' || ext === '.tif' || ext === '.dds', `Corrupted path: "${path}"`);
  data.assertError(replaceableId === 0 || replaceableIds.has(replaceableId), `Unknown replaceable ID: ${replaceableId}`);
  data.assertWarning(path === '' || replaceableId === 0, `Path "${path}" and replaceable ID ${replaceableId} used together`);
}

export function testMaterials(data: SanityTestData) {
  let materials = data.model.materials;

  if (materials.length) {
    testObjects(data, materials, testMaterial);
  } else {
    data.addWarning('No materials');
  }
}

function testMaterial(data: SanityTestData, material: Material) {
  let layers = material.layers;
  let shader = material.shader;

  if (data.model.version > 800) {
    data.assertWarning(shader === 'Shader_SD_FixedFunction' || shader === 'Shader_HD_DefaultUnit', `Unknown shader: "${shader}"`);
  }

  if (layers.length) {
    testObjects(data, layers, testLayer);
  } else {
    data.addWarning('No layers');
  }
}

function testLayer(data: SanityTestData, layer: Layer) {
  let textures = data.model.textures;
  let textureAnimations = data.model.textureAnimations;

  for (let textureId of getTextureIds(layer)) {
    testReference(data, textures, textureId, 'texture');
  }

  let textureAnimationId = layer.textureAnimationId;

  if (textureAnimationId !== -1) {
    testReference(data, textureAnimations, textureAnimationId, 'texture animation');
  }

  let filterMode = layer.filterMode;

  data.assertWarning(filterMode >= 0 && filterMode <= 6, `Invalid filter mode: ${layer.filterMode}`);
}

export function testGeoset(data: SanityTestData, geoset: Geoset, index: number) {
  let geosetAnimations = data.model.geosetAnimations;
  let materialId = geoset.materialId;

  data.assertSevere(geoset.vertices.length < 65536, `Too many vertices in one geoset: ${geoset.vertices.length}`);

  testGeosetSkinning(data, geoset, index);

  if (geosetAnimations.length) {
    let references = [];

    for (let j = 0, k = geosetAnimations.length; j < k; j++) {
      if (geosetAnimations[j].geosetId === index) {
        references.push(j);
      }
    }

    data.assertWarning(references.length <= 1, `Referenced by ${references.length} geoset animations: ${references.join(', ')}`);
  }

  testReference(data, data.model.materials, materialId, 'material');

  if (geoset.faces.length) {
    data.addImplicitReference();
  } else {
    // The game and my code have no issue with geosets containing no faces, but Magos crashes, so add a warning in addition to it being useless.
    data.addWarning('Zero faces');
  }

  // The game and my code have no issue with geosets having any number of sequence extents, but Magos fails to parse, so add a warning.
  // Either way this is only relevant to version 800, because there seem to always be 0 extents in >800 models.
  if (geoset.sequenceExtents.length !== data.model.sequences.length && data.model.version === 800) {
    data.addWarning(`Number of sequence extents (${geoset.sequenceExtents.length}) does not match the number of sequences (${data.model.sequences.length})`);
  }
}

export function testGeosetAnimation(data: SanityTestData, geosetAnimation: GeosetAnimation) {
  let geosets = data.model.geosets;
  let geosetId = geosetAnimation.geosetId;

  data.addImplicitReference();

  testReference(data, geosets, geosetId, 'geoset');
}

const SUPPOSED_ALPHA_THRESHOLD = 0.1;

export function testBone(data: SanityTestData, bone: Bone) {
  let geosets = data.model.geosets;
  let geosetAnimations = data.model.geosetAnimations;
  let geosetId = bone.geosetId;
  let geosetAnimationId = bone.geosetAnimationId;

  if (geosetId !== -1) {
    testReference(data, geosets, geosetId, 'geoset');
  }

  if (geosetAnimationId !== -1 && testReference(data, geosetAnimations, geosetAnimationId, 'geoset animation')) {
    let geosetAnimation = geosetAnimations[geosetAnimationId];

    if (geosetId !== -1 && geosetAnimation.alpha < SUPPOSED_ALPHA_THRESHOLD && !hasAnimation(geosetAnimation, 'KGAO')) {
      data.addSevere(`Referencing geoset ${bone.geosetAnimationId} and geoset animation ${geosetAnimationId} with a 0 alpha, the geoset may be invisible`);
    }
  }
}

export function testLight(data: SanityTestData, light: Light) {
  let attenuation = light.attenuation;

  data.assertWarning(attenuation[0] >= 80, `Minimum attenuation should probably be bigger than or equal to 80, but is ${attenuation[0]}`);
  data.assertWarning(attenuation[1] <= 200, `Maximum attenuation should probably be smaller than or equal to 200, but is ${attenuation[0]}`);
  data.assertWarning(attenuation[1] - attenuation[0] > 0, `The maximum attenuation should be bigger than the minimum, but isn't`);
}

export function testAttachment(data: SanityTestData, attachment: Attachment) {
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
}

export function testPivotPoints(data: SanityTestData) {
  let pivotPoints = data.model.pivotPoints;
  let objects = data.objects;

  data.assertWarning(pivotPoints.length === objects.length, `Expected ${objects.length} pivot points, got ${pivotPoints.length}`);
}

export function testParticleEmitter(data: SanityTestData, emitter: ParticleEmitter) {
  data.assertError(emitter.path.toLowerCase().endsWith('.mdl'), 'Invalid path');
}

export function testParticleEmitter2(data: SanityTestData, emitter: ParticleEmitter2) {
  let replaceableId = emitter.replaceableId;

  testReference(data, data.model.textures, emitter.textureId, 'texture');

  let filterMode = emitter.filterMode;

  data.assertWarning(filterMode >= 0 && filterMode <= 4, `Invalid filter mode: ${emitter.filterMode}`);
  data.assertError(replaceableId === 0 || replaceableIds.has(replaceableId), `Invalid replaceable ID: ${replaceableId}`);
}

export function testParticleEmitterPopcorn(data: SanityTestData, emitter: ParticleEmitterPopcorn) {
  let path = emitter.path;

  if (path.length) {
    data.assertError(path.endsWith('.pkfx'), `Corrupted path: "${path}"`);
  }
}

export function testRibbonEmitter(data: SanityTestData, emitter: RibbonEmitter) {
  testReference(data, data.model.materials, emitter.materialId, 'material');
}

export function testEventObject(data: SanityTestData, eventObject: EventObject) {
  testTracks(data, eventObject);
}

export function testCamera(data: SanityTestData, camera: Camera) {
  // I don't know what the rules are as to when cameras are used for portraits.
  // Therefore, for now never report them as not used.
  data.addImplicitReference();
}

export function testFaceEffect(data: SanityTestData) {
  let path = data.model.faceEffect;

  if (path.length) {
    data.assertError(path.endsWith('.facefx') || path.endsWith('.facefx_ingame'), `Corrupted face effect path: "${path}"`);
  }
}

export function testBindPose(data: SanityTestData) {
  let matrices = data.model.bindPose;
  let objects = data.objects;

  data.assertWarning(matrices.length === objects.length, `Expected ${objects.length} matrices, got ${matrices.length}`);
}
