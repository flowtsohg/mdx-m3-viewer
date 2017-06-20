/**
 * @constructor
 * @param {MdxParticleEmitter} emitter
 */
function MdxParticle(emitter) {
    this.emitter = emitter;

    this.position = vec3.create();
    this.velocity = vec3.create();
    this.orientation = 0;
    this.gravity = 0;

    this.instance = null;
    this.node = null;
    this.internalInstance = emitter.internalModel.addInstance();
}

MdxParticle.prototype = {
    reset(emitterView) {
        let instance = emitterView.instance,
            node = instance.skeleton.nodes[this.emitter.node.index];

        this.instance = instance;
        this.node = node;

        instance.scene.addInstance(this.internalInstance);

        var scale = node.worldScale;
        var speed = emitterView.getSpeed();
        var latitude = emitterView.getLatitude();
        var longitude = emitterView.getLongitude();
        var lifespan = emitterView.getLifespan();
        var gravity = emitterView.getGravity() * scale[2];
        var position = this.position;
        var worldMatrix = node.worldMatrix;

        this.health = lifespan;

        vec3.transformMat4(position, node.pivot, node.worldMatrix);

        var velocity = vec3.heap;
        var rotation = mat4.heap;
        var velocityStart = vec3.heap2;
        var velocityEnd = vec3.heap3;

        mat4.identity(rotation);
        mat4.rotateZ(rotation, rotation, Math.randomRange(-Math.PI, Math.PI));
        mat4.rotateY(rotation, rotation, Math.randomRange(-latitude, latitude));

        vec3.transformMat4(velocity, vec3.UNIT_Z, rotation);
        vec3.normalize(velocity, velocity);

        vec3.add(velocityEnd, position, velocity);

        vec3.transformMat4(velocityStart, position, worldMatrix);
        vec3.transformMat4(velocityEnd, velocityEnd, worldMatrix);

        vec3.subtract(velocity, velocityEnd, velocityStart);
        vec3.normalize(velocity, velocity);
        vec3.scale(velocity, velocity, speed);

        vec3.multiply(this.velocity, velocity, scale);

        this.orientation = Math.randomRange(0, Math.PI * 2);
        this.gravity = gravity;

        this.internalInstance.rotate(quat.setAxisAngle([], [0, 0, 1], this.orientation));
        this.internalInstance.setSequence(0);
        this.internalInstance.rendered = true;
    },

    update() {
        let frameTimeS = this.internalInstance.env.frameTime * 0.001;

        this.health -= frameTimeS;

        this.velocity[2] -= this.gravity * frameTimeS;

        vec3.scaleAndAdd(this.position, this.position, this.velocity, frameTimeS);

        this.internalInstance.setLocation(this.position);
        this.internalInstance.setScale(this.node.worldScale);
    },

    kill() {
        this.internalInstance.rendered = false;
    }
};
