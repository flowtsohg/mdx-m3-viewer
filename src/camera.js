import Frustum from './frustum';
import NotifiedNode from './notifiednode';
import glMatrix from './math/gl-matrix-addon';
import ViewerNode from './node';
import common from './common';

/**
 * @constructor
 * @augments Frustum
 * @augments ViewerNode
 */
function Camera() {
    Frustum.call(this);

    this.perspective = true;
    this.ortho = false;
    this.fieldOfView = 0;
    this.aspectRatio = 0;
    this.nearClipPlane = 0;
    this.farClipPlane = 0;
    this.leftClipPlane = 0;
    this.rightClipPlane = 0;
    this.bottomClipPlane = 0;
    this.topClipPlane = 0;
    this.viewport = glMatrix.vec4.create();
    this.projectionMatrix = glMatrix.mat4.create();
    this.worldProjectionMatrix = glMatrix.mat4.create();
    this.inverseWorldMatrix = glMatrix.mat4.create();
    this.inverseRotation = glMatrix.quat.create();
    this.inverseRotationMatrix = glMatrix.mat4.create();
    this.inverseWorldProjectionMatrix = glMatrix.mat4.create();

    // First four vectors are the corners of a 2x2 rectangle, the last three vectors are the unit axes
    this.vectors = [glMatrix.vec3.fromValues(-1, -1, 0), glMatrix.vec3.fromValues(-1, 1, 0), glMatrix.vec3.fromValues(1, 1, 0), glMatrix.vec3.fromValues(1, -1, 0), glMatrix.vec3.fromValues(1, 0, 0), glMatrix.vec3.fromValues(0, 1, 0), glMatrix.vec3.fromValues(0, 0, 1)];

    // First four vectors are the corners of a 2x2 rectangle billboarded to the camera, the last three vectors are the unit axes billboarded
    this.billboardedVectors = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()];

    NotifiedNode.call(this);

    this.dontInheritScaling = true;
}

Camera.prototype = {
    setPerspective(fieldOfView, aspectRatio, nearClipPlane, farClipPlane) {
        this.perspective = true;
        this.ortho = false;
        this.fieldOfView = fieldOfView;
        this.aspectRatio = aspectRatio;
        this.nearClipPlane = nearClipPlane;
        this.farClipPlane = farClipPlane;

        this.recalculateTransformation();
    },

    setOrtho(left, right, bottom, top, near, far) {
        this.perspective = false;
        this.ortho = true;
        this.leftClipPlane = left;
        this.rightClipPlane = right;
        this.bottomClipPlane = bottom;
        this.topClipPlane = top;
        this.nearClipPlane = near;
        this.farClipPlane = far;

        this.recalculateTransformation();
    },

    setViewport(viewport) {
        glMatrix.vec4.copy(this.viewport, viewport);
        
        this.aspectRatio = viewport[2] / viewport[3];
        
        return this.recalculateTransformation();
    },

    recalculateTransformation() {
        let worldMatrix = this.worldMatrix,
            projectionMatrix = this.projectionMatrix,
            worldProjectionMatrix = this.worldProjectionMatrix,
            inverseWorldRotation = this.inverseWorldRotation,
            vectors = this.vectors,
            billboardedVectors = this.billboardedVectors;

        // Recalculate the node part
        ViewerNode.prototype.recalculateTransformation.call(this);

        // Projection matrix
        // Camera space -> NDC space
        if (this.perspective) {
            glMatrix.mat4.perspective(projectionMatrix, this.fieldOfView, this.aspectRatio, this.nearClipPlane, this.farClipPlane);
        } else {
            glMatrix.mat4.ortho(projectionMatrix, this.leftClipPlane, this.rightClipPlane, this.bottomClipPlane, this.topClipPlane, this.nearClipPlane, this.farClipPlane);
        }

        // World projection matrix
        // World space -> NDC space
        glMatrix.mat4.mul(worldProjectionMatrix, projectionMatrix, worldMatrix);

        // Inverse world matrix
        // Camera space -> World space
        glMatrix.mat4.invert(this.inverseWorldMatrix, worldMatrix);

        // Inverse world projection matrix
        // NDC space -> World space
        glMatrix.mat4.invert(this.inverseWorldProjectionMatrix, worldProjectionMatrix);

        // Cache the billboarded vectors
        for (let i = 0; i < 7; i++) {
            glMatrix.vec3.transformQuat(billboardedVectors[i], vectors[i], inverseWorldRotation);
        }

        // Recaculate the camera's frusum planes
        this.recalculatePlanes(worldProjectionMatrix);

        return this;
    },

    // Given a vector in camera space, return the vector transformed to world space
    cameraToWorld(out, v) {
        //glMatrix.vec3.copy(out, v);
        //glMatrix.vec3.transformMat4(out, out, this.inverseWorldMatrix);

        //return out;
    },

    // Given a vector in world space, return the vector transformed to camera space
    worldToCamera(out, v) {
        //glMatrix.vec3.transformQuat(out, v, this.inverseWorldRotation);

        //return out;
    },

    // Given a vector in world space, return the vector transformed to screen space
    worldToScreen(out, v) {
        let temp = glMatrix.vec3.heap,
            viewport = this.viewport;

        glMatrix.vec3.transformMat4(temp, v, this.worldProjectionMatrix);

        out[0] = Math.round(((temp[0] + 1) / 2) * viewport[2]);
        out[1] = Math.round(((temp[1] + 1) / 2) * viewport[3]);

        return out;
    },

    // Given a vector in screen space, return the vector transformed to world space, projected on the X-Z plane
    screenToWorld(out, v) {
        let a = glMatrix.vec3.heap,
            b = glMatrix.vec3.heap2,
            c = glMatrix.vec3.heap3,
            x = v[0],
            y = v[1],
            inverseWorldProjectionMatrix = this.inverseWorldProjectionMatrix,
            viewport = this.viewport;

        // Intersection on the near-plane
        glMatrix.vec3.unproject(a, glMatrix.vec3.set(c, x, y, 0), inverseWorldProjectionMatrix, viewport);

        // Intersection on the far-plane
        glMatrix.vec3.unproject(b, glMatrix.vec3.set(c, x, y, 1), inverseWorldProjectionMatrix, viewport);

        // Intersection on the X-Y plane
        let zIntersection = -a[2] / (b[2] - a[2]);

        glMatrix.vec3.set(out, a[0] + (b[0] - a[0]) * zIntersection, 0, a[1] + (b[1] - a[1]) * zIntersection);

        //console.log(out, a, b, zIntersection)
        return out;
    }
};

common.mix(Camera.prototype, NotifiedNode.prototype, Frustum.prototype);

export default Camera;
