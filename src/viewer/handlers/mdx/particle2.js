import {vec3, vec4, quat} from 'gl-matrix';
import {VEC3_UNIT_Z} from '../../../common/gl-matrix-addon';
import {degToRad, randomInRange, lerp} from '../../../common/math';
import {uint8ToUint24} from '../../../common/typecast';

// Heap allocations needed for this module.
let rotationHeap = quat.create();
let locationHeap = vec3.create();
let colorHeap = new Uint8Array(4);
let widthHeap = new Float32Array(1);
let lengthHeap = new Float32Array(1);
let latitudeHeap = new Float32Array(1);
let variationHeap = new Float32Array(1);
let speedHeap = new Float32Array(1);
let gravityHeap = new Float32Array(1);

/**
 * A type 2 particle.
 */
export default class Particle2 {
  /**
   * @param {MdxParticle2Emitter} emitter
   */
  constructor(emitter) {
    this.emitter = emitter;
    this.emitterView = null;
    this.health = 0;
    this.head = true;
    this.location = vec3.create();
    this.velocity = vec3.create();
    this.gravity = 0;
    this.nodeScale = vec3.create();

    this.vertices = new Float32Array(12);
    this.lta = 0;
    this.lba = 0;
    this.rta = 0;
    this.rba = 0;
    this.rgb = 0;
  }

  /**
   * @param {ParticleEmitter2View} emitterView
   * @param {boolean} isHead
   */
  reset(emitterView, isHead) {
    emitterView.getWidth(widthHeap);
    emitterView.getLength(lengthHeap);
    emitterView.getLatitude(latitudeHeap);
    emitterView.getVariation(variationHeap);
    emitterView.getSpeed(speedHeap);
    emitterView.getGravity(gravityHeap);

    let modelObject = this.emitter.modelObject;
    let node = emitterView.instance.nodes[modelObject.index];
    let pivot = node.pivot;
    let scale = node.worldScale;
    let width = widthHeap[0] * 0.5;
    let length = lengthHeap[0] * 0.5;
    let latitude = degToRad(latitudeHeap[0]);
    let variation = variationHeap[0];
    let speed = speedHeap[0];
    let location = this.location;
    let velocity = this.velocity;

    this.emitterView = emitterView;
    this.node = node;
    this.health = modelObject.lifeSpan;
    this.head = isHead;
    this.gravity = gravityHeap[0] * scale[2];

    vec3.copy(this.nodeScale, scale);

    // Local location
    location[0] = pivot[0] + randomInRange(-width, width);
    location[1] = pivot[1] + randomInRange(-length, length);
    location[2] = pivot[2];

    // World location
    if (!modelObject.modelSpace) {
      vec3.transformMat4(location, location, node.worldMatrix);
    }

    // Local rotation
    quat.identity(rotationHeap);
    quat.rotateZ(rotationHeap, rotationHeap, Math.PI / 2);
    quat.rotateY(rotationHeap, rotationHeap, randomInRange(-latitude, latitude));

    // If this is not a line emitter, emit in a sphere rather than a circle.
    if (!modelObject.lineEmitter) {
      quat.rotateX(rotationHeap, rotationHeap, randomInRange(-latitude, latitude));
    }

    // World rotation
    if (!modelObject.modelSpace) {
      quat.mul(rotationHeap, node.worldRotation, rotationHeap);
    }

    // Apply the rotation
    vec3.transformQuat(velocity, VEC3_UNIT_Z, rotationHeap);

    // Apply speed
    vec3.scale(velocity, velocity, speed + randomInRange(-variation, variation));

    // Apply the parent's scale
    vec3.mul(velocity, velocity, scale);
  }

