import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import BoundingSphere from './boundingsphere';
import BoundingShape from './boundingshape';

/**
 * The model information structure.
 */
export default class M3ParserModel {
  version: number;
  modelName: Reference;
  flags: number;
  sequences: Reference;
  stc: Reference;
  stg: Reference;
  unknown0: number;
  unknown1: number;
  unknown2: number;
  unknown3: number;
  sts: Reference;
  bones: Reference;
  numberOfBonesToCheckForSkin: number;
  vertexFlags: number;
  vertices: Reference;
  divisions: Reference;
  boneLookup: Reference;
  boundings: BoundingSphere;
  unknown4To20: Uint32Array;
  attachmentPoints: Reference;
  attachmentPointAddons: Reference;
  ligts: Reference;
  shbxData: Reference;
  cameras: Reference;
  unknown21: Reference;
  materialReferences: Reference;
  materials: Reference[];
  particleEmitters: Reference;
  particleEmitterCopies: Reference;
  ribbonEmitters: Reference;
  projections: Reference;
  forces: Reference;
  warps: Reference;
  unknown22: Reference;
  rigidBodies: Reference;
  unknown23: Reference;
  physicsJoints: Reference;
  clothBehavior: Reference | null = null;
  unknown24: Reference;
  ikjtData: Reference;
  unknown25: Reference;
  unknown26: Reference | null = null;
  partsOfTurrentBehaviors: Reference;
  turrentBehaviors: Reference;
  absoluteInverseBoneRestPositions: Reference;
  tightHitTest: BoundingShape;
  fuzzyHitTestObjects: Reference;
  attachmentVolumes: Reference;
  attachmentVolumesAddon0: Reference;
  attachmentVolumesAddon1: Reference;
  billboardBehaviors: Reference;
  tmdData: Reference;
  unknown27: number;
  unknown28: Reference;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.modelName = new Reference(reader, index);
    this.flags = reader.readUint32();
    this.sequences = new Reference(reader, index);
    this.stc = new Reference(reader, index);
    this.stg = new Reference(reader, index);
    this.unknown0 = reader.readFloat32();
    this.unknown1 = reader.readFloat32();
    this.unknown2 = reader.readFloat32();
    this.unknown3 = reader.readFloat32();
    this.sts = new Reference(reader, index);
    this.bones = new Reference(reader, index);
    this.numberOfBonesToCheckForSkin = reader.readUint32();
    this.vertexFlags = reader.readUint32();
    this.vertices = new Reference(reader, index);
    this.divisions = new Reference(reader, index);
    this.boneLookup = new Reference(reader, index);
    this.boundings = new BoundingSphere(reader);
    this.unknown4To20 = reader.readUint32Array(16);
    this.attachmentPoints = new Reference(reader, index);
    this.attachmentPointAddons = new Reference(reader, index);
    this.ligts = new Reference(reader, index);
    this.shbxData = new Reference(reader, index);
    this.cameras = new Reference(reader, index);
    this.unknown21 = new Reference(reader, index);
    this.materialReferences = new Reference(reader, index);

    this.materials = [
      new Reference(reader, index), // Standard
      new Reference(reader, index), // Displacement
      new Reference(reader, index), // Composite
      new Reference(reader, index), // Terrain
      new Reference(reader, index), // Volume
      new Reference(reader, index), // ?
      new Reference(reader, index), // Creep
    ];

    if (version > 24) {
      this.materials.push(new Reference(reader, index)); // Volume noise
    }

    if (version > 25) {
      this.materials.push(new Reference(reader, index)); // Splat terrain bake
    }

    if (version > 27) {
      this.materials.push(new Reference(reader, index)); // ?
    }

    if (version > 28) {
      this.materials.push(new Reference(reader, index)); // Lens flare
    }

    this.particleEmitters = new Reference(reader, index);
    this.particleEmitterCopies = new Reference(reader, index);
    this.ribbonEmitters = new Reference(reader, index);
    this.projections = new Reference(reader, index);
    this.forces = new Reference(reader, index);
    this.warps = new Reference(reader, index);
    this.unknown22 = new Reference(reader, index); // ?
    this.rigidBodies = new Reference(reader, index);
    this.unknown23 = new Reference(reader, index); // ?
    this.physicsJoints = new Reference(reader, index);

    if (version > 27) {
      this.clothBehavior = new Reference(reader, index);
    }

    this.unknown24 = new Reference(reader, index); // ?
    this.ikjtData = new Reference(reader, index);
    this.unknown25 = new Reference(reader, index); // ?

    if (version > 24) {
      this.unknown26 = new Reference(reader, index); // ?
    }

    this.partsOfTurrentBehaviors = new Reference(reader, index);
    this.turrentBehaviors = new Reference(reader, index);
    this.absoluteInverseBoneRestPositions = new Reference(reader, index);
    this.tightHitTest = new BoundingShape(reader);
    this.fuzzyHitTestObjects = new Reference(reader, index);
    this.attachmentVolumes = new Reference(reader, index);
    this.attachmentVolumesAddon0 = new Reference(reader, index);
    this.attachmentVolumesAddon1 = new Reference(reader, index);
    this.billboardBehaviors = new Reference(reader, index);
    this.tmdData = new Reference(reader, index);
    this.unknown27 = reader.readUint32(); // ?
    this.unknown28 = new Reference(reader, index); // ?
  }
}
