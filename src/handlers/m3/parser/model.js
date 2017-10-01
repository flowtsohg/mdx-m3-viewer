import M3ParserReference from "./reference";
import M3ParserBoundingSphere from "./boundingsphere";
import M3ParserBoundingShape from "./boundingshape";

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserModel(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {M3ParserReference} */
    this.modelName = new M3ParserReference(reader, index);
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {M3ParserReference} */
    this.sequences = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.stc = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.stg = new M3ParserReference(reader, index);
    /** @member {number} */
    this.unknown0 = reader.readFloat32();
    /** @member {number} */
    this.unknown1 = reader.readFloat32();
    /** @member {number} */
    this.unknown2 = reader.readFloat32();
    /** @member {number} */
    this.unknown3 = reader.readFloat32();
    /** @member {M3ParserReference} */
    this.sts = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.bones = new M3ParserReference(reader, index);
    /** @member {number} */
    this.numberOfBonesToCheckForSkin = reader.readUint32();
    /** @member {number} */
    this.vertexFlags = reader.readUint32();
    /** @member {M3ParserReference} */
    this.vertices = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.divisions = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.boneLookup = new M3ParserReference(reader, index);
    /** @member {M3ParserBoundingSphere} */
    this.boundings = new M3ParserBoundingSphere(reader);
    /** @member {?} */
    this.unknown4To20 = reader.readUint32Array(16);
    /** @member {M3ParserReference} */
    this.attachmentPoints = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.attachmentPointAddons = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.ligts = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.shbxData = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.cameras = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.unknown21 = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.materialReferences = new M3ParserReference(reader, index);

    /** @member {Array<M3ParserReference>} */
    this.materials = [
        new M3ParserReference(reader, index), // Standard
        new M3ParserReference(reader, index), // Displacement
        new M3ParserReference(reader, index), // Composite
        new M3ParserReference(reader, index), // Terrain
        new M3ParserReference(reader, index), // Volume
        new M3ParserReference(reader, index), // ?
        new M3ParserReference(reader, index)  // Creep
    ];

    if (version > 24) {
        this.materials.push(new M3ParserReference(reader, index)); // Volume noise
    }

    if (version > 25) {
        this.materials.push(new M3ParserReference(reader, index)); // Splat terrain bake
    }

    if (version > 27) {
        this.materials.push(new M3ParserReference(reader, index)); // ?
    }

    if (version > 28) {
        this.materials.push(new M3ParserReference(reader, index)); // Lens flare
    }

    /** @member {M3ParserReference} */
    this.particleEmitters = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.particleEmitterCopies = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.ribbonEmitters = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.projections = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.forces = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.warps = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.unknown22 = new M3ParserReference(reader, index); // ?
    /** @member {M3ParserReference} */
    this.rigidBodies = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.unknown23 = new M3ParserReference(reader, index); // ?
    /** @member {M3ParserReference} */
    this.physicsJoints = new M3ParserReference(reader, index);

    if (version > 27) {
        /** @member {?M3ParserReference} */
        this.clothBehavior = new M3ParserReference(reader, index);
    }

    /** @member {M3ParserReference} */
    this.unknown24 = new M3ParserReference(reader, index); // ?
    /** @member {M3ParserReference} */
    this.ikjtData = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.unknown25 = new M3ParserReference(reader, index); // ?

    if (version > 24) {
        /** @member {?M3ParserReference} */
        this.unknown26 = new M3ParserReference(reader, index); // ?
    }

    /** @member {M3ParserReference} */
    this.partsOfTurrentBehaviors = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.turrentBehaviors = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.absoluteInverseBoneRestPositions = new M3ParserReference(reader, index);
    /** @member {M3ParserBoundingShape} */
    this.tightHitTest = new M3ParserBoundingShape(reader);
    /** @member {M3ParserReference} */
    this.fuzzyHitTestObjects = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.attachmentVolumes = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.attachmentVolumesAddon0 = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.attachmentVolumesAddon1 = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.billboardBehaviors = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.tmdData = new M3ParserReference(reader, index);
    /** @member {number} */
    this.unknown27 = reader.readUint32(); // ?
    /** @member {M3ParserReference} */
    this.unknown28 = new M3ParserReference(reader, index); // ?
}

export default M3ParserModel;
