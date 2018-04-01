import MdxSharedEmitter from './sharedemitter';

export default class MdxSharedGeometryEmitter extends MdxSharedEmitter {
    updateData() {
        let active = this.active,
            data = this.buffer.float32array;

        for (let i = 0, l = active.length, offset = 0; i < l; i++ , offset += 30) {
            let object = active[i],
                vertices = object.vertices,
                lta = object.lta,
                lba = object.lba,
                rta = object.rta,
                rba = object.rba,
                rgb = object.rgb;

            data[offset + 0] = vertices[0];
            data[offset + 1] = vertices[1];
            data[offset + 2] = vertices[2];
            data[offset + 3] = lta;
            data[offset + 4] = rgb;

            data[offset + 5] = vertices[3];
            data[offset + 6] = vertices[4];
            data[offset + 7] = vertices[5];
            data[offset + 8] = lba;
            data[offset + 9] = rgb;

            data[offset + 10] = vertices[6];
            data[offset + 11] = vertices[7];
            data[offset + 12] = vertices[8];
            data[offset + 13] = rba;
            data[offset + 14] = rgb;

            data[offset + 15] = vertices[0];
            data[offset + 16] = vertices[1];
            data[offset + 17] = vertices[2];
            data[offset + 18] = lta;
            data[offset + 19] = rgb;

            data[offset + 20] = vertices[6];
            data[offset + 21] = vertices[7];
            data[offset + 22] = vertices[8];
            data[offset + 23] = rba;
            data[offset + 24] = rgb;

            data[offset + 25] = vertices[9];
            data[offset + 26] = vertices[10];
            data[offset + 27] = vertices[11];
            data[offset + 28] = rta;
            data[offset + 29] = rgb;
        }
    }

    render(bucket, shader) {
        let modelObject = this.modelObject,
            active = this.active.length;

        if (modelObject.internalResource && active > 0) {
            let model = modelObject.model,
                gl = model.env.gl;

            gl.blendFunc(modelObject.blendSrc, modelObject.blendDst);

            gl.uniform2fv(shader.uniforms.get('u_dimensions'), modelObject.dimensions);

            model.bindTexture(modelObject.internalResource, 0, bucket.modelView);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.float32array.subarray(0, active * 30));

            gl.vertexAttribPointer(shader.attribs.get('a_position'), 3, gl.FLOAT, false, 20, 0);
            gl.vertexAttribPointer(shader.attribs.get('a_uva_rgb'), 2, gl.FLOAT, false, 20, 12);

            gl.drawArrays(gl.TRIANGLES, 0, active * 6);
        }
    }
};
