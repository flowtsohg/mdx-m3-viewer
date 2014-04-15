function Particle2() {
  this.color = [];
  this.position = [];
}

Particle2.prototype = {
  reset: function (emitter, head, sequence, frame, counter) {
    var p = emitter.node.pivot;
    var width = getSDValue(sequence, frame, counter, emitter.sd.width, emitter.width) * 0.5;
    var length = getSDValue(sequence, frame, counter, emitter.sd.length, emitter.length) * 0.5;
    var speed = getSDValue(sequence, frame, counter, emitter.sd.speed, emitter.speed) ;
    var latitude = math.toRad(getSDValue(sequence, frame, counter, emitter.sd.latitude, emitter.latitude));
    
    this.alive = true;
    this.health = emitter.lifespan;
    this.head = head;
    
    math.mat4.multVec3(emitter.node.worldMatrix, [p[0] + math.random(-width, width), p[1] + math.random(-length, length), p[2]], this.position);
    
    this.speed = speed + math.random(-emitter.variation, emitter.variation);
    
    var rotationY = [];
    var rotationZ = [];
    var rotation = [];
    var v = [];
    
    math.mat4.makeRotateY(rotationY, math.random(-latitude, latitude));
    math.mat4.makeRotateZ(rotationZ, math.random(-Math.PI, Math.PI));
    math.mat4.multMat(rotationZ, rotationY, rotation);
    math.mat4.multVec3(rotation, [0, 0, 1], v);
    math.vec3.normalize(v, v);
    
    p = this.position;
    
    var velocityStart = [p[0], p[1], p[2]];
    var velocityEnd = [p[0] + v[0], p[1] + v[1], p[2] + v[2]];

    math.mat4.multVec3(emitter.node.worldMatrix, velocityStart, velocityStart);
    math.mat4.multVec3(emitter.node.worldMatrix, velocityEnd, velocityEnd);
    
    math.vec3.subtract(velocityEnd, velocityStart, v);
    math.vec3.normalize(v, v);
    
    math.vec3.scale(v, this.speed, v);
    
    this.velocity = v;
    
    if (!this.head) {
      var tailLength = emitter.tailLength * 0.5;
      
      this.position[0] -= tailLength * v;
      this.position[1] -= tailLength * v;
      this.position[2] -= tailLength * v;
      this.tailLength = tailLength;
    }
    
    this.scale = 1;
    this.row = 0;
    this.column = 0;
  },
  
  update: function (emitter, sequence, frame, counter) {
    if (this.alive) {
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
        scale = (emitter.segmentScaling[0] + tempFactor * (emitter.segmentScaling[1] - emitter.segmentScaling[0]));

        math.vec4.lerp(emitter.colors[0], emitter.colors[1], tempFactor, this.color);
      } else {
        tempFactor = (lifeFactor - emitter.time) / (1 - emitter.time);
        scale = (emitter.segmentScaling[1] + tempFactor * (emitter.segmentScaling[2] - emitter.segmentScaling[1]));

        math.vec4.lerp(emitter.colors[1], emitter.colors[2], tempFactor, this.color);
      }
      
      var currentFrame = lifeFactor * emitter.numberOfFrames;

      this.index = 0;

      var frameInterval, frameIntervalStart;
      
      if (emitter.headOrTail !== 0) {
        if (currentFrame < emitter.headFrames) {
          frameInterval = emitter.headInterval[1] - emitter.headInterval[0] + 1;
          frameIntervalStart = 0;

          this.index = emitter.headInterval[0] + ((currentFrame - frameIntervalStart) % frameInterval);
        } else if (currentFrame < emitter.headFrames + emitter.headDecayFrames) {
          frameInterval = emitter.headDecayInterval[1] - emitter.headDecayInterval[0] + 1;
          frameIntervalStart = emitter.headFrames;

          this.index = emitter.headDecayInterval[0] + ((currentFrame - frameIntervalStart) % frameInterval);
        } else if (currentFrame < emitter.headFrames + emitter.headDecayFrames + emitter.tailFrames) {
          frameInterval = emitter.tailInterval[1] - emitter.tailInterval[0] + 1;
          frameIntervalStart = emitter.headFrames + emitter.headDecayFrames;

          this.index = emitter.tailInterval[0] + ((currentFrame - frameIntervalStart) % frameInterval);
        } else if (currentFrame < emitter.headFrames + emitter.headDecayFrames + emitter.tailFrames + emitter.tailDecayFrames) {
          frameInterval = emitter.tailDecayInterval[1] - emitter.tailDecayInterval[0] + 1;
          frameIntervalStart = emitter.headFrames + emitter.headDecayFrames + emitter.tailFrames;

          this.index = emitter.tailDecayInterval[0] + ((currentFrame - frameIntervalStart) % frameInterval);
        }
      }

      this.row = Math.round((emitter.columns === 1) ? 0 : (this.index / emitter.columns));
      this.column = Math.round((emitter.columns === 1) ? 0 : (this.index % emitter.columns));
      this.scale = scale;
    }
  }
};