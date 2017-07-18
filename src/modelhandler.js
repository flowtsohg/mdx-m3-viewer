import Handler from './handler';
import ModelView from './modelview';
import ModelInstance from './modelinstance';
import Bucket from './bucket';
import common from './common';

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

common.mix(ModelHandler, Handler);

export default ModelHandler;
