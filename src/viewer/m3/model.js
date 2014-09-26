function Model(binaryReader, textureMap) {
  BaseModel.call(this, textureMap);
  
  var parser = Parser(binaryReader);
  
  if (DEBUG_MODE) {
    console.log(parser);
  }
        
  if (parser) {
    this.setup(parser);
    this.setupShaders(parser);
  }
  
  if (DEBUG_MODE) {
    console.log(this);
  }
}

var prototype = Object.create(BaseModel.prototype);
Model.prototype = prototype;

prototype.setup = function (parser) {
  var i, l;
  var material;
  var div = parser.divisions[0];
  
  this.name = getFileName(parser.name);
  
  this.setupGeometry(parser, div);
  
  this.batches = [];
  this.materials = [[], []]; // 2D array for the possibility of adding more material types in the future
  this.materialMaps = parser.materialMaps;

  var materialMaps = parser.materialMaps;
  var materials = parser.materials;
  var batches = [];
  
  // Create concrete material objects for standard materials
  for (i = 0, l = materials[0].length; i < l; i++) {
    material = materials[0][i];
    
    this.materials[1][i] = new StandardMaterial(material, this, this.textureMap);
  }
  
  // Create concrete batch objects
  for (i = 0, l = div.batches.length; i < l; i++) {
    var batch = div.batches[i];
    var regionId = batch.regionIndex;
    var materialMap = materialMaps[batch.materialReferenceIndex];
    
    if (materialMap.materialType === 1) {
      batches.push({regionId: regionId, region: this.meshes[regionId], material: this.materials[1][materialMap.materialIndex]});
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
    for (i = 0, l = parser.fuzzyHitTestObjects.length; i < l; i++) {
      this.boundingShapes[i] = new BoundingShape(parser.fuzzyHitTestObjects[i], parser.bones);
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
};

prototype.setupShaders = function (parser) {
  // Shader setup
  var uvSetCount = this.uvSetCount;
  var uvSets = "EXPLICITUV" + (uvSetCount - 1);
  var vscommon = SHADERS.vsbonetexture + SHADERS.svscommon + "\n";
  var vsstandard = vscommon + SHADERS.svsstandard;
  var pscommon = SHADERS.spscommon + "\n";
  var psstandard = pscommon + SHADERS.spsstandard;
  var psspecialized = pscommon + SHADERS.spsspecialized;
  var NORMALS_PASS = "NORMALS_PASS";
  var HIGHRES_NORMALS = "HIGHRES_NORMALS";
  var SPECULAR_PASS = "SPECULAR_PASS";
  var UNSHADED_PASS = "UNSHADED_PASS";
  
  // Load all the M3 shaders.
  // All of them are based on the uv sets of this specific model.
  if (!gl.shaderStatus("sstandard" + uvSetCount)) {
    gl.createShader("sstandard" + uvSetCount, vsstandard, psstandard, [uvSets]);
  }
  
  if (!gl.shaderStatus("sdiffuse" + uvSetCount)) {
    gl.createShader("sdiffuse" + uvSetCount, vsstandard, psspecialized, [uvSets, "DIFFUSE_PASS"]);
  }
  
  if (!gl.shaderStatus("snormals" + uvSetCount)) {
    gl.createShader("snormals" + uvSetCount, vsstandard, psspecialized, [uvSets, NORMALS_PASS]);
  }
  
  if (!gl.shaderStatus("suvs" + uvSetCount)) {
    gl.createShader("suvs" + uvSetCount, vsstandard, psspecialized, [uvSets, "UV_PASS"]);
  }
  
  if (!gl.shaderStatus("snormalmap" + uvSetCount)) {
    gl.createShader("snormalmap" + uvSetCount, vsstandard, psspecialized, [uvSets, NORMALS_PASS, HIGHRES_NORMALS]);
  }
  
  if (!gl.shaderStatus("sspecular" + uvSetCount)) {
    gl.createShader("sspecular" + uvSetCount, vsstandard, psspecialized, [uvSets, SPECULAR_PASS]);
  }
  
  if (!gl.shaderStatus("sspecular_normalmap" + uvSetCount)) {
    gl.createShader("sspecular_normalmap" + uvSetCount, vsstandard, psspecialized, [uvSets, SPECULAR_PASS, HIGHRES_NORMALS]);
  }
  
  if (!gl.shaderStatus("semissive" + uvSetCount)) {
    gl.createShader("semissive" + uvSetCount, vsstandard, psspecialized, [uvSets, "EMISSIVE_PASS"]);
  }
  
  if (!gl.shaderStatus("sunshaded" + uvSetCount)) {
    gl.createShader("sunshaded" + uvSetCount, vsstandard, psspecialized, [uvSets, UNSHADED_PASS]);
  }
  
  if (!gl.shaderStatus("sunshaded_normalmap" + uvSetCount)) {
    gl.createShader("sunshaded_normalmap" + uvSetCount, vsstandard, psspecialized, [uvSets, UNSHADED_PASS, HIGHRES_NORMALS]);
  }
  
  if (!gl.shaderStatus("sdecal" + uvSetCount)) {
    gl.createShader("sdecal" + uvSetCount, vsstandard, psspecialized, [uvSets, "DECAL_PASS"]);
  }
  
  if (!gl.shaderStatus("swhite" + uvSetCount)) {
    gl.createShader("swhite" + uvSetCount, vsstandard, psspecialized, [uvSets, "WHITE_PASS"]);
  }
  
  if (!gl.shaderStatus("sparticles" + uvSetCount)) {
    gl.createShader("sparticles" + uvSetCount, SHADERS.svsparticles, SHADERS.spsparticles);
  } 
  
  if (!gl.shaderStatus("scolor")) {
    gl.createShader("scolor", SHADERS.vsbonetexture + SHADERS.svscolor, SHADERS.pscolor);
  }
};

prototype.setupGeometry = function (parser, div) {
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
  
  this.meshes = [];
  
  for (i = 0, l = regions.length; i < l; i++) {
    this.meshes.push(new Region(regions[i], div.triangles, elementArray, edgeArray, offsets[i]));
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
};

prototype.mapMaterial =function (index) {
  var materialMap = this.materialMaps[index];
  
  return this.materials[materialMap.materialType][materialMap.materialIndex];
};

prototype.addGlobalAnims = function () {
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
};

prototype.getValue = function (animRef, sequence, frame) {
  if (sequence !== -1) {
    return this.stg[sequence].getValue(animRef, frame)
  } else {
    return animRef.initValue;
  }
};

prototype.bind = function (shader, context) {
  var vertexSize = this.vertexSize;
  var uvSetCount = this.uvSetCount;
  var buffer = context.polygonMode ? this.elementBuffer : this.edgeBuffer;
  
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
};

prototype.bindColor = function (shader) {
  var vertexSize = this.vertexSize;
  
  ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
  
  ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, vertexSize, 0);
  ctx.vertexAttribPointer(shader.variables.a_weights, 4, ctx.UNSIGNED_BYTE, false, vertexSize, 12);
  ctx.vertexAttribPointer(shader.variables.a_bones, 4, ctx.UNSIGNED_BYTE, false, vertexSize, 16);
  
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
};

prototype.render = function (instance, context) {
  var i, l;
  var sequence = instance.sequence;
  var frame = instance.frame;
  var tc;
  var teamId = instance.teamColor;
  var shaderName = shaders[context.shader];
  var realShaderName = "s" + shaderName + this.uvSetCount;
  // Instance-based texture overriding
  var textureMap = instance.textureMap;
  
  if (gl.shaderStatus(realShaderName)) {
    // Use a black team color if team colors are disabled
    if (!context.teamColorsMode) {
      teamId = 13;
    }
    
    var shader = gl.bindShader(realShaderName);
    
    instance.skeleton.bind(shader);
    
    ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
    ctx.uniformMatrix4fv(shader.variables.u_mv, false, gl.getViewMatrix());
    
    ctx.uniform3fv(shader.variables.u_teamColor, teamColors[teamId]);
    ctx.uniform3fv(shader.variables.u_eyePos, cameraPosition);
    ctx.uniform3fv(shader.variables.u_lightPos, lightPosition);
    
    // Bind the vertices
    this.bind(shader, context);
    
    for (i = 0, l = this.batches.length; i < l; i++) {
      var batch = this.batches[i];
     
      if (instance.meshVisibilities[batch.regionId]) {
        var region = batch.region;
        var material = batch.material;
        
        if (shaderName === "standard" || shaderName === "uvs") {
          material.bind(sequence, frame, textureMap, shader);
        } else if (shaderName === "diffuse") {
          material.bindDiffuse(sequence, frame, textureMap, shader);
        } else if (shaderName === "normalmap" || shaderName === "unshaded_normalmap") {
          material.bindNormalMap(sequence, frame, textureMap, shader);
        } else if (shaderName === "specular") {
          material.bindSpecular(sequence, frame, textureMap, shader);
        } else if (shaderName === "specular_normalmap") {
          material.bindSpecular(sequence, frame, textureMap, shader);
          material.bindNormalMap(sequence, frame, textureMap, shader);
        } else if (shaderName === "emissive") {
          material.bindEmissive(sequence, frame, textureMap, shader);
        } else if (shaderName === "decal") {
          material.bindDecal(sequence, frame, textureMap, shader);
        }
        
        region.render(shader, context.polygonMode);
        
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
};

prototype.renderEmitters = function (instance, context) {
  
};

prototype.renderBoundingShapes = function (instance, context) {
  var shader,
        fuzzyHitTestObject;
  
   if (this.boundingShapes && gl.shaderStatus("white")) {
    ctx.depthMask(1);
    
    shader = gl.bindShader("white");
    
    for (i = 0, l = this.boundingShapes.length; i < l; i++) {
      this.boundingShapes[i].render(shader, instance.skeleton.bones);
    }
  }
};

prototype.renderColor = function (instance, color) {
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
        
        region.renderColor(shader);
      }
    }
  }
};