import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import BoundingSphere from './boundingsphere';
import BoundingShape from './boundingshape';

/**
 * The model information structure.
 */
export default class ModelHeader {
  version: number = -1;
  modelName: Reference = new Reference();
  flags: number = 0;
  sequences: Reference = new Reference();
  stc: Reference = new Reference();
  stg: Reference = new Reference();
  unknown0: number = 0;
  unknown1: number = 0;
  unknown2: number = 0;
  unknown3: number = 0;
  sts: Reference = new Reference();
  bones: Reference = new Reference();
  numberOfBonesToCheckForSkin: number = 0;
  vertexFlags: number = 0;
  vertices: Reference = new Reference();
  divisions: Reference = new Reference();
  boneLookup: Reference = new Reference();
  boundings: BoundingSphere = new BoundingSphere();
  unknown4To20: Uint32Array = new Uint32Array(16);
  attachmentPoints: Reference = new Reference();
  attachmentPointAddons: Reference = new Reference();
  ligts: Reference = new Reference();
  shbxData: Reference = new Reference();
  cameras: Reference = new Reference();
  unknown21: Reference = new Reference();
  materialReferences: Reference = new Reference();
  materials: Reference[] = [];
  particleEmitters: Reference = new Reference();
  particleEmitterCopies: Reference = new Reference();
  ribbonEmitters: Reference = new Reference();
  projections: Reference = new Reference();
  forces: Reference = new Reference();
  warps: Reference = new Reference();
  unknown22: Reference = new Reference();
  rigidBodies: Reference = new Reference();
  unknown23: Reference = new Reference();
  physicsJoints: Reference = new Reference();
  clothBehavior: Reference = new Reference();
  unknown24: Reference = new Reference();
  ikjtData: Reference = new Reference();
  unknown25: Reference = new Reference();
  unknown26: Reference = new Reference();
  partsOfTurrentBehaviors: Reference = new Reference();
  turrentBehaviors: Reference = new Reference();
  absoluteInverseBoneRestPositions: Reference = new Reference();
  tightHitTest: BoundingShape = new BoundingShape();
  fuzzyHitTestObjects: Reference = new Reference();
  attachmentVolumes: Reference = new Reference();
  attachmentVolumesAddon0: Reference = new Reference();
  attachmentVolumesAddon1: Reference = new Reference();
  billboardBehaviors: Reference = new Reference();
  tmdData: Reference = new Reference();
  unknown27: number = 0;
  unknown28: Reference = new Reference();

  constructor() {
    for (let i = 0; i < 11; i++) {
      this.materials[i] = new Reference();
    }
  }

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.modelName.load(stream, index);
    this.flags = stream.readUint32();
    this.sequences.load(stream, index);
    this.stc.load(stream, index);
    this.stg.load(stream, index);
    this.unknown0 = stream.readFloat32();
    this.unknown1 = stream.readFloat32();
    this.unknown2 = stream.readFloat32();
    this.unknown3 = stream.readFloat32();
    this.sts.load(stream, index);
    this.bones.load(stream, index);
    this.numberOfBonesToCheckForSkin = stream.readUint32();
    this.vertexFlags = stream.readUint32();
    this.vertices.load(stream, index);
    this.divisions.load(stream, index);
    this.boneLookup.load(stream, index);
    this.boundings.load(stream);
    stream.readUint32Array(this.unknown4To20);
    this.attachmentPoints.load(stream, index);
    this.attachmentPointAddons.load(stream, index);
    this.ligts.load(stream, index);
    this.shbxData.load(stream, index);
    this.cameras.load(stream, index);
    this.unknown21.load(stream, index);
    this.materialReferences.load(stream, index);

    for (let i = 0; i < 7; i++) {
      this.materials[i].load(stream, index); // Standard, Displacement, Composite, Terrain, Volume, ?, Creep
    }

    if (version > 24) {
      this.materials[7].load(stream, index); // Volume noise
    }

    if (version > 25) {
      this.materials[8].load(stream, index); // Splat terrain bake
    }

    if (version > 27) {
      this.materials[9].load(stream, index); // ?
    }

    if (version > 28) {
      this.materials[10].load(stream, index); // Lens flare
    }

    this.particleEmitters.load(stream, index);
    this.particleEmitterCopies.load(stream, index);
    this.ribbonEmitters.load(stream, index);
    this.projections.load(stream, index);
    this.forces.load(stream, index);
    this.warps.load(stream, index);
    this.unknown22.load(stream, index); // ?
    this.rigidBodies.load(stream, index);
    this.unknown23.load(stream, index); // ?
    this.physicsJoints.load(stream, index);

    if (version > 27) {
      this.clothBehavior.load(stream, index);
    }

    this.unknown24.load(stream, index); // ?
    this.ikjtData.load(stream, index);
    this.unknown25.load(stream, index); // ?

    if (version > 24) {
      this.unknown26.load(stream, index); // ?
    }

    this.partsOfTurrentBehaviors.load(stream, index);
    this.turrentBehaviors.load(stream, index);
    this.absoluteInverseBoneRestPositions.load(stream, index);
    this.tightHitTest.load(stream);
    this.fuzzyHitTestObjects.load(stream, index);
    this.attachmentVolumes.load(stream, index);
    this.attachmentVolumesAddon0.load(stream, index);
    this.attachmentVolumesAddon1.load(stream, index);
    this.billboardBehaviors.load(stream, index);
    this.tmdData.load(stream, index);
    this.unknown27 = stream.readUint32(); // ?
    this.unknown28.load(stream, index); // ?
  }
}
