M3.ModelInstance = function () {

};

M3.ModelInstance.prototype = extend(BaseModelInstance.prototype, {
    loadstart: function (asyncInstance, reportError, reportLoad) {
        BaseModelInstance.call(this, asyncInstance.asyncModel.model, {});

        this.asyncInstance = asyncInstance;

        this.skeleton = new M3.Skeleton(this.asyncInstance, this.asyncInstance.asyncModel.model, this.asyncInstance.context.gl.ctx);

        reportLoad();
    },

    update: function () {
        var context = this.asyncInstance.context;
        var i, l;
        var sequenceId = this.sequence;
        var allowCreate = false;

        if (sequenceId !== -1) {
            var sequence = this.model.sequences[sequenceId];

            this.frame += context.frameTimeMS;

            if (this.frame > sequence.animationEnd) {
                if ((this.sequenceLoopMode === 0 && !(sequence.flags & 0x1)) || this.sequenceLoopMode === 2) {
                    this.frame = 0;
                }
            }

            allowCreate = true;
        }

        this.skeleton.update(sequenceId, this.frame, context.gl.ctx);

        /*
        if (this.particleEmitters) {
        for (i = 0, l = this.particleEmitters.length; i < l; i++) {
        this.particleEmitters[i].update(allowCreate, sequenceId, this.frame);
        }
        }
        */
    },

    setSequence: function (sequence) {
        this.sequence = sequence;
        this.frame = 0;
    },

    setTeamColor: function (id) {
        this.teamColor = id;
    },

    getAttachment: function (id) {
        var attachment = this.model.getAttachment(id);

        if (attachment) {
            return this.skeleton.nodes[attachment.bone];
        } else {
            return this.skeleton.root;
        }
    }
});
