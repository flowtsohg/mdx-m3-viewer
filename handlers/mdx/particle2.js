/**
 * @constructor
 * @param {MdxParticleEmitter2} emitter
 */
function MdxParticle2(emitter) {
    this.emitter = emitter;
    this.health = 0;
    this.head = true;
    this.location = vec3.create();
    this.worldLocation = vec3.create();
    this.velocity = vec3.create();
    this.color = new Uint8Array(4);
    this.gravity = 0;
    this.scale = 1;
    this.index = 0;
    this.nodeScale = vec3.create();
}

MdxParticle2.prototype = {
    reset(emitterView, isHead) {
        let emitter = this.emitter,
            node = emitterView.instance.skeleton.nodes[emitter.node.index],
            pivot = node.pivot,
            scale = node.worldScale,
            width = emitterView.getWidth() * 0.5,
            length = emitterView.getLength() * 0.5,
            latitude = Math.toRad(emitterView.getLatitude()),
            location = this.location,
            velocity = this.velocity,
            q = quat.heap;

        this.node = node;
        this.health = emitter.lifespan;
        this.head = isHead;
        this.gravity = emitterView.getGravity() * scale[2];
        this.scale = 1;
        this.index = 0;

        vec4.copy(this.color, emitter.colors[0]);
        vec3.copy(this.nodeScale, scale);

        // Local location
        location[0] = pivot[0] + Math.randomRange(-width, width);
        location[1] = pivot[1] + Math.randomRange(-length, length);
        location[2] = pivot[2];

        // World location
        if (!emitter.modelSpace) {
            vec3.transformMat4(location, location, node.worldMatrix);
        }

        // Local rotation
        quat.identity(q);
        quat.rotateZ(q, q, Math.randomRange(-Math.PI, Math.PI));
        quat.rotateY(q, q, Math.randomRange(-latitude, latitude));
        vec3.transformQuat(velocity, vec3.UNIT_Z, q);

        // World rotation
        if (!emitter.modelSpace) {
            vec3.transformQuat(velocity, velocity, node.worldRotation);
        }

        // Apply speed
        vec3.scale(velocity, velocity, emitterView.getSpeed() + Math.randomRange(-emitter.variation, emitter.variation));

        // Apply the parent's scale
        vec3.mul(velocity, velocity, scale);

        if (!isHead) {
            var tailLength = emitter.tailLength * 0.5;

            vec3.scaleAndAdd(location, velocity, -tailLength);
        }
    },

    update() {
        let emitter = this.emitter,
            dt = emitter.model.env.frameTime * 0.001,
            location = this.location;

        this.health -= dt;
        this.velocity[1] -= this.gravity * dt;

        vec3.scaleAndAdd(location, location, this.velocity, dt);

        if (emitter.modelSpace) {
            vec3.transformMat4(this.worldLocation, location, this.node.worldMatrix);
        } else {
            vec3.copy(this.worldLocation, location);
        }

        let lifeFactor = (emitter.lifespan - this.health) / emitter.lifespan,
            timeMiddle = emitter.timeMiddle,
            factor,
            firstColor,
            head = this.head,
            interval;

        if (lifeFactor < timeMiddle) {
            factor = lifeFactor / timeMiddle;

            firstColor = 0;

            if (head) {
                interval = emitter.headInterval;
            } else {
                interval = emitter.tailInterval;
            }
        } else {
            factor = (lifeFactor - timeMiddle) / (1 - timeMiddle);

            firstColor = 1;

            if (head) {
                interval = emitter.headDecayInterval;
            } else {
                interval = emitter.tailDecayInterval;
            }
        }

        let segmentScaling = emitter.segmentScaling,
            colors = emitter.colors;

        this.scale = Math.lerp(segmentScaling[0], segmentScaling[1], factor);
        vec4.lerp(this.color, colors[firstColor], colors[firstColor + 1], factor);
        this.index = Math.floor(Math.lerp(interval[0], interval[1], factor));
    }
};
