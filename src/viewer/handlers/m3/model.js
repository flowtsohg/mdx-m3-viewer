import M3Parser from '../../../parsers/m3/model';
import TexturedModel from '../../texturedmodel';
import M3StandardMaterial from './standardmaterial';
import M3Bone from './bone';
import M3Sequence from './sequence';
import M3Sts from './sts';
import M3Stc from './stc';
import M3Stg from './stg';
import M3Attachment from './attachment';
import M3Camera from './camera';
import M3Region from './region';

export default class M3Model extends TexturedModel {
    /**
     * @param {Object} resourceData
     */
    constructor(resourceData) {
        super(resourceData);

        this.parser = null;
        this.name = '';
        this.batches = [];
        this.materials = [[], []]; // 2D array for the possibility of adding more material types in the future
        this.materialMaps = [];
        this.bones = [];
        this.boneLookup = [];
        this.sequences = [];
        this.sts = [];
        this.stc = [];
        this.stg = [];
        this.attachments = [];
        this.cameras = [];
    }

    load(src) {
        var parser = new M3Parser(src);

        var i, l;
        var model = parser.model;
        var div = model.divisions.get();

        this.parser = parser;
        this.name = model.modelName.getAll().join('');

        this.setupGeometry(model, div);

        var materialMaps = model.materialReferences.getAll();
        var materials = model.materials[0].getAll();
        var batches = [];

        this.materialMaps = materialMaps;

        // Create concrete material objects for standard materials
        for (i = 0, l = materials.length; i < l; i++) {
            this.materials[1][i] = new M3StandardMaterial(this, materials[i]);
        }

        const divBatches = div.batches.getAll();

        // Create concrete batch objects
        for (i = 0, l = divBatches.length; i < l; i++) {
            var batch = divBatches[i];
            var regionId = batch.regionIndex;
            var materialMap = materialMaps[batch.materialReferenceIndex];

            if (materialMap.materialType === 1) {
                batches.push({ regionId: regionId, region: this.regions[regionId], material: this.materials[1][materialMap.materialIndex] });
            }
        }

        /*
        var batchGroups = [[], [], [], [], [], []];

        for (i = 0, l = batches.length; i < l; i++) {
        var blendMode = batches[i].material.blendMode;

        batchGroups[blendMode].push(batches[i]);
        }

        function sortByPriority(a, b) {
        var a = a.material.priority;
        var b = b.material.priority;

        if (a < b) {
        return 1;
        } else if (a == b) {
        return 0;
        } else {
        return -1;
        }
        }

        for (i = 0; i < 6; i++) {
        batchGroups[i].sort(sortByPriority);
        }
        */
        /*
        // In the EggPortrait model the batches seem to be sorted by blend mode. Is this true for every model?
        this.batches.sort(function (a, b) {
        var ba = a.material.blendMode;
        var bb = b.material.blendMode;

        if (ba < bb) {
        return -1;
        } else if (ba == bb) {
        return 0;
        } else {
        return 1;
        }
        });
        */

        //this.batches = batchGroups[0].concat(batchGroups[1]).concat(batchGroups[2]).concat(batchGroups[3]).concat(batchGroups[4]).concat(batchGroups[5]);

        this.batches = batches;

        var sts = model.sts.getAll();
        var stc = model.stc.getAll();
        var stg = model.stg.getAll();

        this.initialReference = model.absoluteInverseBoneRestPositions.getAll();

        let bones = model.bones.getAll();
        for (let i = 0, l = bones.length; i < l; i++) {
            this.bones[i] = new M3Bone(this, bones[i]);
        }

        this.boneLookup = model.boneLookup.getAll();

        let sequences = model.sequences.getAll();
        for (i = 0, l = sequences.length; i < l; i++) {
            this.sequences[i] = new M3Sequence(sequences[i]);
        }

        for (i = 0, l = sts.length; i < l; i++) {
            this.sts[i] = new M3Sts(sts[i]);
        }

        for (i = 0, l = stc.length; i < l; i++) {
            this.stc[i] = new M3Stc(stc[i]);
        }

        for (i = 0, l = stg.length; i < l; i++) {
            this.stg[i] = new M3Stg(stg[i], this.sts, this.stc);
        }

        this.addGlobalAnims();

        /*
        if (parser.fuzzyHitTestObjects.length > 0) {
            for (i = 0, l = parser.fuzzyHitTestObjects.length; i < l; i++) {
                this.boundingShapes[i] = new M3BoundingShape(parser.fuzzyHitTestObjects[i], parser.bones, gl);
            }
        }
        */
        /*
        if (parser.particleEmitters.length > 0) {
        this.particleEmitters = [];

        for (i = 0, l = parser.particleEmitters.length; i < l; i++) {
        this.particleEmitters[i] = new M3ParticleEmitter(parser.particleEmitters[i], this);
        }
        }
        */

        let attachments = model.attachmentPoints.getAll();
        for (i = 0, l = attachments.length; i < l; i++) {
            this.attachments[i] = new M3Attachment(attachments[i]);
        }

        let cameras = model.cameras.getAll();
        for (i = 0, l = cameras.length; i < l; i++) {
            this.cameras[i] = new M3Camera(cameras[i]);
        }
    }

