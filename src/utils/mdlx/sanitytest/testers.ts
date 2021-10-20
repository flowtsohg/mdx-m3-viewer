import { extname } from '../../../common/path';
import Sequence from '../../../parsers/mdlx/sequence';
import Texture from '../../../parsers/mdlx/texture';
import Material from '../../../parsers/mdlx/material';
import Layer, { FilterMode as LayerFilterMode } from '../../../parsers/mdlx/layer';
import Geoset from '../../../parsers/mdlx/geoset';
import GeosetAnimation from '../../../parsers/mdlx/geosetanimation';
import Bone from '../../../parsers/mdlx/bone';
import Light from '../../../parsers/mdlx/light';
import ParticleEmitter from '../../../parsers/mdlx/particleemitter';
import ParticleEmitter2, { FilterMode as Particle2FilterMode, Flags as Particle2Flags } from '../../../parsers/mdlx/particleemitter2';
import ParticleEmitterPopcorn from '../../../parsers/mdlx/particleemitterpopcorn';
import RibbonEmitter from '../../../parsers/mdlx/ribbonemitter';
import EventObject from '../../../parsers/mdlx/eventobject';
import Camera from '../../../parsers/mdlx/camera';
import FaceEffect from '../../../parsers/mdlx/faceeffect';
import SanityTestData from './data';
import { sequenceNames, replaceableIds, testObjects, testReference, getTextureIds, testGeosetSkinning, hasAnimation, getAnimation, testExtent, testAndGetReference } from './utils';
import testTracks from './tracks';

export function testHeader(data: SanityTestData): void {
  const version = data.model.version;

  if (version !== 800 && version !== 900 && version !== 1000) {
    data.addWarning(`Unknown version: ${version}`);
  }

  if (version === 900) {
    data.addError('Version 900 is not supported by Warcrft 3');
  }

  if (data.model.animationFile !== '') {
    data.addWarning(`The animation file should probably be empty, currently set to: "${data.model.animationFile}"`);
  }

  testExtent(data, data.model.extent);
}

export function testSequences(data: SanityTestData): void {
  const sequences = data.model.sequences;

  if (sequences.length) {
    testObjects(data, sequences, testSequence);

    data.assertSevere(data.foundStand, 'Missing "Stand" sequence');
    data.assertSevere(data.foundDeath, 'Missing "Death" sequence');
  } else {
    data.addWarning('No sequences');
  }
}

