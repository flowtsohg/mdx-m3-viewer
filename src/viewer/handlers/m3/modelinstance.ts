import { mat4 } from 'gl-matrix';
import DataTexture from '../../gl/datatexture';
import Scene from '../../scene';
import ModelInstance from '../../modelinstance';
import Texture from '../../texture';
import M3Model from './model';
import M3Skeleton from './skeleton';
import { STANDARD_MATERIAL_OFFSET } from './standardmaterial';
import { M3HandlerObject } from './handler';
import M3Node from './node';

const boneHeap = mat4.create();

/**
 * An M3 model instance.
 */
export default class M3ModelInstance extends ModelInstance {
  skeleton: M3Skeleton | null = null;
  teamColor = 0;
  vertexColor = new Float32Array([1, 1, 1, 1]);
  sequence = -1;
  frame = 0;
  sequenceLoopMode = 0;
  sequenceEnded = false;
  forced = true;
  boneTexture: DataTexture | null = null;

  constructor(model: M3Model) {
    super(model);

    this.skeleton = new M3Skeleton(this);

    // This takes care of calling setSequence before the model is loaded.
    // In this case, this.sequence will be set, but nothing else is changed.
    // Now that the model is loaded, set it again to do the real work.
    if (this.sequence !== -1) {
      this.setSequence(this.sequence);
    }

    this.boneTexture = new DataTexture(model.viewer.gl, 3, model.boneLookup.length * 4, 1);
  }

  /**
   * Override the texture of the layer at the given index in the material at the given index.
   * 
   * If a texture isn't given, removes the override if there was one.
   */
  setTexture(material: number, layer: number, texture?: Texture): void {
    this.overrideTexture(material * STANDARD_MATERIAL_OFFSET + layer, texture);
  }

  updateSkeletonAndBoneTexture(dt: number): void {
    const model = <M3Model>this.model;
    const viewer = model.viewer;
    const buffer = viewer.buffer;
    const boneLookup = model.boneLookup;
    const skeleton = <M3Skeleton>this.skeleton;
    const nodes = skeleton.nodes;
    const bindPose = model.initialReference;
    const count = boneLookup.length;
    const isAnimated = this.sequence !== -1;
    const boneTexture = <DataTexture>this.boneTexture;

    skeleton.update(dt);

    // Ensure there is enough memory for all of the instances data.
    buffer.reserve(count * 48);

    const floatView = <Float32Array>buffer.floatView;
    let finalMatrix;

    if (isAnimated) {
      finalMatrix = boneHeap;
    } else {
      finalMatrix = this.worldMatrix;
    }

    for (let i = 0; i < count; i++) {
      const offset = i * 12;

      if (isAnimated) {
        const bone = boneLookup[i];

        // Every bone has to be multiplied by its bind pose counterpart for rendering.
        finalMatrix = mat4.mul(boneHeap, nodes[bone].worldMatrix, <mat4>bindPose[bone]);
      }

      floatView[offset + 0] = finalMatrix[0];
      floatView[offset + 1] = finalMatrix[1];
      floatView[offset + 2] = finalMatrix[2];
      floatView[offset + 3] = finalMatrix[4];
      floatView[offset + 4] = finalMatrix[5];
      floatView[offset + 5] = finalMatrix[6];
      floatView[offset + 6] = finalMatrix[8];
      floatView[offset + 7] = finalMatrix[9];
      floatView[offset + 8] = finalMatrix[10];
      floatView[offset + 9] = finalMatrix[12];
      floatView[offset + 10] = finalMatrix[13];
      floatView[offset + 11] = finalMatrix[14];
    }

    boneTexture.bindAndUpdate(floatView, boneTexture.width, 1);
  }

