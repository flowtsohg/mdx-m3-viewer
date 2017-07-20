import { vec3 } from "gl-matrix";
import ResizeableBuffer from "../../gl/resizeablebuffer";
import MdxSdContainer from "./sd";
import MdxRibbon from "./ribbon";
import MdxParticleEmitter from "./particleemitter";
import MdxParticle2Emitter from "./particle2emitter";

// Heap allocations needed for this module.
let colorHeap = vec3.create();

/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserRibbonEmitter} emitter
 */
function MdxRibbonEmitter(model, emitter) {
    let gl = model.gl,
        layer = model.materials[emitter.materialId][0];

    this.model = model;

    this.active = [];
    this.inactive = [];

    this.buffer = new ResizeableBuffer(gl);
    this.bytesPerEmit = 4 * 30;

    this.heightAbove = emitter.heightAbove;
    this.heightBelow = emitter.heightBelow;
    this.alpha = emitter.alpha;
    this.color = emitter.color;
    this.lifespan = emitter.lifespan;
    this.textureSlot = emitter.textureSlot;
    this.emissionRate = emitter.emissionRate;
    this.gravity = emitter.gravity;

    this.dimensions = [emitter.columns, emitter.rows];
    this.cellWidth = 1 / emitter.columns;
    this.cellHeight = 1 / emitter.rows;

    this.node = model.nodes[emitter.node.index];

    this.layer = layer;
    this.texture = model.textures[layer.textureId];

    this.sd = new MdxSdContainer(model, emitter.tracks);
}

MdxRibbonEmitter.prototype = {
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
    },

    update: MdxParticleEmitter.prototype.update,
    updateData: MdxParticle2Emitter.prototype.updateData,

    render(bucket, shader) {
        let active = this.active.length;

        if (active > 0) {
            let model = this.model,
                gl = model.gl;

            this.layer.bind(shader);

            gl.uniform2fv(shader.uniforms.get("u_dimensions"), this.dimensions);

            model.bindTexture(this.texture, 0, bucket.modelView);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.float32array.subarray(0, active * 30));

            gl.vertexAttribPointer(shader.attribs.get("a_position"), 3, gl.FLOAT, false, 20, 0);
            gl.vertexAttribPointer(shader.attribs.get("a_uva_rgb"), 2, gl.FLOAT, false, 20, 12);

            gl.drawArrays(gl.TRIANGLES, 0, active * 6);
        }
    },

    shouldRender(instance) {
        return this.getVisibility(instance) > 0.75;
    },

    getHeightBelow(instance) {
        return this.sd.getValue("KRHB", instance, this.heightBelow);
    },

    getHeightAbove(instance) {
        return this.sd.getValue("KRHA", instance, this.heightAbove);
    },

    getTextureSlot(instance) {
        return this.sd.getValue("KRTX", instance, 0);
    },

    getColor(instance) {
        return this.sd.getValue3(colorHeap, "KRCO", instance, this.color);
    },

    getAlpha(instance) {
        return this.sd.getValue("KRAL", instance, this.alpha);
    },

    getVisibility(instance) {
        return this.sd.getValue("KRVS", instance, 1);
    }
};

export default MdxRibbonEmitter;
