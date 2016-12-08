function MdxParticle(emitter) {
    this.emitter = emitter;

    this.spawnedInstance = null;

    this.position = vec3.create();
    this.velocity = vec3.create();
    this.orientation = 0;
    this.gravity = 0;
}

MdxParticle.prototype = {
    reset() {
        const emitter = this.emitter;

        var scale = emitter.node.worldScale;
        var speed = emitter.getSpeed();
        var latitude = emitter.getLatitude();
        var longitude = emitter.getLongitude();
        var lifespan = emitter.getLifespan();
        var gravity = emitter.getGravity() * scale[2];
        var position = this.position;
        var worldMatrix = emitter.node.worldMatrix;

        this.alive = true;

        this.health = lifespan;

        vec3.transformMat4(position, emitter.node.pivot, emitter.node.worldMatrix);

        var velocity = emitter.heapVelocity;
        var rotation = emitter.heapMat;
        var velocityStart = emitter.heapVel1;
        var velocityEnd = vec3.heap;

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

        if (!this.spawnedInstance) {
            this.spawnedInstance = emitter.spawnModel.addInstance().setSequence(0);
        } else {
            this.spawnedInstance.rendered = true;
        }

        this.spawnedInstance.rotate(quat.setAxisAngle([], [0, 0, 1], this.orientation));
    },

    update() {
        if (this.alive) {
            const frameTimeS = this.spawnedInstance.env.frameTime * 0.001;

            this.health -= frameTimeS;

            this.velocity[2] -= this.gravity * frameTimeS;

            vec3.scaleAndAdd(this.position, this.position, this.velocity, frameTimeS);

            this.spawnedInstance.setLocation(this.position);
            this.spawnedInstance.setScale(this.emitter.node.worldScale);
        }
    },

    kill() {
        this.alive = false;
        this.spawnedInstance.rendered = false;
    }
};
