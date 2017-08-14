import { mix } from "../../common";
import Bucket from "../../bucket";
import MdxParticleEmitter from "./particleemitter";
import MdxParticle2Emitter from "./particle2emitter";
import MdxRibbonEmitter from "./ribbonemitter";
import MdxEventObjectSpnEmitter from "./eventobjectspnemitter";
import MdxEventObjectSplEmitter from "./eventobjectsplemitter";
import MdxEventObjectUbrEmitter from "./eventobjectubremitter";

/**
 * @constructor
 * @augments Bucket
 * @memberOf Mdx
 * @param {MdxModelView} modelView
 */
function MdxBucket(modelView) {
    Bucket.call(this, modelView);

    let model = this.model,
        gl = model.env.gl,
        numberOfBones = model.bones.length + 1,
        objects;
    
    this.boneArrayInstanceSize = numberOfBones * 16;
    this.boneArray = new Float32Array(this.boneArrayInstanceSize * this.size);

    this.updateBoneTexture = false;
    this.boneTexture = gl.createTexture();
    this.boneTextureWidth = numberOfBones * 4;
    this.boneTextureHeight = this.size;
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
    this.updateTeamColors = false;
    this.teamColorArray = new Uint8Array(this.size);
    this.teamColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.teamColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.teamColorArray, gl.DYNAMIC_DRAW);

    // Vertex color (per instance)
    this.updateVertexColors = false;
    this.vertexColorArray = new Uint8Array(4 * this.size).fill(255); // Vertex color initialized to white
    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexColorArray, gl.DYNAMIC_DRAW);

    // Batch visibility (per instance per batch)
    this.updateGeosetVisibilities = false;
    this.geosetVisibilityArrays = [];
    this.geosetVisibilityBuffers = [];

    // Geoset colors (per instance per geoset)
    this.updateGeosetColors = false;
    this.geosetColorArrays = [];
    this.geosetColorBuffers = [];

    // Layer alphas (per instance per layer)
    this.updateLayerAlphas = false;
    this.layerAlphaArrays = [];
    this.layerAlphaBuffers = [];

    // Texture coordinate animations (per instance per layer)
    this.updateUvOffsets = false;
    this.uvOffsetArrays = [];
    this.uvOffsetBuffers = [];

    // Batches
    if (model.batches.length) {
        for (var i = 0, l = model.geosets.length; i < l; i++) {
            this.geosetVisibilityArrays[i] = new Uint8Array(this.size);
            this.geosetVisibilityBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetVisibilityBuffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, this.geosetVisibilityArrays[i], gl.DYNAMIC_DRAW);

            this.geosetColorArrays[i] = new Uint8Array(3 * this.size).fill(255); // Geoset colors are initialized to white
            this.geosetColorBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetColorBuffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, this.geosetColorArrays[i], gl.DYNAMIC_DRAW);
        }

        for (var i = 0, l = model.layers.length; i < l; i++) {
            this.uvOffsetArrays[i] = new Float32Array(4 * this.size);
            this.uvOffsetBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvOffsetBuffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, this.uvOffsetArrays[i], gl.DYNAMIC_DRAW);

            this.layerAlphaArrays[i] = new Uint8Array(this.size).fill(255); // Layer alphas are initialized to opaque
            this.layerAlphaBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.layerAlphaBuffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, this.layerAlphaArrays[i], gl.DYNAMIC_DRAW);
        }
    }

    // Emitters
    this.particleEmitters = [];
    this.particle2Emitters = [];
    this.eventObjectEmitters = [];
    this.ribbonEmitters = [];

    objects = model.particleEmitters;
    for (let i = 0, l = objects.length; i < l; i++) {
        this.particleEmitters[i] = new MdxParticleEmitter(objects[i]);
    }

    objects = model.particle2Emitters;
    for (let i = 0, l = objects.length; i < l; i++) {
        this.particle2Emitters[i] = new MdxParticle2Emitter(objects[i]);
    }

    objects = model.ribbonEmitters;
    for (let i = 0, l = objects.length; i < l; i++) {
        this.ribbonEmitters[i] = new MdxRibbonEmitter(model, objects[i]);
    }

    objects = model.eventObjectEmitters;
    for (let i = 0, l = objects.length; i < l; i++) {
        let object = objects[i],
            type = object.type;

        if (type === "SPN") {
            this.eventObjectEmitters.push(new MdxEventObjectSpnEmitter(object));
        } else if (type === "SPL") {
            this.eventObjectEmitters.push(new MdxEventObjectSplEmitter(object));
        } else if (type === "UBR") {
            this.eventObjectEmitters.push(new MdxEventObjectUbrEmitter(object));
        }
    }
}

