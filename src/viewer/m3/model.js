function Model(parser, textureMap) {
  var i, l;
  var div = parser.divisions[0];
  var uvSetCount = parser.uvSetCount;
  var regions = div.regions;
  var tokens = parser.name.split(/[\/\\]/);
  var material;
  
  this.name = tokens[tokens.length - 1];
  this.uvSetCount = uvSetCount;
  this.regions = [];
  
  for (i = 0, l = regions.length; i < l; i++) {
    this.regions.push(new Region(regions[i], parser.vertices, div.triangles, parser.boneLookup, uvSetCount));
  }
  
  this.batches = [];
  this.materials = [[], []]; // 2D array for the possibility of adding more material types in the future
  this.materialMaps = parser.materialMaps;

  var materialMaps = parser.materialMaps;
  var materials = parser.materials;
  var batches = [];
  
  this.textureMap = {};
  
  // Create concrete material objects for standard materials
  for (i = 0, l = materials[0].length; i < l; i++) {
    material = materials[0][i];
    
    this.materials[1][i] = new StandardMaterial(material, this, textureMap);
  }
  
// Create concrete batch objects
  for (i = 0, l = div.batches.length; i < l; i++) {
    var batch = div.batches[i];
    var regionId = batch.regionIndex;
    var materialMap = materialMaps[batch.materialReferenceIndex];
    
    if (materialMap.materialType === 1) {
      batches.push({region: this.regions[regionId], material: this.materials[1][materialMap.materialIndex]});
    }
  }

/*
  var batchGroups = [[], [], [], [], [], []];
  
  for (i = 0, l = batches.length; i < l; i++) {
    var blendMode = batches[i].material.blendMode;
    
    batchGroups[blendMode].push(batches[i]);
  }
  
  function sortByPriority(a, b) {
    var a = a.material.priority;
    var b = b.material.priority;
    
    if (a < b) {
      return 1;
    } else if (a == b) {
      return 0;
    } else {
      return -1;
    }
  }
  
  for (i = 0; i < 6; i++) {
    batchGroups[i].sort(sortByPriority);
  }
*/
  /*
  // In the EggPortrait model the batches seem to be sorted by blend mode. Is this true for every model?
  this.batches.sort(function (a, b) {
    var ba = a.material.blendMode;
    var bb = b.material.blendMode;
    
    if (ba < bb) {
      return -1;
    } else if (ba == bb) {
      return 0;
    } else {
      return 1;
    }
  });
  */
  
  //this.batches = batchGroups[0].concat(batchGroups[1]).concat(batchGroups[2]).concat(batchGroups[3]).concat(batchGroups[4]).concat(batchGroups[5]);
  this.batches = batches;
  
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
  
  this.addGlobalAnims();
  
  if (parser.fuzzyHitTestObjects.length > 0) {
    this.fuzzyHitTestObjects = [];
    
    for (i = 0, l = parser.fuzzyHitTestObjects.length; i < l; i++) {
      this.fuzzyHitTestObjects[i] = new BoundingShape(parser.fuzzyHitTestObjects[i]);
    }
  }
  /*
  if (parser.particleEmitters.length > 0) {
    this.particleEmitters = [];
    
    for (i = 0, l = parser.particleEmitters.length; i < l; i++) {
      this.particleEmitters[i] = new ParticleEmitter(parser.particleEmitters[i], this);
    }
  }
  */
 
  this.attachments = parser.attachmentPoints;
  this.cameras = parser.cameras;
    
  this.ready = true;
}

