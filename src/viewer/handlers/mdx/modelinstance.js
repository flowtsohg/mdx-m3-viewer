import ModelInstance from '../../modelinstance';
import TexturedModelInstance from '../../texturedmodelinstance';
import MdxSkeleton from './skeleton';
import AttachmentInstance from './attachmentinstance';
import MdxParticleEmitterView from './particleemitterview';
import MdxParticleEmitter2View from './particleemitter2view';
import MdxRibbonEmitterView from './ribbonemitterview';
import MdxEventObjectEmitterView from './eventobjectemitterview';

export default class MdxModelInstance extends ModelInstance {
    /**
     * @param {MdxModel} model
     */
    constructor(model) {
        super(model);

        this.attachments = [];
        this.particleEmitters = [];
        this.particle2Emitters = [];
        this.ribbonEmitters = [];
        this.eventObjectEmitters = [];

        this.hasAttachments = false;
        this.hasEmitters = false;
        this.hasBatches = false;

        this.skeleton = null;
        this.frame = 0;
        this.counter = 0; // Global sequences
        this.sequence = -1;
        this.sequenceObject = null;
        this.sequenceLoopMode = 0;

        this.teamColor = 0;
        this.vertexColor = new Uint8Array([255, 255, 255, 255]);

        this.allowParticleSpawn = false;

        this.geosetColors = null;
        this.uvOffsets = null;
        this.layerAlphas = null;
    }

    initialize() {
        let model = this.model,
            geosetCount = model.geosets.length,
            layerCount = model.layers.length;
        
        this.skeleton = new MdxSkeleton(this);

        this.geosetColors = new Uint8Array(geosetCount * 4);
        this.layerAlphas = new Uint8Array(layerCount);
        this.uvOffsets = new Float32Array(layerCount * 4);

        let attachments = model.attachments;
        for (let i = 0, l = attachments.length; i < l; i++) {
            let attachment = attachments[i];

            if (attachment.internalModel) {
                this.attachments.push(new AttachmentInstance(this, attachment));
            }
        }

        this.hasAttachments = this.attachments.length > 0;
        this.hasBatches = model.batches.length > 0;

        // This takes care of calling setSequence before the model is loaded.
        // In this case, this.sequence will be set, but nothing else is changed.
        // Now that the model is loaded, set it again to do the real work.
        if (this.sequence !== -1) {
            this.setSequence(this.sequence);
        }
    }

    setSharedData() {
        let bucket = this.bucket,
            objects;

        objects = bucket.particleEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            this.particleEmitters[i] = new MdxParticleEmitterView(this, objects[i]);
        }

