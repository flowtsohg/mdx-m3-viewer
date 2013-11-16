// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Particle(model) {
  this.model = model;
  this.position = [];
}

Particle.prototype = {
  reset: function (emitter) {
    var speed = getTrack(emitter.tracks.speed, emitter.initialVelocity, this.model);
    var latitude = getTrack(emitter.tracks.latitude, emitter.latitude, this.model);
    var longitude = getTrack(emitter.tracks.longitude, emitter.longitude, this.model);
    var lifespan = getTrack(emitter.tracks.lifespan, emitter.lifespan, this.model);
    
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
  
  update: function (emitter) {
    if (this.alive) {
      var gravity = getTrack(emitter.tracks.gravity, emitter.gravity, this.model);
      
      this.health -= FRAME_TIME * ANIMATION_SCALE;
      
      this.velocity[2] -= gravity * FRAME_TIME * ANIMATION_SCALE;

      this.position[0] += this.velocity[0] * FRAME_TIME * ANIMATION_SCALE;
      this.position[1] += this.velocity[1] * FRAME_TIME * ANIMATION_SCALE;
      this.position[2] += this.velocity[2] * FRAME_TIME * ANIMATION_SCALE;
    }
  }
};