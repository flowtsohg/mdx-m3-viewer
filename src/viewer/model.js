function Model(source) {
  var path;
  
  this.isModel = true;
  this.ready = false;
  this.source = source;
  
  // Holds a list of instances that were created before the internal model finished loading
  this.queue = [];
  
  // Parse the source as an absolute path, an MPQ path, or an ID
  if (source.startsWith("http://")) {
    path = source;
  } else if (source.match(/\.(?:mdx|m3|blp|dds)$/)) {
    path = urls.mpqFile(source);
  } else {
    path = urls.customModel(source);
    // Load the custom texturs header to override the needed textures
    getFile(urls.header(source), false, this.setupCustomTextures, onerrorwrapper, onprogresswrapper, this);
  }
  
  getFile(path, true, this.setup, onerrorwrapper, onprogresswrapper, this);
  
  onloadstart(this);
}

Model.prototype = {
  setupCustomTextures: function (e) {
    var object = JSON.parse(e.target.responseText);
    var textures = object.textures;
    var keys = Object.keys(textures);
    
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      var texture = textures[key];
      
      if (texture.included === 1) {
        this.overrideTexture(key, urls.customFile(texture.url));
      }
    }
  },
  
  setup: function (e) {
    var reader = new BinaryReader(e.target.response);
    var tag = peek(reader, 4);
    
    this.format = tag;
    
    if (tag == "MDLX") {
      this.setupMdx(reader);
    } else if (tag == "43DM") {
      this.setupM3(reader);
    } else {
      console.warn("Tried to load a model from " + this.source + ", which is not a valid model file");
    }
    
    for (var i = 0, l = this.queue.length; i < l; i++) {
      var action = this.queue[i];
      
      this[action[0]].apply(this, action[1]);
    }
    
    onload(this, e);
  },
  
  setupMdx: function (reader) {
    var parser = new Mdx.Parser(reader);
	  
    if (parser["ready"]) {
      if (DEBUG_MODE) {
        console.log(parser);
      }
      
      var psmain = floatPrecision + SHADERS["wpsmain"];
      
      // Load the main shader if it is needed
      if ((parser["geosetChunk"] || parser["particleEmitterChunk"]) && !gl.shaderReady("wmain")) {
        gl.newShader("wmain", SHADERS["vsbonetexture"] + SHADERS["wvsskinning"], psmain)
      }
      
      // Load the particle emitters type 2 shader if it is needed
      if (parser["particleEmitter2Chunk"] && !gl.shaderReady("wparticles")) {
        gl.newShader("wparticles", SHADERS["wvsparticles"], floatPrecision + SHADERS["wpsparticles"]);
      }
      
      // Load the ribbon emitters shader if it is needed
      if (parser["ribbonEmitterChunk"] && !gl.shaderReady("wribbons")) {
        gl.newShader("wribbons", SHADERS["wvssoftskinning"], psmain);
      }
  
      // Load the model
      this.model = new Mdx.Model(parser, false, onprogress);
  
      if (DEBUG_MODE) {
        console.log(this.model);
      }
      
      this.ready = true;
      
      if (typeof this.onload === "function") {
        this.onload(this);
      }
    }
  },
  
  setupM3: function (reader) {
    var parser = new M3.Parser(reader);
      
      if (parser) {
        if (DEBUG_MODE) {
          console.log(parser);
        }
        
        // Load the model
        this.model = new M3.Model(parser);
        
        // Shader setup
        var uvSetCount = this.model.uvSetCount;
        var uvSets = "EXPLICITUV" + (uvSetCount - 1);
        var vscommon = SHADERS["vsbonetexture"] + SHADERS["svscommon"] + "\n";
        var vsstandard = vscommon + SHADERS["svsstandard"];
        var pscommon = SHADERS["spscommon"] + "\n";
        var psstandard = floatPrecision + pscommon + SHADERS["spsstandard"];
        var psspecialized = floatPrecision + pscommon + SHADERS["spsspecialized"];
        var NORMALS_PASS = "NORMALS_PASS";
        var HIGHRES_NORMALS = "HIGHRES_NORMALS";
        var SPECULAR_PASS = "SPECULAR_PASS";
        var UNSHADED_PASS = "UNSHADED_PASS";
        
        // Load all the M3 shaders.
        // All of them are based on the uv sets of this specific model.
        if (!gl.shaderReady("sstandard" + uvSetCount)) {
          gl.newShader("sstandard" + uvSetCount, vsstandard, psstandard, [uvSets]);
        }
        
        if (!gl.shaderReady("sdiffuse" + uvSetCount)) {
          gl.newShader("sdiffuse" + uvSetCount, vsstandard, psspecialized, [uvSets, "DIFFUSE_PASS"]);
        }
        
        if (!gl.shaderReady("snormals" + uvSetCount)) {
          gl.newShader("snormals" + uvSetCount, vsstandard, psspecialized, [uvSets, NORMALS_PASS]);
        }
        
        if (!gl.shaderReady("snormalmap" + uvSetCount)) {
          gl.newShader("snormalmap" + uvSetCount, vsstandard, psspecialized, [uvSets, NORMALS_PASS, HIGHRES_NORMALS]);
        }
        
        if (!gl.shaderReady("sspecular" + uvSetCount)) {
          gl.newShader("sspecular" + uvSetCount, vsstandard, psspecialized, [uvSets, SPECULAR_PASS]);
        }
        
        if (!gl.shaderReady("sspecular_normalmap" + uvSetCount)) {
          gl.newShader("sspecular_normalmap" + uvSetCount, vsstandard, psspecialized, [uvSets, SPECULAR_PASS, HIGHRES_NORMALS]);
        }
        
        if (!gl.shaderReady("semissive" + uvSetCount)) {
          gl.newShader("semissive" + uvSetCount, vsstandard, psspecialized, [uvSets, "EMISSIVE_PASS"]);
        }
        
        if (!gl.shaderReady("sunshaded" + uvSetCount)) {
          gl.newShader("sunshaded" + uvSetCount, vsstandard, psspecialized, [uvSets, UNSHADED_PASS]);
        }
        
        if (!gl.shaderReady("sunshaded_normalmap" + uvSetCount)) {
          gl.newShader("sunshaded_normalmap" + uvSetCount, vsstandard, psspecialized, [uvSets, UNSHADED_PASS, HIGHRES_NORMALS]);
        }
        
        if (!gl.shaderReady("sdecal" + uvSetCount)) {
          gl.newShader("sdecal" + uvSetCount, vsstandard, psspecialized, [uvSets, "DECAL_PASS"]);
        }
        
        if (!gl.shaderReady("sparticles" + uvSetCount)) {
          gl.newShader("sparticles" + uvSetCount, SHADERS["svsparticles"], floatPrecision + SHADERS["spsparticles"]);
        } 
        
        if (DEBUG_MODE) {
          console.log(this.model);
        }
        
        this.ready = true;
        
        if (typeof this.onload === "function") {
          this.onload(this);
        }
      }
  },
 
  setupInstance: function (instance) {
    if (this.ready) {
      instance.setup(this.model, this.format);
    } else {
      this.queue.push(["setupInstance", [instance]]);
    }
  },
  
  render: function (parent) {
    if (this.ready) {
      this.model.render(parent);
    }
  },
  
  getAttachment: function (id) {
    if (this.ready) {
      return this.model.getAttachment(id);
    }
  },
  
  getCamera: function (id) {
    if (this.ready) {
      return this.model.getCamera(id);
    }
  },
  
  getTransform: function () {
    if (this.ready) {
      this.model.getTransform();
    }
  },
  
  overrideTexture: function (path, newpath) {
    if (this.ready) {
      this.model.overrideTexture(path, newpath);
    } else {
      this.queue.push(["overrideTexture", [path, newpath]]);
    }
  },
  
  getSequences: function () {
    if (this.ready) {
      return this.model.getSequences();
    }
  },
  
  getAttachments: function () {
    if (this.ready) {
      return this.model.getAttachments();
    }
  },
  
  getCameras: function () {
    if (this.ready) {
      return this.model.getCameras();
    }
  }
};