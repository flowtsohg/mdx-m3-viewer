importScripts("../../math/common.js");
importScripts("../../math/vec3.js");
importScripts("../../math/vec4.js");
importScripts("../../math/mat3.js");
importScripts("../../math/mat4.js");
importScripts("../../math/quat.js");
importScripts("../../math/math.js");
importScripts("../../math/interpolator.js");
importScripts("../../math/gl-matrix-addon.js");
importScripts("../../basenode.js");
importScripts("../../binaryreader.js");

importScripts("common.js");
importScripts("parser.js");
importScripts("geoset.js");
importScripts("model.js");
importScripts("modelinstance.js");
importScripts("skeleton.js");
importScripts("sd.js");
importScripts("node.js");
importScripts("layer.js");
importScripts("geosetanimation.js");

var models = {};
var instances = {};

var globalMessage = {id: 0, type: 0, data: 0};
var globalTransferList = [];

onmessage = function (e) {
    var message = e.data;
    var id = message.id;
    var type = message.type;
    var data = message.data;

    if (type === WORKER_NEW_MODEL) {
        var model = new Mdx.Model(data, id);

        models[id] = model;

        model.post();
    } else if (type === WORKER_NEW_INSTANCE) {
        var instance = new Mdx.ModelInstance(models[data], id);

        instances[id] = instance;

        instance.post();
    } else if (type === WORKER_UPDATE_INSTANCE_ROOT) {
        var instance = instances[id];

        instance.updateRoot(data);
    } else if (type === WORKER_UPDATE_INSTANCE) {
        var instance = instances[id];

        instance.update(data);
    } else if (type === WORKER_SET_SEQUENCE) {
        var instance = instances[id];

        instance.setSequence(data);
    }
};
