/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserModel(reader, version, index) {
    this.version = version;
    this.modelName = new M3ParserReference(reader, index);
    this.flags = reader.readUint32();
    this.sequences = new M3ParserReference(reader, index);
    this.stc = new M3ParserReference(reader, index);
    this.stg = new M3ParserReference(reader, index);
    this.unknown0 = reader.readFloat32();
    this.unknown1 = reader.readFloat32();
    this.unknown2 = reader.readFloat32();
    this.unknown3 = reader.readFloat32();
    this.sts = new M3ParserReference(reader, index);
    this.bones = new M3ParserReference(reader, index);
    this.numberOfBonesToCheckForSkin = reader.readUint32();
    this.vertexFlags = reader.readUint32();
    this.vertices = new M3ParserReference(reader, index);
    this.divisions = new M3ParserReference(reader, index);
    this.boneLookup = new M3ParserReference(reader, index);
    this.boundings = new M3ParserBoundingSphere(reader);
    this.unknown4To20 = reader.readUint32Array(16);
    this.attachmentPoints = new M3ParserReference(reader, index);
    this.attachmentPointAddons = new M3ParserReference(reader, index);
    this.ligts = new M3ParserReference(reader, index);
    this.shbxData = new M3ParserReference(reader, index);
    this.cameras = new M3ParserReference(reader, index);
    this.unknown21 = new M3ParserReference(reader, index);
    this.materialReferences = new M3ParserReference(reader, index);

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

    this.particleEmitters = new M3ParserReference(reader, index);
    this.particleEmitterCopies = new M3ParserReference(reader, index);
    this.ribbonEmitters = new M3ParserReference(reader, index);
    this.projections = new M3ParserReference(reader, index);
    this.forces = new M3ParserReference(reader, index);
    this.warps = new M3ParserReference(reader, index);
    this.unknown22 = new M3ParserReference(reader, index); // ?
    this.rigidBodies = new M3ParserReference(reader, index);
    this.unknown23 = new M3ParserReference(reader, index); // ?
    this.physicsJoints = new M3ParserReference(reader, index);

    if (version > 27) {
        this.clothBehavior = new M3ParserReference(reader, index);
    }

    this.unknown24 = new M3ParserReference(reader, index); // ?
    this.ikjtData = new M3ParserReference(reader, index);
    this.unknown25 = new M3ParserReference(reader, index); // ?

    if (version > 24) {
        this.unknown26 = new M3ParserReference(reader, index); // ?
    }

    this.partsOfTurrentBehaviors = new M3ParserReference(reader, index);
    this.turrentBehaviors = new M3ParserReference(reader, index);
    this.absoluteInverseBoneRestPositions = new M3ParserReference(reader, index);
    this.tightHitTest = new M3ParserBoundingShape(reader);
    this.fuzzyHitTestObjects = new M3ParserReference(reader, index);
    this.attachmentVolumes = new M3ParserReference(reader, index);
    this.attachmentVolumesAddon0 = new M3ParserReference(reader, index);
    this.attachmentVolumesAddon1 = new M3ParserReference(reader, index);
    this.billboardBehaviors = new M3ParserReference(reader, index);
    this.tmdData = new M3ParserReference(reader, index);
    this.unknown27 = reader.readUint32(); // ?
    this.unknown28 = new M3ParserReference(reader, index); // ?
}
