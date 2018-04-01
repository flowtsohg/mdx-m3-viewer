import TexturedModel from '../../texturedmodel';
import MdxGenericObject from './genericobject';
import TextureAnimation from './textureanimation';
import MdxLayer from './layer';
import GeosetAnimation from './geosetanimation';
import { MdxGeoset } from './geoset';
import MdxBatch from './batch';

import { MdxShallowGeoset } from './geoset';
import replaceableIds from './replaceableids';

import Model from '../../../parsers/mdlx/model';

import Bone from './bone';
import Light from './light';
import Helper from './helper';
import Attachment from './attachment';
import ParticleEmitter from './modelparticleemitter';
import ParticleEmitter2 from './modelparticleemitter2';
import RibbonEmitter from './modelribbonemitter';
import Camera from './camera';
import EventObject from './modeleventobject';
import CollisionShape from './collisionshape';

export default class MdxModel extends TexturedModel {
    /**
     * @param {ModelViewer} env
     * @param {function(?)} pathSolver
     * @param {Handler} handler
     * @param {string} extension
     */
    constructor(env, pathSolver, handler, extension) {
        super(env, pathSolver, handler, extension);

        this.model = null;
        this.name = '';
        this.extent = null;
        this.sequences = [];
        this.globalSequences = [];
        this.materials = [];
        this.layers = [];
        this.textures = [];
        this.textureAnimations = [];
        this.geosets = [];
        this.geosetAnimations = [];
        this.bones = [];
        this.lights = [];
        this.helpers = [];
        this.attachments = [];
        this.pivotPoints = [];
        this.particleEmitters = [];
        this.particleEmitters2 = [];
        this.ribbonEmitters = [];
        this.cameras = [];
        this.eventObjects = [];
        this.collisionShapes = [];

        this.hasLayerAnims = false;
        this.hasGeosetAnims = false;
        this.batches = [];
        this.opaqueBatches = [];
        this.translucentBatches = [];

        this.objects = [];
        this.hierarchy = [];
        this.replaceables = [];
        this.textureOptions = [];



        this.loadTeamTextures();
    }

    loadTeamTextures() {
        let teamColors = [],
            teamGlows = [];

        for (let i = 0; i < 14; i++) {
            let id = ('' + i).padStart(2, '0');

            teamColors[i] = this.env.load(`ReplaceableTextures\\TeamColor\\TeamColor${id}.blp`, this.pathSolver);
            teamGlows[i] = this.env.load(`ReplaceableTextures\\TeamGlow\\TeamGlow${id}.blp`, this.pathSolver);
        }

        this.env.loadTextureAtlas('teamColors', teamColors, (atlas) => { });
        this.env.loadTextureAtlas('teamGlows', teamGlows, (atlas) => { });
    }

