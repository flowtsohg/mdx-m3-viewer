Mdx.ModelInstance = function (model, id) {
    this.model = model;
    this.skeleton = new Mdx.Skeleton(model);
    this.id = id;
    this.sequence = -1;
    this.frame = 0;
    this.counter = 0;

    var batchVisibilities = new Uint8Array(model.batches.length);
    for (var i = 0, l = batchVisibilities.length; i < l; i++) {
        batchVisibilities[i] = 1;
    }
    this.batchVisibilities = batchVisibilities;
};

Mdx.ModelInstance.prototype = {
    update: function (boneBuffer) {
        var allowCreate = false;

        if (this.sequence !== -1) {
            var sequence = this.model.sequences[this.sequence];

            this.frame += 1000 / 30;
            this.counter += 1000/ 30;

            allowCreate = true;

            if (this.frame >= sequence.interval[1]) {
                this.frame = sequence.interval[0];
                allowCreate = true;
            }
        }

        this.updateSkeleton(boneBuffer);
        this.updateBatches();
    },

    updateRoot: function (worldMatrix) {
        this.skeleton.updateRoot(worldMatrix);
    },

    updateSkeleton: function (boneBuffer) {
        this.skeleton.update(boneBuffer, this.sequence, this.frame, this.counter);

        globalMessage.id = this.id;
        globalMessage.type = WORKER_UPDATE_SKELETON;
        globalMessage.data = boneBuffer;
        globalTransferList[0] = boneBuffer.buffer;
        postMessage(globalMessage, globalTransferList);
    },

    updateBatches: function () {
        var batchVisibilities = this.batchVisibilities;
        var newValue;
        var sequence = this.sequence;
        var frame = this.frame;
        var counter = this.counter;

        for (var i = 0, l = batchVisibilities.length; i < l; i++) {
            newValue = this.model.shouldRenderBatch(sequence, frame, counter, i);

            //if (newValue !== batchVisibilities[i]) {
                batchVisibilities[i] = newValue;
            //}
        }

        globalMessage.id = this.id;
        globalMessage.type = WORKER_UPDATE_BATCH_VISIBILITIES;
        globalMessage.data = batchVisibilities;
        postMessage(globalMessage);
    },

    setSequence: function (id) {
        var sequences = this.model.sequences.length;

        if (id < sequences) {
            this.sequence = id;

            if (id === -1) {
                this.frame = 0;
            } else {
                var sequence = this.model.sequences[id];

                this.frame = sequence.interval[0];
            }
        }
    },

    post: function () {
        globalMessage.id = this.id;
        globalMessage.type = WORKER_NEW_SKELETON;
        globalMessage.data = this.model.bones.length;
        postMessage(globalMessage);

        //var message = { id: this.id, type: "debug", data: this.skeleton.rootNode.worldMatrix };
        //postMessage(message);
    }
};
