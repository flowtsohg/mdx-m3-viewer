import unique from '../../../common/arrayunique';
import { basename } from '../../../common/path';
import { Animation, InterpolationType } from '../../../parsers/mdlx/animations';
import AnimatedObject from '../../../parsers/mdlx/animatedobject';
import GenericObject from '../../../parsers/mdlx/genericobject';
import Extent from '../../../parsers/mdlx/extent';
import Sequence from '../../../parsers/mdlx/sequence';
import Texture from '../../../parsers/mdlx/texture';
import Material from '../../../parsers/mdlx/material';
import Layer from '../../../parsers/mdlx/layer';
import TextureAnimation from '../../../parsers/mdlx/textureanimation';
import Geoset from '../../../parsers/mdlx/geoset';
import GeosetAnimation from '../../../parsers/mdlx/geosetanimation';
import Bone from '../../../parsers/mdlx/bone';
import Light from '../../../parsers/mdlx/light';
import Helper from '../../../parsers/mdlx/helper';
import Attachment from '../../../parsers/mdlx/attachment';
import ParticleEmitter from '../../../parsers/mdlx/particleemitter';
import ParticleEmitter2 from '../../../parsers/mdlx/particleemitter2';
import ParticleEmitterPopcorn from '../../../parsers/mdlx/particleemitterpopcorn';
import RibbonEmitter from '../../../parsers/mdlx/ribbonemitter';
import EventObject from '../../../parsers/mdlx/eventobject';
import Camera from '../../../parsers/mdlx/camera';
import CollisionShape from '../../../parsers/mdlx/collisionshape';
import FaceEffect from '../../../parsers/mdlx/faceeffect';
import SanityTestData from './data';
import testTracks from './tracks';
import { SanityTestNode } from './data';

export function isBetween(x: number, minVal: number, maxVal: number): boolean {
  return x >= minVal && x <= maxVal;
}

export const sequenceNames = new Set([
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
  'ready', // HeroMountainKing.mdx has "Alternate Ready" which I assume is the same as or a replacement to "Alternate Stand Ready"?
]);

