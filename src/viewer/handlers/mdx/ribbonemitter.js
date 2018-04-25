import ResizeableBuffer from '../../gl/resizeablebuffer';
import MdxSharedGeometryEmitter from './sharedgeometryemitter';
import MdxSdContainer from './sd';
import MdxRibbon from './ribbon';

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

    fill(emitterView, scene) {
        let emission = emitterView.currentEmission;

        if (emission >= 1) {
            for (let i = 0, l = Math.floor(emission); i < l; i++ , emitterView.currentEmission--) {
                emitterView.lastEmit = this.emit(emitterView);
            }
        }
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

    render(modelView, shader) {
        let active = this.active.length;

        if (active > 0) {
            let model = this.modelObject.model,
                gl = model.env.gl;

            this.modelObject.layer.bind(shader);

            gl.uniform2fv(shader.uniforms.get('u_dimensions'), this.modelObject.dimensions);

            model.bindTexture(this.modelObject.texture, 0, modelView);

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
};
