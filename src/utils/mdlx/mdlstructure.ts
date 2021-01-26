import Attachment from '../../parsers/mdlx/attachment';
import Bone from '../../parsers/mdlx/bone';
import Camera from '../../parsers/mdlx/camera';
import CollisionShape from '../../parsers/mdlx/collisionshape';
import FaceEffect from '../../parsers/mdlx/faceeffect';
import Geoset from '../../parsers/mdlx/geoset';
import GeosetAnimation from '../../parsers/mdlx/geosetanimation';
import Helper from '../../parsers/mdlx/helper';
import Layer from '../../parsers/mdlx/layer';
import Light from '../../parsers/mdlx/light';
import Model from '../../parsers/mdlx/model';
import ParticleEmitter from '../../parsers/mdlx/particleemitter';
import ParticleEmitter2 from '../../parsers/mdlx/particleemitter2';
import ParticleEmitterPopcorn from '../../parsers/mdlx/particleemitterpopcorn';
import RibbonEmitter from '../../parsers/mdlx/ribbonemitter';
import Sequence from '../../parsers/mdlx/sequence';
import Texture from '../../parsers/mdlx/texture';
import TextureAnimation from '../../parsers/mdlx/textureanimation';
import TokenStream from '../../parsers/mdlx/tokenstream';
import { getObjectName, getObjectTypeName } from './sanitytest/utils';

interface MdlStructureNode {
  name: string;
  source: string;
  nodes?: MdlStructureNode[];
}

function mdlObjects(stream: TokenStream, model: Model, objects: (Sequence | Layer | Texture | TextureAnimation | Geoset | GeosetAnimation | Bone | Light | Helper | Attachment | ParticleEmitter | ParticleEmitter2 | ParticleEmitterPopcorn | RibbonEmitter | Camera | CollisionShape | FaceEffect)[], out: MdlStructureNode[]) {
  if (objects.length) {
    for (let [index, object] of objects.entries()) {
      object.writeMdl(stream, model.version);
      out.push({ name: getObjectName(object, index), source: stream.buffer });
      stream.clear();
    }
  }
}

function mdlObjectsBlock(stream: TokenStream, model: Model, objects: (Sequence | Texture | TextureAnimation)[], out: MdlStructureNode[]) {
  if (objects.length) {
    let name = getObjectTypeName(objects[0]) + 's';
    let nodes = <MdlStructureNode[]>[];

    mdlObjects(stream, model, objects, nodes);

    model.saveStaticObjectsBlock(stream, name, objects);
    out.push({ name, source: stream.buffer, nodes });
    stream.clear();
  }
}

export default function mdlStructure(model: Model) {
  let stream = new TokenStream();
  let out = <MdlStructureNode[]>[];

  model.saveVersionBlock(stream);
  out.push({ name: 'Version', source: stream.buffer });
  stream.clear();

  model.saveModelBlock(stream);
  out.push({ name: 'Model', source: stream.buffer });
  stream.clear();

  mdlObjectsBlock(stream, model, model.sequences, out);

  if (model.globalSequences.length) {
    model.saveGlobalSequenceBlock(stream);
    out.push({ name: 'GlobalSequences', source: stream.buffer });
    stream.clear();
  }

  mdlObjectsBlock(stream, model, model.textures, out);

  if (model.materials.length) {
    let nodes = [];

    for (let [index, material] of model.materials.entries()) {
      let layerNodes = <MdlStructureNode[]>[];

      mdlObjects(stream, model, material.layers, layerNodes);

      material.writeMdl(stream, model.version);
      nodes.push({ name: `Material ${index + 1}`, source: stream.buffer, nodes: layerNodes });
      stream.clear();
    }

    model.saveStaticObjectsBlock(stream, 'Materials', model.materials);
    out.push({ name: 'Materials', source: stream.buffer, nodes });
    stream.clear();
  }

  mdlObjectsBlock(stream, model, model.textureAnimations, out);
  mdlObjects(stream, model, model.geosets, out);
  mdlObjects(stream, model, model.geosetAnimations, out);
  mdlObjects(stream, model, model.bones, out);
  mdlObjects(stream, model, model.lights, out);
  mdlObjects(stream, model, model.helpers, out);
  mdlObjects(stream, model, model.attachments, out);

  if (model.pivotPoints.length) {
    model.savePivotPointBlock(stream);
    out.push({ name: 'PivotPoints', source: stream.buffer });
    stream.clear();
  }

  mdlObjects(stream, model, model.particleEmitters, out);
  mdlObjects(stream, model, model.particleEmitters2, out);
  mdlObjects(stream, model, model.particleEmittersPopcorn, out);
  mdlObjects(stream, model, model.ribbonEmitters, out);
  mdlObjects(stream, model, model.cameras, out);
  mdlObjects(stream, model, model.collisionShapes, out);
  mdlObjects(stream, model, model.faceEffects, out);

  if (model.bindPose.length) {
    model.saveBindPoseBlock(stream);
    out.push({ name: 'BindPose', source: stream.buffer });
    stream.clear();
  }

  return { nodes: out };
}
