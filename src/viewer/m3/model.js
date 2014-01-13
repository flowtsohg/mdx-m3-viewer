// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Model(parser, onprogress) {
  this.setup(parser);
  
  if (onprogress) {
    onprogress({lengthComputable: true, total: 100, loaded: 100});
  }
    
  this.ready = true;
}

Model.prototype = {
  mapMaterial: function (index) {
	var materialMap = this.materialMaps[index];
	
	return this.materials[materialMap.materialType][materialMap.materialIndex];
  },
  
  setup: function (parser) {
    var i, l;
    var div = parser.divisions[0];
    var uvSetCount = parser.uvSetCount;
    var regions = div.regions;
    
    this.uvSetCount = uvSetCount;
    this.regions = [];
    
    for (i = 0, l = regions.length; i < l; i++) {
      this.regions.push(new Region(regions[i], parser.vertices, div.triangles, parser.boneLookup, uvSetCount));
    }
    
    this.batches = [];
    this.materials = [[], []]; // 2D array for the possibility of adding more material types in the future
    this.texturePaths = {}; // Used in StandardMaterial to avoid loading textures multiple times
    this.materialMaps = parser.materialMaps;
	
    var materialMaps = parser.materialMaps;
    var materials = parser.materials;
    var batches = [];
    
	// Create concrete material objects for standard materials
	for (i = 0, l = materials[0].length; i < l; i++) {
		var material = materials[0][i];
		
		this.materials[1][i] = new StandardMaterial(material, this);
	}
	
	// Create concrete batch objects
    for (i = 0, l = div.batches.length; i < l; i++) {
      var batch = div.batches[i];
      var regionId = batch.regionIndex;
      var materialMap = materialMaps[batch.materialReferenceIndex];
      
      if (materialMap.materialType === 1) {
        var region = this.regions[regionId];
        var material = this.materials[1][materialMap.materialIndex];
        
        batches.push({region: region, material: material});
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
	
    this.skeleton = new Skeleton(parser);
    
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
    this.frame = 0;
    this.loopingMode = 0;
    
    this.teamId = 0;
    
    this.sequences = parser.sequences;
    this.sequenceId = -1;
    
    this.extent = parser.tightHitTest.size[0] || 2;
  },
  
  update: function () {
	var i, l;
    var sequenceId = this.sequenceId;
    var allowCreate = false;
	
    if (sequenceId !== -1) {
      var sequence = this.sequences[sequenceId];
      
      this.frame += FRAME_TIME * ANIMATION_SCALE * 1000; // M3 models work in milliseconds 
      
      if (this.frame > sequence.animationEnd) {
        if ((this.loopingMode === 0 && !(sequence.flags & 0x1)) || this.loopingMode === 2) {
          this.frame = 0;
        }
      }
      
      this.skeleton.update(sequenceId, this.frame);
	  
      allowCreate = true;
    }
    /*
    if (this.particleEmitters) {
      for (i = 0, l = this.particleEmitters.length; i < l; i++) {
        this.particleEmitters[i].update(allowCreate, sequenceId, this.frame);
      }
	  }
    */
  },
  
  getValue: function (animRef) {
    return this.skeleton.getValue(animRef, this.sequenceId, this.frame);
  },
  
  render: function () {
    var i, l;
    var tc = teamColors[this.teamId];
    
    gl.bindShader(shaderToUse);
    
    gl.bindMVP("u_mvp");
    gl.bindView("u_mv");
    gl.setParameter("u_teamColor", [tc[0] / 255, tc[1] / 255, tc[2] / 255]);
    gl.setParameter("u_eyePos", cameraPosition);
    gl.setParameter("u_lightPos", lightPosition);
    
    this.skeleton.bind();
    
    for (i = 0, l = this.batches.length; i < l; i++) {
      var batch = this.batches[i];
      var region = batch.region;
      var material = batch.material;
      
      if (shaderToUse === "standard") {
        material.bind();
      } else if (shaderToUse === "diffuse") {
        material.bindDiffuse();
      } else if (shaderToUse === "normalmap" || shaderToUse === "unshaded_normalmap") {
        material.bindNormalMap();
      } else if (shaderToUse === "specular") {
        material.bindSpecular();
      } else if (shaderToUse === "specular_normalmap") {
        material.bindSpecular();
        material.bindNormalMap();
      } else if (shaderToUse === "emissive") {
        material.bindEmissive();
      } else if (shaderToUse === "decal") {
        material.bindDecal();
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
    if (shouldRenderShapes && this.fuzzyHitTestObjects && whiteShader) {
      ctx.depthMask(1);
      gl.bindShader("white");
      
      for (i = 0, l = this.fuzzyHitTestObjects.length; i < l; i++) {
        var fuzzyHitTestObject = this.fuzzyHitTestObjects[i];
        
        gl.pushMatrix();
        
        gl.multMat(this.skeleton.bones[fuzzyHitTestObject.bone].worldMatrix);
        gl.multMat(fuzzyHitTestObject.matrix);
        gl.bindMVP("u_mvp");
        
        gl.popMatrix();
        
        fuzzyHitTestObject.render();
      }
    }
  },
  
  setTeamColor: function (id) {
    this.teamId = math.clamp(id, 0, 16);
  },
  
  setAnimation: function (sequenceId) {
    sequenceId = math.clamp(sequenceId, -1, this.sequences.length - 1);
    
    this.frame = 0;
    this.sequenceId = sequenceId;
    
    if (sequenceId === -1) {
      this.skeleton.update(-1); // This removes the need to keep updating the skeleton when it wont move anyway
    }
  },
  
  setAnimationLooping: function (looping) {
    this.loopingMode = math.clamp(looping, 0, 2);
  }
};