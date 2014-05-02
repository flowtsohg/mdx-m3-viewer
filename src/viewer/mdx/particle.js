function Particle() {
  this.position = vec3.create();
  this.velocity = vec3.create();
  this.orientation = 0;
}

Particle.prototype = {
  reset: function (emitter, sequence, frame, counter) {
    var speed = getSDValue(null, sequence, frame, counter, emitter.sd.speed, emitter.initialVelocity);
    var latitude = getSDValue(null, sequence, frame, counter, emitter.sd.latitude, emitter.latitude);
    var longitude = getSDValue(null, sequence, frame, counter, emitter.sd.longitude, emitter.longitude);
    var lifespan = getSDValue(null, sequence, frame, counter, emitter.sd.lifespan, emitter.lifespan);
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
    mat4.rotateZ(rotation, rotation, math.random(-Math.PI, Math.PI));
    mat4.rotateY(rotation, rotation, math.random(-latitude, latitude));
    
    vec3.transformMat4(velocity, zAxis, rotation);
    vec3.normalize(velocity, velocity);
    
    vec3.add(velocityEnd, position, velocity);
    
    vec3.transformMat4(velocityStart, position, worldMatrix);
    vec3.transformMat4(velocityEnd, velocityEnd, worldMatrix);
    
    vec3.subtract(velocity, velocityEnd, velocityStart);
    vec3.normalize(velocity, velocity);
    vec3.scale(velocity, velocity, speed);
    
    vec3.copy(this.velocity, velocity);
    
    this.orientation = math.random(0, Math.PI * 2);
  },
  
  update: function (emitter, sequence, frame, counter) {
    if (this.alive) {
      var gravity = getSDValue(null, sequence, frame, counter, emitter.sd.gravity, emitter.gravity);
      
      this.health -= FRAME_TIME;
      
      this.velocity[2] -= gravity * FRAME_TIME;

      vec3.scaleAndAdd(this.position, this.position, this.velocity, FRAME_TIME);
    }
  }
};