export const replaceableIds = new Set([
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

export const animatedTypeNames = new Map([
  // Layer
  ['KMTF', 'Texture ID'],
  ['KMTA', 'Alpha'],
  ['KMTE', 'Emissive Gain'],
  ['KFC3', 'Fresnel Color'],
  ['KFCA', 'Fresnel Opacity'],
  ['KFTC', 'Fresnel Team Color'],
  // TextureAnimation
  ['KTAT', 'Translation'],
  ['KTAR', 'Rotation'],
  ['KTAS', 'Scaling'],
  // GeosetAnimation
  ['KGAO', 'Alpha'],
  ['KGAC', 'Color'],
  // GenericObject
  ['KGTR', 'Translation'],
  ['KGRT', 'Rotation'],
  ['KGSC', 'Scaling'],
  // Light
  ['KLAS', 'Attenuation Start'],
  ['KLAE', 'Attenuation End'],
  ['KLAC', 'Color'],
  ['KLAI', 'Intensity'],
  ['KLBI', 'Ambient Intensity'],
  ['KLBC', 'Ambient Color'],
  ['KLAV', 'Visibility'],
  // Attachment
  ['KATV', 'Visibility'],
  // ParticleEmitter
  ['KPEE', 'Emission Rate'],
  ['KPEG', 'Gravity'],
  ['KPLN', 'Longitude'],
  ['KPLT', 'Latitude'],
  ['KPEL', 'Lifespan'],
  ['KPES', 'Speed'],
  ['KPEV', 'Visibility'],
  // ParticleEmitter2
  ['KP2E', 'Emission Rate'],
  ['KP2G', 'Gravity'],
  ['KP2L', 'Latitude'],
  ['KP2R', 'Variation'],
  ['KP2N', 'Length'],
  ['KP2W', 'Width'],
  ['KP2S', 'Speed'],
  ['KP2V', 'Visibility'],
  // ParticleEmitterCorn
  ['KPPA', 'Alpha'],
  ['KPPC', 'Color'],
  ['KPPE', 'EmissionRate'],
  ['KPPL', 'LifeSpan'],
  ['KPPS', 'Speed'],
  ['KPPV', 'Visibility'],
  // RibbonEmitter
  ['KRHA', 'Height Above'],
  ['KRHB', 'Height Below'],
  ['KRAL', 'Alpha'],
  ['KRCO', 'Color'],
  ['KRTX', 'Texture Slot'],
  ['KRVS', 'Visibility'],
  // Camera
  ['KCTR', 'Translation'],
  ['KTTR', 'Rotation'],
  ['KCRL', 'Target Translation'],
]);

export function hasAnimation(object: AnimatedObject, name: string): boolean {
  for (const animation of object.animations) {
    if (animation.name === name) {
      return true;
    }
  }

  return false;
}

export type MdlxType = Extent | Sequence | number | Texture | Material | Layer | TextureAnimation | Geoset | GeosetAnimation | Bone | Light | Helper | Attachment | ParticleEmitter | ParticleEmitter2 | ParticleEmitterPopcorn | RibbonEmitter | EventObject | Camera | CollisionShape | FaceEffect | Animation;

export function getObjectTypeName(object: MdlxType): string {
  if (object instanceof Extent) {
    return 'Extent';
  } else if (object instanceof Sequence) {
    return 'Sequence';
  } else if (typeof object === 'number') {
    return 'GlobalSequence';
  } else if (object instanceof Texture) {
    return 'Texture';
  } else if (object instanceof Material) {
    return 'Material';
  } else if (object instanceof Layer) {
    return 'Layer';
  } else if (object instanceof TextureAnimation) {
    return 'TextureAnimation';
  } else if (object instanceof Geoset) {
    return 'Geoset';
  } else if (object instanceof GeosetAnimation) {
    return 'GeosetAnimation';
  } else if (object instanceof Bone) {
    return 'Bone';
  } else if (object instanceof Light) {
    return 'Light';
  } else if (object instanceof Helper) {
    return 'Helper';
  } else if (object instanceof Attachment) {
    return 'Attachment';
  } else if (object instanceof ParticleEmitter) {
    return 'ParticleEmitter';
  } else if (object instanceof ParticleEmitter2) {
    return 'ParticleEmitter2';
  } else if (object instanceof ParticleEmitterPopcorn) {
    return 'ParticleEmitterPopcorn';
  } else if (object instanceof RibbonEmitter) {
    return 'RibbonEmitter';
  } else if (object instanceof EventObject) {
    return 'EventObject';
  } else if (object instanceof Camera) {
    return 'Camera';
  } else if (object instanceof CollisionShape) {
    return 'CollisionShape';
  } else if (object instanceof FaceEffect) {
    return 'FaceEffect';
  } else if (object instanceof Animation) {
    return <string>animatedTypeNames.get(object.name);
  } else {
    console.warn('Unknown object type', object);
    return 'Unknown';
  }
}

export function getObjectName(object: MdlxType, index: number): string {
  let name = getObjectTypeName(object);

  if (!(object instanceof Animation) && !(object instanceof Extent)) {
    name += ` ${index}`;
  }

  if (object instanceof Sequence || object instanceof GenericObject || object instanceof Camera) {
    name += ` - "${object.name}"`;
  }

  if (object instanceof Texture || object instanceof FaceEffect) {
    if (object.path.length) {
      name += ` - "${basename(object.path)}"`;
    }

    if (object instanceof Texture) {
      if (object.replaceableId === 1) {
        name += ' - Team color';
      } else if (object.replaceableId === 2) {
        name += ' - Team glow';
      } else if (object.replaceableId > 0) {
        name += ` - Replaceable ID ${object.replaceableId}`;
      }
    }
  }

  return name;
}

export function testObjects<T extends MdlxType>(data: SanityTestData, objects: T[], handler?: (data: SanityTestData, object: T, index: number) => void): void {
  const l = objects.length;

  if (l) {
    const isAnimated = objects[0] instanceof AnimatedObject;
    const isGeneric = objects[0] instanceof GenericObject;

    for (let i = 0; i < l; i++) {
      const object = objects[i];

      data.push(object, i);

      if (handler) {
        handler(data, object, i);
      }

      if (isAnimated) {
        const asAnimated = <AnimatedObject>object;

        testObjects(data, asAnimated.animations, testAnimation);
      }

      if (isGeneric) {
        const asGeneric = <GenericObject>object;

        const objectId = asGeneric.objectId;
        const parentId = asGeneric.parentId;

        data.assertError(parentId === -1 || hasGenericObject(data, parentId), `Invalid parent ${parentId}`);
        data.assertError(objectId !== parentId, 'Same object and parent');
      }

      data.pop();
    }
  }
}

export function testAndGetReference<T extends MdlxType>(data: SanityTestData, objects: T[], index: number, typeNameIfError: string): T | undefined {
  if (index >= 0 && index < objects.length) {
    data.addReference(objects[index]);

    return objects[index];
  } else {
    data.addError(`Invalid ${typeNameIfError} ${index}`);

    return;
  }
}

export function testReference<T extends MdlxType>(data: SanityTestData, objects: T[], index: number, typeNameIfError: string): boolean {
  // This explicit test against undefined is needed because global sequences are numbers and could be equal to 0.
  return testAndGetReference(data, objects, index, typeNameIfError) !== undefined;
}

/**
 * Get all of the texture indices referenced by a layer.
 */
export function getTextureIds(layer: Layer): number[] {
  for (const animation of layer.animations) {
    if (animation.name === 'KMTF') {
      return unique(animation.values.map((value) => value[0]));
    }
  }

  return [layer.textureId];
}

function testVertexSkinning(data: SanityTestData, vertex: number, bone: number, isHd: boolean): void {
  const object = data.objects[bone];

  if (isHd) {
    data.assertError(isBetween(bone, 0, 255), `Vertex ${vertex}: References bone ${bone} but there can only be 256 bones in an HD model`);
  }

  if (object) {
    if (!(object instanceof Bone)) {
      data.addSevere(`Vertex ${vertex}: Attached to "${object.name}" which is not a bone`);
    } else {
      // Add a use for this bone, to check later if bones have vertices attached to them.
      const uses = data.boneUsageMap.get(bone) || 0;
     
      data.boneUsageMap.set(bone, uses + 1);
    }
  } else {
    data.addError(`Vertex ${vertex}: Attached to object ${bone} which does not exist`);
  }
}

/**
 * Test geoset skinning.
 */
export function testGeosetSkinning(data: SanityTestData, geoset: Geoset): void {
  if (data.model.version > 800 && geoset.skin.length) {
    data.assertWarning(geoset.vertexGroups.length === 0, 'This geoset has both skin/weights and vertex groups');

    const skin = geoset.skin;

    for (let i = 0, l = skin.length / 8; i < l; i++) {
      const offset = i * 8;
      const bone0 = skin[offset];
      const bone1 = skin[offset + 1];
      const bone2 = skin[offset + 2];
      const bone3 = skin[offset + 3];
      const weight0 = skin[offset + 4];
      const weight1 = skin[offset + 5];
      const weight2 = skin[offset + 6];
      const weight3 = skin[offset + 7];

      if (weight0 > 0) {
        testVertexSkinning(data, i, bone0, true);
      }

      if (weight1 > 0) {
        testVertexSkinning(data, i, bone1, true);
      }

      if (weight2 > 0) {
        testVertexSkinning(data, i, bone2, true);
      }

      if (weight3 > 0) {
        testVertexSkinning(data, i, bone3, true);
      }

      const weight = weight0 + weight1 + weight2 + weight3;

      if (weight === 0) {
        data.addSevere(`Vertex ${i}: Not attached to anything`);
      } else if (weight !== 255) {
        data.addSevere(`Vertex ${i}: The weights are not normalized to 1`);
      }
    }
  } else {
    // A model having no bones at all is also valid.
    // I don't know if the skinning information in that case can be anything whatsoever, or if there are rules.
    if (data.model.bones.length) {
      const vertexGroups = geoset.vertexGroups;
      const matrixGroups = geoset.matrixGroups;
      const matrixIndices = geoset.matrixIndices;
      const slices = [];

      for (let i = 0, l = matrixGroups.length, k = 0; i < l; i++) {
        slices.push(matrixIndices.subarray(k, k + matrixGroups[i]));
        k += matrixGroups[i];
      }

      for (let i = 0, l = vertexGroups.length; i < l; i++) {
        const slice = slices[vertexGroups[i]];

        if (slice) {
          for (const bone of slice) {
            testVertexSkinning(data, i, bone, false);
          }
        } else {
          const vertexGroup = vertexGroups[i];

          if (vertexGroup === 255) {
            data.addSevere(`Vertex ${i}: Not attached to anything`);
          } else {
            data.addSevere(`Vertex ${i}: Attached to vertex group ${vertexGroup} which does not exist`);
          }
        }
      }
    }
  }
}

/**
 * Is the given ID a valid generic object?
 */
function hasGenericObject(data: SanityTestData, id: number): boolean {
  for (const object of data.objects) {
    if (object.objectId === id) {
      return true;
    }
  }

  return false;
}

export function testAnimation(data: SanityTestData, animation: Animation): void {
  const name = animation.name;
  const interpolationType = animation.interpolationType;

  // Particle emitter 2 variation animations are not implemented in Magos for the MDX format.
  data.assertWarning(name !== 'KP2R', 'Using a variation animation.');

  // Particle emitter 2 gravity animations are not implemented in Magos for the MDX format.
  data.assertWarning(name !== 'KP2G', 'Using a gravity animation.');

  // The game seems to force visiblity (and others?) interpolation types to none.
  data.assertWarning(animatedTypeNames.get(name) !== 'Visibility' || interpolationType === InterpolationType.DontInterp, 'Interpolation type not set to None');

  testTracks(data, animation);
}

export function cleanNode(node: SanityTestNode): void {
  const nodes = node.nodes;

  for (let i = nodes.length - 1; i >= 0; i--) {
    const child = nodes[i];

    if (child.type === 'node') {
      if (child.errors || child.severe || child.warnings || child.unused || (child.uses !== undefined && !child.uses)) {
        cleanNode(child);
      } else {
        nodes.splice(i, 1);
      }
    }
  }
}

export function getAnimation(object: AnimatedObject, name: string): Animation | undefined {
  for (const animation of object.animations) {
    if (animation.name === name) {
      return animation;
    }
  }

  return;
}

export function testExtent(data: SanityTestData, extent: Extent): void {
  data.push(extent, 0);

  const { max, min } = extent;

  if ((max[0] - min[0] < 0) || (max[1] - min[1] < 0) || (max[2] - min[2] < 0)) {
    data.addWarning('Negative extents');
  }

  data.pop();
}

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
