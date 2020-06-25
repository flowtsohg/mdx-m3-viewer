import unique from '../../common/arrayunique';
import { Animation } from '../../parsers/mdlx/animations';
import AnimatedObject from '../../parsers/mdlx/animatedobject';
import GenericObject from '../../parsers/mdlx/genericobject';
import Sequence from '../../parsers/mdlx/sequence';
import Texture from '../../parsers/mdlx/texture';
import Material from '../../parsers/mdlx/material';
import Layer from '../../parsers/mdlx/layer';
import TextureAnimation from '../../parsers/mdlx/textureanimation';
import Geoset from '../../parsers/mdlx/geoset';
import GeosetAnimation from '../../parsers/mdlx/geosetanimation';
import Bone from '../../parsers/mdlx/bone';
import Light from '../../parsers/mdlx/light';
import Helper from '../../parsers/mdlx/helper';
import Attachment from '../../parsers/mdlx/attachment';
import ParticleEmitter from '../../parsers/mdlx/particleemitter';
import ParticleEmitter2 from '../../parsers/mdlx/particleemitter2';
import ParticleEmitterPopcorn from '../../parsers/mdlx/particleemitterpopcorn';
import RibbonEmitter from '../../parsers/mdlx/ribbonemitter';
import EventObject from '../../parsers/mdlx/eventobject';
import Camera from '../../parsers/mdlx/camera';
import CollisionShape from '../../parsers/mdlx/collisionshape';
import SanityTestData from './data';
import testTracks from './tracks';
import { SanityTestNode } from './data';

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

export function hasAnimation(object: AnimatedObject, name: string) {
  for (let animation of object.animations) {
    if (animation.name === name) {
      return true;
    }
  }

  return false;
}

export type MdlxType = Sequence | number | Texture | Material | Layer | TextureAnimation | Geoset | GeosetAnimation | Bone | Light | Helper | Attachment | ParticleEmitter | ParticleEmitter2 | ParticleEmitterPopcorn | RibbonEmitter | EventObject | Camera | CollisionShape | Animation;

export function getObjectTypeName(object: MdlxType) {
  if (object instanceof Sequence) {
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
  } else if (object instanceof Animation) {
    return <string>animatedTypeNames.get(object.name);
  } else {
    console.warn('Unknown object type', object);
    return 'Unknown';
  }
}

export function testObjects(data: SanityTestData, objects: MdlxType[], handler?: (data: SanityTestData, object: any, index: number) => void) {
  let l = objects.length;

  if (l) {
    let isAnimated = objects[0] instanceof AnimatedObject;
    let isGeneric = objects[0] instanceof GenericObject;

    for (let i = 0; i < l; i++) {
      let object = objects[i];

      data.push(object, i);

      if (handler) {
        handler(data, object, i);
      }

      if (isAnimated) {
        let asAnimated = <AnimatedObject>object;

        testObjects(data, asAnimated.animations, testAnimation);
      }

      if (isGeneric) {
        let asGeneric = <GenericObject>object;

        let objectId = asGeneric.objectId;
        let parentId = asGeneric.parentId;

        data.assertError(parentId === -1 || hasGenericObject(data, parentId), `Invalid parent ${parentId}`);
        data.assertError(objectId !== parentId, 'Same object and parent');
      }

      data.pop();
    }
  }
}

export function testReference(data: SanityTestData, objects: MdlxType[], index: number, typeNameIfError: string) {
  if (index >= 0 && index < objects.length) {
    data.addReference(objects[index]);

    return true;
  } else {
    data.addError(`Invalid ${typeNameIfError} ${index}`);

    return false;
  }
}

/**
 * Get all of the texture indices referenced by a layer.
 */
export function getTextureIds(layer: Layer) {
  for (let animation of layer.animations) {
    if (animation.name === 'KMTF') {
      return unique(animation.values.map((value) => value[0]));
    }
  }

  return [layer.textureId];
}

function testVertexSkinning(data: SanityTestData, vertex: number, bone: number, geoset: number) {
  let object = data.objects[bone];

  if (object) {
    if (!(object instanceof Bone)) {
      data.addSevere(`Vertex ${vertex}: Attached to "${object.name}" which is not a bone`);
    }
  } else {
    data.addError(`Vertex ${vertex}: Attached to object ${bone} which does not exist`);
  }
}

/**
 * Test geoset skinning.
 */
export function testGeosetSkinning(data: SanityTestData, geoset: Geoset, index: number) {
  if (data.model.version > 800 && geoset.skin.length) {
    data.assertWarning(geoset.vertexGroups.length === 0, 'This geoset has both skin/weights and vertex groups');

    let skin = geoset.skin;

    for (let i = 0, l = skin.length / 8; i < l; i++) {
      let offset = i * 8;
      let bone0 = skin[offset];
      let bone1 = skin[offset + 1];
      let bone2 = skin[offset + 2];
      let bone3 = skin[offset + 3];
      let weight0 = skin[offset + 4];
      let weight1 = skin[offset + 5];
      let weight2 = skin[offset + 6];
      let weight3 = skin[offset + 7];

      if (weight0 > 0) {
        testVertexSkinning(data, i, bone0, index);
      }

      if (weight1 > 0) {
        testVertexSkinning(data, i, bone1, index);
      }

      if (weight2 > 0) {
        testVertexSkinning(data, i, bone2, index);
      }

      if (weight3 > 0) {
        testVertexSkinning(data, i, bone3, index);
      }

      let weight = weight0 + weight1 + weight2 + weight3;

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
            testVertexSkinning(data, i, bone, index);
          }
        } else {
          let vertexGroup = vertexGroups[i];

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
function hasGenericObject(data: SanityTestData, id: number) {
  for (let object of data.objects) {
    if (object.objectId === id) {
      return true;
    }
  }

  return false;
}

export function testAnimation(data: SanityTestData, animation: Animation) {
  let name = animation.name;
  let interpolationType = animation.interpolationType;

  // Particle emitter 2 variation animations are not implemented in Magos for the MDX format.
  data.assertWarning(name !== 'KP2R', 'Using a variation animation.');

  // Particle emitter 2 gravity animations are not implemented in Magos for the MDX format.
  data.assertWarning(name !== 'KP2G', 'Using a gravity animation.');

  // The game seems to force visiblity (and others?) interpolation types to none.
  data.assertWarning(animatedTypeNames.get(name) !== 'Visibility' || interpolationType === 0, 'Interpolation type not set to None');

  testTracks(data, animation);
}

export function cleanNode(node: SanityTestNode) {
  let nodes = node.nodes;

  for (let i = nodes.length - 1; i >= 0; i--) {
    let child = nodes[i];

    if (child.type === 'node') {
      if (child.errors || child.severe || child.warnings || child.unused || !child.uses) {
        cleanNode(child);
      } else {
        nodes.splice(i, 1);
      }
    }
  }
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
