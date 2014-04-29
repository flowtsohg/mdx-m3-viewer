function Particle2() {
  this.color = [];
  this.position = [];
}

Particle2.prototype = {
  reset: function (emitter, head, id, sequence, frame, counter) {
    var pivot = emitter.node.pivot;
    var width = getSDValue(sequence, frame, counter, emitter.sd.width, emitter.width) * 0.5;
    var length = getSDValue(sequence, frame, counter, emitter.sd.length, emitter.length) * 0.5;
    var speed = getSDValue(sequence, frame, counter, emitter.sd.speed, emitter.speed) ;
    var latitude = math.toRad(getSDValue(sequence, frame, counter, emitter.sd.latitude, emitter.latitude));
    var color = emitter.colors[0];
    
    this.id = id;
    
    this.health = emitter.lifespan;
    this.head = head;
    
    var position = [];
    
    math.mat4.multVec3(emitter.node.worldMatrix, [pivot[0] + math.random(-width, width), pivot[1] + math.random(-length, length), pivot[2]], position);
    
    this.speed = speed + math.random(-emitter.variation, emitter.variation);
    
    var rotationY = [];
    var rotationZ = [];
    var rotation = [];
    var velocity = [];
    
    math.mat4.makeRotateY(rotationY, math.random(-latitude, latitude));
    math.mat4.makeRotateZ(rotationZ, math.random(-Math.PI, Math.PI));
    math.mat4.multMat(rotationZ, rotationY, rotation);
    math.mat4.multVec3(rotation, [0, 0, 1], velocity);
    math.vec3.normalize(velocity, velocity);
    
    var velocityStart = [position[0], position[1], position[2]];
    var velocityEnd = [position[0] + velocity[0], position[1] + velocity[1], position[2] + velocity[2]];

    math.mat4.multVec3(emitter.node.worldMatrix, velocityStart, velocityStart);
    math.mat4.multVec3(emitter.node.worldMatrix, velocityEnd, velocityEnd);
    
    math.vec3.subtract(velocityEnd, velocityStart, velocity);
    math.vec3.normalize(velocity, velocity);
    
    math.vec3.scale(velocity, this.speed, velocity);
    
    if (!head) {
      var tailLength = emitter.tailLength * 0.5;
      
      position[0] -= tailLength * velocity[0];
      position[1] -= tailLength * velocity[1];
      position[2] -= tailLength * velocity[2];
      this.tailLength = tailLength;
    }
    
    this.position = position;
    this.velocity = velocity;
    this.color[0] = color[0];
    this.color[1] = color[1];
    this.color[2] = color[2];
    this.color[3] = color[3];
    
    this.scale = 1;
    this.row = 0;
    this.column = 0;
    this.index = 0;
  },
  
  update: function (emitter, sequence, frame, counter) {
    var gravity = getSDValue(sequence, frame, counter, emitter.sd.gravity, emitter.gravity);
    
    this.health -= FRAME_TIME;
    this.velocity[2] -= gravity * FRAME_TIME;

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
    var frameInterval, frameIntervalStart;
    
    if (currentFrame < emitter.headFrames) {
      frameInterval = emitter.headInterval[1] - emitter.headInterval[0] + 1;
      frameIntervalStart = 0;

      index = emitter.headInterval[0] + ((currentFrame - frameIntervalStart) % frameInterval);
    } else if (currentFrame < emitter.headFrames + emitter.headDecayFrames) {
      frameInterval = emitter.headDecayInterval[1] - emitter.headDecayInterval[0] + 1;
      frameIntervalStart = emitter.headFrames;

      index = emitter.headDecayInterval[0] + ((currentFrame - frameIntervalStart) % frameInterval);
    } else if (currentFrame < emitter.headFrames + emitter.headDecayFrames + emitter.tailFrames) {
      frameInterval = emitter.tailInterval[1] - emitter.tailInterval[0] + 1;
      frameIntervalStart = emitter.headFrames + emitter.headDecayFrames;

      this.index = emitter.tailInterval[0] + ((currentFrame - frameIntervalStart) % frameInterval);
    } else if (currentFrame < emitter.headFrames + emitter.headDecayFrames + emitter.tailFrames + emitter.tailDecayFrames) {
      frameInterval = emitter.tailDecayInterval[1] - emitter.tailDecayInterval[0] + 1;
      frameIntervalStart = emitter.headFrames + emitter.headDecayFrames + emitter.tailFrames;

      index = emitter.tailDecayInterval[0] + ((currentFrame - frameIntervalStart) % frameInterval);
    }
    
    this.index = Math.floor(index);
    this.scale = scale;
  }
};