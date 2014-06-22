function Model(parser, textureMap) {
  var objects, i, l, j, k;
  
  this.name = parser.modelChunk.name;
  this.sequences = [];
  this.textures = [];
  this.textureMap = {};
  
  if (parser.textureChunk) {
    objects = parser.textureChunk.objects;
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.loadTexture(objects[i], textureMap);
    }
  }
  
  if (parser.sequenceChunk) {
    this.sequences = parser.sequenceChunk.objects;
  }
  
  if (parser.globalSequenceChunk) {
    this.globalSequences = parser.globalSequenceChunk.objects;
  }
  
  var nodes = parser.nodes;
  var pivots = parser.pivotPointChunk.objects;
  
  this.nodes = [];
  
  for (i = 0, l = nodes.length; i < l; i++) {
    this.nodes[i] = new Node(nodes[i], this, pivots);
  }
  
  // This list is used to access all the nodes in a loop while keeping the hierarchy in mind.
  this.hierarchy = [0];
  this.setupHierarchy(0);
  
  if (parser.boneChunk) {
    this.bones = parser.boneChunk.objects;
  }
  
  if (parser.materialChunk) {
    this.materials = parser.materialChunk.objects;
  }
  
  if (parser.geosetChunk) {
    var geosets = parser.geosetChunk.objects;
    var groups = [[], [], [], []];
    
    this.geosets = [];
    
    for (i = 0, l = geosets.length; i < l; i++) {
      var g = geosets[i];
      var layers = this.materials[g.materialId].layers;
      
      this.geosets.push(new Geoset(g));
      
      for (j = 0, k = layers.length; j < k; j++) {
        var layer = new Layer(layers[j], i, this);
        
        groups[layer.renderOrder].push(layer);
      }
    }
    
    this.layers = groups[0].concat(groups[1]).concat(groups[2]).concat(groups[3]);
  }
  
  if (parser.cameraChunk) {
    this.cameras = parser.cameraChunk.objects;
  }

  if (parser.geosetAnimationChunk) {
    objects = parser.geosetAnimationChunk.objects;

    this.geosetAnimations = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.geosetAnimations[i] = new GeosetAnimation(objects[i], this);
    }
  }
  
  if (parser.textureAnimationChunk) {
    objects = parser.textureAnimationChunk.objects;

    this.textureAnimations = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.textureAnimations[i] = new TextureAnimation(objects[i], this);
    }
  }

  if (parser.particleEmitterChunk) {
    this.particleEmitters = parser.particleEmitterChunk.objects;
  }

  if (parser.particleEmitter2Chunk) {
    this.particleEmitters2 = parser.particleEmitter2Chunk.objects;
  }

  if (parser.ribbonEmitterChunk) {
    this.ribbonEmitters = parser.ribbonEmitterChunk.objects;
  }

  if (parser.collisionShapeChunk) {
    objects = parser.collisionShapeChunk.objects;
    
    this.collisionShapes = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.collisionShapes[i] = new CollisionShape(objects[i]);
    }
  }

  if (parser.attachmentChunk) {
    objects = parser.attachmentChunk.objects;
    
    this.attachments = [];
    
    for (i = 0, l = objects.length; i < l; i++) {
      this.attachments[i] = new Attachment(objects[i], this);
    }
  }
  
  // Avoid heap allocations in render()
  this.modifier = vec4.create();
  this.uvoffset = vec3.create();
  this.defaultUvoffset = vec3.create();
  
  this.ready = true;
}

