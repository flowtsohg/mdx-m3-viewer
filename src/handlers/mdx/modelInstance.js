Mdx.ModelInstance = function (model, id) {
    this.model = model;
    this.skeleton = new Mdx.Skeleton(model);
    this.id = id;
    
    this.sequence = 1;
    this.frame = model.sequences[this.sequence].interval[0];
    this.counter = 0;
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

        this.skeleton.update(boneBuffer, this.sequence, this.frame, this.counter);

        globalMessage.id = this.id;
        globalMessage.type = WORKER_UPDATE_SKELETON;
        globalMessage.data = boneBuffer;
        globalTransferList[0] = boneBuffer.buffer;
        postMessage(globalMessage, globalTransferList);
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