    setupGeometry(parser, div) {
        let gl = this.viewer.gl;

        var i, l;
        var uvSetCount = 1;
        var vertexFlags = parser.vertexFlags;

        if (vertexFlags & 0x40000) {
            uvSetCount = 2;
        } else if (vertexFlags & 0x80000) {
            uvSetCount = 3;
        } else if (vertexFlags & 0x100000) {
            uvSetCount = 4;
        }

        var regions = div.regions.getAll();
        var totalElements = 0;
        var offsets = [];

        for (i = 0, l = regions.length; i < l; i++) {
            offsets[i] = totalElements;
            totalElements += regions[i].triangleIndicesCount;
        }

        var elementArray = new Uint16Array(totalElements);

        this.regions = [];

        const triangles = div.triangles.getAll();

        for (i = 0, l = regions.length; i < l; i++) {
            this.regions.push(new M3Region(this, regions[i], triangles, elementArray, offsets[i]));
        }

        this.elementBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementArray, gl.STATIC_DRAW);

        var arrayBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, parser.vertices.getAll(), gl.STATIC_DRAW);

        this.arrayBuffer = arrayBuffer;
        this.vertexSize = (7 + uvSetCount) * 4;
        this.uvSetCount = uvSetCount;
    }

    mapMaterial(index) {
        var materialMap = this.materialMaps[index];

        return this.materials[materialMap.materialType][materialMap.materialIndex];
    }

    addGlobalAnims() {
        /*
        var i, l;
        var glbirth, glstand, gldeath;
        var stgs = this.stg;
        var stg, name;
    
        for (i = 0, l = stgs.length; i < l; i++) {
        stg = stgs[i];
        name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...
    
        if (name === 'glbirth') {
        glbirth = stg;
        } else if (name === 'glstand') {
        glstand = stg;
        } else if (name === 'gldeath') {
        gldeath = stg;
        }
        }
    
        for (i = 0, l = stgs.length; i < l; i++) {
        stg = stgs[i];
        name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...
    
        if (name !== 'glbirth' && name !== 'glstand' && name !== 'gldeath') {
        if (name.indexOf('birth') !== -1 && glbirth) {
        stg.stcIndices = stg.stcIndices.concat(glbirth.stcIndices);
        } else  if (name.indexOf('death') !== -1 && gldeath) {
        stg.stcIndices = stg.stcIndices.concat(gldeath.stcIndices);
        } else if (glstand) {
        stg.stcIndices = stg.stcIndices.concat(glstand.stcIndices);
        }
        }
        }
        */
    }

    getValue(animRef, sequence, frame) {
        if (sequence !== -1) {
            return this.stg[sequence].getValue(animRef, frame)
        } else {
            return animRef.initValue;
        }
    }

    bindShared(bucket) {
        let gl = this.viewer.gl,
            shader = this.shader,
            vertexSize = this.vertexSize,
            instancedArrays = gl.extensions.instancedArrays,
            attribs = shader.attribs,
            uniforms = shader.uniforms;

        // Team colors
        let teamColorAttrib = attribs.get('a_teamColor');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.teamColorBuffer);
        gl.vertexAttribPointer(teamColorAttrib, 1, gl.UNSIGNED_BYTE, false, 1, 0);
        instancedArrays.vertexAttribDivisorANGLE(teamColorAttrib, 1);

        // Vertex colors
        let vertexColorAttrib = attribs.get('a_vertexColor');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.vertexColorBuffer);
        gl.vertexAttribPointer(vertexColorAttrib, 4, gl.UNSIGNED_BYTE, true, 4, 0); // normalize the colors from [0, 255] to [0, 1] here instead of in the pixel shader
        instancedArrays.vertexAttribDivisorANGLE(vertexColorAttrib, 1);

        let instanceIdAttrib = attribs.get('a_InstanceID');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.instanceIdBuffer);
        gl.vertexAttribPointer(instanceIdAttrib, 1, gl.UNSIGNED_SHORT, false, 2, 0);
        instancedArrays.vertexAttribDivisorANGLE(instanceIdAttrib, 1);

        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, bucket.boneTexture);
        gl.uniform1i(uniforms.get('u_boneMap'), 15);
        gl.uniform1f(uniforms.get('u_vectorSize'), bucket.vectorSize);
        gl.uniform1f(uniforms.get('u_rowSize'), bucket.rowSize);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer);
        gl.vertexAttribPointer(attribs.get('a_position'), 3, gl.FLOAT, false, vertexSize, 0);
        gl.vertexAttribPointer(attribs.get('a_weights'), 4, gl.UNSIGNED_BYTE, false, vertexSize, 12);
        gl.vertexAttribPointer(attribs.get('a_bones'), 4, gl.UNSIGNED_BYTE, false, vertexSize, 16);
    }

    bind(bucket, scene) {
        const gl = this.viewer.gl,
            webgl = this.viewer.webgl;

        var vertexSize = this.vertexSize;
        var uvSetCount = this.uvSetCount;

        // HACK UNTIL I IMPLEMENT MULTIPLE SHADERS AGAIN
        var shader = this.viewer.shaderMap.get('M3StandardShader' + (uvSetCount - 1));
        webgl.useShaderProgram(shader);
        this.shader = shader;

        this.bindShared(bucket);

        let instancedArrays = webgl.extensions.instancedArrays,
            attribs = shader.attribs,
            uniforms = shader.uniforms;

        gl.vertexAttribPointer(attribs.get('a_normal'), 4, gl.UNSIGNED_BYTE, false, vertexSize, 20);

        for (let i = 0; i < uvSetCount; i++) {
            gl.vertexAttribPointer(attribs.get('a_uv' + i), 2, gl.SHORT, false, vertexSize, 24 + i * 4);
        }

        gl.vertexAttribPointer(attribs.get('a_tangent'), 4, gl.UNSIGNED_BYTE, false, vertexSize, 24 + uvSetCount * 4);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);

        let camera = scene.camera;

        gl.uniformMatrix4fv(uniforms.get('u_mvp'), false, camera.worldProjectionMatrix);
        gl.uniformMatrix4fv(uniforms.get('u_mv'), false, camera.worldMatrix);

        gl.uniform3fv(uniforms.get('u_eyePos'), camera.worldLocation);
        gl.uniform3fv(uniforms.get('u_lightPos'), this.handler.lightPosition);
    }

    unbind() {
        let instancedArrays = this.viewer.gl.extensions.instancedArrays,
            shader = this.shader,
            attribs = shader.attribs;

        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_teamColor'), 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_vertexColor'), 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_InstanceID'), 0);
    }

    renderBatch(bucket, batch) {
        let shader = this.shader,
            region = batch.region,
            material = batch.material;
            
        material.bind(bucket, shader);

        region.render(shader, bucket.count);

        material.unbind(shader); // This is required to not use by mistake layers from this material that were bound and are not overwritten by the next material
    }

    renderBatches(bucket, scene, batches) {
        if (batches && batches.length) {
            this.bind(bucket, scene);

            for (let i = 0, l = batches.length; i < l; i++) {
                this.renderBatch(bucket, batches[i]);
            }

            this.unbind();
        }
    }

    renderOpaque(data, scene, modelView) {
        for (let bucket of data.buckets) {
            if (bucket.count) {
                this.renderBatches(bucket, scene, this.batches);
            }
        }
    }

    renderTranslucent(data, scene, modelView) {

    }
};
