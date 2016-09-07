function MdxNode(object, model, pivots) {
    var pivot = pivots[object.objectId];

    this.name = object.name;
    this.objectId = object.objectId;
    this.parentId = object.parentId;
    this.pivot = pivot ? pivot.value : [0, 0, 0];
    this.billboarded = object.billboarded;
    this.modelSpace = object.modelSpace;
    this.xYQuad = object.xYQuad;
    this.sd = new MdxSdContainer(object.tracks, model);

    if (object.objectId === object.parentId) {
        this.parentId = -1;
    }
}

MdxNode.prototype = {
    getTranslation(instance) {
        return this.sd.getKGTRValue(instance, vec3.ZERO);
    },

    getRotation(instance) {
        return this.sd.getKGRTValue(instance, quat.DEFAULT);
    },

    getScale(instance) {
        return this.sd.getKGSCValue(instance, vec3.ONE);
    },

    isVariant(sequence) {
        var sd = this.sd;

        return sd.isKGTRVariant(sequence) || sd.isKGRTVariant(sequence) || sd.isKGSCVariant(sequence);
    }
};
