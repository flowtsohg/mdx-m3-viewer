/**
 * @constructor
 * @extends {TexturedModelInstance}
 * @memberOf M3
 * @param {M3Model} model
 */
function M3ModelInstance(model) {
    TexturedModelInstance.call(this, model);

    this.skeleton = null;
    this.teamColor = 0;
    this.vertexColor = vec4.fromValues(255, 255, 255, 255);
    this.sequence = -1;
    this.frame = 0;
    this.sequenceLoopMode = 0;
}

M3ModelInstance.prototype = {
    initialize() {
        this.skeleton = new M3Skeleton(this);

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

        this.teamColorArray = sharedData.teamColorArray;
        this.vertexColorArray = sharedData.vertexColorArray;

        this.teamColorArray[0] = this.teamColor;
        this.bucket.updateTeamColors[0] = 1;

        this.vertexColorArray.set(this.vertexColor);
        this.bucket.updateVertexColors[0] = 1;
    },

    invalidateSharedData() {
        this.skeleton.boneArray = null;
        this.teamColorArray = null;
        this.vertexColorArray = null;
    },

    globalUpdate() {
        var sequenceId = this.sequence;

        if (sequenceId !== -1) {
            var sequence = this.model.sequences[sequenceId];

            var interval = sequence.interval;

            this.frame += this.env.frameTime;

            if (this.frame > interval[1]) {
                if ((this.sequenceLoopMode === 0 && !(sequence.flags & 0x1)) || this.sequenceLoopMode === 2) {
                    this.frame = 0;
                } else {
                    this.frame = interval[1];
                }

                this.dispatchEvent({ type: "seqend" });
            }
        }
    },

    update() {
        var sequenceId = this.sequence;

        if (sequenceId !== -1) {
            this.skeleton.update();
            this.bucket.updateBoneTexture[0] = 1;
        }

        /*
        if (this.particleEmitters) {
        for (i = 0, l = this.particleEmitters.length; i < l; i++) {
        this.particleEmitters[i].update(allowCreate, sequenceId, this.frame);
        }
        }
        */
    },

    // This is overriden in order to update the skeleton when the parent node changes
    recalculateTransformation() {
        ViewerNode.prototype.recalculateTransformation.call(this);

        if (this.bucket) {
            this.skeleton.update();
            this.bucket.updateBoneTexture[0] = 1;
        }
    },

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
        this.frame = 0;

        if (this.model.loaded) {
            var sequences = this.model.sequences.length;

            if (id < -1 || id > sequences - 1) {
                id = -1;

                this.sequence = id;
            }

            if (this.bucket) {
                // Update the skeleton in case this sequence isn't variant, and thus it won't get updated in the update function
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
        var attachment = this.model.attachments[id];

        if (attachment) {
            return this.skeleton.nodes[attachment.bone];
        } else {
            return this.skeleton.root;
        }
    }
};

mix(M3ModelInstance.prototype, TexturedModelInstance.prototype);
