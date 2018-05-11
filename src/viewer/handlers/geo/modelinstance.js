import { mat4 } from 'gl-matrix';
import ModelInstance from '../../modelinstance';
import BoundingShape from '../../boundingshape';

export default class GeometryModelInstance extends ModelInstance {
    /**
     * @param {GeometryModel} model
     */
    constructor(model) {
        super(model);

        this.vertexColor = new Uint8Array(4);
        this.edgeColor = new Uint8Array(4);
    }

    load() {
        //this.boundingShape = new BoundingShape();
        //this.boundingShape.fromVertices(this.model.vertexArray);
        //this.boundingShape.setParent(this);

        // Initialize to the model's material color
        this.setVertexColor(this.model.vertexColor);
        this.setEdgeColor(this.model.edgeColor);
    }

    setVertexColor(color) {
        this.vertexColor.set(color);

        return this;
    }

    setEdgeColor(color) {
        this.edgeColor.set(color);

        return this;
    }
};
