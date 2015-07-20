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

        var message = { id: asyncInstance.id, type: "new-instance", data: model.asyncModel.id };
        this.worker.postMessage(message);
    },

    gotMessage: function (type, data) {
        //console.log(type, data);

        if (type === "new-skeleton") {
            this.skeleton = new Mdx.WebGLSkeleton(data, this.ctx);
            this.wantUpdate = true
        } else if (type === WORKER_UPDATE_SKELETON) {
            //console.log(new Float32Array(data.buffer, 16*4*4, 16));
            this.skeleton.updateTexture(data);
            this.wantUpdate = true;
        } else {
            console.log(data);
        }
    },

    update: function (instance, context) {
        if (this.wantUpdate) {
            this.wantUpdate = false;
            //console.log("requesting update");

            globalMessage.id = this.asyncInstance.id;
            globalMessage.type = WORKER_UPDATE_INSTANCE;
            //globalMessage.data = this.skeleton.boneBuffer;
            //globalTransferList[0] = globalMessage.data.buffer;
            this.worker.postMessage(globalMessage);
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
       
    },

    getAttachment: function (id) {
       
    }
});
