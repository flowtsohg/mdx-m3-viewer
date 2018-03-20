import { vec3, quat } from 'gl-matrix';
import { randomInRange } from '../../../common/math';

// Heap allocations needed for this module.
let rotationHeap = quat.create(),
    velocityHeap = vec3.create();

export default class MdxParticle {
    /**
     * @param {MdxParticleEmitter} emitter
     */
    constructor(emitter) {
        this.emitter = emitter;
        this.instance = null;

        this.internalInstance = emitter.modelObject.internalResource.addInstance();
        this.velocity = vec3.create();
        this.gravity = 0;
    }

    reset(emitterView) {
        let instance = emitterView.instance,
            node = instance.skeleton.nodes[this.emitter.modelObject.node.index],
            internalInstance = this.internalInstance,
            scale = node.worldScale,
            latitude = emitterView.getLatitude(),
            //longitude = emitterView.getLongitude(), // ?
            velocity = this.velocity;

        this.instance = instance;
        this.node = node;
        this.health = emitterView.getLifespan();
        this.gravity = emitterView.getGravity() * scale[2];

        // Local rotation
        quat.identity(rotationHeap);
        quat.rotateZ(rotationHeap, rotationHeap, randomInRange(-Math.PI, Math.PI));
        quat.rotateY(rotationHeap, rotationHeap, randomInRange(-latitude, latitude));
        vec3.transformQuat(velocity, vec3.UNIT_Z, rotationHeap);

        // World rotation
        vec3.transformQuat(velocity, velocity, node.worldRotation);
        
        // Apply speed
        vec3.scale(velocity, velocity, emitterView.getSpeed());

        // Apply the parent's scale
        vec3.mul(velocity, velocity, scale);

        instance.scene.addInstance(internalInstance);

        internalInstance.setTransformation(node.worldLocation, quat.setAxisAngle(rotationHeap, vec3.UNIT_Z, randomInRange(0, Math.PI * 2)), node.worldScale);
        internalInstance.setSequence(0);
        internalInstance.show();
    }

    update() {
        let internalInstance = this.internalInstance,
            velocity = this.velocity,
            frameTimeS = internalInstance.env.frameTime * 0.001;

        internalInstance.paused = false;

        this.health -= frameTimeS;

        velocity[2] -= this.gravity * frameTimeS;

        internalInstance.move(vec3.scale(velocityHeap, velocity, frameTimeS));

        if (this.health <= 0) {
            this.internalInstance.hide();
        }
    }
};