  override renderOpaque(): void {
    const model = <M3Model>this.model;
    const batches = model.batches;

    if (batches.length) {
      const viewer = model.viewer;
      const m3Cache = <M3HandlerObject>viewer.sharedCache.get('m3');
      const gl = viewer.gl;
      const vertexSize = model.vertexSize;
      const uvSetCount = model.uvSetCount;
      const shader = m3Cache.standardShaders[uvSetCount - 1];
      const attribs = shader.attribs;
      const uniforms = shader.uniforms;
      const scene = <Scene>this.scene;
      const camera = scene.camera;
      const textureOverrides = this.textureOverrides;
      const boneTexture = <DataTexture>this.boneTexture;

      shader.use();

      gl.uniform1f(uniforms['u_teamColor'], this.teamColor);
      gl.uniform4fv(uniforms['u_vertexColor'], this.vertexColor);

      gl.uniformMatrix4fv(uniforms['u_VP'], false, camera.viewProjectionMatrix);
      gl.uniformMatrix4fv(uniforms['u_MV'], false, camera.viewMatrix);

      gl.uniform3fv(uniforms['u_eyePos'], camera.location);
      gl.uniform3fv(uniforms['u_lightPos'], scene.lightPosition);

      boneTexture.bind(15);
      gl.uniform1i(uniforms['u_boneMap'], 15);
      gl.uniform1f(uniforms['u_vectorSize'], 1 / boneTexture.width);
      gl.uniform1f(uniforms['u_rowSize'], 1);

      gl.bindBuffer(gl.ARRAY_BUFFER, model.arrayBuffer);
      gl.vertexAttribPointer(attribs['a_position'], 3, gl.FLOAT, false, vertexSize, 0);
      gl.vertexAttribPointer(attribs['a_weights'], 4, gl.UNSIGNED_BYTE, false, vertexSize, 12);
      gl.vertexAttribPointer(attribs['a_bones'], 4, gl.UNSIGNED_BYTE, false, vertexSize, 16);
      gl.vertexAttribPointer(attribs['a_normal'], 4, gl.UNSIGNED_BYTE, false, vertexSize, 20);

      for (let i = 0; i < uvSetCount; i++) {
        gl.vertexAttribPointer(attribs[`a_uv${i}`], 2, gl.SHORT, false, vertexSize, 24 + i * 4);
      }

      gl.vertexAttribPointer(attribs['a_tangent'], 4, gl.UNSIGNED_BYTE, false, vertexSize, 24 + uvSetCount * 4);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.elementBuffer);

      for (const batch of batches) {
        const material = batch.material;
        const region = batch.region;

        material.bind(shader, textureOverrides);

        region.render(shader);

        material.unbind(shader); // This is required to not use by mistake layers from this material that were bound and are not overwritten by the next material
      }
    }
  }

  override updateAnimations(dt: number): void {
    const sequenceId = this.sequence;

    if (sequenceId !== -1) {
      const model = <M3Model>this.model;
      const sequence = model.sequences[sequenceId];
      const interval = sequence.interval;

      this.frame += dt * 1000;

      if (this.frame > interval[1]) {
        if ((this.sequenceLoopMode === 0 && !(sequence.flags & 0x1)) || this.sequenceLoopMode === 2) {
          this.frame = interval[0];
        } else {
          this.frame = interval[1];
        }

        this.sequenceEnded = true;
      } else {
        this.sequenceEnded = false;
      }
    }

    if (this.forced || sequenceId !== -1) {
      this.forced = false;

      this.updateSkeletonAndBoneTexture(dt);
    }
  }

  setTeamColor(id: number): this {
    this.teamColor = id;

    return this;
  }

  setVertexColor(color: Uint8Array): this {
    this.vertexColor.set(color);

    return this;
  }

  setSequence(id: number): this {
    const model = <M3Model>this.model;
    this.sequence = id;
    this.frame = 0;

    if (id < -1 || id > model.sequences.length - 1) {
      id = -1;

      this.sequence = id;
    }

    // Do a forced update, so non-animated data can be skipped in future updates
    this.forced = true;

    return this;
  }

  setSequenceLoopMode(mode: number): this {
    this.sequenceLoopMode = mode;

    return this;
  }

  getAttachment(id: number): M3Node | undefined {
    const model = <M3Model>this.model;
    const attachment = model.attachments[id];

    if (attachment) {
      return (<M3Skeleton>this.skeleton).nodes[attachment.bone];
    }

    return;
  }
}