        objects = bucket.particle2Emitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            this.particle2Emitters[i] = new MdxParticleEmitter2View(this, objects[i]);
        }

        objects = bucket.ribbonEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            this.ribbonEmitters[i] = new MdxRibbonEmitterView(this, objects[i]);
        }

        objects = bucket.eventObjectEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            this.eventObjectEmitters[i] = new MdxEventObjectEmitterView(this, objects[i]);
        }

        this.hasEmitters = this.particleEmitters.length > 0 || this.particle2Emitters.length > 0 || this.ribbonEmitters.length > 0 || this.eventObjectEmitters.length > 0;

        // Do a forced update, so non-animated data can be skipped in future updates
        this.update(true);
    }

    invalidateSharedData() {
        this.particleEmitters = [];
        this.particle2Emitters = [];
        this.ribbonEmitters = [];
        this.eventObjectEmitters = [];
    }

    // Overriden to handle the interal attachments.
    hide() {
        let changed = ModelInstance.prototype.hide.call(this);

        if (changed) {
            let attachments = this.attachments;

            for (let i = 0, l = attachments.length; i < l; i++) {
                attachments[i].internalInstance.hide();
            }
        }

        return changed;
    }

    // Overriden to handle the interal attachments.
    show() {
        let changed = ModelInstance.prototype.show.call(this);

        if (changed) {
            let attachments = this.attachments;

            for (let i = 0, l = attachments.length; i < l; i++) {
                attachments[i].internalInstance.show();
            }
        }

        return changed;
    }

    updateTimers() {
        if (this.sequence !== -1) {
            var sequence = this.sequenceObject,
                interval = sequence.interval,
                frameTime = this.env.frameTime;

            this.frame += frameTime;
            this.counter += frameTime;
            this.allowParticleSpawn = true;

            if (this.frame >= interval[1]) {
                if (this.sequenceLoopMode === 2 || (this.sequenceLoopMode === 0 && sequence.flags === 0)) {
                    this.frame = interval[0];
                } else {
                    this.frame = interval[1];
                    this.counter -= frameTime;
                    this.allowParticleSpawn = false;
                }

                this.dispatchEvent({ type: 'seqend' });
            }
        }
    }

    updateAttachments() {
        let objects = this.attachments;

        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }
    }

    updateEmitters() {
        let objects;

        objects = this.particleEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        objects = this.particle2Emitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        objects = this.ribbonEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        objects = this.eventObjectEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }
    }

    updateBatches(forced) {
        let model = this.model,
            sequence = this.sequence;

        // Geosets
        if (forced || model.hasGeosetAnims) {
            let geosets = model.geosets,
                geosetColors = this.geosetColors;

            for (let i = 0, l = geosets.length; i < l; i++) {
                let geoset = geosets[i],
                    offset = i * 4;

                // Color
                if (forced || geoset.variants.color[sequence]) {
                    let color = geoset.getColor(this);

                    geosetColors[offset] = color[0] * 255;
                    geosetColors[offset + 1] = color[1] * 255;
                    geosetColors[offset + 2] = color[2] * 255;
                }

                // Alpha
                if (forced || geoset.variants.alpha[sequence]) {
                    geosetColors[offset + 3] = geoset.getAlpha(this) * 255;
                }
            }
        }

        // Layers
        if (forced || model.hasLayerAnims) {
            let layers = model.layers,
                layerAlphas = this.layerAlphas,
                uvOffsets = this.uvOffsets;

            for (let i = 0, l = layers.length; i < l; i++) {
                let layer = layers[i],
                    offset = i * 4;

                // Alpha
                if (forced || layer.variants.alpha[sequence]) {
                    layerAlphas[i] = layer.getAlpha(this) * 255;
                }

                // Texture coordinates
                if (layer.hasUvAnim && (forced || layer.variants.uv[sequence])) {
                    // What is Z used for?
                    let uvOffset = layer.textureAnimation.getTranslation(this);

                    uvOffsets[offset] = uvOffset[0];
                    uvOffsets[offset + 1] = uvOffset[1];
                }

                // Sprite animations
                if (layer.hasSlotAnim && (forced || layer.variants.slot[sequence])) {
                    let uvDivisor = layer.uvDivisor,
                        textureId = layer.getTextureId(this);

                    uvOffsets[offset + 2] = textureId % uvDivisor[0];
                    uvOffsets[offset + 3] = Math.floor(textureId / uvDivisor[1]);
                }
            }
        }
    }

    // If forced is true-ish, the skeleton and geometry will be updated regadless of variancy.
    // This allows to do a forced update once when setting the sequence or the bucket.
    // Any later non-forced update can then use variancy to skip updating things.
    update(forced) {
        // Update the skeleton
        if (forced || (this.sequence !== -1 && this.model.variants[this.sequence])) {
            this.skeleton.update(forced);
        }

        // Update the geometry
        if (this.hasBatches) {
            this.updateBatches(forced);
        }

        if (!forced) {
            // Update the model attachments
            if (this.hasAttachments) {
                this.updateAttachments();
            }

            // Update all of the emitters
            if (this.hasEmitters && this.allowParticleSpawn) {
                this.updateEmitters();
            }
        }
    }

    // This is overriden in order to update the skeleton when the parent node changes
    recalculateTransformation() {
        super.recalculateTransformation();

        // If the instance is moved before it is loaded, the skeleton doesn't exist yet.
        if (this.skeleton) {
            this.skeleton.update();
        }
    }

    setTeamColor(id) {
        this.teamColor = id;

        return this;
    }

    setVertexColor(color) {
        this.vertexColor.set(color);

        return this;
    }

    setSequence(id) {
        this.sequence = id;

        // If the model isn't loaded yet, a sequence can't be selected.
        if (this.model.loaded) {
            var sequences = this.model.sequences.length;

            if (id < -1 || id > sequences - 1) {
                id = -1;

                this.sequence = id;
            }

            if (id === -1) {
                this.frame = 0;

                this.sequenceObject = null;

                this.allowParticleSpawn = false;
            } else {
                var sequence = this.model.sequences[id];

                this.frame = sequence.interval[0];

                this.sequenceObject = sequence;
            }

            // Do a forced update, so non-animated data can be skipped in future updates
            this.update(true);
        }

        return this;
    }

    setSequenceLoopMode(mode) {
        this.sequenceLoopMode = mode;

        return this;
    }

    getAttachment(id) {
        if (this.model.loaded) {
            var attachment = this.model.attachments[id];

            if (attachment) {
                return this.skeleton.nodes[attachment.index];
            } else {
                return this.skeleton.nodes[0];
            }
        }
    }
};
