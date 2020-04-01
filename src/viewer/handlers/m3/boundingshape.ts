import BoundingShape from '../../../parsers/m3/boundingshape';

/**
 * An M3 bounding shape.
 */
export default class M3BoundingShape {
  bone: number;
  matrix: Float32Array;

  constructor(boundingshape: BoundingShape) {
    this.bone = boundingshape.bone;
    this.matrix = boundingshape.matrix;
    //this.name = bones[boundingshape.bone].name;
    /*
    var size = boundingshape.size;
    var shape;

    if (boundingshape.shape === 0) {
        shape = gl.createCube(-size[0], -size[1], -size[2], size[0], size[1], size[2]);
    } else if (boundingshape.shape === 1) {
        shape = gl.createSphere(0, 0, 0, 9, 9, size[0]);
    } else {
        shape = gl.createCylinder(0, 0, 0, size[0], size[1], 9);
    }

    this.shape = shape;
    */
  }
}