Model.prototype = {
  mapMaterial: function (index) {
    var materialMap = this.materialMaps[index];
    
    return this.materials[materialMap.materialType][materialMap.materialIndex];
  },
  
  addGlobalAnims: function () {
    /*
    var i, l;
    var glbirth, glstand, gldeath;
    var stgs = this.stg;
    var stg, name;
    
    for (i = 0, l = stgs.length; i < l; i++) {
      stg = stgs[i];
      name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...
      
      if (name === "glbirth") {
        glbirth = stg;
      } else if (name === "glstand") {
        glstand = stg;
      } else if (name === "gldeath") {
        gldeath = stg;
      }
    }
    
    for (i = 0, l = stgs.length; i < l; i++) {
      stg = stgs[i];
      name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...
      
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
    */
  },
  
  getValue: function (animRef, sequence, frame) {
    if (sequence !== -1) {
      return this.stg[sequence].getValue(animRef, frame)
    } else {
      return animRef.initValue;
    }
  },
  
  render: function (instance, instanceImpl, allowTeamColors) {
    var i, l;
    var sequence = instanceImpl.sequence;
    var frame = instanceImpl.frame;
    var tc;
    var teamId = instance.teamColor;
    var shader = shaders[shaderToUse];
    // Instance-based texture overriding
    var textureMap = instance.textureMap;
    
    // Use a black team color if team colors are disabled
    if (!allowTeamColors) {
      teamId = 13;
    }
    
    tc = teamColors[teamId];
    
    gl.bindShader(shader + this.uvSetCount);
    
    instanceImpl.skeleton.bind();
    
    gl.bindMVP("u_mvp");
    gl.bindView("u_mv");
    
    gl.setParameter("u_teamColor", [tc[0] / 255, tc[1] / 255, tc[2] / 255]);
    gl.setParameter("u_eyePos", cameraPosition);
    gl.setParameter("u_lightPos", lightPosition);
    
    for (i = 0, l = this.batches.length; i < l; i++) {
      var batch = this.batches[i];
      var region = batch.region;
      var material = batch.material;
      
      if (shader === "sstandard") {
        material.bind(sequence, frame, textureMap);
      } else if (shader === "sdiffuse") {
        material.bindDiffuse(sequence, frame, textureMap);
      } else if (shader === "snormalmap" || shader === "sunshaded_normalmap") {
        material.bindNormalMap(sequence, frame, textureMap);
      } else if (shader === "sspecular") {
        material.bindSpecular(sequence, frame, textureMap);
      } else if (shader === "sspecular_normalmap") {
        material.bindSpecular(sequence, frame, textureMap);
        material.bindNormalMap(sequence, frame, textureMap);
      } else if (shader === "semissive") {
        material.bindEmissive(sequence, frame, textureMap);
      } else if (shader === "sdecal") {
        material.bindDecal(sequence, frame, textureMap);
      }
      
      region.render();
      
      material.unbind(); // This is required to not use by mistake layers from this material that were bound and are not overwritten by the next material
    }
    /*
    if (this.particleEmitters) {
      ctx.disable(ctx.CULL_FACE);
      
      for (i = 0, l = this.particleEmitters.length; i < l; i++) {
        gl.bindShader("particles");
        
        gl.bindMVP("u_mvp");
        
        this.particleEmitters[i].render();
      }
      
      ctx.enable(ctx.CULL_FACE);
    }
	*/
    if (shouldRenderShapes && this.fuzzyHitTestObjects && gl.shaderReady("white")) {
      ctx.depthMask(1);
      gl.bindShader("white");
      
      for (i = 0, l = this.fuzzyHitTestObjects.length; i < l; i++) {
        var fuzzyHitTestObject = this.fuzzyHitTestObjects[i];
        
        gl.pushMatrix();
        
        gl.multMat(instanceImpl.skeleton.bones[fuzzyHitTestObject.bone].worldMatrix);
        gl.multMat(fuzzyHitTestObject.matrix);
        gl.bindMVP("u_mvp");
        
        gl.popMatrix();
        
        fuzzyHitTestObject.render();
      }
    }
  },
  
  renderEmitters: function (instance, instanceImpl, allowTeamColors) {
    
  },
  
  renderColor: function (instance, color) {
    var i, l;
    var batch, region;
    
    gl.bindShader("scolor");
    
    instance.skeleton.bind();
    
    gl.bindMVP("u_mvp");
    gl.setParameter("u_color", color);
    
    for (i = 0, l = this.batches.length; i < l; i++) {
      batch = this.batches[i];
      region = batch.region;
      
      region.renderColor();
    }
  },
  
  getAttachment: function (id) {
    if (this.attachments) {
      return this.attachments[id];
    }
  },
  
  getCamera: function (id) {
    if (this.cameras) {
      return this.cameras[id];
    }
  },
  
  overrideTexture: function (path, newpath) {
    this.textureMap[source] = path;
  },
  
  getSequences: function () {
    var data = [];
    
    if (this.sequences) {
      for (var i = 0, l = this.sequences.length; i < l; i++) {
        data[i] = this.sequences[i].name;
      }
    }
    
    return data;
  },
  
  getAttachments: function () {
    var data = [];
    
    if (this.attachments) {
      for (var i = 0, l = this.attachments.length; i < l; i++) {
        data[i] = this.attachments[i].name;
      }
    }
    
    return data;
  },
  
  getCameras: function () {
    var data = [];
    
    if (this.cameras) {
      for (var i = 0, l = this.cameras.length; i < l; i++) {
        data[i] = this.cameras[i].name;
      }
    }
    
    return data;
  },
  
  getTextureMap: function () {
    var data = {};
    var textureMap = this.textureMap;
    var keys = Object.keys(textureMap);
    var key;
      
    for (var i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      
      data[key] = textureMap[key];
    }
    
    return data;
  }
};