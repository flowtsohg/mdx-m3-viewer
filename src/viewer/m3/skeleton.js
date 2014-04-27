function ShallowBone (bone) {
  this.boneImpl = bone;
  this.parent = bone.parent;
  this.worldMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  this.scale = [1, 1, 1];
}

ShallowBone.prototype = {
  getTransform: function () {
    return this.worldMatrix;
  }
};

function Skeleton(model) {
  var i, l;
  var bones = model.bones;
  
  this.initialReference = model.initialReference;
  this.sts = model.sts;
  this.stc = model.stc;
  this.stg = model.stg;
  this.bones = [];
  
  this.hwbones = new Float32Array(16 * bones.length);
  this.boneTexture = ctx.createTexture();
  this.boneTextureSize = Math.max(2, math.powerOfTwo(bones.length + 1)) * 4;
  this.texelFraction = 1 / this.boneTextureSize;
  this.boneFraction = this.texelFraction * 4;
  
  ctx.activeTexture(ctx.TEXTURE15);
  ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
  ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.boneTextureSize, 1, 0, ctx.RGBA, ctx.FLOAT, null);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
  
  for (i = 0, l = bones.length; i < l; i++) {
    this.bones[i] = new ShallowBone(bones[i]);
  }
  
  this.root = [];
  
  this.update(-1); // Go into bind pose when the viewer starts
}

Skeleton.prototype = {
  // NOTE: This function assumes that the bones are sorted in such way that a child would always be after its parent. Is this true?
  update: function (sequence, frame, instance) {
    var root = this.root;
    
    math.mat4.makeIdentity(root);
    
    if (instance) {
      math.mat4.multMat(root, instance.getTransform(), root);
    }
    
    for (var i = 0, l = this.bones.length; i < l; i++) {
      this.updateBone(this.bones[i], sequence, frame);
    }
    
    this.updateBoneTexture(sequence);
  },
  
  getValue: function (animRef, sequence, frame) {
    if (sequence !== -1) {
      return this.stg[sequence].getValue(animRef, frame)
    }
    
    return animRef.initValue;
  },
  
  updateBone: function (bone, sequence, frame) {
    var localMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var location = this.getValue(bone.boneImpl.location, sequence, frame);
    var scale = this.getValue(bone.boneImpl.scale, sequence, frame);
    var rotation = this.getValue(bone.boneImpl.rotation, sequence, frame);
    
    if (location[0] !== 0 || location[1] !== 0 || location[2] !== 0) {
      math.mat4.translate(localMatrix, location[0], location[1], location[2]);
    }
    
    if (rotation[0] !== 0 || rotation[1] !== 0 || rotation[2] !== 0 || rotation[3] !== 1) {
      math.mat4.rotateQ(localMatrix, rotation);
    }
    
    if (scale[0] !== 1 || scale[1] !== 1 || scale[2] !== 1) {
      math.mat4.scale(localMatrix, scale[0], scale[1], scale[2]);
      
      math.vec3.setFromArray(bone.scale, scale);
    }
    
    if (bone.parent !== -1) {
      var parent = this.bones[bone.parent];
      
      math.vec3.scaleVec(bone.scale, parent.scale, bone.scale);
      math.mat4.multMat(parent.worldMatrix, localMatrix, bone.worldMatrix);
    } else {
      math.mat4.multMat(this.root, localMatrix, bone.worldMatrix);
    }
  },
  
  updateBoneTexture: function (sequence) {
    var bones = this.bones;
    var hwbones = this.hwbones;
    var initialReferences = this.initialReference;
    
     for (var i = 0, l = bones.length; i < l; i++) {
      var k = i * 16;
      var finalMatrix = [];
       
      if (sequence !== -1) {
        math.mat4.multMat(bones[i].worldMatrix, initialReferences[i], finalMatrix);
      } else {
        finalMatrix = this.root;
      }
      
      hwbones[k + 0] = finalMatrix[0];
      hwbones[k + 1] = finalMatrix[1];
      hwbones[k + 2] = finalMatrix[2];
      hwbones[k + 3] = finalMatrix[3];
      hwbones[k + 4] = finalMatrix[4];
      hwbones[k + 5] = finalMatrix[5];
      hwbones[k + 6] = finalMatrix[6];
      hwbones[k + 7] = finalMatrix[7];
      hwbones[k + 8] = finalMatrix[8];
      hwbones[k + 9] = finalMatrix[9];
      hwbones[k + 10] = finalMatrix[10];
      hwbones[k + 11] = finalMatrix[11];
      hwbones[k + 12] = finalMatrix[12];
      hwbones[k + 13] = finalMatrix[13];
      hwbones[k + 14] = finalMatrix[14];
      hwbones[k + 15] = finalMatrix[15];
    }
  
    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, bones.length * 4, 1, ctx.RGBA, ctx.FLOAT, hwbones);
  },
  
  bind: function () {
    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    
    gl.setParameter("u_bones", 15);
    gl.setParameter("u_bone_size", this.boneFraction);
    gl.setParameter("u_pixel_size", this.texelFraction);
  }
};