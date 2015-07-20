Mdx.ModelInstance = function (model, id) {
    this.model = model;
    this.skeleton = new Mdx.Skeleton(model);

    this.skeleton.update();

    this.id = id;
};

Mdx.ModelInstance.prototype = {
    update: function () {
        this.skeleton.update();

        postMessage({ id: this.id, type: "update-skeleton", data: this.skeleton.boneBuffer });
    },

    post: function () {
        //postMessage({ id: this.id, type: "debug", data: this.skeleton });
        postMessage({ id: this.id, type: "new-skeleton", data: this.model.bones.length });
        //postMessage({ id: this.id, type: "update-skeleton", data: this.skeleton.boneBuffer });
    }
};
