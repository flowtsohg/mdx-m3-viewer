/**
 * @class
 * @classdesc A geometry model instance.
 * @extends ModelInstance
 * @memberOf Geo
 * @param {ModelViewer} env The model viewer object that this texture belongs to.
 */
function GeometryModelInstance(env) {
    ModelInstance.call(this, env);

    this.color = vec3.create();
    this.edgeColor = vec3.create;
}

GeometryModelInstance.prototype = {
    initialize() {
        this.boundingShape = new BoundingShape();
        this.boundingShape.fromVertices(this.model.vertexArray);
        this.boundingShape.setParent(this);

        // Initialize to the model's material color
        this.setColor(this.model.color);
        this.setEdgeColor(this.model.edgeColor);
    },

    setSharedData(sharedData) {
        this.boneArray = sharedData.boneArray;
        this.colorArray = sharedData.colorArray;
        this.edgeColorArray = sharedData.edgeColorArray;

        this.colorArray.set(this.color);
        this.edgeColorArray.set(this.edgeColor);
    },

    invalidateSharedData() {
        this.boneArray = null;
        this.colorArray = null;
        this.edgeColorArray = null;
    },

    update() {
        mat4.copy(this.boneArray, this.worldMatrix);
    },

    setColor(color) {
        this.color.set(color);

        if (this.bucket) {
            this.colorArray.set(color);
            this.bucket.updateColors[0] = 1;
        }

        return this;
    },

    setEdgeColor(color) {
        this.edgeColor.set(color);

        if (this.bucket) {
            this.edgeColorArray.set(color);
            this.bucket.updateEdgeColors[0] = 1;
        }

        return this;
    }
};

mix(GeometryModelInstance.prototype, ModelInstance.prototype);