MdxBucket.prototype = {
    getRenderStats() {
        let model = this.model,
            calls = 0,
            instances = this.instances.length,
            vertices = 0,
            polygons = 0,
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
                vertices += active * 6;
                polygons += active * 2;
            }
        }

        objects = this.ribbonEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            let emitter = objects[i],
                active = emitter.active.length;

            if (active > 0) {
                calls += 1;
                vertices += active * 6;
                polygons += active * 2;
            }
        }

        objects = this.eventObjectEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            let emitter = objects[i],
                active = emitter.active.length;

            if (active > 0) {
                let type = emitter.type;

                if (type === "SPL" || type === "UBR") {
                    calls += 1;
                    vertices += active * 6;
                    polygons += active * 2;
                }
            }
        }
      
        return { calls, instances, vertices, polygons };
    },

    update(scene) {
        let gl = this.model.env.gl,
            size = this.instances.length,
            objects;

        objects = this.particleEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        objects = this.particle2Emitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update(scene);
        }

        objects = this.ribbonEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update(scene);
        }

        objects = this.eventObjectEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update(scene);
        }

        if (this.updateBoneTexture) {
            this.updateBoneTexture = false;

            gl.activeTexture(gl.TEXTURE15);
            gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, size, gl.RGBA, gl.FLOAT, this.boneArray);
        }

        if (this.updateTeamColors) {
            this.updateTeamColors = false;

            gl.bindBuffer(gl.ARRAY_BUFFER, this.teamColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.teamColorArray.subarray(0, size));
        }

        if (this.updateVertexColors) {
            this.updateVertexColors = false;

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexColorArray.subarray(0, 4 * size));
        }

        if (this.updateGeosetVisibilities) {
            this.updateGeosetVisibilities = false;

            for (var i = 0, l = this.geosetVisibilityArrays.length; i < l; i++) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetVisibilityBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.geosetVisibilityArrays[i].subarray(0, size));
            }
        }

        if (this.updateGeosetColors) {
            this.updateGeosetColors = false;

            for (var i = 0, l = this.geosetColorArrays.length; i < l; i++) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetColorBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.geosetColorArrays[i].subarray(0, 3 * size));
            }
        }

        if (this.updateUvOffsets) {
            this.updateUvOffsets = false;

            for (var i = 0, l = this.uvOffsetArrays.length; i < l; i++) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvOffsetBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvOffsetArrays[i].subarray(0, 4 * size));
            }
        }

        if (this.updateLayerAlphas) {
            this.updateLayerAlphas = false;

            for (var i = 0, l = this.layerAlphaArrays.length; i < l; i++) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.layerAlphaBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.layerAlphaArrays[i].subarray(0, size));
            }
        }
    },

    getSharedData(index) {
        var data = {
            boneArray: new Float32Array(this.boneArray.buffer, this.boneArrayInstanceSize * 4 * index, this.boneArrayInstanceSize),
            teamColorArray: new Uint8Array(this.teamColorArray.buffer, index, 1),
            vertexColorArray: new Uint8Array(this.vertexColorArray.buffer, 4 * index, 4),
            geosetVisibilityArrays: [],
            geosetColorArrays: [],
            uvOffsetArrays: [],
            layerAlphaArrays: []
        };

        for (var i = 0, l = this.geosetVisibilityArrays.length; i < l; i++) {
            data.geosetVisibilityArrays[i] = new Uint8Array(this.geosetVisibilityArrays[i].buffer, index, 1);
            data.geosetColorArrays[i] = new Uint8Array(this.geosetColorArrays[i].buffer, 3 * index, 3);
        }

        for (var i = 0, l = this.uvOffsetArrays.length; i < l; i++) {
            data.uvOffsetArrays[i] = new Float32Array(this.uvOffsetArrays[i].buffer, 4 * 4 * index, 4);
            data.layerAlphaArrays[i] = new Uint8Array(this.layerAlphaArrays[i].buffer, index, 1);
        }

        return data;
    }
};

mix(MdxBucket.prototype, Bucket.prototype);

export default MdxBucket;