  /**
   *
   */
  update() {
    let modelObject = this.emitter.modelObject;
    let dt = modelObject.model.viewer.frameTime * 0.001;
    let location = this.location;
    let worldLocation = locationHeap;
    let velocity = this.velocity;

    this.health -= dt;

    velocity[2] -= this.gravity * dt;

    vec3.scaleAndAdd(location, location, velocity, dt);

    vec3.copy(worldLocation, location);

    let lifeFactor = (modelObject.lifeSpan - this.health) / modelObject.lifeSpan;
    let timeMiddle = modelObject.timeMiddle;
    let intervals = modelObject.intervals;
    let factor;
    let firstColor;
    let head = this.head;
    let interval;

    if (lifeFactor < timeMiddle) {
      factor = lifeFactor / timeMiddle;

      firstColor = 0;

      if (head) {
        interval = intervals[0];
      } else {
        interval = intervals[2];
      }
    } else {
      factor = (lifeFactor - timeMiddle) / (1 - timeMiddle);

      firstColor = 1;

      if (head) {
        interval = intervals[1];
      } else {
        interval = intervals[3];
      }
    }

    factor = Math.min(factor, 1);

    let start = interval[0];
    let end = interval[1];
    let repeat = interval[2];
    let scaling = modelObject.scaling;
    let colors = modelObject.colors;
    let scale = lerp(scaling[firstColor], scaling[firstColor + 1], factor);
    let left;
    let top;
    let right;
    let bottom;
    let instance = this.emitterView.instance;

    // If this is a team colored emitter, get the team color tile from the atlas.
    // Otherwise do normal texture atlas handling.
    if (modelObject.teamColored) {
      let teamColor = instance.teamColor;

      left = teamColor % 4;
      top = (teamColor / 4) | 0;
      right = left + 1;
      bottom = top + 1;
    } else {
      let columns = modelObject.dimensions[0];
      let index = 0;
      let spriteCount = end - start;

      if (spriteCount) {
        // Repeating speeds up the sprite animation, which makes it effectively run N times in its interval.
        // E.g. if repeat is 4, the sprite animation will be seen 4 times, and thus also run 4 times as fast.
        index = start + Math.floor(spriteCount * repeat * factor) % spriteCount;
      }

      left = index % columns;
      top = (index / columns) | 0;
      right = left + 1;
      bottom = top + 1;
    }

    vec4.lerp(colorHeap, colors[firstColor], colors[firstColor + 1], factor);

    let a = colorHeap[3];

    this.lta = uint8ToUint24(right, bottom, a);
    this.lba = uint8ToUint24(left, bottom, a);
    this.rta = uint8ToUint24(right, top, a);
    this.rba = uint8ToUint24(left, top, a);
    this.rgb = uint8ToUint24(colorHeap[0], colorHeap[1], colorHeap[2]);

    let camera = instance.scene.camera;
    let vectors;

    // Choose between a default rectangle or billboarded one
    if (modelObject.xYQuad) {
      vectors = camera.vectors;
    } else {
      vectors = camera.billboardedVectors;
    }

    let vertices = this.vertices;
    let nodeScale = this.nodeScale;

    let scalex = scale * nodeScale[0];
    let scaley = scale * nodeScale[1];
    let scalez = scale * nodeScale[2];

    if (head) {
      // If this is a model space emitter, the particle location is in local space, so convert it now to world space.
      if (modelObject.modelSpace) {
        vec3.transformMat4(worldLocation, worldLocation, this.node.worldMatrix);
      }

      let px = worldLocation[0];
      let py = worldLocation[1];
      let pz = worldLocation[2];

      let pv1 = vectors[0];
      let pv2 = vectors[1];
      let pv3 = vectors[2];
      let pv4 = vectors[3];

      vertices[0] = px + pv1[0] * scalex;
      vertices[1] = py + pv1[1] * scaley;
      vertices[2] = pz + pv1[2] * scalez;
      vertices[3] = px + pv2[0] * scalex;
      vertices[4] = py + pv2[1] * scaley;
      vertices[5] = pz + pv2[2] * scalez;
      vertices[6] = px + pv3[0] * scalex;
      vertices[7] = py + pv3[1] * scaley;
      vertices[8] = pz + pv3[2] * scalez;
      vertices[9] = px + pv4[0] * scalex;
      vertices[10] = py + pv4[1] * scaley;
      vertices[11] = pz + pv4[2] * scalez;
    } else {
      let tailLength = modelObject.tailLength;
      let offsetx = tailLength * velocity[0] * 1;
      let offsety = tailLength * velocity[1] * 1;
      let offsetz = tailLength * velocity[2] * 1;

      // The start and end of the tail.
      let start = [worldLocation[0] - offsetx, worldLocation[1] - offsety, worldLocation[2] - offsetz];
      let end = [worldLocation[0], worldLocation[1], worldLocation[2]];

      // If this is a model space emitter, the start and end are is in local space, so convert them to world space.
      if (modelObject.modelSpace) {
        vec3.transformMat4(start, start, this.node.worldMatrix);
        vec3.transformMat4(end, end, this.node.worldMatrix);
      }

      let startx = start[0];
      let starty = start[1];
      let startz = start[2];
      let endx = end[0];
      let endy = end[1];
      let endz = end[2];

      // Get the normal to the tail in camera space.
      // This allows to build a 2D rectangle around the 3D tail.
      let tail = [endx - startx, endy - starty, endz - startz];
      vec3.normalize(tail, tail);
      let normal = vec3.cross([], camera.billboardedVectors[6], tail);
      vec3.normalize(normal, normal);

      let normalX = normal[0] * scalex;
      let normalY = normal[1] * scaley;
      let normalZ = normal[2] * scalez;

      vertices[0] = startx - normalX;
      vertices[1] = starty - normalY;
      vertices[2] = startz - normalZ;

      vertices[6] = endx + normalX;
      vertices[7] = endy + normalY;
      vertices[8] = endz + normalZ;

      vertices[3] = endx - normalX;
      vertices[4] = endy - normalY;
      vertices[5] = endz - normalZ;

      vertices[9] = startx + normalX;
      vertices[10] = starty + normalY;
      vertices[11] = startz + normalZ;
    }
  }
}
