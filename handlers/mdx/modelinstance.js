import TexturedModelInstance from '../../src/texturedmodelinstance';
import common from '../../src/common';

/**
 * @constructor
 * @augments ModelInstance
 * @memberOf Mdx
 * @param {MdxModel} model
 */
function MdxModelInstance(model) {
    TexturedModelInstance.call(this, model);
    
    this.attachments = [];
    this.particleEmitters = [];
    this.particleEmitters2 = [];
    this.ribbonEmitters = [];
    this.eventObjectEmitters = [];

    this.skeleton = null;
    this.frame = 0;
    this.counter = 0; // Global sequences
    this.sequence = -1;
    this.sequenceObject = null;
    this.sequenceLoopMode = 0;

    this.teamColor = 0;
    this.vertexColor = vec4.fromValues(255, 255, 255, 255);

    this.allowParticleSpawn = false;
}

MdxModelInstance.prototype = {
    initialize() {
        let model = this.model,
            objects;

        this.skeleton = new MdxSkeleton(this);

        objects = model.attachments;
        for (let i = 0, l = objects.length; i < l; i++) {
            let attachment = objects[i];

            if (attachment.internalModel) {
                this.attachments.push(new MdxShallowAttachment(this, attachment));
            }
        }

        //let extent = this.model.parser.chunks.MODL.extent;
        //this.boundingShape = new BoundingShape();
        //this.boundingShape.fromBounds(extent.min, extent.max);
        //this.boundingShape.setParent(this);

        //-------------------------------------------------------------------------------------------------------
        // NOTE: If I ever want to re-implement bounding shape rendering, this is pretty much how it should work
        //       Possibly always create unit geometries and scale the instances, to avoid creating many models
        //       This will allow me to introduce instanced rendering for SimpleMesh if I want to at some point
        //       E.g. createSphere(1, 12, 12)
        //            ...
        //            instance.setUniformScale(radius)
        //-------------------------------------------------------------------------------------------------------
        /*
        var viewer = model.env;
        var boundingShapes = model.boundingShapes;
        boundingShapes = [];
        for (var i = 0, l = boundingShapes.length; i < l; i++) {
            var boundingShape = boundingShapes[i];

            if (boundingShape.type === 0) {
                var vertices = boundingShape.vertices,
                    x1 = vertices[0],
                    y1 = vertices[1],
                    z1 = vertices[2],
                    x2 = vertices[3],
                    y2 = vertices[4],
                    z2 = vertices[5];

                var boundingModel = viewer.load({ geometry: createCube((x2 - x1) / 2, (y2 - y1) / 2, (z2 - z1) / 2), material: { renderMode: 1 } }, Geo.pathSolver);
                var instance = boundingModel.addInstance();
                instance.dontInheritScale = false; // Override since the bounding shapes should scale with the instance
                instance.setLocation([(x2 + x1) / 2, (y2 + y1) / 2, -(z2 + z1) / 4]);
                instance.setParent(this.skeleton.nodes[boundingShape.node.index]);
            } else if (boundingShape.type === 2) {
                var boundingModel = viewer.load({ geometry: createSphere(boundingShape.radius, 12, 12), material: { renderMode: 1 } }, Geo.pathSolver);
                var instance = boundingModel.addInstance();
                instance.dontInheritScale = false; // Override since the bounding shapes should scale with the instance
                instance.setLocation(boundingShape.vertices);
                instance.setParent(this.skeleton.nodes[boundingShape.node.index]);
            }
        }
        */

        /*
        if (0) {
            let extent = model.extent,
                min = extent.min,
                max = extent.max,
                dx = (max[0] - min[0]) / 2,
                dy = (max[1] - min[1]) / 2,
                dz = (max[2] - min[2]) / 2;

            // Viewer X = Game Y
            // Viewer Y = Game Z
            // Viewer Z = Game X

            console.log(dx, dy, dz);
            //let shape = createSphere(model.extent.radius, 12, 12);
            let shape = createCube(dx, dy, dz);
            var boundingModel = viewer.load({ geometry: shape, material: { renderMode: 1, edgeColor: [150, 200, 150] } }, Geo.pathSolver);
            var instance = boundingModel.addInstance();
            instance.dontInheritScale = false; // Override since the bounding shapes should scale with the instance
            //instance.move([dx / 2, dy / 2, dz / 2]);
            instance.setParent(this);


            shape = createSphere(model.extent.radius, 12, 12);
            boundingModel = viewer.load({ geometry: shape, material: { renderMode: 1, edgeColor: [150, 200, 150] } }, Geo.pathSolver);
            instance = boundingModel.addInstance();
            instance.dontInheritScale = false; // Override since the bounding shapes should scale with the instance
            //instance.move([dx / 2, dy / 2, dz / 2]);
            instance.setParent(this);

            console.log(model.extent)
        }
        //*/

        //-------------------------------------------------------------------------------------------------------
        
        
        
        //if (model.eventObjects) {
        //    objects = model.eventObjects;
            
        //    for (i = 0, l = objects.length; i < l; i++) {
        //        this.eventObjectEmitters[i] = new MdxEventObjectEmitter(objects[i], model, this, viewer, pathSolver);
        //    }
        //}

        // This takes care of calling setSequence before the model is loaded.
        // In this case, this.sequence will be set, but nothing else is changed.
        // Now that the model is loaded, set it again to do the real work.
        if (this.sequence !== -1) {
            this.setSequence(this.sequence);
        }
    },

    setSharedData(sharedData) {
        this.boneArray = sharedData.boneArray;

        // Update once at setup, since it might not be updated later, depending on sequence variancy
        this.skeleton.update();

        this.geosetColorArrays = sharedData.geosetColorArrays;
        this.uvOffsetArrays = sharedData.uvOffsetArrays;

        this.teamColorArray = sharedData.teamColorArray;
        this.vertexColorArray = sharedData.vertexColorArray;

        this.batchVisibilityArrays = sharedData.batchVisibilityArrays;

        this.teamColorArray[0] = this.teamColor;
        this.bucket.updateTeamColors[0] = 1;

        this.vertexColorArray.set(this.vertexColor);
        this.bucket.updateVertexColors[0] = 1;

        let bucket = this.bucket,
            objects;

        objects = bucket.particleEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            this.particleEmitters[i] = new MdxParticleEmitterView(this, objects[i]);
        }

        objects = bucket.particleEmitters2;
        for (let i = 0, l = objects.length; i < l; i++) {
            this.particleEmitters2[i] = new MdxParticleEmitter2View(this, objects[i]);
        }

        objects = bucket.ribbonEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            this.ribbonEmitters[i] = new MdxRibbonEmitterView(this, objects[i]);
        }

        objects = bucket.eventObjectEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            this.eventObjectEmitters[i] = new MdxEventObjectEmitterView(this, objects[i]);
        }
    },

    invalidateSharedData() {
        this.skeleton.boneArray = null;
        this.geosetColorArrays = null;
        this.uvOffsetArrays = null;
        this.teamColorArray = null;
        this.vertexColorArray = null;
        this.batchVisibilityArrays = null;

        this.particleEmitters = [];
        this.particleEmitters2 = [];
        this.ribbonEmitters = [];
        this.eventObjectEmitters = [];
    },

    hide() {
        let changed = ModelInstance.prototype.hide.call(this);

        if (changed) {
            let attachments = this.attachments;

            for (let i = 0, l = attachments.length; i < l; i++) {
                attachments[i].internalInstance.hide();
            }
        }

        return changed;
    },

    show() {
        let changed = ModelInstance.prototype.show.call(this);

        if (changed) {
            let attachments = this.attachments;

            for (let i = 0, l = attachments.length; i < l; i++) {
                attachments[i].internalInstance.show();
            }
        }

        return changed;
    },

    updateAttachments() {
        let objects = this.attachments;

        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }
    },

    updateEmitters() {
        if (this.allowParticleSpawn) {
            let objects;

            objects = this.attachments;
            for (let i = 0, l = objects.length; i < l; i++) {
                objects[i].update();
            }

            objects = this.particleEmitters;
            for (let i = 0, l = objects.length; i < l; i++) {
                objects[i].update();
            }

            objects = this.particleEmitters2;
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
    },

    globalUpdate() {
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

                this.dispatchEvent({ type: "seqend" });
            }
        }
    },

    update() {
        var model = this.model,
            bucket = this.bucket;

        if (this.sequence !== -1 && model.variants[this.sequence]) {
            this.skeleton.update();
        }
        
        this.updateAttachments();
        this.updateEmitters();

        var batches = model.batches;

        // Not every model has batches
        if (batches.length) {
            var layers = model.layers,
                geosetColorArrays = this.geosetColorArrays,
                uvOffsetArrays = this.uvOffsetArrays,
                batchVisibilityArrays = this.batchVisibilityArrays;

            // Update batch visibilities and geoset colors
            for (var i = 0, l = batches.length; i < l; i++) {
                let batch = batches[i],
                    index = batch.index,
                    geoset = batch.geoset,
                    layer = batch.layer,
                    geosetColorArray = geosetColorArrays[index];

                //if (layer.isAlphaVariant(0) || geoset.isAlphaVariant(0) || geoset.isColorVariant(0)) {
                    //console.log(model.name);
                    //console.log(geoset.geosetAnimation)
                //}

                var batchVisibility = batch.shouldRender(this);
                batchVisibilityArrays[index][0] = batchVisibility;
                bucket.updateBatches[index] |= batchVisibility;

                if (batchVisibility) {
                    if (geoset.geosetAnimation) {
                        var tempVec3 = geoset.geosetAnimation.getColor(this);

                        geosetColorArray[0] = tempVec3[0] * 255;
                        geosetColorArray[1] = tempVec3[1] * 255;
                        geosetColorArray[2] = tempVec3[2] * 255;
                    }

                    geosetColorArray[3] = layer.getAlpha(this) * 255;
                }
            }

            var hasTextureAnims = model.hasTextureAnims,
                hasLayerAnims = model.hasLayerAnims;

            if (hasTextureAnims || hasLayerAnims) {
                // Update texture coordinates
                for (var i = 0, l = layers.length; i < l; i++) {
                    var layer = layers[i],
                        index = layer.index,
                        textureAnimation = layer.textureAnimation,
                        uvOffsetArray = uvOffsetArrays[index];

                    // Texture animation that works by offsetting the coordinates themselves
                    if (textureAnimation) {
                        // What is Z used for?
                        var uvOffset = textureAnimation.getTranslation(this);

                        uvOffsetArray[0] = uvOffset[0];
                        uvOffsetArray[1] = uvOffset[1];

                        bucket.updateUvOffsets[0] = 1;
                    }

                    // Texture animation that is based on a texture atlas, where the selected tile changes
                    if (layer.isTextureAnim) {
                        var uvDivisor = layer.uvDivisor;
                        var textureId = layer.getTextureId(this);

                        uvOffsetArray[2] = textureId % uvDivisor[0];
                        uvOffsetArray[3] = Math.floor(textureId / uvDivisor[1]);

                        bucket.updateUvOffsets[0] = 1;
                    }
                }
            }
        }
    },

    // This is overriden in order to update the skeleton when the parent node changes
    recalculateTransformation() {
        NotifiedNode.prototype.recalculateTransformation.call(this);

        if (this.bucket) {
            this.skeleton.update();
        }
    },
    /*
    render: function () {
        if (this.eventObjectEmitters) {
            var emitters = this.eventObjectEmitters;
            
            for (i = 0, l = emitters.length; i < l; i++) {
                emitters[i].render();
            }
        }
    }
    */
    setTeamColor(id) {
        this.teamColor = id;

        if (this.bucket) {
            this.teamColorArray[0] = id;
            this.bucket.updateTeamColors[0] = 1;
        }

        return this;
    },

    setVertexColor(color) {
        this.vertexColor.set(color);

        if (this.bucket) {
            this.vertexColorArray.set(color);
            this.bucket.updateVertexColors[0] = 1;
        }

        return this;
    },

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

            // Update the skeleton in case this sequence isn't variant, and thus it won't get updated in the update function
            if (this.bucket) {
                this.skeleton.update();
            }
        }

        return this;
    },

    setSequenceLoopMode(mode) {
        this.sequenceLoopMode = mode;

        return this;
    },

    getAttachment(id) {
        if (this.model.loaded) {
            var attachment = this.model.attachments[id];

            if (attachment) {
                return this.skeleton.nodes[attachment.node.index];
            } else {
                return this.skeleton.nodes[0];
            }
        }
    }
};

common.mix(MdxModelInstance.prototype, TexturedModelInstance.prototype);

export default MdxModelInstance;