    initialize(src) {
        // Parsing
        let model = new Model();

        if (this.extension === '.mdx') {
            model.loadMdx(src);
        } else {
            model.loadMdl(src);
        }

        this.model = model;

        // Model
        this.name = model.name;
        this.extent = model.extent;

        // Sequences
        for (let sequence of model.sequences) {
            this.sequences.push(sequence);
        }

        // Global sequences
        for (let globalSequence of model.globalSequences) {
            this.globalSequences.push(globalSequence);
        }

        // Textures
        for (let texture of model.textures) {
            this.loadTexture(texture);
        }

        // Texture animations
        for (let textureAnimation of model.textureAnimations) {
            this.textureAnimations.push(new TextureAnimation(this, textureAnimation));
        }

        // Materials
        let layerId = 0;
        for (let material of model.materials) {
            let vMaterial = [];

            for (let layer of material.layers) {
                let vLayer = new MdxLayer(this, layer, layerId++, material.priorityPlane);

                vMaterial.push(vLayer);
                this.layers.push(vLayer);

                if (vLayer.hasAnim) {
                    this.hasLayerAnims = true;
                }
            }

            this.materials.push(vMaterial);
        }

        // Geoset animations
        for (let geosetAnimation of model.geosetAnimations) {
            this.geosetAnimations.push(new GeosetAnimation(this, geosetAnimation));
        }

        // Geosets
        if (model.geosets.length) {
            let geosetId = 0,
                batchId = 0,
                opaqueBatches = [],
                translucentBatches = [];

            for (let geoset of model.geosets) {
                let vGeoset = new MdxGeoset(this, geoset, geosetId++);

                if (vGeoset.hasAnim) {
                    this.hasGeosetAnims = true;
                }

                this.geosets.push(vGeoset);

                // Batches
                for (let vLayer of this.materials[geoset.materialId]) {
                    let batch = new MdxBatch(batchId++, vLayer, vGeoset);

                    if (vLayer.filterMode < 1) {
                        opaqueBatches.push(batch);
                    } else {
                        translucentBatches.push(batch);
                    }
                }
            }

            /// TODO: I don't remember if this is actually needed, are the layers ever not sorted?
            translucentBatches.sort((a, b) => a.layer.priorityPlane - b.layer.priorityPlane);

            this.opaqueBatches.push(...opaqueBatches);
            this.translucentBatches.push(...translucentBatches);
            this.batches.push(...opaqueBatches, ...translucentBatches);

            this.setupGeosets();
        }

        // Tracks the IDs of all generic objects.
        let objectId = 0,
            pivotPoints = model.pivotPoints;

        // Bones
        for (let bone of model.bones) {
            this.bones.push(new Bone(this, bone, pivotPoints, objectId++));
        }

        // Lights
        for (let light of model.lights) {
            this.lights.push(new Light(this, light, pivotPoints, objectId++));
        }

        // Helpers
        for (let helper of model.helpers) {
            this.helpers.push(new Helper(this, helper, pivotPoints, objectId++));
        }

        // Attachments
        for (let attachment of model.attachments) {
            this.attachments.push(new Attachment(this, attachment, pivotPoints, objectId++));
        }

        // Particle emitters
        for (let particleEmitter of model.particleEmitters) {
            this.particleEmitters.push(new ParticleEmitter(this, particleEmitter, pivotPoints, objectId++));
        }

        // Particle emitters 2
        for (let particleEmitter2 of model.particleEmitters2) {
            this.particleEmitters2.push(new ParticleEmitter2(this, particleEmitter2, pivotPoints, objectId++));
        }

        // Ribbon emitters
        for (let ribbonEmitter of model.ribbonEmitters) {
            this.ribbonEmitters.push(new RibbonEmitter(this, ribbonEmitter, pivotPoints, objectId++));
        }

        // Cameras
        for (let camera of model.cameras) {
            this.cameras.push(new Camera(this, camera, pivotPoints, objectId++));
        }

        // Event objects
        for (let eventObject of model.eventObjects) {
            this.eventObjects.push(new EventObject(this, eventObject, pivotPoints, objectId++));
        }

        // Collision shapes
        for (let collisionShape of model.collisionShapes) {
            this.collisionShapes.push(new CollisionShape(this, collisionShape, pivotPoints, objectId++));
        }

        // One array for all generic objects.
        this.objects.push(...this.bones, ...this.lights, ...this.helpers, ...this.attachments, ...this.particleEmitters, ...this.particleEmitters2, ...this.ribbonEmitters, ...this.cameras, ...this.eventObjects, ...this.collisionShapes);

        // Creates the sorted indices array of the generic objects.
        this.setupHierarchy(-1);

        // Checks what sequences are variant or not.
        this.setupVariants();

        //this.calculateExtent();

        return true;
    }

    isVariant(sequence) {
        let objects = this.objects;

        for (let i = 0, l = objects.length; i < l; i++) {
            if (objects[i].variants.generic[sequence]) {
                return true;
            }
        }

        return false;
    }

    setupVariants() {
        let variants = [];

        for (let i = 0, l = this.sequences.length; i < l; i++) {
            variants[i] = this.isVariant(i);
        }

        this.variants = variants;
    }

