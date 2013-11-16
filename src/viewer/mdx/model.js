// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Model(parser, customTextures, spawned, onprogress) {
  this.sequences = [];
  this.loopingMode = 0;
  this.spawned = spawned;
  this.frame = 0;
  this.time = 0;
  
  this.setup(parser);
  
  if (onprogress) {
    onprogress({lengthComputable: true, total: 100, loaded: 100});
  }
  
  if (parser.textureChunk) {
    if (onprogress) {
      onprogress({status: "Loading textures"});
    }
    
    this.loadTextures(parser, customTextures, onprogress);
  }
  
  this.ready = true;
}

Model.prototype = {
  setup: function (parser) {
    var emitters, i, l, j, k;
    
    if (parser.materialChunk) {
      this.materials = parser.materialChunk.materials;
    }
    
    if (parser.geosetChunk) {
      var geosets = parser.geosetChunk.geosets;
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
    
    if (parser.sequenceChunk) {
      this.sequences = parser.sequenceChunk.sequences;
    }
    
    if (parser.cameraChunk) {
      this.cameras = parser.cameraChunk.cameras;
    }
    
    if (parser.geosetAnimationChunk) {
      this.geosetAnimations = parser.geosetAnimationChunk.animations;
    }
    
    if (parser.globalSequenceChunk) {
      this.globalSequences = parser.globalSequenceChunk.sequences;
    }
    
    if (parser.textureAnimationChunk) {
      this.textureAnimations = parser.textureAnimationChunk.animations;
    }
    
    if (parser.particleEmitterChunk) {
      emitters = parser.particleEmitterChunk.emitters;
      
      this.particleEmitters = [];
      
      for (i = 0, l = emitters.length; i < l; i++) {
        this.particleEmitters[i] = new ParticleEmitter(emitters[i], this);
      }
    }
    
    if (parser.particleEmitter2Chunk) {
      emitters = parser.particleEmitter2Chunk.emitters;
      
      this.particleEmitters2 = [];
      
      for (i = 0, l = emitters.length; i < l; i++) {
        this.particleEmitters2[i] = new ParticleEmitter2(emitters[i], this);
      }
    }
    
    if (parser.ribbonEmitterChunk) {
      emitters = parser.ribbonEmitterChunk.emitters;
      
      this.ribbonEmitters = [];
      
      for (i = 0, l = emitters.length; i < l; i++) {
        this.ribbonEmitters[i] = new RibbonEmitter(emitters[i], this.materials, this);
      }
    }
    
    if (parser.collisionShapeChunk) {
      var shapes = parser.collisionShapeChunk.shapes;
      
      this.collisionShapes = [];
      
      for (i = 0, l = shapes.length; i < l; i++) {
        this.collisionShapes[i] = new CollisionShape(shapes[i]);
      }
    }
    
    this.skeleton = new Skeleton(parser, this);
    
    this.extent = parser.modelChunk.extent.maximum[0] || 100;
  },
  
  loadTextures: function (parser, customTextures, onprogress) {
    var loaded = 0;
    var failed = 0;
    var textures = parser.textureChunk.textures;
    
    function onload() {
      loaded++;
      
      if (onprogress) {
        onprogress({lengthComputable: true, total: textures.length, loaded: loaded + failed});
      }
    }
    
    function onerror() {
      failed++;
      
      if (onprogress) {
        onprogress({lengthComputable: true, total: textures.length, loaded: loaded + failed});
      }
    }
    
    this.textures = [];
    
    for (var i = 0, l = textures.length; i < l; i++) {
      this.textures.push(new Texture(textures[i].fileName, textures[i].replaceableId, customTextures, onload, onerror));
    }
  },
  
  updateEmitters: function (emitters, allowCreate) {
    if (emitters) {
      for (var i = 0, l = emitters.length; i < l; i++) {
        emitters[i].update(allowCreate);
      }
    }
  },
  
  update: function () {
    var allowCreate = false;
    
    if (this.sequence) {
      this.time += 16 * ANIMATION_SCALE;
      this.frame += 16 * ANIMATION_SCALE;
      allowCreate = true;
      
      if (this.frame >= this.sequence.interval[1]) {
        if (this.loopingMode === 2 || (this.loopingMode === 0 && this.sequence.flags === 0)) {
          this.frame = this.sequence.interval[0];
          allowCreate = false;
        } else {
          this.time -= 16 * ANIMATION_SCALE;
          this.frame = this.sequence.interval[1];
          allowCreate = false;
        }
      }
    }
    
    this.skeleton.update();
    
    this.updateEmitters(this.particleEmitters, allowCreate);
    this.updateEmitters(this.particleEmitters2, allowCreate);
    this.updateEmitters(this.ribbonEmitters, allowCreate);
  },
  
  render: function () {
    var i, l, v;
    
    if (this.layers && standardShader) {
      gl.bindShader("main");
      gl.bindMVP("u_mvp");
      gl.setParameter("u_texture", 0);
      
      for (i = 0, l = this.layers.length; i < l; i++) {
        var layer = this.layers[i];
        
        if (layer.shouldRender() && this.shouldRenderGeoset(layer)) {
          var geoset = this.geosets[layer.geosetId];
          
          var modifier = [1, 1, 1, 1];
          var uvoffset = [0 ,0];
          
          layer.setMaterial();
          
          gl.bindTexture(this.textures[Math.floor(getTrack(layer.tracks.textureId, layer.textureId, this))].fileName, 0);
          
          if (this.geosetAnimations) {
            for (var j = this.geosetAnimations.length; j--;) {
              var geosetAnimation = this.geosetAnimations[j];
              
              if (geosetAnimation.geosetId === layer.geosetId) {
                v = getTrack(geosetAnimation.tracks.color, geosetAnimation.color, this);
                
                if (v[0] !== 1 || v[1] !== 1 || v[2] !== 1) {
                  modifier[0] = v[0];
                  modifier[1] = v[1];
                  modifier[2] = v[2];
                }
              }
            }
          }
          
          modifier[3] = getTrack(layer.tracks.alpha, layer.alpha, this);
          
          gl.setParameter("u_modifier", modifier);
          
          if (layer.textureAnimationId !== 4294967295 && this.textureAnimations) {
            var textureAnimation = this.textureAnimations[layer.textureAnimationId];
            // What is Z used for?
            v = getTrack(textureAnimation.tracks.translation, [0, 0, 0], this);
            
            uvoffset[0] = v[0];
            uvoffset[1] = v[1];
          }
          
          gl.setParameter("u_uv_offset", uvoffset);
          
          if (RENDER_MODE > 0) {
            this.skeleton.bind();
            geoset.renderHW(layer.coordId);
          } else {
            geoset.render(this.skeleton.nodes, layer.coordId);
          }
        }
      }
    }
    
    ctx.depthMask(1);
    
    // Don't allow emitted models to emit more models.
    // I don't know if this is legal in WC3, but either way it could cause infinite emitters
    if (!this.spawned && this.particleEmitters && standardShader) {
      for (i = 0, l = this.particleEmitters.length; i < l; i++) {
        this.particleEmitters[i].render();
      }
    }
    
    if (this.ribbonEmitters && ribbonShader) {
      ctx.disable(ctx.CULL_FACE);
      
      gl.bindShader("ribbons");
      gl.bindMVP("u_mvp");
      gl.setParameter("u_texture", 0);
      
      for (i = 0, l = this.ribbonEmitters.length; i < l; i++) {
        this.ribbonEmitters[i].render(this);
      }
    }
    
    if (this.particleEmitters2 && particleShader) {
      ctx.depthMask(0);
      ctx.enable(ctx.BLEND);
      ctx.disable(ctx.CULL_FACE);
      
      gl.bindShader("particles");
      gl.bindMVP("u_mvp");
      gl.setParameter("u_texture", 0);
      
      for (i = 0, l = this.particleEmitters2.length; i < l; i++) {
        this.particleEmitters2[i].render(this);
      }
      
      ctx.depthMask(1);
      ctx.disable(ctx.BLEND);
      ctx.enable(ctx.CULL_FACE);
    }
    
    if (shouldRenderShapes && this.collisionShapes && whiteShader) {
      ctx.depthMask(1);
      gl.bindShader("white");
      gl.bindMVP("u_mvp");
      
      for (i = 0, l = this.collisionShapes.length; i < l; i++) {
        this.collisionShapes[i].render();
      }
    }
    
    ctx.disable(ctx.BLEND);
    ctx.enable(ctx.CULL_FACE);
  },
  
  shouldRenderGeoset: function (layer) {
    var i, l;
    
    if (this.geosetAnimations) {
      for (i = 0, l = this.geosetAnimations.length; i < l; i++) {
        var geosetAnimation = this.geosetAnimations[i];
        
        if (geosetAnimation.geosetId === layer.geosetId && geosetAnimation.tracks.alpha) {
          return (getTrack(geosetAnimation.tracks.alpha, 1, this) > 0.1);
        }
      }
    }
    
    return true;
  },
  
  setTeamColor: function (id) {
    id = ((id < 10) ? "0" + id : "" + id);
    
    for (var i = 0, l = this.textures.length; i < l; i++) {
      var texture = this.textures[i];
      var replaceableId = texture.replaceableId;
      
      if (replaceableId === 1 || replaceableId === 2) {
        texture.fileName = texture.fileName.replace(/\d\d/, id);
      }
    }
  },
  
  setAnimation: function (sequenceId) {
    if (this.sequence && this.sequence === this.sequences[sequenceId]) {
      this.frame = this.sequence.interval[0];
    } else {
      sequenceId = math.clamp(sequenceId, -1, this.sequences.length - 1);
      
      if (sequenceId === -1) {
        this.sequence = null;
        this.time = 0;
        this.frame = 0;
      } else {
        this.sequence = this.sequences[sequenceId];
        this.frame = this.sequence.interval[0];
      }
    }
  },
  
  setAnimationLooping: function (looping) {
    this.loopingMode = math.clamp(looping, 0, 2);
  }
};