/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserLayer} layer
 * @param {number} layerId
 * @param {number} priorityPlane
 */
function MdxLayer(model, layer, layerId, priorityPlane) {
    let filterMode = Math.min(layer.filterMode, 6),
        textureAnimationId = layer.textureAnimationId,
        gl = model.gl;

    this.gl = gl;
    this.index = layerId;
    this.priorityPlane = priorityPlane;
    this.filterMode = filterMode;
    this.textureId = layer.textureId;
    this.coordId = layer.coordId;
    this.alpha = layer.alpha;
    this.renderOrder = MdxLayer.filterModeToRenderOrder[filterMode];
    this.sd = new MdxSdContainer(model, layer.tracks);

    var flags = layer.flags;

    this.unshaded = flags & 0x1;
    this.sphereEnvironmentMap = flags & 0x2;
    this.twoSided = flags & 0x10;
    this.unfogged = flags & 0x20;
    this.noDepthTest = flags & 0x40;
    this.noDepthSet = flags & 0x80;

    if (textureAnimationId !== -1) {
        let textureAnimation = model.textureAnimations[textureAnimationId];

        if (textureAnimation) {
            this.textureAnimation = textureAnimation;
        }
    }

    this.depthMaskValue = (filterMode === 0 || filterMode === 1) ? 1 : 0;
    this.alphaTestValue = (filterMode === 1) ? 1 : 0;

    let blended = (filterMode > 1) ? true : false;

    if (blended) {
        let blendSrc,
            blendDst;

        switch (filterMode) {
            case 2:
                blendSrc = gl.SRC_ALPHA;
                blendDst = gl.ONE_MINUS_SRC_ALPHA;
                break;
            case 3:
                blendSrc = gl.ONE;
                blendDst = gl.ONE;
                break;
            case 4:
                blendSrc = gl.SRC_ALPHA;
                blendDst = gl.ONE;
                break;
            case 5:
                blendSrc = gl.ZERO;
                blendDst = gl.SRC_COLOR;
                break;
            case 6:
                blendSrc = gl.DST_COLOR;
                blendDst = gl.SRC_COLOR;
                break;
        }

        this.blendSrc = blendSrc;
        this.blendDst = blendDst;
    }

    this.blended = blended;
    

    this.uvDivisor = new Float32Array([1, 1]);
    this.isTextureAnim = false;
}

MdxLayer.filterModeToRenderOrder = {
    0: 0, // Opaque
    1: 1, // 1bit Alpha
    2: 2, // 8bit Alpha
    3: 3, // Additive
    4: 3, // Add Alpha (according to Magos)
    5: 3, // Modulate
    6: 3  // Modulate 2X
};

MdxLayer.prototype = {
    bind(shader) {
        const gl = this.gl;

        gl.uniform1f(shader.uniforms.get("u_alphaTest"), this.alphaTestValue);

        if (this.blended) {
            gl.enable(gl.BLEND);
            gl.blendFunc(this.blendSrc, this.blendDst);
        } else {
            gl.disable(gl.BLEND);
        }

        if (this.twoSided) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
        }

        if (this.noDepthTest) {
            gl.disable(gl.DEPTH_TEST);
        } else {
            gl.enable(gl.DEPTH_TEST);
        }

        if (this.noDepthSet) {
            gl.depthMask(0);
        } else {
            gl.depthMask(this.depthMaskValue);
        }
    },

    setAtlas(atlas) {
        this.textureId = atlas.textureId;
        this.uvDivisor.set([atlas.columns, atlas.rows]);
        this.isTextureAnim = true;
    },

    getAllTextureIds() {
        var kmtf = this.sd.KMTF;

        if (kmtf) {
            var values = kmtf.getValues();

            // Remove duplicate elements but keep the unique ones in order
            return values.unique();
        } else {
            return [this.textureId];
        }
    },

    getAlpha(instance) {
        return this.sd.getValue("KMTA", instance, this.alpha);
    },

    isAlphaVariant(sequence) {
        return this.sd.isVariant("KMTA", sequence);
    },

    getTextureId(instance) {
        return this.sd.getValue("KMTF", instance, this.textureId);
    }
};
