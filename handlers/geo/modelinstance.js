/**
 * @class
 * @classdesc A geometry model instance.
 * @extends ModelInstance
 * @memberOf Geo
 * @param {ModelViewer} env The model viewer object that this texture belongs to.
 */
function GeometryModelInstance(env) {
    ModelInstance.call(this, env);
}

GeometryModelInstance.prototype = {
    initialize() {
        this.boundingShape = new BoundingShape();
        this.boundingShape.fromVertices(this.model.vertexArray);
        this.boundingShape.setParent(this);
    },

    setSharedData(sharedData) {
        this.bucket = sharedData.bucket;
        this.boneArray = sharedData.boneArray;
        this.colorArray = sharedData.colorArray;
        this.edgeColorArray = sharedData.edgeColorArray;

        // Initialize to the model's material color
        this.setColor(this.model.color);
        this.setEdgeColor(this.model.edgeColor);
    },

    update() {
        mat4.copy(this.boneArray, this.worldMatrix);
    },

    setColor(color) {
        if (this.rendered) {
            this.colorArray.set(color);
            this.bucket.updateColors[0] = 1;
        } else {
            this.addAction(id => this.setColor(color), [color]);
        }

        return this;
    },

    setEdgeColor(color) {
        if (this.rendered) {
            this.edgeColorArray.set(color);
            this.bucket.updateEdgeColors[0] = 1;
        } else {
            this.addAction(id => this.setEdgeColor(color), [color]);
        }

        return this;
    }
};

mix(GeometryModelInstance.prototype, ModelInstance.prototype);
