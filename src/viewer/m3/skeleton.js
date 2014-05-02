function ShallowBone (bone) {
  this.boneImpl = bone;
  this.parent = bone.parent;
  this.worldMatrix = math.mat4.createIdentity();
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
  var boneLookup = model.boneLookup;
  
  this.initialReference = model.initialReference;
  this.sts = model.sts;
  this.stc = model.stc;
  this.stg = model.stg;
  this.bones = [];
  
  this.boneLookup = boneLookup;
  this.hwbones = new Float32Array(16 * boneLookup.length);
  this.boneTexture = ctx.createTexture();
  this.boneTextureSize = Math.max(2, math.powerOfTwo(boneLookup.length + 1)) * 4;
  this.texelFraction = 1 / this.boneTextureSize;
  this.matrixFraction = this.texelFraction * 4;
  
  ctx.activeTexture(ctx.TEXTURE15);
  ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
  ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.boneTextureSize, 1, 0, ctx.RGBA, ctx.FLOAT, null);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
  
  for (i = 0, l = bones.length; i < l; i++) {
    this.bones[i] = new ShallowBone(bones[i]);
  }
  
  this.root = math.mat4.create();
  this.localMatrix = math.mat4.create();
  this.rotationMatrix = math.mat4.create();
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
    var localMatrix = this.localMatrix;
    var rotationMatrix = this.rotationMatrix;
    var location = this.getValue(bone.boneImpl.location, sequence, frame);
    var scale = this.getValue(bone.boneImpl.scale, sequence, frame);
    var rotation = this.getValue(bone.boneImpl.rotation, sequence, frame);
    
    math.mat4.makeIdentity(localMatrix);
    
    if (location[0] !== 0 || location[1] !== 0 || location[2] !== 0) {
      math.mat4.translate(localMatrix, location[0], location[1], location[2]);
    }
    
    if (rotation[0] !== 0 || rotation[1] !== 0 || rotation[2] !== 0 || rotation[3] !== 1) {
      math.quaternion.toRotationMatrix4(rotation, rotationMatrix);
      
      math.mat4.multMat(localMatrix, rotationMatrix, localMatrix);
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
    var bone;
    var finalMatrix;
    
    if (sequence === -1) {
      finalMatrix = this.root;
    } else {
      finalMatrix = this.localMatrix;
    }
    
    for (var i = 0, l = boneLookup.length; i < l; i++) {
      if (sequence !== -1) {
        bone = boneLookup[i];
        math.mat4.multMat(bones[bone].worldMatrix, initialReferences[bone], finalMatrix);
      } 
      
      hwbones.set(finalMatrix, i * 16);
    }
  
    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, boneLookup.length * 4, 1, ctx.RGBA, ctx.FLOAT, hwbones);
  },
  
  bind: function (shader) {
    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    
    ctx.uniform1i(shader.variables.u_boneMap, 15);
    ctx.uniform1f(shader.variables.u_matrix_size, this.matrixFraction);
    ctx.uniform1f(shader.variables.u_texel_size, this.texelFraction);
  }
};