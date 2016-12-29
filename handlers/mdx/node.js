function MdxNode(object, model, pivots) {
    var pivot = pivots[object.objectId];

    this.name = object.name;
    this.objectId = object.objectId;
    this.parentId = object.parentId;
    this.pivot = pivot ? pivot.value : [0, 0, 0];
    this.dontInheritTranslation = object.dontInheritTranslation;
    this.dontInheritRotation = object.dontInheritRotation;
    this.dontInheritScaling = object.dontInheritScaling;
    this.billboarded = object.billboarded;
    this.billboardedX = object.billboardedX;
    this.billboardedY = object.billboardedY;
    this.billboardedZ = object.billboardedZ;
    this.modelSpace = object.modelSpace;
    this.xYQuad = object.xYQuad;
    this.sd = new MdxSdContainer(object.tracks, model);

    if (object.objectId === object.parentId) {
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
