import { VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT } from '../../../common/gl-matrix-addon';
import stringHash from '../../../common/stringhash';
import unique from '../../../common/arrayunique';
import AnimatedObject from './animatedobject';
import { layerFilterMode } from './filtermode';

export default class Layer extends AnimatedObject {
    /**
     * @param {ModelViewer.viewer.mdx.Model} model
     * @param {ModelViewer.parser.mdlx.Layer} layer
     * @param {number} priorityPlane
     */
    constructor(model, layer, layerId, priorityPlane) {
        let filterMode = layer.filterMode,
            textureAnimationId = layer.textureAnimationId,
            gl = model.viewer.gl;

        super(model, layer);

        this.index = layerId;
        this.priorityPlane = priorityPlane;
        this.filterMode = filterMode;
        this.textureId = layer.textureId;
        this.coordId = layer.coordId;
        this.alpha = layer.alpha;

        var flags = layer.flags;

        this.unshaded = flags & 0x1;
        this.sphereEnvironmentMap = flags & 0x2;
        this.twoSided = flags & 0x10;
        this.unfogged = flags & 0x20;
        this.noDepthTest = flags & 0x40;
        this.noDepthSet = flags & 0x80;

        this.depthMaskValue = (filterMode === 0 || filterMode === 1) ? 1 : 0;
        this.alphaTestValue = (filterMode === 1) ? 1 : 0;

        this.blendSrc = 0;
        this.blendDst = 0;
        this.blended = (filterMode > 1) ? true : false;

        if (this.blended) {
            [this.blendSrc, this.blendDst] = layerFilterMode(filterMode, gl);
        }

        this.uvDivisor = new Float32Array([1, 1]);

        if (textureAnimationId !== -1) {
            let textureAnimation = model.textureAnimations[textureAnimationId];

            if (textureAnimation) {
                this.textureAnimation = textureAnimation;
            }
        }

        let variants = {
            alpha: [],
            slot: [],
            translation: [],
            rotation: [],
            scale: []
        };

        let hasSlotAnim = false,
            hasTranslationAnim = false,
            hasRotationAnim = false,
            hasScaleAnim = false;

        for (let i = 0, l = model.sequences.length; i < l; i++) {
            let alpha = this.isAlphaVariant(i),
                slot = this.isTextureIdVariant(i),
                translation = this.isTranslationVariant(i),
                rotation = this.isRotationVariant(i),
                scale = this.isScaleVariant(i);

            variants.alpha[i] = alpha;
            variants.slot[i] = slot;
            variants.translation[i] = translation;
            variants.rotation[i] = rotation;
            variants.scale[i] = scale;

            hasSlotAnim = hasSlotAnim || slot;
            hasTranslationAnim = hasTranslationAnim || translation;
            hasRotationAnim = hasRotationAnim || rotation;
            hasScaleAnim = hasScaleAnim || scale;
        }

        this.variants = variants;
        this.hasSlotAnim = hasSlotAnim;
        this.hasTranslationAnim = hasTranslationAnim;
        this.hasRotationAnim = hasRotationAnim;
        this.hasScaleAnim = hasScaleAnim;

        this.setupVaryingTextures(model);
    }

    bind(shader) {
        let gl = this.model.viewer.gl;

        gl.uniform1f(shader.uniforms.get('u_alphaTest'), this.alphaTestValue);

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
    }

    setupVaryingTextures(model) {
        if (!this.animations.KMTF) {
            return;
        }

        // Get all unique texture IDs used by this layer
        var textureIds = unique(this.animations.KMTF.getValues());

        if (textureIds.length > 1) {
            let env = model.viewer,
                hash = stringHash(textureIds.join('')),
                textures = [];

            // Grab all of the textures
            for (let i = 0, l = textureIds.length; i < l; i++) {
                textures[i] = model.textures[textureIds[i]];
            }

            // Load the atlas, and use the hash to cache it.
            model.viewer.loadTextureAtlas(hash, textures)
                .then((atlas) => {
                    model.textures.push(atlas.texture);
                    model.textureOptions.push({ repeatS: true, repeatT: true });

                    this.textureId = model.textures.length - 1;
                    this.uvDivisor.set([atlas.columns, atlas.rows]);
                });
        }
    }

    getAlpha(instance) {
        return this.getValue('KMTA', instance, this.alpha);
    }

    isAlphaVariant(sequence) {
        return this.isVariant('KMTA', sequence);
    }

    getTextureId(instance) {
        return this.getValue('KMTF', instance, this.textureId);
        /// TODO: map the returned slot to a texture atlas slot if one exists.
    }

    isTextureIdVariant(sequence) {
        return this.isVariant('KMTF', sequence);
    }

    getTranslation(instance) {
        if (this.textureAnimation) {
            return this.textureAnimation.getTranslation(instance);
        }

        return VEC3_ZERO;
    }

    isTranslationVariant(sequence) {
        if (this.textureAnimation) {
            return this.textureAnimation.isTranslationVariant(sequence);
        } else {
            return false;
        }
    }

    getRotation(instance) {
        if (this.textureAnimation) {
            return this.textureAnimation.getRotation(instance);
        }

        return QUAT_DEFAULT;
    }

    isRotationVariant(sequence) {
        if (this.textureAnimation) {
            return this.textureAnimation.isRotationVariant(sequence);
        } else {
            return false;
        }
    }

    getScale(instance) {
        if (this.textureAnimation) {
            return this.textureAnimation.getScale(instance);
        }

        return VEC3_ONE;
    }

    isScaleVariant(sequence) {
        if (this.textureAnimation) {
            return this.textureAnimation.isScaleVariant(sequence);
        } else {
            return false;
        }
    }
};
