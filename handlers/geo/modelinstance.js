/**
 * @constructor
 * @extends ModelInstance
 * @memberOf Geo
 * @param {GeometryModel} model
 */
function GeometryModelInstance(model) {
    ModelInstance.call(this, model);

    this.vertexColor = vec4.create();
    this.edgeColor = vec4.create();
}

GeometryModelInstance.prototype = {
    initialize() {
        this.boundingShape = new BoundingShape();
        this.boundingShape.fromVertices(this.model.vertexArray);
        this.boundingShape.setParent(this);

        // Initialize to the model's material color
        this.setVertexColor(this.model.vertexColor);
        this.setEdgeColor(this.model.edgeColor);
    },

    setSharedData(sharedData) {
        this.boneArray = sharedData.boneArray;
        this.vertexColorArray = sharedData.vertexColorArray;
        this.edgeColorArray = sharedData.edgeColorArray;

        this.vertexColorArray.set(this.vertexColor);
        this.bucket.updateVertexColors[0] = 1;

        this.edgeColorArray.set(this.edgeColor);
        this.bucket.updateEdgeColors[0] = 1;
    },

    invalidateSharedData() {
        this.boneArray = null;
        this.vertexColorArray = null;
        this.edgeColorArray = null;
    },

    update() {
        mat4.copy(this.boneArray, this.worldMatrix);
    },

    setVertexColor(color) {
        this.vertexColor.set(color);

        if (this.bucket) {
            this.vertexColorArray.set(color);
            this.bucket.updateVertexColors[0] = 1;
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