    setupGeosets() {
        let geosets = this.geosets;

        if (geosets.length > 0) {
            let gl = this.env.gl,
                shallowGeosets = [],
                typedArrays = [],
                totalArrayOffset = 0,
                elementTypedArrays = [],
                totalElementOffset = 0,
                i, l;

            for (i = 0, l = geosets.length; i < l; i++) {
                let geoset = geosets[i],
                    vertices = geoset.locationArray,
                    normals = geoset.normalArray,
                    uvSets = geoset.uvsArray,
                    boneIndices = geoset.boneIndexArray,
                    boneNumbers = geoset.boneNumberArray,
                    faces = geoset.faceArray,
                    verticesOffset = totalArrayOffset,
                    normalsOffset = verticesOffset + vertices.byteLength,
                    uvSetsOffset = normalsOffset + normals.byteLength,
                    boneIndicesOffset = uvSetsOffset + uvSets.byteLength,
                    boneNumbersOffset = boneIndicesOffset + boneIndices.byteLength;

                shallowGeosets[i] = new MdxShallowGeoset(this, [verticesOffset, normalsOffset, uvSetsOffset, boneIndicesOffset, boneNumbersOffset, totalElementOffset], geoset.uvSetSize, faces.length);

                typedArrays.push([verticesOffset, vertices]);
                typedArrays.push([normalsOffset, normals]);
                typedArrays.push([uvSetsOffset, uvSets]);
                typedArrays.push([boneIndicesOffset, boneIndices]);
                typedArrays.push([boneNumbersOffset, boneNumbers]);

                elementTypedArrays.push([totalElementOffset, faces]);

                totalArrayOffset = boneNumbersOffset + boneNumbers.byteLength;
                totalElementOffset += faces.byteLength;
            }

            let arrayBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, totalArrayOffset, gl.STATIC_DRAW);

            for (i = 0, l = typedArrays.length; i < l; i++) {
                gl.bufferSubData(gl.ARRAY_BUFFER, typedArrays[i][0], typedArrays[i][1]);
            }

            let faceBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, totalElementOffset, gl.STATIC_DRAW);

