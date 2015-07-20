Mdx.WebGLModelInstance = function (asyncInstance, model, customPaths, context) {
    
}

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
        } else if (type === "update-skeleton") {
            this.skeleton.updateTexture(data);
            this.wantUpdate = true;
        }
    },

    update: function (instance, context) {
        if (this.wantUpdate) {
            this.wantUpdate = false;
            //console.log("requesting update");
            this.worker.postMessage({ id: this.asyncInstance.id, type: "update-instance" });
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
