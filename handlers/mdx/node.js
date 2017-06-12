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
    this.pivot = pivot ? pivot.value : [0, 0, 0];
    this.sd = new MdxSdContainer(model, node.tracks);

    this.dontInheritTranslation = flags & 1;
    this.dontInheritRotation = flags & 2;
    this.dontInheritScaling = flags & 4;
    this.billboarded = flags & 8;
    this.billboardedX = flags & 16;
    this.billboardedY = flags & 32;
    this.billboardedZ = flags & 64;
    this.cameraAnchored = flags & 128;
    this.bone = flags & 256;
    this.light = flags & 512;
    this.eventObject = flags & 1024;
    this.attachment = flags & 2048;
    this.particleEmitter = flags & 4096;
    this.collisionShape = flags & 8192;
    this.ribbonEmitter = flags & 16384;
    this.emitterUsesMdlOrUnshaded = flags & 32768;
    this.emitterUsesTgaOrSortPrimitivesFarZ = flags & 65536;
    this.lineEmitter = flags & 131072;
    this.unfogged = flags & 262144;
    this.modelSpace = flags & 524288;
    this.xYQuad = flags & 1048576;

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
        var sd = this.sd;

        return sd.isVariant("KGTR", sequence) || sd.isVariant("KGRT", sequence) || sd.isVariant("KGSC", sequence);
    }
};
