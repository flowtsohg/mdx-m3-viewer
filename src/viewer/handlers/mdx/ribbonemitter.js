import { vec3 } from 'gl-matrix';
import ResizeableBuffer from '../../gl/resizeablebuffer';
import MdxSharedGeometryEmitter from './sharedgeometryemitter';
import MdxSdContainer from './sd';
import MdxRibbon from './ribbon';

// Heap allocations needed for this module.
let colorHeap = vec3.create();

export default class MdxRibbonEmitter extends MdxSharedGeometryEmitter {
    /**
     * @param {MdxModel} model
     * @param {MdxParserRibbonEmitter} emitter
     */
    constructor(modelObject) {
        super(modelObject);

        this.bytesPerEmit = 4 * 30;
        this.buffer = new ResizeableBuffer(modelObject.model.env.gl);
    }

    emit(emitterView) {
        this.buffer.grow((this.active.length + 1) * this.bytesPerEmit);

        let inactive = this.inactive,
            object;

        if (inactive.length) {
            object = inactive.pop();
        } else {
            object = new MdxRibbon(this);
        }

        object.reset(emitterView);

        this.active.push(object);

        return object;
    }

    render(bucket, shader) {
        let active = this.active.length;

        if (active > 0) {
            let model = this.modelObject.model,
                gl = model.env.gl;

            this.modelObject.layer.bind(shader);

            gl.uniform2fv(shader.uniforms.get('u_dimensions'), this.modelObject.dimensions);

            model.bindTexture(this.modelObject.texture, 0, bucket.modelView);

            /// TODO: Needed to avoid bleeding from the other side of the texture.
            ///       Any better way to handle this?
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.float32array.subarray(0, active * 30));

            gl.vertexAttribPointer(shader.attribs.get('a_position'), 3, gl.FLOAT, false, 20, 0);
            gl.vertexAttribPointer(shader.attribs.get('a_uva_rgb'), 2, gl.FLOAT, false, 20, 12);

            gl.drawArrays(gl.TRIANGLES, 0, active * 6);
        }
    }

    shouldRender(instance) {
        return this.getVisibility(instance) > 0.75;
    }

    getHeightBelow(instance) {
        return this.modelObject.getValue('KRHB', instance, this.modelObject.heightBelow);
    }

    getHeightAbove(instance) {
        return this.modelObject.getValue('KRHA', instance, this.modelObject.heightAbove);
    }

    getTextureSlot(instance) {
        return this.modelObject.getValue('KRTX', instance, 0);
    }

    getColor(instance) {
        return this.modelObject.getValue3(colorHeap, 'KRCO', instance, this.modelObject.color);
    }

    getAlpha(instance) {
        return this.modelObject.getValue('KRAL', instance, this.modelObject.alpha);
    }

    getVisibility(instance) {
        return this.modelObject.getValue('KRVS', instance, 1);
    }
};
