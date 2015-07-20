var defaultTransformations = {
    translation: [0, 0, 0],
    rotation: [0, 0, 0, 1],
    scaling: [1, 1, 1]
};

Mdx.Node = function (object, model) {
    this.name = object.name;
    this.objectId = object.objectId;
    this.parentId = object.parentId;
    this.billboarded = object.billboarded;
    this.modelSpace = object.modelSpace;
    this.xYQuad = object.xYQuad;
    this.sd = new Mdx.SDContainer(object.tracks, model);

    if (object.objectId === object.parentId) {
        this.parentId = -1;
    }
};

Mdx.Node.prototype = {
    getTranslation: function (sequence, frame, counter) {
        return this.sd.getKGTR(sequence, frame, counter, defaultTransformations.translation);
    },

    getRotation: function (sequence, frame, counter) {
        return this.sd.getKGRT(sequence, frame, counter, defaultTransformations.rotation);
    },

    getScale: function (sequence, frame, counter) {
        return this.sd.getKGSC(sequence, frame, counter, defaultTransformations.scaling);
    }  
};
