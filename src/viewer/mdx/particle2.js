function Particle2() {
  this.id = 0;
  this.health = 0;
  this.head = true;
  this.position = [];
  this.velocity = [];
  this.color = [];
  this.gravity = 0;
  this.scale = 1;
  this.index = 0;
}

Particle2.prototype = {
  reset: function (emitter, head, id, sequence, frame, counter) {
    var pivot = emitter.node.pivot;
    var width = getSDValue(sequence, frame, counter, emitter.sd.width, emitter.width) * 0.5;
    var length = getSDValue(sequence, frame, counter, emitter.sd.length, emitter.length) * 0.5;
    var speed = getSDValue(sequence, frame, counter, emitter.sd.speed, emitter.speed) + math.random(-emitter.variation, emitter.variation);
    var latitude = math.toRad(getSDValue(sequence, frame, counter, emitter.sd.latitude, emitter.latitude));
    var gravity = getSDValue(sequence, frame, counter, emitter.sd.gravity, emitter.gravity);
    var color = emitter.colors[0];
    var localPosition = emitter.particleLocalPosition;
    var position = emitter.particlePosition;
    var rotationY = emitter.particleRotationY;
    var rotationZ = emitter.particleRotationZ;
    var rotation = emitter.particleRotation;
    var velocity = emitter.particleVelocity;
    var velocityStart = emitter.particleVelocityStart;
    var velocityEnd = emitter.particleVelocityEnd;
    
    localPosition[0] = pivot[0] + math.random(-width, width);
    localPosition[1] = pivot[1] + math.random(-length, length);
    localPosition[2] = pivot[2];
    
    math.mat4.multVec3(emitter.node.worldMatrix, localPosition, position);
    
    math.mat4.makeRotateY(rotationY, math.random(-latitude, latitude));
    math.mat4.makeRotateZ(rotationZ, math.random(-Math.PI, Math.PI));
    math.mat4.multMat(rotationZ, rotationY, rotation);
    math.mat4.multVec3(rotation, [0, 0, 1], velocity);
    math.vec3.normalize(velocity, velocity);
    
    velocityEnd[0] = position[0] + velocity[0];
    velocityEnd[1] = position[1] + velocity[1];
    velocityEnd[2] = position[2] + velocity[2];

    math.mat4.multVec3(emitter.node.worldMatrix, position, velocityStart);
    math.mat4.multVec3(emitter.node.worldMatrix, velocityEnd, velocityEnd);
    
    math.vec3.subtract(velocityEnd, velocityStart, velocity);
    math.vec3.normalize(velocity, velocity);
    
    math.vec3.scale(velocity, speed, velocity);
    
    if (!head) {
      var tailLength = emitter.tailLength * 0.5;
      
      position[0] -= tailLength * velocity[0];
      position[1] -= tailLength * velocity[1];
      position[2] -= tailLength * velocity[2];
    }
    
    this.id = id;
    this.health = emitter.lifespan;
    this.head = head;
    
    this.position[0] = position[0];
    this.position[1] = position[1];
    this.position[2] = position[2];
    
    this.velocity[0] = velocity[0];
    this.velocity[1] = velocity[1];
    this.velocity[2] = velocity[2];
    
    this.color[0] = color[0];
    this.color[1] = color[1];
    this.color[2] = color[2];
    this.color[3] = color[3];
    
    this.gravity = gravity;
    this.scale = 1;
    this.index = 0;
  },
  
  update: function (emitter, sequence, frame, counter) {
    this.health -= FRAME_TIME;
    this.velocity[2] -= this.gravity * FRAME_TIME;
    this.position[0] += this.velocity[0] * FRAME_TIME;
    this.position[1] += this.velocity[1] * FRAME_TIME;
    this.position[2] += this.velocity[2] * FRAME_TIME;

    var lifeFactor = (emitter.lifespan === 0) ? 0 : 1 - (this.health / emitter.lifespan);
    var scale;
    var tempFactor;
    
    if (lifeFactor < emitter.time) {
      tempFactor = lifeFactor / emitter.time;
      
      scale = math.lerp(emitter.segmentScaling[0], emitter.segmentScaling[1], tempFactor);
      
      math.vec4.lerp(emitter.colors[0], emitter.colors[1], tempFactor, this.color);
    } else {
      tempFactor = (lifeFactor - emitter.time) / (1 - emitter.time);
      
      scale = math.lerp(emitter.segmentScaling[1], emitter.segmentScaling[2], tempFactor);
      
      math.vec4.lerp(emitter.colors[1], emitter.colors[2], tempFactor, this.color);
    }
    
    var currentFrame = lifeFactor * emitter.numberOfFrames;
    var index = 0;
    
    // For some reason if I use array access here, Chrome doesn't like this function and doesn't optimize it
    if (currentFrame < emitter.interval0Frames) {
      index = emitter.interval0LocalStart + ((currentFrame - emitter.interval0Start) % emitter.interval0);
    } else if (currentFrame < emitter.interval1Frames) {
      index = emitter.interval1LocalStart + ((currentFrame - emitter.interval1Start) % emitter.interval1);
    } else if (currentFrame < emitter.interval2Frames) {
      this.index = emitter.interval2LocalStart + ((currentFrame - emitter.interval2Start) % emitter.interval2);
    } else if (currentFrame < emitter.interval3Frames) {
      index = emitter.interval3LocalStart + ((currentFrame - emitter.interval3Start) % emitter.interval3);
    }
    
    this.index = Math.floor(index);
    this.scale = scale;
  }
};