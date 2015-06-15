Mdx.Particle = function  () {
    this.position = vec3.create();
    this.velocity = vec3.create();
    this.orientation = 0;
    this.gravity = 0;
};

Mdx.Particle.prototype = {
    reset: function (emitter, sequence, frame, counter) {
        var scale = emitter.node.scale;
        var speed = Mdx.getSDValue(sequence, frame, counter, emitter.sd.speed, emitter.initialVelocity);
        var latitude = Mdx.getSDValue(sequence, frame, counter, emitter.sd.latitude, emitter.latitude);
        var longitude = Mdx.getSDValue(sequence, frame, counter, emitter.sd.longitude, emitter.longitude);
        var lifespan = Mdx.getSDValue(sequence, frame, counter, emitter.sd.lifespan, emitter.lifespan);
        var gravity = Mdx.getSDValue(sequence, frame, counter, emitter.sd.gravity, emitter.gravity) * scale[2];
        var position = this.position;
        var worldMatrix = emitter.node.worldMatrix;

        this.alive = true;
        this.health = lifespan;

        vec3.transformMat4(position, emitter.node.pivot, emitter.node.worldMatrix);

        var velocity = [];
        var rotation = mat4.create();
        var velocityStart = [];
        var velocityEnd = [];

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
    },

    update: function (emitter, sequence, frame, counter, context) {
        if (this.alive) {
            this.health -= (context.frameTime / 1000);

            this.velocity[2] -= this.gravity * (context.frameTime / 1000);

            vec3.scaleAndAdd(this.position, this.position, this.velocity, (context.frameTime / 1000));
        }
    }
};
