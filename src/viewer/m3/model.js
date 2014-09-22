function Model(parser, textureMap) {
  var i, l;
  var material;
  var div = parser.divisions[0];
  
  this.setupGeometry(parser, div);
  
  //
  // TODO: Refactor this.regions into this.meshes
  //
  this.meshes = this.geosets;
  
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
      batches.push({regionId: regionId, region: this.regions[regionId], material: this.materials[1][materialMap.materialIndex]});
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
  this.boneLookup = parser.boneLookup;
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
  setupGeometry: function (parser, div) {
    var i, l;
    var uvSetCount = parser.uvSetCount;
    var regions = div.regions;
    var totalElements = 0;
    var offsets = [];
    
    for (i = 0, l = regions.length; i < l; i++) {
      offsets[i] = totalElements;
      totalElements += regions[i].triangleIndicesCount;
    }
    
    var elementArray = new Uint16Array(totalElements);
    var edgeArray = new Uint16Array(totalElements * 2);
    
    this.regions = [];
    
    for (i = 0, l = regions.length; i < l; i++) {
      this.regions.push(new Region(regions[i], div.triangles, elementArray, edgeArray, offsets[i]));
    }
    
    this.elementBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, elementArray, ctx.STATIC_DRAW);
    
    this.edgeBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.edgeBuffer);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, edgeArray, ctx.STATIC_DRAW);
    
    var arrayBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, arrayBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, parser.vertices, ctx.STATIC_DRAW);
    
    this.arrayBuffer = arrayBuffer;
    this.vertexSize = (7 + uvSetCount) * 4;
    this.uvSetCount = uvSetCount;
  },
  
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
  
  bind: function (shader, wireframe) {
    var vertexSize = this.vertexSize;
    var uvSetCount = this.uvSetCount;
    var buffer = wireframe ? this.edgeBuffer : this.elementBuffer;
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
    
    ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, vertexSize, 0);
    ctx.vertexAttribPointer(shader.variables.a_weights, 4, ctx.UNSIGNED_BYTE, false, vertexSize, 12);
    ctx.vertexAttribPointer(shader.variables.a_bones, 4, ctx.UNSIGNED_BYTE, false, vertexSize, 16);
    ctx.vertexAttribPointer(shader.variables.a_normal, 4, ctx.UNSIGNED_BYTE, false, vertexSize, 20);
    
    for (var i = 0; i < uvSetCount; i++) {
      ctx.vertexAttribPointer(shader.variables["a_uv" + i], 2, ctx.SHORT, false, vertexSize, 24 + i * 4);
    }
    
    ctx.vertexAttribPointer(shader.variables.a_tangent, 4, ctx.UNSIGNED_BYTE, false, vertexSize, 24 + uvSetCount * 4);
    
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, buffer);
  },
  
  bindColor: function (shader) {
    var vertexSize = this.vertexSize;
    
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
    
    ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, vertexSize, 0);
    ctx.vertexAttribPointer(shader.variables.a_weights, 4, ctx.UNSIGNED_BYTE, false, vertexSize, 12);
    ctx.vertexAttribPointer(shader.variables.a_bones, 4, ctx.UNSIGNED_BYTE, false, vertexSize, 16);
    
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
  },
  
  render: function (instance, instanceImpl, allowTeamColors, wireframe) {
    var i, l;
    var sequence = instanceImpl.sequence;
    var frame = instanceImpl.frame;
    var tc;
    var teamId = instance.teamColor;
    var shaderName = shaders[shaderToUse];
    var realShaderName = shaderName + this.uvSetCount;
    // Instance-based texture overriding
    var textureMap = instance.textureMap;
    
    if (gl.shaderStatus(realShaderName)) {
      // Use a black team color if team colors are disabled
      if (!allowTeamColors) {
        teamId = 13;
      }
      
      var shader = gl.bindShader(realShaderName);
      
      instanceImpl.skeleton.bind(shader);
      
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
      ctx.uniformMatrix4fv(shader.variables.u_mv, false, gl.getViewMatrix());
      
      ctx.uniform3fv(shader.variables.u_teamColor, teamColors[teamId]);
      ctx.uniform3fv(shader.variables.u_eyePos, cameraPosition);
      ctx.uniform3fv(shader.variables.u_lightPos, lightPosition);
      
      // Bind the vertices
      this.bind(shader, wireframe);
      
      for (i = 0, l = this.batches.length; i < l; i++) {
        var batch = this.batches[i];
       
        if (instanceImpl.meshVisibilities[batch.regionId]) {
          var region = batch.region;
          var material = batch.material;
          
          if (shaderName === "sstandard" || shaderName === "suvs") {
            material.bind(sequence, frame, textureMap, shader);
          } else if (shaderName === "sdiffuse") {
            material.bindDiffuse(sequence, frame, textureMap, shader);
          } else if (shaderName === "snormalmap" || shaderName === "sunshaded_normalmap") {
            material.bindNormalMap(sequence, frame, textureMap, shader);
          } else if (shaderName === "sspecular") {
            material.bindSpecular(sequence, frame, textureMap, shader);
          } else if (shaderName === "sspecular_normalmap") {
            material.bindSpecular(sequence, frame, textureMap, shader);
            material.bindNormalMap(sequence, frame, textureMap, shader);
          } else if (shaderName === "semissive") {
            material.bindEmissive(sequence, frame, textureMap, shader);
          } else if (shaderName === "sdecal") {
            material.bindDecal(sequence, frame, textureMap, shader);
          }
          
          region.render(shader, wireframe);
          
          material.unbind(shader); // This is required to not use by mistake layers from this material that were bound and are not overwritten by the next material
        }
      }
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
    if (shouldRenderShapes && this.fuzzyHitTestObjects && gl.shaderStatus("white")) {
      ctx.depthMask(1);
      
      shader = gl.bindShader("white");
      
      var fuzzyHitTestObject;
      
      for (i = 0, l = this.fuzzyHitTestObjects.length; i < l; i++) {
        fuzzyHitTestObject = this.fuzzyHitTestObjects[i];
        
        gl.pushMatrix();
        
        gl.multMat(instanceImpl.skeleton.bones[fuzzyHitTestObject.bone].worldMatrix);
        gl.multMat(fuzzyHitTestObject.matrix);
        
        ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
        
        gl.popMatrix();
        
        fuzzyHitTestObject.render(shader);
      }
    }
  },
  
  renderEmitters: function (instance, instanceImpl, allowTeamColors) {
    
  },
  
  renderColor: function (instance, color) {
    var i, l;
    var batch, region;
    
    if (gl.shaderStatus("scolor")) {
      var shader = gl.bindShader("scolor");
      
      instance.skeleton.bind(shader);
      
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
      ctx.uniform3fv(shader.variables.u_color, color);
      
      // Bind the vertices
      this.bindColor(shader);
      
      for (i = 0, l = this.batches.length; i < l; i++) {
        batch = this.batches[i];
        
        if (instance.meshVisibilities[batch.regionId]) {
          region = batch.region;
          
          region.render(shader);
        }
      }
    }
  }
};