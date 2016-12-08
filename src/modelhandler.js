const ModelHandler = {
    get objectType() {
        return "modelhandler"
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
