import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import BoundingSphere from './boundingsphere';
import BoundingShape from './boundingshape';

/**
 * The model information structure.
 */
export default class ModelHeader {
  version = -1;
  modelName = new Reference();
  flags = 0;
  sequences = new Reference();
  stc = new Reference();
  stg = new Reference();
  unknown0 = 0;
  unknown1 = 0;
  unknown2 = 0;
  unknown3 = 0;
  sts = new Reference();
  bones = new Reference();
  numberOfBonesToCheckForSkin = 0;
  vertexFlags = 0;
  vertices = new Reference();
  divisions = new Reference();
  boneLookup = new Reference();
  boundings = new BoundingSphere();
  unknown4To20 = new Uint32Array(16);
  attachmentPoints = new Reference();
  attachmentPointAddons = new Reference();
  ligts = new Reference();
  shbxData = new Reference();
  cameras = new Reference();
  unknown21 = new Reference();
  materialReferences = new Reference();
  materials: Reference[] = [];
  particleEmitters = new Reference();
  particleEmitterCopies = new Reference();
  ribbonEmitters = new Reference();
  projections = new Reference();
  forces = new Reference();
  warps = new Reference();
  unknown22 = new Reference();
  rigidBodies = new Reference();
  unknown23 = new Reference();
  physicsJoints = new Reference();
  clothBehavior = new Reference();
  unknown24 = new Reference();
  ikjtData = new Reference();
  unknown25 = new Reference();
  unknown26 = new Reference();
  partsOfTurrentBehaviors = new Reference();
  turrentBehaviors = new Reference();
  absoluteInverseBoneRestPositions = new Reference();
  tightHitTest = new BoundingShape();
  fuzzyHitTestObjects = new Reference();
  attachmentVolumes = new Reference();
  attachmentVolumesAddon0 = new Reference();
  attachmentVolumesAddon1 = new Reference();
  billboardBehaviors = new Reference();
  tmdData = new Reference();
  unknown27 = 0;
  unknown28 = new Reference();

  constructor() {
    for (let i = 0; i < 11; i++) {
      this.materials[i] = new Reference();
    }
  }

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
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
