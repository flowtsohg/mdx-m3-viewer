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
  
  this.boneLookup = model.boneLookup;
  
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
    var boneLookup = this.boneLookup;
    var index, finalMatrix, bone;
    
     for (var i = 0, l = boneLookup.length; i < l; i++) {
      index = i * 16;
      finalMatrix = [];
      bone = boneLookup[i];
       
      if (sequence !== -1) {
        math.mat4.multMat(bones[bone].worldMatrix, initialReferences[bone], finalMatrix);
      } else {
        finalMatrix = this.root;
      }
      
      hwbones[index + 0] = finalMatrix[0];
      hwbones[index + 1] = finalMatrix[1];
      hwbones[index + 2] = finalMatrix[2];
      hwbones[index + 3] = finalMatrix[3];
      hwbones[index + 4] = finalMatrix[4];
      hwbones[index + 5] = finalMatrix[5];
      hwbones[index + 6] = finalMatrix[6];
      hwbones[index + 7] = finalMatrix[7];
      hwbones[index + 8] = finalMatrix[8];
      hwbones[index + 9] = finalMatrix[9];
      hwbones[index + 10] = finalMatrix[10];
      hwbones[index + 11] = finalMatrix[11];
      hwbones[index + 12] = finalMatrix[12];
      hwbones[index + 13] = finalMatrix[13];
      hwbones[index + 14] = finalMatrix[14];
      hwbones[index + 15] = finalMatrix[15];
    }
  
    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, boneLookup.length * 4 + 4, 1, ctx.RGBA, ctx.FLOAT, hwbones);
  },
  
  bind: function () {
    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    
    gl.setParameter("u_bones", 15);
    gl.setParameter("u_bone_size", this.boneFraction);
    gl.setParameter("u_pixel_size", this.texelFraction);
  }
};