function ShallowBone (bone) {
  this.boneImpl = bone;
  this.parent = bone.parent;
  this.worldMatrix = mat4.create();
  this.scale = vec3.create();
  this.inverseScale = vec3.create();
}

ShallowBone.prototype = {
  getTransformation: function () {
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
  
  // TODO: instead of hacking, inject a root exactly like I do in the Mdx parser.
  this.root = {
    worldMatrix: mat4.create(),
    scale: vec3.create(),
    inverseScale: vec3.create(),
    getTransformation: function () { return this.worldMatrix }
  };
  
  this.localMatrix = mat4.create();
  this.rotationMatrix = mat4.create();
  
  this.locationVec = vec3.create();
  this.scaleVec = vec3.create();
  this.rotationQuat = quat.create();
  this.tempVec3 = vec3.create();
}

Skeleton.prototype = {
  // NOTE: This function assumes that the bones are sorted in such way that a child would always be after its parent. Is this true?
  update: function (sequence, frame, instance) {
    var root = this.root;
    
    mat4.identity(root.worldMatrix);
    
    if (instance) {
      mat4.copy(root.worldMatrix, instance.getTransformation());
      mat4.decomposeScale(root.scale, root.worldMatrix);
      vec3.inverse(root.inverseScale, root.scale);
    }
    
    for (var i = 0, l = this.bones.length; i < l; i++) {
      this.updateBone(this.bones[i], sequence, frame);
    }
    
    this.updateBoneTexture(sequence);
  },
  
  getValue: function (out, animRef, sequence, frame) {
    if (sequence !== -1) {
      return this.stg[sequence].getValue(out, animRef, frame)
    }
    
    return animRef.initValue;
  },
  
  updateBone: function (bone, sequence, frame) {
    var localMatrix = this.localMatrix;
    var rotationMatrix = this.rotationMatrix;
    var location = this.getValue(this.locationVec, bone.boneImpl.location, sequence, frame);
    var rotation = this.getValue(this.rotationQuat, bone.boneImpl.rotation, sequence, frame);
    var scale = this.getValue(this.scaleVec, bone.boneImpl.scale, sequence, frame);
    
    mat4.fromRotationTranslationScale(localMatrix, rotation, location, scale);
    
    if (bone.parent !== -1) {
      var parent = this.bones[bone.parent];
      
      mat4.multiply(bone.worldMatrix, parent.worldMatrix, localMatrix);
    } else {
      mat4.multiply(bone.worldMatrix, this.root.worldMatrix, localMatrix);
    }
    
    mat4.decomposeScale(bone.scale, bone.worldMatrix);
    vec3.inverse(bone.inverseScale, bone.scale);
  },
  
  updateBoneTexture: function (sequence) {
    var bones = this.bones;
    var hwbones = this.hwbones;
    var initialReferences = this.initialReference;
    var boneLookup = this.boneLookup;
    var bone;
    var finalMatrix;
    
    if (sequence === -1) {
      finalMatrix = this.root.worldMatrix;
    } else {
      finalMatrix = this.localMatrix;
    }
    
    for (var i = 0, l = boneLookup.length; i < l; i++) {
      if (sequence !== -1) {
        bone = boneLookup[i];
        mat4.multiply(finalMatrix, bones[bone].worldMatrix, initialReferences[bone]);
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