function testSequence(data: SanityTestData, sequence: Sequence, index: number): void {
  const name = sequence.name;
  const tokens = name.toLowerCase().trim().split('-')[0].split(/\s+/);
  let token = tokens[0];
  const interval = sequence.interval;
  const length = interval[1] - interval[0];
  const sequences = data.model.sequences;

  for (let i = 0; i < index; i++) {
    const otherSequence = sequences[i];
    const otherInterval = otherSequence.interval;

    // Reforged fixed these weird issues with sequence ordering.
    if (data.model.version === 800) {
      if (interval[0] === otherInterval[0]) {
        data.addSevere(`This sequence starts at the same frame as sequence ${i} "${otherSequence.name}"`);
      } else if (interval[0] < otherInterval[1]) {
        data.addSevere(`This sequence starts before sequence ${i} "${otherSequence.name}" ends`);
      }
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

  testExtent(data, sequence.extent);
}

export function testGlobalSequence(data: SanityTestData, sequence: number): void {
  data.assertWarning(sequence !== 0, 'Zero length');
  data.assertWarning(sequence >= 0, `Negative length: ${sequence}`);
}

export function testTextures(data: SanityTestData): void {
  const textures = data.model.textures;

  if (textures.length) {
    testObjects(data, textures, testTexture);
  } else {
    data.addWarning('No textures');
  }
}

function testTexture(data: SanityTestData, texture: Texture): void {
  const replaceableId = texture.replaceableId;
  const path = texture.path.toLowerCase();
  const ext = extname(path);

  data.assertError(path === '' || ext === '.blp' || ext === '.tga' || ext === '.tif' || ext === '.dds', `Corrupted path: "${path}"`);
  data.assertError(replaceableId === 0 || replaceableIds.has(replaceableId), `Unknown replaceable ID: ${replaceableId}`);
  data.assertWarning(path === '' || replaceableId === 0, `Path "${path}" and replaceable ID ${replaceableId} used together`);
}

export function testMaterial(data: SanityTestData, material: Material): void {
  const layers = material.layers;
  const shader = material.shader;

  if (data.model.version > 800) {
    data.assertWarning(shader === '' || shader === 'Shader_SD_FixedFunction' || shader === 'Shader_HD_DefaultUnit', `Unknown shader: "${shader}"`);
  }

  if (layers.length) {
    testObjects(data, layers, testLayer);
  } else {
    data.addWarning('No layers');
  }
}

function testLayer(data: SanityTestData, layer: Layer): void {
  const textures = data.model.textures;
  const textureAnimations = data.model.textureAnimations;

  for (const textureId of getTextureIds(layer)) {
    testReference(data, textures, textureId, 'texture');
  }

  const textureAnimationId = layer.textureAnimationId;

  if (textureAnimationId !== -1) {
    testReference(data, textureAnimations, textureAnimationId, 'texture animation');
  }

  const filterMode = layer.filterMode;

  data.assertWarning(filterMode >= LayerFilterMode.None && filterMode <= LayerFilterMode.Modulate2x, `Invalid filter mode: ${layer.filterMode}`);
}

export function testGeoset(data: SanityTestData, geoset: Geoset, index: number): void {
  const geosetAnimations = data.model.geosetAnimations;
  const material = testAndGetReference(data, data.model.materials, geoset.materialId, 'material');
  let isHd = false;

  if (material && material.shader === 'Shader_HD_DefaultUnit') {
    isHd = true;
  }

  if (!isHd) {
    // When a geoset has too many vertices (or faces? or both?) it will render completely bugged in WC3.
    // I don't know the exact number, but here are numbers that I tested:
    //
    //     Verts   Faces   Result
    //     ----------------------
    //     7433    16386   Bugged
    //     7394    16290   Good
    //
    const GUESSED_MAX_VERTICES = 7433 * 3;

    data.assertSevere(geoset.vertices.length < GUESSED_MAX_VERTICES, `Too many vertices in one geoset: ${geoset.vertices.length / 3}`);
  }

  testGeosetSkinning(data, geoset);

  if (geosetAnimations.length) {
    const references = [];

    for (let j = 0, k = geosetAnimations.length; j < k; j++) {
      if (geosetAnimations[j].geosetId === index) {
        references.push(j);
      }
    }

    data.assertWarning(references.length <= 1, `Referenced by ${references.length} geoset animations: ${references.join(', ')}`);
  }

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

  testExtent(data, geoset.extent);

  for (const extent of geoset.sequenceExtents) {
    testExtent(data, extent);
  }
}

export function testGeosetAnimation(data: SanityTestData, geosetAnimation: GeosetAnimation): void {
  const geosets = data.model.geosets;
  const geosetId = geosetAnimation.geosetId;

  data.addImplicitReference();

  testReference(data, geosets, geosetId, 'geoset');
}

const SUPPOSED_ALPHA_THRESHOLD = 0.1;

export function testBone(data: SanityTestData, bone: Bone, index: number): void {
  const geosets = data.model.geosets;
  const geosetAnimations = data.model.geosetAnimations;
  const geosetId = bone.geosetId;
  const geosetAnimationId = bone.geosetAnimationId;

  if (geosetId !== -1) {
    testReference(data, geosets, geosetId, 'geoset');
  }

  if (geosetAnimationId !== -1 && testReference(data, geosetAnimations, geosetAnimationId, 'geoset animation')) {
    const geosetAnimation = geosetAnimations[geosetAnimationId];

    if (geosetId !== -1 && geosetAnimation.alpha < SUPPOSED_ALPHA_THRESHOLD && !hasAnimation(geosetAnimation, 'KGAO')) {
      data.addSevere(`Referencing geoset ${geosetId} and geoset animation ${geosetAnimationId} with a 0 alpha, the geoset may be invisible`);
    }
  }

  data.assertWarning(data.boneUsageMap.get(index) > 0, `There are no vertices attached to this bone`);
}

export function testLight(data: SanityTestData, light: Light): void {
  const attenuation = light.attenuation;

  data.assertWarning(attenuation[0] >= 80, `Minimum attenuation should probably be bigger than or equal to 80, but is ${attenuation[0]}`);
  data.assertWarning(attenuation[1] <= 200, `Maximum attenuation should probably be smaller than or equal to 200, but is ${attenuation[1]}`);
  data.assertWarning(attenuation[1] - attenuation[0] > 0, `The maximum attenuation should be bigger than the minimum, but isn't`);
}

export function testAttachments(data: SanityTestData): void {
  const attachments = data.model.attachments;
  let foundOrigin = false;

  for (const attachment of attachments) {
    const path = attachment.path;

    if (path.length) {
      const lowerCase = path.toLowerCase();

      data.assertError(lowerCase.endsWith('.mdl') || lowerCase.endsWith('.mdx'), `Invalid path "${path}"`);
    }
  
    if (attachment.name.startsWith('Origin Ref')) {
      foundOrigin = true;
    }
  }

  if (!foundOrigin) {
    data.addWarning('Missing the Origin attachment point');
  }
}

export function testPivotPoints(data: SanityTestData): void {
  const pivotPoints = data.model.pivotPoints;
  const objects = data.objects;

  data.assertWarning(pivotPoints.length === objects.length, `Expected ${objects.length} pivot points, got ${pivotPoints.length}`);
}

export function testParticleEmitter(data: SanityTestData, emitter: ParticleEmitter): void {
  const path = emitter.path.toLowerCase();

  data.assertError(path.endsWith('.mdl') || path.endsWith('.mdx'), 'Invalid path');
}

export function testParticleEmitter2(data: SanityTestData, emitter: ParticleEmitter2): void {
  const replaceableId = emitter.replaceableId;

  testReference(data, data.model.textures, emitter.textureId, 'texture');

  const filterMode = emitter.filterMode;

  data.assertWarning(filterMode >= Particle2FilterMode.Blend && filterMode <= Particle2FilterMode.AlphaKey, `Invalid filter mode: ${emitter.filterMode}`);
  data.assertError(replaceableId === 0 || replaceableIds.has(replaceableId), `Invalid replaceable ID: ${replaceableId}`);

  if (emitter.flags & Particle2Flags.XYQuad) {
    data.assertSevere(emitter.speed !== 0 && emitter.latitude !== 0, 'XY Quad emitters must have a non-zero speed and latitude');
  }

  data.assertSevere(emitter.timeMiddle >= 0 && emitter.timeMiddle <= 1, `Expected time middle to be between 0 and 1, got ${emitter.timeMiddle}`);

  if (emitter.squirt && !getAnimation(emitter, 'KP2E')) {
    data.addSevere('Using squirt without animating the emission rate');
  }
}

export function testParticleEmitterPopcorn(data: SanityTestData, emitter: ParticleEmitterPopcorn): void {
  data.assertSevere(emitter.animationVisiblityGuide.length > 0, 'No animation visibility guide');
}

export function testRibbonEmitter(data: SanityTestData, emitter: RibbonEmitter): void {
  testReference(data, data.model.materials, emitter.materialId, 'material');
}

export function testEventObject(data: SanityTestData, eventObject: EventObject): void {
  testTracks(data, eventObject);
}

export function testCamera(data: SanityTestData, _camera: Camera): void {
  // I don't know what the rules are as to when cameras are used for portraits.
  // Therefore, for now never report them as not used.
  data.addImplicitReference();
}

export function testFaceEffect(data: SanityTestData, faceEffect: FaceEffect): void {
  const path = faceEffect.path;

  if (path.length) {
    data.assertError(path.endsWith('.facefx') || path.endsWith('.facefx_ingame'), `Corrupted face effect path: "${path}"`);
  }

  data.addImplicitReference();
}

export function testBindPose(data: SanityTestData): void {
  const matrices = data.model.bindPose;
  const objects = data.objects;

  if (matrices.length && objects.length) { 
    // There's always an extra matrix for some reason.
    // Face effects? but also models with no face effects have it.
    data.assertWarning(matrices.length === objects.length + 1, `Expected ${objects.length + 1} matrices, got ${matrices.length}`);
  }
}
