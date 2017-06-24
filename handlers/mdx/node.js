/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserNode} node
 * @param {Array<MdxParserPivot>} pivots
 */
function MdxNode(model, node, pivots) {
    let pivot = pivots[node.objectId],
        flags = node.flags;

    this.name = node.name;
    this.objectId = node.objectId;
    this.parentId = node.parentId;
    this.pivot = pivot ? pivot.value : vec3.create();
    this.sd = new MdxSdContainer(model, node.tracks);

    this.dontInheritTranslation = flags & 0x1;
    this.dontInheritRotation = flags & 0x2;
    this.dontInheritScaling = flags & 0x4;
    this.billboarded = flags & 0x8;
    this.billboardedX = flags & 0x10;
    this.billboardedY = flags & 0x20;
    this.billboardedZ = flags & 0x40;
    this.cameraAnchored = flags & 0x80;
    this.bone = flags & 0x100;
    this.light = flags & 0x200;
    this.eventObject = flags & 0x400;
    this.attachment = flags & 0x800;
    this.particleEmitter = flags & 0x1000;
    this.collisionShape = flags & 0x2000;
    this.ribbonEmitter = flags & 0x4000;
    this.emitterUsesMdlOrUnshaded = flags & 0x8000;
    this.emitterUsesTgaOrSortPrimitivesFarZ = flags & 0x10000;
    this.lineEmitter = flags & 0x20000;
    this.unfogged = flags & 0x40000;
    this.modelSpace = flags & 0x80000;
    this.xYQuad = flags & 0x100000;

    if (node.objectId === node.parentId) {
        this.parentId = -1;
    }
}

MdxNode.prototype = {
    getTranslation(instance) {
        return this.sd.getValue("KGTR", instance, vec3.ZERO);
    },

    getRotation(instance) {
        return this.sd.getValue("KGRT", instance, quat.DEFAULT);
    },

    getScale(instance) {
        return this.sd.getValue("KGSC", instance, vec3.ONE);
    },

    isVariant(sequence) {
        let sd = this.sd;

        return sd.isVariant("KGTR", sequence) || sd.isVariant("KGRT", sequence) || sd.isVariant("KGSC", sequence);
    }
};
