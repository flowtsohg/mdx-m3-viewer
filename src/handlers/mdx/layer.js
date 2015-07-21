Mdx.ShallowLayer = function (layer, geoset) {
    this.layer = layer;
    this.geoset = geoset;
};

var filterModeToRenderOrder = {
    0: 0, // Opaque
    1: 1, // 1bit Alpha
    2: 2, // 8bit Alpha
    3: 3, // Additive
    4: 3, // Add Alpha (according to Magos)
    5: 3, // Modulate
    6: 3  // Modulate 2X
};

Mdx.Layer = function (layer, index, model) {
    var filterMode = Math.min(layer.filterMode, 6);
    
    this.index = index;
    this.filterMode = filterMode;
    this.twoSided = layer.twoSided;
    this.noDepthTest = layer.noDepthTest;
    this.noDepthSet = layer.noDepthSet;
    this.textureId = layer.textureId;
    this.textureAnimationId = layer.textureAnimationId;
    this.coordId = layer.coordId;
    this.alpha = layer.alpha;
    this.renderOrder = filterModeToRenderOrder[filterMode];
    this.sd = new Mdx.SDContainer(layer.tracks, model);
};

Mdx.Layer.prototype = {
    getAlpha: function (sequence, frame, counter) {
        return this.sd.getKMTA(sequence, frame, counter, this.alpha);
    },

    getTextureId: function (sequence, frame, counter) {
        return this.sd.getKMTF(sequence, frame, counter, this.textureId);
    }
};
