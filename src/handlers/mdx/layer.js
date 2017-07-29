import { hashFromString, createTextureAtlas } from "../../common";
import MdxSdContainer from "./sd";

/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserLayer} layer
 * @param {number} layerId
 * @param {number} priorityPlane
 */
function MdxLayer(model, layer, layerId, priorityPlane) {
    let filterMode = layer.filterMode,
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

    this.hasAnim = false;
    this.hasUvAnim = false;
    this.hasSlotAnim = false;

    if (textureAnimationId !== -1) {
        let textureAnimation = model.textureAnimations[textureAnimationId];

        if (textureAnimation) {
            this.textureAnimation = textureAnimation;

            this.hasAnim = true;
            this.hasUvAnim = true;
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

    this.setupVaryingTextures(model);
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
        let gl = this.gl;

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

    setupVaryingTextures(model) {
        // Get all unique texture IDs used by this layer
        var textureIds = this.sd.getValues("KMTF").unique();

        if (textureIds.length > 1) {
            let env = model.env,
                hash = hashFromString(textureIds.join("")),
                textures = [];

            this.hasAnim = true;

            // Grab all of the textures
            for (let i = 0, l = textureIds.length; i < l; i++) {
                textures[i] = model.textures[textureIds[i]];
            }

            // Promise that there is a future load that the code cannot know about yet, so Viewer.whenAllLoaded() isn't called prematurely.
            let promise = env.makePromise();

            // When all of the textures are loaded, it's time to construct a texture atlas
            env.whenLoaded(textures, () => {
                let textureAtlases = model.textureAtlases;

                // Cache atlases
                if (!textureAtlases[hash]) {
                    let images = [];

                    // Grab all the ImageData objects from the loaded textures
                    for (let i = 0, l = textures.length; i < l; i++) {
                        images[i] = textures[i].imageData;
                    }

                    // Finally create the atlas
                    let atlasData = createTextureAtlas(images);

                    let texture = env.load(atlasData.texture);

                    textureAtlases[hash] = { textureId: model.textures.length, columns: atlasData.columns, rows: atlasData.rows, texture };
                    
                    model.textures.push(texture);
                }

                // Tell the layer to use this texture atlas, instead of its original texture
                let atlas = textureAtlases[hash];

                this.textureId = atlas.textureId;
                this.uvDivisor.set([atlas.columns, atlas.rows]);
                this.hasSlotAnim = true;

                // Resolve the promise.
                promise.resolve();
            });
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
        // TODO: map the returned slot to a texture atlas slot if one exists.
    }
};

export default MdxLayer;
