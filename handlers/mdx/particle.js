/**
 * @constructor
 * @param {MdxParticleEmitter} emitter
 */
function MdxParticle(emitter) {
    this.emitter = emitter;
    this.instance = null;
    this.internalInstance = emitter.internalModel.addInstance();
    this.velocity = vec3.create();
    this.gravity = 0;
}

MdxParticle.prototype = {
    reset(emitterView) {
        let instance = emitterView.instance,
            node = instance.skeleton.nodes[this.emitter.node.index],
            internalInstance = this.internalInstance,
            scale = node.worldScale,
            latitude = emitterView.getLatitude(),
            //longitude = emitterView.getLongitude(), // ?
            velocity = this.velocity,
            q = quat.heap;

        this.instance = instance;
        this.node = node;
        this.health = emitterView.getLifespan();
        this.gravity = emitterView.getGravity() * scale[2];

        // Local rotation
        quat.identity(q);
        quat.rotateZ(q, q, Math.randomRange(-Math.PI, Math.PI));
        quat.rotateY(q, q, Math.randomRange(-latitude, latitude));
        vec3.transformQuat(velocity, vec3.UNIT_Z, q);

        // World rotation
        vec3.transformQuat(velocity, velocity, node.worldRotation);
        
        // Apply speed
        vec3.scale(velocity, velocity, emitterView.getSpeed());

        // Apply the parent's scale
        vec3.mul(velocity, velocity, scale);

        instance.scene.addInstance(internalInstance);

        internalInstance.setTransformation(node.worldLocation, quat.setAxisAngle(q, vec3.UNIT_Z, Math.randomRange(0, Math.PI * 2)), node.worldScale);
        internalInstance.setSequence(0);
        internalInstance.show();
    },

    update() {
        let internalInstance = this.internalInstance,
            velocity = this.velocity,
            frameTimeS = internalInstance.env.frameTime * 0.001;

        internalInstance.paused = false;

        this.health -= frameTimeS;

        velocity[2] -= this.gravity * frameTimeS;

        internalInstance.move(vec3.scale(vec3.heap, velocity, frameTimeS));
    },

    kill() {
        this.internalInstance.hide();
    }
};
