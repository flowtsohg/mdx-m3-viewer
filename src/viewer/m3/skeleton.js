// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Skeleton(parser) {
  var i, l;
  var sts = parser.sts;
  var stc = parser.stc;
  var stg = parser.stg;
  
  this.initialReference = parser.initialReference;
  this.bones = parser.bones;
  this.sequences = parser.sequences;
  this.sts = [];
  this.stc = [];
  this.stg = [];
  
  for (i = 0, l = sts.length; i < l; i++) {
    this.sts[i] = new STS(sts[i]);
  }
  
  for (i = 0, l = stc.length; i < l; i++) {
    this.stc[i] = new STC(stc[i]);
  }
  
  for (i = 0, l = stg.length; i < l; i++) {
    this.stg[i] = new STG(stg[i], this.sts, this.stc);
  }
  
  this.hwbones = new Float32Array(16 * parser.bones.length);
  this.boneTexture = ctx.createTexture();
  this.boneTextureSize = Math.max(2, math.powerOfTwo(parser.bones.length + 1)) * 4;
  this.texelFraction = 1 / this.boneTextureSize;
  this.boneFraction = this.texelFraction * 4;
  
  ctx.activeTexture(ctx.TEXTURE15);
  ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
  ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.boneTextureSize, 1, 0, ctx.RGBA, ctx.FLOAT, null);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
  
  for (i = 0, l = this.bones.length; i < l; i++) {
    this.bones[i].worldMatrix = [];
  }
  
  this.addGlobalAnims();
  
  this.update(-1); // Go into bind pose when the viewer starts
}

Skeleton.prototype = {
  addGlobalAnims: function () {
    var i, l;
    var glbirth, glstand, gldeath;
    var stgs = this.stg;
    
    for (i = 0, l = stgs.length; i < l; i++) {
      var stg = stgs[i];
      var name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...
      
      if (name === "glbirth") {
        glbirth = stg;
      } else if (name === "glstand") {
        glstand = stg;
      } else if (name === "gldeath") {
        gldeath = stg;
      }
    }
    
    for (i = 0, l = stgs.length; i < l; i++) {
      var stg = stgs[i];
      var name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...
      
      if (name !== "glbirth" && name !== "glstand" && name !== "gldeath") {
        if (name.indexOf("birth") !== -1 && glbirth) {
          stg.stcIndices = stg.stcIndices.concat(glbirth.stcIndices);
        } else  if (name.indexOf("death") !== -1 && gldeath) {
          stg.stcIndices = stg.stcIndices.concat(gldeath.stcIndices);
        } else if (glstand) {
          stg.stcIndices = stg.stcIndices.concat(glstand.stcIndices);
        }
      }
    }
  },
  
  // NOTE: This function assumes that the bones are sorted in such way that a child would always be after its parent. Is this true?
  update: function (sequenceId, frame) {
    for (var i = 0, l = this.bones.length; i < l; i++) {
      this.updateBone(this.bones[i], sequenceId, frame);
    }
    
    this.updateHW(sequenceId);
  },
  
  updateHW: function (sequenceId) {
    var bones = this.bones;
    var hwbones = this.hwbones;
    var initialReferences = this.initialReference;
    
     for (var i = 0, l = bones.length; i < l; i++) {
      var k = i * 16;
      var finalMatrix = [];
       
      if (sequenceId !== -1) {
        math.mat4.multMat(bones[i].worldMatrix, initialReferences[i], finalMatrix);
      } else {
        finalMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
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
  
  getValue: function (animRef, sequenceId, frame) {
    if (sequenceId !== -1) {
      return this.stg[sequenceId].getValue(animRef, frame)
    } else {
      return animRef.initValue;
    }
  },
  
  updateBone: function (bone, sequenceId, frame) {
    var localMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var location = this.getValue(bone.location, sequenceId, frame);
    var scale = this.getValue(bone.scale, sequenceId, frame);
    var rotation = this.getValue(bone.rotation, sequenceId, frame);
    
    if (location[0] !== 0 || location[1] !== 0 || location[2] !== 0) {
      math.mat4.translate(localMatrix, location[0], location[1], location[2]);
    }
    
    if (scale[0] !== 1 || scale[1] !== 1 || scale[2] !== 1) {
      math.mat4.scale(localMatrix, scale[0], scale[1], scale[2]);
    }
    
    if (rotation[0] !== 0 || rotation[1] !== 0 || rotation[2] !== 0 || rotation[3] !== 1) {
      math.mat4.rotateQ(localMatrix, rotation);
    }
    
		if (bone.parent !== -1) {
			math.mat4.multMat(this.bones[bone.parent].worldMatrix, localMatrix, bone.worldMatrix);
		} else {
      bone.worldMatrix = localMatrix;
		}
	},
  
  bind: function () {
    gl.setParameter("u_bones", 15);
    gl.setParameter("u_bone_size", this.boneFraction);
    gl.setParameter("u_pixel_size", this.texelFraction);
    
    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
  }
};