Mdx.WebGLModelInstance = function (asyncInstance, model, customPaths, context) {
    
}

var globalMessage = {id: 0, type: 0, data: 0};
var globalTransferList = [];

Mdx.WebGLModelInstance.prototype = extend(BaseModelInstance.prototype, {
    initWorker: function (asyncInstance, model, customPaths, context) {
        this.worker = model.worker;
        this.ctx = model.ctx;
        this.asyncInstance = asyncInstance;
        this.model = model;
        this.wantUpdate = false;

        var message = { id: asyncInstance.id, type: WORKER_NEW_INSTANCE, data: model.asyncModel.id };
        this.worker.postMessage(message);
    },

    gotMessage: function (type, data) {
        //console.log(type, data);

        if (type === WORKER_NEW_SKELETON) {
            this.skeleton = new Mdx.WebGLSkeleton(data, this.ctx);
            this.wantUpdate = true
        } else if (type === WORKER_UPDATE_SKELETON) {
            //console.log(new Float32Array(data.buffer, 16*4*4, 16));
            this.skeleton.updateTexture(data);
            this.wantUpdate = true;
        } else if (type === WORKER_UPDATE_BATCH_VISIBILITIES) {
            this.batchVisibilities = data;
        } else {
            console.log(data);
        }
    },

    update: function (instance, context) {
        if (this.wantUpdate) {
            this.wantUpdate = false;
            //console.log("requesting update");

            globalMessage.id = this.asyncInstance.id;
            globalMessage.type = WORKER_UPDATE_INSTANCE_ROOT;
            globalMessage.data = instance.worldMatrix;
            this.worker.postMessage(globalMessage);

            globalMessage.type = WORKER_UPDATE_INSTANCE;
            globalMessage.data = this.skeleton.boneBuffer;
            globalTransferList[0] = globalMessage.data.buffer;
            this.worker.postMessage(globalMessage, globalTransferList);
        }
        
    },
    
    render: function (context, tint) {
        this.model.render(this, context, tint);
    },
    
    renderEmitters: function(context) {
        
    },
    
    setTeamColor: function (id) {
       
    },

    setSequence: function (id) {
        globalMessage.id = this.asyncInstance.id;
        globalMessage.type = WORKER_SET_SEQUENCE;
        globalMessage.data = id;
        this.worker.postMessage(globalMessage);
    },

    getAttachment: function (id) {
       
    }
});
