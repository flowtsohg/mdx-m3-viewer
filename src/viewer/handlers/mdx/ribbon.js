import { vec3} from 'gl-matrix';
import { uint8ToUint24 } from '../../../common/typecast';

// Heap allocations needed for this module.
let belowHeap = vec3.create(),
    aboveHeap = vec3.create();

export default class MdxRibbon {
    /**
     * @param {MdxRibbonEmitter} emitter
     */
    constructor(emitter) {
        this.emitter = emitter;
        this.health = 0;
        this.emitterView = null;

        this.vertices = new Float32Array(12);
        this.lta = 0;
        this.lba = 0;
        this.rta = 0;
        this.rba = 0;
        this.rgb = 0;
    }

    reset(emitterView) {
        let emitter = this.emitter,
            vertices = this.vertices;

        this.index = emitterView.currentRibbon++;

        emitterView.ribbonCount++;

        this.emitterView = emitterView;

        this.health = emitter.lifespan;

        let lastEmit = emitterView.lastEmit;
        
        // If this isn't the first ribbon, construct a quad.
        // Otherwise, the vertices will be filled with zeroes, and the ribbon will not render.
        // This allows the emitter to always work with quads, and therefore it can work with many views, because the ribbon chains are implicit.
        if (lastEmit && lastEmit.health > 0) {
            let node = emitterView.instance.skeleton.nodes[emitter.node.index],
                pivot = node.pivot;

            vec3.set(belowHeap, pivot[0], pivot[1] - emitterView.getHeightBelow(), pivot[2])
            vec3.transformMat4(belowHeap, belowHeap, node.worldMatrix);

            vec3.set(aboveHeap, pivot[0], pivot[1] + emitterView.getHeightAbove(), pivot[2])
            vec3.transformMat4(aboveHeap, aboveHeap, node.worldMatrix);

            let lastVertices = lastEmit.vertices;

            // Left top
            vertices[0] = aboveHeap[0];
            vertices[1] = aboveHeap[1];
            vertices[2] = aboveHeap[2];

            // Left bottom
            vertices[3] = belowHeap[0];
            vertices[4] = belowHeap[1];
            vertices[5] = belowHeap[2];

            // Right bottom
            vertices[6] = lastVertices[3];
            vertices[7] = lastVertices[4];
            vertices[8] = lastVertices[5];

            // Right top
            vertices[9] = lastVertices[0];
            vertices[10] = lastVertices[1];
            vertices[11] = lastVertices[2];
        } else {
            vertices[0] = 0;
            vertices[1] = 0;
            vertices[2] = 0;
            vertices[3] = 0;
            vertices[4] = 0;
            vertices[5] = 0;
            vertices[6] = 0;
            vertices[7] = 0;
            vertices[8] = 0;
            vertices[9] = 0;
            vertices[10] = 0;
            vertices[11] = 0;
        }
    }

    update() {
        let emitter = this.emitter,
            emitterView = this.emitterView,
            dt = emitter.model.env.frameTime * 0.001,
            gravity = emitter.gravity * dt * dt,
            vertices = this.vertices,
            animatedColor = emitterView.getColor(),
            animatedAlpha = emitterView.getAlpha(),
            animatedSlot = emitterView.getTextureSlot(),
            chainLengthFactor = 1 / emitterView.ribbonCount,
            locationInChain = (emitterView.currentRibbon - this.index - 1);

        this.health -= dt;

        vertices[1] -= gravity;
        vertices[4] -= gravity;
        vertices[7] -= gravity;
        vertices[10] -= gravity;

        if (this.health <= 0) {
            emitterView.ribbonCount--;
        } else {
            let columns = emitter.dimensions[0],
                left = (animatedSlot % columns) + (locationInChain * chainLengthFactor),
                top = Math.floor(animatedSlot / columns),
                right = left + chainLengthFactor,
                bottom = top + 1;

            left = Math.floor(left * 255);
            top = Math.floor(top * 255);
            // Paladin - when the UV rectangle reaches 254-255 on the X axis, it has a row or two of white pixels in the end for some reason.
            // This happens also if the texture coordinates are clamped to [0, 1] in the shader.
            // The only thing that removes it is to change the texture to being clamped rather than repeating.
            // How is this possible?
            right = Math.floor(right * 255); 
            bottom = Math.floor(bottom * 255);
            animatedAlpha = Math.floor(animatedAlpha * 255);

            this.lta = uint8ToUint24(left, top, animatedAlpha);
            this.lba = uint8ToUint24(left, bottom, animatedAlpha);
            this.rta = uint8ToUint24(right, top, animatedAlpha);
            this.rba = uint8ToUint24(right, bottom, animatedAlpha);
            this.rgb = uint8ToUint24(Math.floor(animatedColor[0] * 255), Math.floor(animatedColor[1] * 255), Math.floor(animatedColor[2] * 255)); // Color even used???
        }
    }
};
