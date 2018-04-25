import Bucket from '../../bucket';
import MdxParticleEmitter from './particleemitter';
import MdxParticleEmitter2 from './particleemitter2';
import MdxRibbonEmitter from './ribbonemitter';
import MdxEventObjectSpnEmitter from './eventobjectspnemitter';
import MdxEventObjectSplEmitter from './eventobjectsplemitter';
import MdxEventObjectUbrEmitter from './eventobjectubremitter';

export default class MdxBucket extends Bucket {
    /**
     * @param {MdxModelView} modelView
     */
    constructor(modelView) {
        super(modelView);

        let model = this.model,
            batchSize = model.batchSize,
            gl = model.env.gl,
            numberOfBones = model.bones.length + 1,
            objects;

        this.boneArrayInstanceSize = numberOfBones * 16;
        this.boneArray = new Float32Array(this.boneArrayInstanceSize * batchSize);

        this.boneTexture = gl.createTexture();
        this.boneTextureWidth = numberOfBones * 4;
        this.boneTextureHeight = batchSize;
        this.vectorSize = 1 / this.boneTextureWidth;
        this.rowSize = 1 / this.boneTextureHeight;

        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.boneTextureWidth, this.boneTextureHeight, 0, gl.RGBA, gl.FLOAT, this.boneArray);

