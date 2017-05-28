/**
 * @class
 * @classdesc An M3 model instance.
 * @extends ModelInstance
 * @memberOf M3
 * @param {ModelViewer} env The model viewer object that this texture belongs to.
 */
function M3ModelInstance(env) {
    ModelInstance.call(this, env);

    this.skeleton = null;
    this.teamColor = 0;
    this.tintColor = vec3.fromValues(255, 255, 255);
    this.sequence = -1;
    this.frame = 0;
    this.sequenceLoopMode = 0;
}

M3ModelInstance.prototype = {
    initialize() {
        this.skeleton = new M3Skeleton(this);
    },

    setSharedData(sharedData) {
        this.boneArray = sharedData.boneArray;

        // Update once at setup, since it might not be updated later, depending on sequence variancy
        this.skeleton.update();

        this.teamColorArray = sharedData.teamColorArray;
        this.tintColorArray = sharedData.tintColorArray;

        this.teamColorArray[0] = this.teamColor;
        this.tintColorArray.set(this.tintColor);
    },

    invalidateSharedData() {
        this.skeleton.boneArray = null;
        this.teamColorArray = null;
        this.tintColorArray = null;
    },

    preemptiveUpdate() {
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
        Node.prototype.recalculateTransformation.call(this);

        if (this.rendered) {
            this.skeleton.update();
            this.bucket.updateBoneTexture[0] = 1;
        }
    },

    setTeamColor(id) {
        this.teamColor = id;

        if (this.rendered) {
            this.teamColorArray[0] = id;
            this.bucket.updateTeamColors[0] = 1;
        }

        return this;
    },

    setTintColor(color) {
        this.tintColor.set(color);

        if (this.rendered) {
            this.tintColorArray.set(color);
            this.bucket.updateTintColors[0] = 1;
        }

        return this;
    },

    setSequence(id) {
        this.sequence = id;
        this.frame = 0;

        if (this.rendered) {
            // Update the skeleton in case this sequence isn't variant, and thus it won't get updated in the update function
            this.skeleton.update();
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

mix(M3ModelInstance.prototype, ModelInstance.prototype);
