const Handler = require('./handler');
const ModelView = require('./modelview');
const ModelInstance = require('./modelinstance');
const Bucket = require('./bucket');

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

require('./common').mix(ModelHandler, Handler);

module.exports = ModelHandler;