        // Team colors (per instance)
        this.teamColorArray = new Uint8Array(batchSize);
        this.teamColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.teamColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.teamColorArray, gl.DYNAMIC_DRAW);

        // Vertex color (per instance)
        this.vertexColorArray = new Uint8Array(4 * batchSize).fill(255); // Vertex color initialized to white
        this.vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexColorArray, gl.DYNAMIC_DRAW);

        // Geoset colors (per instance per geoset)
        this.geosetColorArrays = [];
        this.geosetColorBuffers = [];

        // Layer alphas (per instance per layer)
        this.layerAlphaArrays = [];
        this.layerAlphaBuffers = [];

        // Texture coordinate animations (per instance per layer)
        this.uvOffsetArrays = [];
        this.uvOffsetBuffers = [];

        this.hasBatches = model.batches.length > 0;

        // Batches
        if (this.hasBatches) {
            for (var i = 0, l = model.geosets.length; i < l; i++) {
                this.geosetColorArrays[i] = new Uint8Array(4 * batchSize).fill(255); // Geoset colors are initialized to white
                this.geosetColorBuffers[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetColorBuffers[i]);
                gl.bufferData(gl.ARRAY_BUFFER, this.geosetColorArrays[i], gl.DYNAMIC_DRAW);
            }

            for (var i = 0, l = model.layers.length; i < l; i++) {
                this.uvOffsetArrays[i] = new Float32Array(4 * batchSize);
                this.uvOffsetBuffers[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvOffsetBuffers[i]);
                gl.bufferData(gl.ARRAY_BUFFER, this.uvOffsetArrays[i], gl.DYNAMIC_DRAW);

                this.layerAlphaArrays[i] = new Uint8Array(batchSize).fill(255); // Layer alphas are initialized to opaque
                this.layerAlphaBuffers[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.layerAlphaBuffers[i]);
                gl.bufferData(gl.ARRAY_BUFFER, this.layerAlphaArrays[i], gl.DYNAMIC_DRAW);
            }
        }
    }

    getRenderStats() {
        let model = this.model,
            calls = 0,
            instances = this.instances.length,
            vertices = 0,
            polygons = 0,
            dynamicVertices = 0,
            dynamicPolygons = 0,
            objects;

        objects = model.batches;
        for (let i = 0, l = objects.length; i < l; i++) {
            let geoset = objects[i].geoset;

            calls += 1;
            vertices += (geoset.locationArray.length / 3) * instances;
            polygons += (geoset.faceArray.length / 3) * instances;
        }

        objects = this.particle2Emitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            let emitter = objects[i],
                active = emitter.active.length;

            if (active > 0) {
                calls += 1;
                dynamicVertices += active * 6;
                dynamicPolygons += active * 2;
            }
        }

        objects = this.ribbonEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            let emitter = objects[i],
                active = emitter.active.length;

            if (active > 0) {
                calls += 1;
                dynamicVertices += active * 6;
                dynamicPolygons += active * 2;
            }
        }

        objects = this.eventObjectEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            let emitter = objects[i],
                active = emitter.active.length;

            if (active > 0) {
                let type = emitter.type;

                if (type === 'SPL' || type === 'UBR') {
                    calls += 1;
                    dynamicVertices += active * 6;
                    dynamicPolygons += active * 2;
                }
            }
        }

        return { calls, instances, vertices, polygons, dynamicVertices, dynamicPolygons };
    }

    fill(data, baseInstance, scene) {
        let model = this.model,
            gl = model.env.gl,
            batchSize = model.batchSize,
            geosetCount = model.geosets.length,
            layerCount = model.layers.length,
            boneArray = this.boneArray,
            teamColorArray = this.teamColorArray,
            vertexColorArray = this.vertexColorArray,
            geosetColorArrays = this.geosetColorArrays,
            layerAlphaArrays = this.layerAlphaArrays,
            uvOffsetArrays = this.uvOffsetArrays,
            instanceOffset = 0,
            instances = data.instances,
            particleEmitters = data.particleEmitters,
            particleEmitters2 = data.particleEmitters2,
            ribbonEmitters = data.ribbonEmitters,
            eventObjectEmitters = data.eventObjectEmitters;

        for (let l = instances.length; baseInstance < l && instanceOffset < batchSize; baseInstance++) {
            let instance = instances[baseInstance];

            if (instance.loaded && instance.rendered && !instance.culled) {
                let bones = instance.skeleton.bones,
                    vertexColor = instance.vertexColor,
                    boneMatrices = instance.skeleton.boneMatrices,
                    geosetColors = instance.geosetColors,
                    layerAlphas = instance.layerAlphas,
                    uvOffsets = instance.uvOffsets,
                    base = 16 + instanceOffset * (16 + boneMatrices.length),
                    particleEmitterViews = instance.particleEmitters,
                    particleEmitter2Views = instance.particleEmitters2,
                    ribbonEmitterViews = instance.ribbonEmitters,
                    eventObjectEmitterViews = instance.eventObjectEmitters;

                // Bones
                for (let j = 0, k = boneMatrices.length; j < k; j++) {
                    boneArray[base + j] = boneMatrices[j];
                }

                // Team color
                teamColorArray[instanceOffset] = instance.teamColor;

                // Vertex color
                vertexColorArray[instanceOffset * 4] = vertexColor[0];
                vertexColorArray[instanceOffset * 4 + 1] = vertexColor[1];
                vertexColorArray[instanceOffset * 4 + 2] = vertexColor[2];
                vertexColorArray[instanceOffset * 4 + 3] = vertexColor[3];

                for (let geosetIndex = 0; geosetIndex < geosetCount; geosetIndex++) {
                    let geosetColorArray = geosetColorArrays[geosetIndex];

                    // Geoset color
                    geosetColorArray[instanceOffset * 4] = geosetColors[geosetIndex * 4];
                    geosetColorArray[instanceOffset * 4 + 1] = geosetColors[geosetIndex * 4 + 1];
                    geosetColorArray[instanceOffset * 4 + 2] = geosetColors[geosetIndex * 4 + 2];
                    geosetColorArray[instanceOffset * 4 + 3] = geosetColors[geosetIndex * 4 + 3];
                }

                for (let layerIndex = 0; layerIndex < layerCount; layerIndex++) {
                    let layerAlphaArray = layerAlphaArrays[layerIndex],
                        uvOffsetArray = uvOffsetArrays[layerIndex];

                    // Layer alpha
                    layerAlphaArray[instanceOffset] = layerAlphas[layerIndex];

                    // Texture coordinate animation + sprite animation
                    uvOffsetArray[instanceOffset * 4] = uvOffsets[layerIndex * 4];
                    uvOffsetArray[instanceOffset * 4 + 1] = uvOffsets[layerIndex * 4 + 1];
                    uvOffsetArray[instanceOffset * 4 + 2] = uvOffsets[layerIndex * 4 + 2];
                    uvOffsetArray[instanceOffset * 4 + 3] = uvOffsets[layerIndex * 4 + 3];
                }

                for (let i = 0, l = particleEmitters.length; i < l; i++) {
                    particleEmitters[i].fill(particleEmitterViews[i], scene);
                }

                for (let i = 0, l = particleEmitters2.length; i < l; i++) {
                    particleEmitters2[i].fill(particleEmitter2Views[i], scene);
                }

                for (let i = 0, l = ribbonEmitters.length; i < l; i++) {
                    ribbonEmitters[i].fill(ribbonEmitterViews[i], scene);
                }

                for (let i = 0, l = eventObjectEmitters.length; i < l; i++) {
                    eventObjectEmitters[i].fill(eventObjectEmitterViews[i], scene);
                }

                instanceOffset += 1;
            }
        }

        // Save the number of instances of which data was copied.
        this.count = instanceOffset;

        if (instanceOffset) {
            gl.activeTexture(gl.TEXTURE15);
            gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, instanceOffset, gl.RGBA, gl.FLOAT, boneArray);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.teamColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, teamColorArray);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexColorArray);

            for (let i = 0; i < geosetCount; i++) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetColorBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, geosetColorArrays[i]);
            }

            for (let i = 0; i < layerCount; i++) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.layerAlphaBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, layerAlphaArrays[i]);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvOffsetBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, uvOffsetArrays[i]);
            }
        }

        return baseInstance;
    }
};
