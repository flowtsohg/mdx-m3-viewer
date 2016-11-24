/**
 * @class
 * @classdesc An MDX model instance.
 * @extends ModelInstance
 * @memberOf Mdx
 * @param {ModelViewer} env The model viewer object that this texture belongs to.
 */
function MdxModelInstance(env) {
    ModelInstance.call(this, env);
}

MdxModelInstance.prototype = {
    initialize() {
        var model = this.model;
        var pathSolver = model.pathSolver;

        this.skeleton = new MdxSkeleton(this, model);

        this.particleEmitters = [];
        if (model.particleEmitters && model.particleEmitters.length > 0) {
            const objects = model.particleEmitters;

            for (let i = 0, l = objects.length; i < l; i++) {
                this.particleEmitters[i] = new MdxParticleEmitter(this, objects[i]);
            }
        }

        this.particleEmitters2 = [];
        if (model.particleEmitters2 && model.particleEmitters2.length > 0) {
            const objects = model.particleEmitters2;
            
            for (let i = 0, l = objects.length; i < l; i++) {
                this.particleEmitters2[i] = new MdxParticleEmitter2View(this, objects[i]);
            }
        }

        this.ribbonEmitters = [];
        if (model.ribbonEmitters && model.ribbonEmitters.length > 0) {
            const objects = model.ribbonEmitters;

            for (i = 0, l = objects.length; i < l; i++) {
                this.ribbonEmitters[i] = new MdxRibbonEmitterView(this, objects[i]);
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
                instance.setLocation([(x2 + x1) / 2, (y2 + y1) / 2, (z2 + z1) / 2]);
                instance.setParent(this.skeleton.nodes[boundingShape.node.index]);
            } else if (boundingShape.type === 2) {
                var boundingModel = viewer.load({ geometry: createSphere(boundingShape.radius, 12, 12), material: { renderMode: 1 } }, Geo.pathSolver);
                var instance = boundingModel.addInstance();
                instance.dontInheritScale = false; // Override since the bounding shapes should scale with the instance
                instance.setLocation(boundingShape.vertices);
                instance.setParent(this.skeleton.nodes[boundingShape.node.index]);
            }
        }

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

        //-------------------------------------------------------------------------------------------------------

        this.modelAttachments = [];
        
        const attachments = model.attachments;

        for (let i = 0, l = attachments.length; i < l; i++) {
            const attachment = attachments[i],
                attachedModel = attachment.attachedModel;

            if (attachedModel) {
                const instance = attachedModel.addInstance();

                instance.setSequenceLoopMode(2);
                instance.setParent(this.skeleton.nodes[attachment.node.objectId]);
                instance.dontInheritScale = false;

                this.modelAttachments.push([attachment, instance]);
            }
        }
        
        this.eventObjectEmitters = [];
        
        //if (model.eventObjects) {
        //    objects = model.eventObjects;
            
        //    for (i = 0, l = objects.length; i < l; i++) {
        //        this.eventObjectEmitters[i] = new MdxEventObjectEmitter(objects[i], model, this, viewer, pathSolver);
        //    }
        //}

        this.sequence = -1;
        this.sequenceLoopMode = 0;
        this.sequenceObject = null;
        this.allowParticleSpawn = false;
    },

    setSharedData(sharedData) {
        this.bucket = sharedData.bucket;

        this.skeleton.boneArray = sharedData.boneArray;

        // Update once at setup, since it might not be updated later, depending on sequence variancy
        this.skeleton.update();

        this.geosetColorArrays = sharedData.geosetColorArrays;
        this.uvOffsetArrays = sharedData.uvOffsetArrays;

        this.teamColorArray = sharedData.teamColorArray;
        this.tintColorArray = sharedData.tintColorArray;

        this.batchVisibilityArrays = sharedData.batchVisibilityArrays;
    },

    updateEmitters() {
        let allowCreate = this.allowParticleSpawn,
            emitters;

        emitters = this.particleEmitters;
        for (let i = 0, l = emitters.length; i < l; i++) {
            emitters[i].update(allowCreate);
        }

        emitters = this.particleEmitters2;
        for (let i = 0, l = emitters.length; i < l; i++) {
            emitters[i].update(allowCreate);
        }
        
        emitters = this.ribbonEmitters;
        for (var i = 0, l = emitters.length; i < l; i++) {
            emitters[i].update(allowCreate);
        }
        /*
        emitters = this.eventObjectEmitters;
        for (var i = 0, l = emitters.length; i < l; i++) {
            emitters[i].update(allowCreate);
        }
        */
    },

    preemptiveUpdate() {
        if (this.sequenceObject) {
            var sequence = this.sequenceObject;

            this.frame += this.env.frameTimeMS;

            this.allowParticleSpawn = true;

            if (this.frame >= sequence.interval[1]) {
                if (this.sequenceLoopMode === 2 || (this.sequenceLoopMode === 0 && sequence.flags === 0)) {
                    this.frame = sequence.interval[0];
                } else {
                    this.frame = sequence.interval[1];
                    this.allowParticleSpawn = false;
                }

                this.dispatchEvent({ type: "seqend" });
            }
        }
    },

    update() {
        var model = this.model,
            bucket = this.bucket;

        if (this.sequenceObject && model.variants[this.sequence]) {
            this.skeleton.update();
            bucket.updateBoneTexture[0] = 1;
        }

        this.updateEmitters();

        // Model attachments
        const modelAttachments = this.modelAttachments;

        for (let i = 0, l = modelAttachments.length; i < l; i++) {
            let modelAttachment = modelAttachments[i],
                attachment = modelAttachment[0],
                instance = modelAttachment[1];

            if (attachment.getVisibility(this) > 0.1) {
                if (!instance.rendered) {
                    instance.rendered = true;
                    instance.setSequence(0);
                }
            } else {
                instance.rendered = false;
            }
        }
        
        var batches = model.batches;

        // Not every model has batches
        if (batches.length) {
            let layers = model.layers,
                geosetColorArrays = this.geosetColorArrays,
                uvOffsetArrays = this.uvOffsetArrays,
                batchVisibilityArrays = this.batchVisibilityArrays;

            // Update batch visibilities and geoset colors
            for (var i = 0, l = batches.length; i < l; i++) {
                var batch = batches[i],
                    index = batch.index,
                    geoset = batch.geoset,
                    layer = batch.layer,
                    geosetColorArray = geosetColorArrays[index];

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
    },

    // This is overriden in order to update the skeleton when the parent node changes
    recalculateTransformation() {
        Node.prototype.recalculateTransformation.call(this);

        if (this.rendered) {
            this.skeleton.update();
            this.bucket.updateBoneTexture[0] = 1;
        } else {
            this.addAction(() => this.skeleton.update(), []);
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
        if (this.rendered) {
            this.teamColorArray[0] = id;
            this.bucket.updateTeamColors[0] = 1;
        } else {
            this.addAction(id => this.setTeamColor(id), [id]);
        }

        return this;
    },

    setTintColor(color) {
        if (this.rendered) {
            this.tintColorArray.set(color);
            this.bucket.updateTintColors[0] = 1;
        } else {
            this.addAction(id => this.setTintColor(color), [color]);
        }

        return this;
    },

    setSequence(id) {
        if (this.rendered) {
            var sequences = this.model.sequences.length;

            if (id < sequences) {
                this.sequence = id;

                if (id === -1) {
                    this.frame = 0;

                    this.sequenceObject = null;
                } else {
                    var sequence = this.model.sequences[id];

                    this.frame = sequence.interval[0];

                    this.sequenceObject = sequence;
                }

                // Update the skeleton in case this sequence isn't vareiant, and thus it won't get updated in the update function
                this.skeleton.update();
            }
        } else {
            this.addAction(id => this.setSequence(id), [id]);
        }

        return this;
    },

    setSequenceLoopMode(mode) {
        if (this.rendered) {
            this.sequenceLoopMode = mode;
        } else {
            this.addAction(mode => this.setSequenceLoopMode(mode), [mode]);
        }

        return this;

    },

    getAttachment(id) {
        var attachment = this.model.attachments[id];

        if (attachment) {
            return this.skeleton.nodes[attachment.node.index];
        } else {
            return this.skeleton.nodes[0];
        }
    }
};

mix(MdxModelInstance.prototype, ModelInstance.prototype);
