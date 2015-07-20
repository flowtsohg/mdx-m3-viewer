importScripts("../../math/common.js");
importScripts("../../math/vec3.js");
importScripts("../../math/vec4.js");
importScripts("../../math/mat3.js");
importScripts("../../math/mat4.js");
importScripts("../../math/quat.js");
importScripts("../../math/gl-matrix-addon.js");
importScripts("../../basenode.js");
importScripts("../../binaryreader.js");

importScripts("common.js");
importScripts("parser.js");
importScripts("geoset.js");
importScripts("model.js");
importScripts("modelinstance.js");
importScripts("skeleton.js");

var models = {};
var instances = {};

onmessage = function (e) {
    var message = e.data;
    var id = message.id;
    var type = message.type;
    var data = message.data;

    if (type === "new-model") {
        var model = new Mdx.Model(data, id);

        models[id] = model;

        model.post();
    } else if (type === "new-instance") {
        var instance = new Mdx.ModelInstance(models[data], id);

        instances[id] = instance;

        instance.post();
    } else if (type === "update-instance") {
        var instance = instances[id];

        instance.update();
    }
};
