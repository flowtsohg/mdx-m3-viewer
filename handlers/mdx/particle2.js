function MdxParticle2() {
    this.id = 0;
    this.health = 0;
    this.head = true;
    this.position = [];
    this.worldLocation = [];
    this.velocity = [];
    this.color = [];
    this.gravity = 0;
    this.scale = 1;
    this.index = 0;
}

MdxParticle2.prototype = {
    reset(emitter, head, id, instance) {
        const node = instance.skeleton.nodes[emitter.node.index];

        var pivot = node.pivot;
        var worldMatrix = node.worldMatrix;
        var scale = node.worldScale;
        var width = emitter.getWidth() * 0.5 * scale[0];
        var length = emitter.getLength() * 0.5 * scale[1];
        var speed = emitter.getSpeed() + Math.randomRange(-emitter.variation, emitter.variation);
        var latitude = Math.toRad(emitter.getLatitude());
        var gravity = emitter.getGravity() * scale[2];
        var color = emitter.colors[0];
        var localPosition = emitter.particleLocalPosition;
        var position = emitter.particlePosition;
        var rotation = emitter.particleRotation;
        var velocity = emitter.particleVelocity;
        var velocityStart = emitter.particleVelocityStart;
        var velocityEnd = emitter.particleVelocityEnd;
        var modelSpace = emitter.modelSpace;
        
        localPosition[0] = pivot[0] + Math.randomRange(-width, width);
        localPosition[1] = pivot[1] + Math.randomRange(-length, length);
        localPosition[2] = pivot[2];
        
        if (modelSpace) {
            vec3.copy(position, localPosition);
        } else {
            vec3.transformMat4(position, localPosition, worldMatrix);
        }
        
        mat4.identity(rotation);
        mat4.rotateZ(rotation, rotation, Math.randomRange(-Math.PI, Math.PI));
        mat4.rotateY(rotation, rotation, Math.randomRange(-latitude, latitude));

        vec3.transformMat4(velocity, vec3.UNIT_Z, rotation);
        vec3.normalize(velocity, velocity);
        
        if (emitter.modelSpace) {
            vec3.scale(velocity, velocity, speed);
        } else {
            vec3.add(velocityEnd, position, velocity);

            vec3.transformMat4(velocityStart, position, worldMatrix);
            vec3.transformMat4(velocityEnd, velocityEnd, worldMatrix);

            vec3.subtract(velocity, velocityEnd, velocityStart);
            vec3.normalize(velocity, velocity);
            vec3.scale(velocity, velocity, speed);
        }
        
        if (!head) {
            var tailLength = emitter.tailLength * 0.5;

            vec3.scaleAndAdd(position, velocity, -tailLength);
        }

        this.node = node;
        this.id = id;
        this.health = emitter.lifespan;
        this.head = head;

        vec3.copy(this.position, position);
        vec3.multiply(this.velocity, velocity, scale);
        vec4.copy(this.color, color);

        this.gravity = gravity;
        this.scale = 1;
        this.index = 0;
    },

    update(emitter) {
        var dt = emitter.model.env.frameTimeS;
        var position = this.position;

        this.health -= dt;
        this.velocity[2] -= this.gravity * dt;
        
        vec3.scaleAndAdd(position, position, this.velocity, dt);
        
        if (emitter.modelSpace) {
            vec3.transformMat4(this.worldLocation, position, this.node.worldMatrix);
        } else {
            vec3.copy(this.worldLocation, position);
        }
        
        var lifeFactor = (emitter.lifespan - this.health) / emitter.lifespan;
        var tempFactor;
        var scale;
        var index;
        
        if (lifeFactor < emitter.timeMiddle) {
            tempFactor = lifeFactor / emitter.timeMiddle;
        
            scale = Math.lerp(emitter.segmentScaling[0], emitter.segmentScaling[1], tempFactor);
            vec4.lerp(this.color, emitter.colors[0], emitter.colors[1], tempFactor);
            
            if (this.head) {
                index = Math.lerp(emitter.headInterval[0], emitter.headInterval[1], tempFactor);
            } else {
                index = Math.lerp(emitter.tailInterval[0], emitter.tailInterval[1], tempFactor);
            }
        } else {
            tempFactor = (lifeFactor - emitter.timeMiddle) / (1 - emitter.timeMiddle);
            
            scale = Math.lerp(emitter.segmentScaling[1], emitter.segmentScaling[2], tempFactor);
            vec4.lerp(this.color, emitter.colors[1], emitter.colors[2], tempFactor);
            
            if (this.head) {
                index = Math.lerp(emitter.headDecayInterval[0], emitter.headDecayInterval[1], tempFactor);
            } else {
                index = Math.lerp(emitter.tailDecayInterval[0], emitter.tailDecayInterval[1], tempFactor);
            }
        }

        this.index = Math.floor(index);
        this.scale = scale;
    }
};
