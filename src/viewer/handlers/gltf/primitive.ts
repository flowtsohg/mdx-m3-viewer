import ShaderProgram from '../../gl/program';
import GltfModel from './model';
import { getPrimitiveFlags } from './flags';

/**
 * A glTF mesh primitive.
 */
export default class GltfPrimitive {
  model: GltfModel;
  material: number;
  positions: number;
  normals: number = -1;
  tangents: number = -1;
  uvSet0: number = -1;
  uvSet1: number = -1;
  mode: number = 4;
  indices: number = -1;
  flags: number;

  constructor(model: GltfModel, primitive: object) {
    let attributes = primitive.attributes;

    this.model = model;
    this.material = primitive.material;
    this.positions = attributes.POSITION;

    if (attributes.NORMAL !== undefined) {
      this.normals = attributes.NORMAL;
    }

    if (attributes.TANGENT !== undefined) {
      this.tangents = attributes.TANGENT;
    }

    if (attributes.TEXCOORD_0 !== undefined) {
      this.uvSet0 = attributes.TEXCOORD_0;
    }

    if (attributes.TEXCOORD_1 !== undefined) {
      this.uvSet1 = attributes.TEXCOORD_1;
    }

    if (primitive.mode !== undefined) {
      this.mode = primitive.mode;
    }

    if (primitive.indices !== undefined) {
      this.indices = primitive.indices;
    }

    this.flags = getPrimitiveFlags(this);
  }

  render(shader: ShaderProgram) {
    let model = this.model;
    let accessors = model.accessors;
    let attribs = shader.attribs;
    let positions = accessors[this.positions];

    positions.bind(attribs.a_position);

    if (this.normals !== -1) {
      accessors[this.normals].bind(attribs.a_normal);
    }

    if (this.tangents !== -1) {
      accessors[this.tangents].bind(attribs.a_tangent);
    }

    if (this.uvSet0 !== -1) {
      accessors[this.uvSet0].bind(attribs.a_uv0);
    }

    if (this.uvSet1 !== -1) {
      accessors[this.uvSet1].bind(attribs.a_uv1);
    }

    if (this.indices !== -1) {
      accessors[this.indices].render(this.mode);
    } else {
      positions.render(this.mode);
    }
  }
}
