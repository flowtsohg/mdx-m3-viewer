function Model(source, id, textureMap) {
  this.isModel = true;
  this.id = id;
  
  this.ready = false;
  this.source = source;
  
  // This texture map is used to override textures when a model is loaded from an ID
  this.textureMap = textureMap || {};
    
  // Holds a list of instances that were created before the internal model finished loading
  this.queue = [];
  
  getFile(source, true, this.setup.bind(this), onerrorwrapper.bind(this), onprogresswrapper.bind(this));
  
  onloadstart(this);
}

Model.prototype = {
  setup: function (e) {
    var status = e.target.status;
    
    if (status === 200) {
      var reader = new BinaryReader(e.target.response);
      var tag = peek(reader, 4);
      
      this.format = tag;
      
      if (tag == "MDLX") {
        this.setupMdx(reader);
      } else if (tag == "43DM") {
        this.setupM3(reader);
      } else {
        onerror(this, + "BadFormat");
      }
      
      if (this.ready) {
        for (var i = 0, l = this.queue.length; i < l; i++) {
          var action = this.queue[i];
          
          this[action[0]].apply(this, action[1]);
        }
        
        onload(this);
      }
    } else {
      onerror(this, "" + status);
    }
  },
  
  setupMdx: function (reader) {
    var parser = new Mdx.Parser(reader);
	  
    if (parser["ready"]) {
      if (DEBUG_MODE) {
        console.log(parser);
      }
      
      var psmain = SHADERS["wpsmain"];
      
      // Load the main shader if it is needed
      if ((parser["geosetChunk"] || parser["particleEmitterChunk"]) && !gl.shaderReady("wmain")) {
        gl.createShader("wmain", SHADERS["vsbonetexture"] + SHADERS["wvsmain"], psmain)
      }
      
      // Load the particle emitters type 2 shader if it is needed
      if (parser["particleEmitter2Chunk"] && !gl.shaderReady("wparticles")) {
        gl.createShader("wparticles", SHADERS["decodefloat"] + SHADERS["wvsparticles"], SHADERS["wpsparticles"]);
      }
      
      // Load the instanced particle emitters type 2 shader if it is needed
      //if (parser["particleEmitter2Chunk"] && !gl.shaderReady("wparticlesinstanced")) {
      //  gl.newShader("wparticlesinstanced", SHADERS["decodefloat"] + SHADERS["wvsparticlesinstanced"], SHADERS["wpsparticlesinstanced"]);
      //}
      
      // Load the ribbon emitters shader if it is needed
      if (parser["ribbonEmitterChunk"] && !gl.shaderReady("wribbons")) {
        gl.createShader("wribbons", SHADERS["wvsribbons"], psmain);
      }
      
      // Load the color shader if it is needed
      if (!gl.shaderReady("wcolor")) {
        gl.createShader("wcolor", SHADERS["vsbonetexture"] + SHADERS["wvscolor"], SHADERS["pscolor"]);
      }
      
      // Load the model
      this.model = new Mdx.Model(parser, this.textureMap);
  
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
        this.model = new M3.Model(parser, this.textureMap);
        
        // Shader setup
        var uvSetCount = this.model.uvSetCount;
        var uvSets = "EXPLICITUV" + (uvSetCount - 1);
        var vscommon = SHADERS["vsbonetexture"] + SHADERS["svscommon"] + "\n";
        var vsstandard = vscommon + SHADERS["svsstandard"];
        var pscommon = SHADERS["spscommon"] + "\n";
        var psstandard = pscommon + SHADERS["spsstandard"];
        var psspecialized = pscommon + SHADERS["spsspecialized"];
        var NORMALS_PASS = "NORMALS_PASS";
        var HIGHRES_NORMALS = "HIGHRES_NORMALS";
        var SPECULAR_PASS = "SPECULAR_PASS";
        var UNSHADED_PASS = "UNSHADED_PASS";
        
        // Load all the M3 shaders.
        // All of them are based on the uv sets of this specific model.
        if (!gl.shaderReady("sstandard" + uvSetCount)) {
          gl.createShader("sstandard" + uvSetCount, vsstandard, psstandard, [uvSets]);
        }
        
        if (!gl.shaderReady("sdiffuse" + uvSetCount)) {
          gl.createShader("sdiffuse" + uvSetCount, vsstandard, psspecialized, [uvSets, "DIFFUSE_PASS"]);
        }
        
        if (!gl.shaderReady("snormals" + uvSetCount)) {
          gl.createShader("snormals" + uvSetCount, vsstandard, psspecialized, [uvSets, NORMALS_PASS]);
        }
        
        if (!gl.shaderReady("snormalmap" + uvSetCount)) {
          gl.createShader("snormalmap" + uvSetCount, vsstandard, psspecialized, [uvSets, NORMALS_PASS, HIGHRES_NORMALS]);
        }
        
        if (!gl.shaderReady("sspecular" + uvSetCount)) {
          gl.createShader("sspecular" + uvSetCount, vsstandard, psspecialized, [uvSets, SPECULAR_PASS]);
        }
        
        if (!gl.shaderReady("sspecular_normalmap" + uvSetCount)) {
          gl.createShader("sspecular_normalmap" + uvSetCount, vsstandard, psspecialized, [uvSets, SPECULAR_PASS, HIGHRES_NORMALS]);
        }
        
        if (!gl.shaderReady("semissive" + uvSetCount)) {
          gl.createShader("semissive" + uvSetCount, vsstandard, psspecialized, [uvSets, "EMISSIVE_PASS"]);
        }
        
        if (!gl.shaderReady("sunshaded" + uvSetCount)) {
          gl.createShader("sunshaded" + uvSetCount, vsstandard, psspecialized, [uvSets, UNSHADED_PASS]);
        }
        
        if (!gl.shaderReady("sunshaded_normalmap" + uvSetCount)) {
          gl.createShader("sunshaded_normalmap" + uvSetCount, vsstandard, psspecialized, [uvSets, UNSHADED_PASS, HIGHRES_NORMALS]);
        }
        
        if (!gl.shaderReady("sdecal" + uvSetCount)) {
          gl.createShader("sdecal" + uvSetCount, vsstandard, psspecialized, [uvSets, "DECAL_PASS"]);
        }
        
        if (!gl.shaderReady("sparticles" + uvSetCount)) {
          gl.createShader("sparticles" + uvSetCount, SHADERS["svsparticles"], SHADERS["spsparticles"]);
        } 
        
        if (!gl.shaderReady("scolor")) {
          gl.createShader("scolor", SHADERS["vsbonetexture"] + SHADERS["svscolor"], SHADERS["pscolor"]);
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
  
  // Return the name of the model itself
  getName: function () {
    if (this.ready) {
      return this.model.name;
    }
  },
  
  // Return the source of this model
  getSource: function () {
    return this.source;
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
      this.textureMap[path] = newpath;
      this.model.overrideTexture(path, newpath);
    } else {
      this.queue.push(["overrideTexture", [path, newpath]]);
    }
  },
  
  getTextureMap: function () {
    if (this.ready) {
      return this.model.getTextureMap();
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
  
  getCollisionShapes: function () {
    if (this.ready) {
      return this.model.getCollisionShapes();
    }
  },
  
  getCameras: function () {
    if (this.ready) {
      return this.model.getCameras();
    }
  },
  
  getInfo: function () {
    return {
      name: this.getName(),
      source: this.getSource(),
      sequences: this.getSequences(),
      attachments: this.getAttachments(),
      cameras: this.getCameras(),
      textureMap: this.getTextureMap()
    };
  },
  
  toJSON: function () {
    var modelTextureMap = this.getTextureMap();
    var textureMap = {};
    var key, keys = Object.keys(modelTextureMap);
      
    for (var i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      
      if (urls.mpqFile(key) !== modelTextureMap[key]) {
        textureMap[key] = modelTextureMap[key];
      }
    }
    
    return [
      this.id,
      this.source,
      textureMap
    ];
  },
  
  fromJSON: function (object) {
    
  }
};