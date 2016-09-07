const ModelHandler = {
    get objectType() {
        return "modelhandler"
    },

    get Model() {
        throw "ModelHandler.Model must be overriden!";
    },

    get ModelView() {
        return ModelView;
    },

    get Instance() {
        return ModelInstance;
    },

    get Bucket() {
        return Bucket;
    }
};

mix(ModelHandler, Handler);
