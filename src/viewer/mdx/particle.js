function Particle() {
  this.position = [];
}

Particle.prototype = {
  reset: function (emitter, sequence, frame, counter) {
    var speed = getSDValue(sequence, frame, counter, emitter.sd.speed, emitter.initialVelocity);
    var latitude = getSDValue(sequence, frame, counter, emitter.sd.latitude, emitter.latitude);
    var longitude = getSDValue(sequence, frame, counter, emitter.sd.longitude, emitter.longitude);
    var lifespan = getSDValue(sequence, frame, counter, emitter.sd.lifespan, emitter.lifespan);
    
    this.alive = true;
    this.health = lifespan;
    
    math.mat4.multVec3(emitter.node.worldMatrix, emitter.node.pivot, this.position);
    
    var rotationY = [];
    var rotationZ = [];
    var rotation = [];
    var v = [];
    
    math.mat4.makeRotateY(rotationY, math.random(-latitude, latitude));
    math.mat4.makeRotateZ(rotationZ, math.random(-longitude, longitude));
    math.mat4.multMat(rotationZ, rotationY, rotation);
    math.mat4.multVec3(rotation, [0, 0, 1], v);
    math.vec3.normalize(v, v);
    
    var p = this.position;
    var velocityStart = [p[0], p[1], p[2]];
    var velocityEnd = [p[0] + v[0], p[1] + v[1], p[2] + v[2]];

    math.mat4.multVec3(emitter.node.worldMatrix, velocityStart, velocityStart);
    math.mat4.multVec3(emitter.node.worldMatrix, velocityEnd, velocityEnd);
    
    math.vec3.subtract(velocityEnd, velocityStart, v);
    math.vec3.normalize(v, v);
    
    math.vec3.scale(v, speed, v);
    
    this.velocity = v;
    this.orientation = math.random(0, Math.PI * 2);
  },
  
  update: function (emitter, sequence, frame, counter) {
    if (this.alive) {
      var gravity = getSDValue(sequence, frame, counter, emitter.sd.gravity, emitter.gravity);
      
      this.health -= FRAME_TIME;
      
      this.velocity[2] -= gravity * FRAME_TIME;

      this.position[0] += this.velocity[0] * FRAME_TIME;
      this.position[1] += this.velocity[1] * FRAME_TIME;
      this.position[2] += this.velocity[2] * FRAME_TIME;
    }
  }
};