            for (i = 0, l = elementTypedArrays.length; i < l; i++) {
                gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, elementTypedArrays[i][0], elementTypedArrays[i][1]);
            }

            this.__webglArrayBuffer = arrayBuffer;
            this.__webglElementBuffer = faceBuffer;
            this.shallowGeosets = shallowGeosets;
        }
    }

    setupHierarchy(parent) {
        for (let i = 0, l = this.objects.length; i < l; i++) {
            let object = this.objects[i];

            if (object.parentId === parent) {
                this.hierarchy.push(i);

                this.setupHierarchy(object.objectId);
            }
        }
    }

    loadTexture(texture) {
        var path = texture.path;
        var replaceableId = texture.replaceableId;
        var flags = texture.flags;

        if (replaceableId !== 0) {
            path = 'ReplaceableTextures\\' + replaceableIds[replaceableId] + '.blp';
        }

        // If the path is corrupted, try to fix it.
        if (!path.endsWith('.blp') && !path.endsWith('.tga')) {
            // Try to search for .blp
            var index = path.indexOf('.blp');

            if (index === -1) {
                // Not a .blp, try to search for .tga
                index = path.indexOf('.tga');
            }

            if (index !== -1) {
                // Hopefully fix the path
                path = path.slice(0, index + 4);
            }
        }

        this.replaceables.push(replaceableId);
        this.textures.push(this.env.load(path, this.pathSolver));
        this.textureOptions.push({ repeatS: !!(flags & 0x1), repeatT: !!(flags & 0x2) });
    }

    calculateExtent() {
        var meshes = this.geosets;
        var mesh;
        var min, max;
        var x, y, z;
        var minX = 1E9, minY = 1E9, minZ = 1E9;
        var maxX = -1E9, maxY = -1E9, maxZ = -1E9;
        var dX, dY, dZ;
        var i, l;

        for (i = 0, l = meshes.length; i < l; i++) {
            mesh = meshes[i];
            mesh.calculateExtent();

            min = mesh.extent.min;
            max = mesh.extent.max;
            x = min[0];
            y = min[1];
            z = min[2];

            if (x < minX) {
                minX = x;
            }

            if (y < minY) {
                minY = y;
            }

            if (z < minZ) {
                minZ = z;
            }

            x = max[0];
            y = max[1];
            z = max[2];

            if (x > maxX) {
                maxX = x;
            }

            if (y > maxY) {
                maxY = y;
            }

            if (z > maxZ) {
                maxZ = z;
            }
        }

        dX = maxX - minX;
        dY = maxY - minY;
        dZ = maxZ - minZ;

        this.extent = { radius: Math.sqrt(dX * dX + dY * dY + dZ * dZ) / 2, min: [minX, minY, minZ], max: [maxX, maxY, maxZ] };
    }

    bind(bucket, scene) {
        const webgl = this.env.webgl;
        var gl = this.env.gl;

        // HACK UNTIL I IMPLEMENT MULTIPLE SHADERS AGAIN

        var shader = this.env.shaderMap.get('MdxStandardShader');
        webgl.useShaderProgram(shader);
        this.shader = shader;

        const instancedArrays = gl.extensions.instancedArrays;
        const attribs = shader.attribs;
        const uniforms = shader.uniforms;

        gl.uniformMatrix4fv(uniforms.get('u_mvp'), false, scene.camera.worldProjectionMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.__webglElementBuffer);

        gl.uniform1i(uniforms.get('u_texture'), 0);

        // Team colors
        let teamColor = attribs.get('a_teamColor');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.teamColorBuffer);
        gl.vertexAttribPointer(teamColor, 1, gl.UNSIGNED_BYTE, false, 1, 0);
        instancedArrays.vertexAttribDivisorANGLE(teamColor, 1);

        // Vertex colors
        let vertexColor = attribs.get('a_vertexColor');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.vertexColorBuffer);
        gl.vertexAttribPointer(vertexColor, 4, gl.UNSIGNED_BYTE, true, 4, 0); // normalize the colors from [0, 255] to [0, 1] here instead of in the pixel shader
        instancedArrays.vertexAttribDivisorANGLE(vertexColor, 1);

        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, bucket.boneTexture);
        gl.uniform1i(uniforms.get('u_boneMap'), 15);
        gl.uniform1f(uniforms.get('u_vectorSize'), bucket.vectorSize);
        gl.uniform1f(uniforms.get('u_rowSize'), bucket.rowSize);

        let instanceId = attribs.get('a_InstanceID');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.instanceIdBuffer);
        gl.vertexAttribPointer(instanceId, 1, gl.UNSIGNED_SHORT, false, 0, 0);
        instancedArrays.vertexAttribDivisorANGLE(instanceId, 1);
    }

    unbind() {
        let gl = this.env.gl,
            instancedArrays = gl.extensions.instancedArrays,
            attribs = this.shader.attribs;

        // Reset gl values to default, to play nice with other handlers
        gl.depthMask(1);
        gl.disable(gl.BLEND);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // Reset the attributes to play nice with other handlers
        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_teamColor'), 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_vertexColor'), 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_InstanceID'), 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_geosetAlpha'), 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_geosetColor'), 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_layerAlpha'), 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get('a_uvOffset'), 0);
    }

    renderBatch(bucket, batch) {
        let gl = this.env.gl,
            instancedArrays = gl.extensions.instancedArrays,
            shader = this.shader,
            attribs = this.shader.attribs,
            uniforms = shader.uniforms,
            geoset = batch.geoset,
            layer = batch.layer,
            shallowGeoset = this.shallowGeosets[batch.geoset.index],
            replaceable = this.replaceables[layer.textureId];

        layer.bind(shader);

        let texture,
            isTeamColor = false;;

        if (replaceable === 1) {
            texture = this.env.getTextureAtlas('teamColors');
            isTeamColor = true;
        } else if (replaceable === 2) {
            texture = this.env.getTextureAtlas('teamGlows');
            isTeamColor = true;
        } else {
            texture = this.textures[layer.textureId];
        }

        gl.uniform1f(uniforms.get('u_isTeamColor'), isTeamColor);
        gl.uniform1f(uniforms.get('u_hasLayerAnim'), layer.hasSlotAnim || layer.hasUvAnim);

        this.bindTexture(texture, 0, bucket.modelView);

        let textureOptions = this.textureOptions[layer.textureId],
            wrapS = gl.CLAMP_TO_EDGE,
            wrapT = gl.CLAMP_TO_EDGE;

        if (textureOptions.repeatS) {
            wrapS = gl.REPEAT;
        }

        if (textureOptions.repeatT) {
            wrapT = gl.REPEAT;
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

        // Geoset alphas
        let geosetAlpha = attribs.get('a_geosetAlpha');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.geosetAlphaBuffers[geoset.index]);
        gl.vertexAttribPointer(geosetAlpha, 1, gl.UNSIGNED_BYTE, true, 1, 0);
        instancedArrays.vertexAttribDivisorANGLE(geosetAlpha, 1);

        // Geoset colors
        let geosetColor = attribs.get('a_geosetColor');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.geosetColorBuffers[geoset.index]);
        gl.vertexAttribPointer(geosetColor, 3, gl.UNSIGNED_BYTE, true, 3, 0);
        instancedArrays.vertexAttribDivisorANGLE(geosetColor, 1);

        // Layer alphas
        let layerAlpha = attribs.get('a_layerAlpha');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.layerAlphaBuffers[layer.index]);
        gl.vertexAttribPointer(layerAlpha, 1, gl.UNSIGNED_BYTE, true, 1, 0);
        instancedArrays.vertexAttribDivisorANGLE(layerAlpha, 1);

        // Texture coordinate animations
        let uvOffset = attribs.get('a_uvOffset');
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.uvOffsetBuffers[layer.index]);
        gl.vertexAttribPointer(uvOffset, 4, gl.FLOAT, false, 16, 0);
        instancedArrays.vertexAttribDivisorANGLE(uvOffset, 1);

        // Texture coordinate divisor
        // Used for layers that use image animations, in order to scale the coordinates to match the generated texture atlas
        gl.uniform2f(uniforms.get('u_uvScale'), 1 / layer.uvDivisor[0], 1 / layer.uvDivisor[1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.__webglArrayBuffer);
        shallowGeoset.bind(shader, layer.coordId);

        shallowGeoset.render(bucket.instances.length);
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

    renderOpaque(bucket, scene) {
        this.renderBatches(bucket, scene, this.opaqueBatches);
    }

    renderTranslucent(bucket, scene) {
        this.renderBatches(bucket, scene, this.translucentBatches);
    }

    renderEmitters(bucket, scene) {
        let webgl = this.env.webgl,
            gl = this.env.gl,
            particle2Emitters = bucket.particle2Emitters,
            eventObjectEmitters = bucket.eventObjectEmitters,
            ribbonEmitters = bucket.ribbonEmitters;


        if (particle2Emitters.length || eventObjectEmitters.length || ribbonEmitters.length) {
            gl.depthMask(0);
            gl.enable(gl.BLEND);
            gl.disable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            var shader = this.env.shaderMap.get('MdxParticleShader');
            webgl.useShaderProgram(shader);

            gl.uniformMatrix4fv(shader.uniforms.get('u_mvp'), false, scene.camera.worldProjectionMatrix);

            gl.uniform1i(shader.uniforms.get('u_texture'), 0);

            gl.uniform1f(shader.uniforms.get('u_isRibbonEmitter'), false);

            for (let i = 0, l = particle2Emitters.length; i < l; i++) {
                particle2Emitters[i].render(bucket, shader);
            }

            for (let i = 0, l = eventObjectEmitters.length; i < l; i++) {
                eventObjectEmitters[i].render(bucket, shader);
            }

            gl.uniform1f(shader.uniforms.get('u_isRibbonEmitter'), true);

            for (let i = 0, l = ribbonEmitters.length; i < l; i++) {
                ribbonEmitters[i].render(bucket, shader);
            }
        }
    }
};