Model.prototype = {
  loadTexture: function (texture, textureMap) {
    var source = texture.path;
    var path;
    var replaceableId = texture.replaceableId;
    
    if (replaceableId !== 0) {
      source = "ReplaceableTextures/" + replaceableIdToName[replaceableId] + ".blp";
    }
    
    source = source.replace(/\\/g, "/").toLowerCase();
    
    this.textures.push(source);
    
    if (textureMap[source]) {
      path = textureMap[source];
    } else {
      path = urls.mpqFile(source);
    }
    
    this.textureMap[source] = path;
    
    gl.loadTexture(path);
  },
  
  setupHierarchy: function (parent) {
    var cildren = [];
      
    for (var i = 0, l = this.nodes.length; i < l; i++) {
      var node = this.nodes[i];
      
      if (node.parentId === parent) {
        this.hierarchy.push(i);
        
        this.setupHierarchy(node.objectId);
      }
    }
  },
  
  render: function (instance, textureMap) {
    var i, l, v;
	  var sequence = instance.sequence;
    var frame = instance.frame;
    var counter = instance.counter;
    var shader;
    var layers = this.layers;
    
    if (layers && gl.shaderStatus("wmain")) {
      var modifier = this.modifier;
      var uvoffset = this.uvoffset;
      var layer;
      var geoset;
      var textureId;
      var geosets = this.geosets;
      var textures = this.textures;
      var temp;
      var defaultUvoffset = this.defaultUvoffset;
      
      shader = gl.bindShader("wmain");
      
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
      ctx.uniform1i(shader.variables.u_texture, 0);
      
      instance.skeleton.bind(shader);
      
      for (i = 0, l = layers.length; i < l; i++) {
        layer = layers[i];
        
        if (layer.shouldRender(sequence, frame, counter) && this.shouldRenderGeoset(sequence, frame, counter, layer)) {
          geoset = geosets[layer.geosetId];
          
          modifier[0] = 1;
          modifier[1] = 1;
          modifier[2] = 1;
          modifier[3] = 1;
          
          uvoffset[0] = 0;
          uvoffset[1] = 0;
          uvoffset[2] = 0;
          
          layer.setMaterial(shader);
          
          textureId = getSDValue(sequence, frame, counter, layer.sd.textureId, layer.textureId);
          
          bindTexture(textures[textureId], 0, this.textureMap, textureMap);
          
          if (this.geosetAnimations) {
            for (var j = this.geosetAnimations.length; j--;) {
              var geosetAnimation = this.geosetAnimations[j];
              
              if (geosetAnimation.geosetId === layer.geosetId) {
                getSDValue(sequence, frame, counter, geosetAnimation.sd.color, geosetAnimation.color, modifier);
                
                temp = modifier[0];
                
                modifier[0] = modifier[2];
                modifier[2] = temp;
              }
            }
          }
          
          modifier[3] = getSDValue(sequence, frame, counter, layer.sd.alpha, layer.alpha);
          
          ctx.uniform4fv(shader.variables.u_modifier, modifier);
          
          if (layer.textureAnimationId !== -1 && this.textureAnimations) {
            var textureAnimation = this.textureAnimations[layer.textureAnimationId];
            // What is Z used for?
            uvoffset = getSDValue(sequence, frame, counter, textureAnimation.sd.translation, defaultUvoffset, uvoffset);
          }
          
          ctx.uniform3fv(shader.variables.u_uv_offset, uvoffset);
          
          geoset.render(layer.coordId, shader);
        }
      }
    }
    
    if (instance.particleEmitters && gl.shaderStatus("wmain")) {
      for (i = 0, l = instance.particleEmitters.length; i < l; i++) {
        instance.particleEmitters[i].render();
      }
    }
    
    if (shouldRenderShapes && this.collisionShapes && gl.shaderStatus("white")) {
      ctx.depthMask(1);
      
      shader = gl.bindShader("white");
      
      for (i = 0, l = this.collisionShapes.length; i < l; i++) {
        this.collisionShapes[i].render(instance.skeleton, shader);
      }
    }
    
    ctx.disable(ctx.BLEND);
    ctx.enable(ctx.CULL_FACE);
  },
  
  renderEmitters: function (instance, textureMap) {
    var i, l;
	  var sequence = instance.sequence;
    var frame = instance.frame;
    var counter = instance.counter;
    var shader;
    
    if (instance.ribbonEmitters && gl.shaderStatus("wribbons")) {
      ctx.depthMask(1);
      ctx.disable(ctx.CULL_FACE);
      
      shader = gl.bindShader("wribbons");
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
      ctx.uniform1i(shader.variables.u_texture, 0);
      
      for (i = 0, l = instance.ribbonEmitters.length; i < l; i++) {
        instance.ribbonEmitters[i].render(sequence, frame, counter, textureMap, shader);
      }
    }
    
    if (instance.particleEmitters2 && gl.shaderStatus("wparticles")) {
      ctx.depthMask(0);
      ctx.enable(ctx.BLEND);
      ctx.disable(ctx.CULL_FACE);
      
      shader = gl.bindShader("wparticles");
      
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
      ctx.uniform1i(shader.variables.u_texture, 0);
      
      for (i = 0, l = instance.particleEmitters2.length; i < l; i++) {
        instance.particleEmitters2[i].render(textureMap, shader);
      }
      
      ctx.depthMask(1);
    }
    
    ctx.disable(ctx.BLEND);
    ctx.enable(ctx.CULL_FACE);
  },
  
  renderColor: function (instance, color) {
    var i, l;
    var sequence = instance.sequence;
    var frame = instance.frame;
    var counter = instance.counter;
    var layer, geoset, texture;
    var shader;
    var layers = this.layers;
    
    if (layers && gl.shaderStatus("wcolor")) {
      shader = gl.bindShader("wcolor");
      
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
      ctx.uniform3fv(shader.variables.u_color, color);
      
      instance.skeleton.bind(shader);
      
      for (i = 0, l = layers.length; i < l; i++) {
        layer = layers[i];
        
        if (layer.shouldRender(sequence, frame, counter) && this.shouldRenderGeoset(sequence, frame, counter, layer)) {
          geoset = this.geosets[layer.geosetId];
          texture = this.textureMap[this.textures[layer.textureId]];
          
          // Avoid rendering team glows
          if (!texture.endsWith("teamglow00.blp")) {
            geoset.renderColor(shader);
          }
        }
      }
    }
  },
  
  shouldRenderGeoset: function (sequence, frame, counter, layer) {
    var i, l, geosetAnimation, geosetAnimations = this.geosetAnimations;
    
    if (geosetAnimations) {
      for (i = 0, l = geosetAnimations.length; i < l; i++) {
        geosetAnimation = geosetAnimations[i];
        
        if (geosetAnimation.geosetId === layer.geosetId && geosetAnimation.sd.alpha) {
          // This handles issues when there are multiple geoset animations for one geoset.
          // This is a bug, but the game supports it.
          if (getSDValue(sequence, frame, counter, geosetAnimation.sd.alpha) < VISIBILITY_CUTOFF) {
            return false;
          }
        }
      }
    }
    
    return true;
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
  
  overrideTexture: function (source, path) {
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