// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

  gl.setShaderMaps(PARAMETERMAP, MEMBERMAP);
  
  function loadFormat(magic, reader, args, customTextures) {
    if (magic == "MDLX") {
      var parser = new Mdx.Parser(reader, onprogress);
	  
      if (parser["ready"]) {
        document.title = fileName(parser["modelChunk"].name);
        
        onprogress({status: "Setting the model for rendering"});
        
        if (DEBUG_MODE) {
          console.log(parser);
        }
        
        var psmain = floatPrecision + SHADERS["wpsmain"];
        
        if (parser["geosetChunk"] || parser["particleEmitterChunk"]) {
          if (HAS_FLOAT_TEXTURE && HAS_VERTEX_TEXTURE) {
            standardShader = gl.newShader("main", SHADERS["vsbonetexture"] + SHADERS["wvshardskinningtexture"], psmain);
            RENDER_MODE = 2;
          }
          
          if (!standardShader && parser["boneChunk"].bones.length < (VERTEX_UNIFORM_VECTORS / 4) - 1) {
            standardShader = gl.newShader("main", SHADERS["wvshardskinningarray"], psmain);
            RENDER_MODE = 1;
          }
          
          if (!standardShader) {
            standardShader = gl.newShader("main", SHADERS["wvssoftskinning"], psmain);
            RENDER_MODE = 0;
          }
	  
          if (standardShader) {
            if (RENDER_MODE === 0) {
              console.log("Running in SOFTware mode.");
            } else if (RENDER_MODE === 1) {
              console.log("Running in HARDware mode (array).");
            } else if (RENDER_MODE === 2) {
              console.log("Running in HARDware mode (texture).");
            }
          }
        }
        
        if (parser["particleEmitter2Chunk"]) {
          particleShader = gl.newShader("particles", SHADERS["wvsparticles"], floatPrecision + SHADERS["wpsparticles"]);
        }
        
        if (parser["ribbonEmitterChunk"]) {
          ribbonShader = gl.newShader("ribbons", SHADERS["wvssoftskinning"], psmain);
        }
		
        model = new Mdx.Model(parser, customTextures, false, onprogress);
		
        if (DEBUG_MODE) {
          console.log(model);
        }
      }
      
      for (var i = 0; i < 13; i++) {
        var number = ((i < 10) ? "0" + i : i);
        var teamColor = "ReplaceableTextures/TeamColor/TeamColor" + number + ".blp";
        var teamGlow = "ReplaceableTextures/TeamGlow/TeamGlow" + number + ".blp";
        
        gl.newTexture(teamColor, url.mpqFile(teamColor));
        gl.newTexture(teamGlow, url.mpqFile(teamGlow));
      }
    } else {
      var parser = new M3.Parser(reader, onprogress);
      
      if (parser) {
        document.title = fileName(parser.name);

        onprogress({status: "Setting the model for rendering"});
        
        if (DEBUG_MODE) {
          console.log(parser);
        }
        
        model = new M3.Model(parser, onprogress);
        
        var uvSets = "EXPLICITUV" + (model.uvSetCount - 1);
        var vscommon = SHADERS["vsbonetexture"] + SHADERS["svscommon"] + "\n";
        var vsstandard = vscommon + SHADERS["svsstandard"];
        var pscommon = SHADERS["spscommon"] + "\n";
        var psstandard = floatPrecision + pscommon + SHADERS["spsstandard"];
        var psspecialized = floatPrecision + pscommon + SHADERS["spsspecialized"];
        var NORMALS_PASS = "NORMALS_PASS";
        var HIGHRES_NORMALS = "HIGHRES_NORMALS";
        var SPECULAR_PASS = "SPECULAR_PASS";
        var UNSHADED_PASS = "UNSHADED_PASS";
        
        gl.newShader("standard", vsstandard, psstandard, [uvSets]);
        gl.newShader("diffuse", vsstandard, psspecialized, [uvSets, "DIFFUSE_PASS"]);
        gl.newShader("normals", vsstandard, psspecialized, [uvSets, NORMALS_PASS]);
        gl.newShader("normalmap", vsstandard, psspecialized, [uvSets, NORMALS_PASS, HIGHRES_NORMALS]);
        gl.newShader("specular", vsstandard, psspecialized, [uvSets, SPECULAR_PASS]);
        gl.newShader("specular_normalmap", vsstandard, psspecialized, [uvSets, SPECULAR_PASS, HIGHRES_NORMALS]);
        gl.newShader("emissive", vsstandard, psspecialized, [uvSets, "EMISSIVE_PASS"]);
        gl.newShader("unshaded", vsstandard, psspecialized, [uvSets, UNSHADED_PASS]);
        gl.newShader("unshaded_normalmap", vsstandard, psspecialized, [uvSets, UNSHADED_PASS, HIGHRES_NORMALS]);
        gl.newShader("decal", vsstandard, psspecialized, [uvSets, "DECAL_PASS"]);
        gl.newShader("particles", SHADERS["svsparticles"], floatPrecision + SHADERS["spsparticles"]);
		
        if (DEBUG_MODE) {
          console.log(model);
        }
      }
      
      addEvent(document.getElementById("shaders-select"), "change", function (e) {
        shaderToUse = e.target.value;
      });
    }
  }
  
  function onprogress(e) {
    if (args.onprogress) {
      args.onprogress(e);
    }
  }
  
  function onerror(e) {
    if (args.onerror) {
      args.onerror(e);
    }
  }
  
  function onload(e) {
    var reader = new BinaryReader(e.target.response);
    var magic = peek(reader, 4);
    
    if (magic == "MDLX") {
      format = 1;
      camera.range = [30, 2000];
      loadFormat(magic, reader, args, customTextures);
    } else if (magic == "43DM") {
      format = 2;
      camera.range = [0.2, 20];
      loadFormat(magic, reader, args, customTextures);
    } else {
      console.log("Invalid file");
      console.log("Magic is: " + magic);
    }
    
    resetCamera();
    
    if (args.onload) {
      args.onload(format);
    }
  }
  
  function onloadHeader(e) {
    var data = JSON.parse(e.target.response);
    
    customTextures = data.textures;
    
    onprogress({status: "Downloading the model file"});
    
    getFile(url.customFile(data.url), true, onload, onerror, onprogress);
  }
  
  if (MODEL_PATH && MODEL_PATH !== "") {
    onprogress({status: "Downloading the model file"});
      
    getFile(MODEL_PATH, true, onload, onerror, onprogress);
  } else if (MPQ_PATH && MPQ_PATH !== "") {
    onprogress({status: "Downloading the model file"});
      
    getFile(url.mpqFile(MPQ_PATH), true, onload, onerror, onprogress);
  } else if (MODEL_ID && MODEL_ID !== "") {
    onprogress({status: "Downloading the model data file"});
    
    getFile(url.header(MODEL_ID), false, onloadHeader, onerror, onprogress);
  } else {
    console.log("No input file");
  }
  
  gl.viewSize(canvas.width, canvas.height);
  gl.setPerspective(45, canvas.width / canvas.height, 0.1, 5E4);
  
  worldShader = gl.newShader("world", SHADERS["vsworld"], floatPrecision + SHADERS["psworld"]);
  whiteShader = gl.newShader("white", SHADERS["vswhite"], floatPrecision + SHADERS["pswhite"]);
  
  gl.newTexture("grass", "http://www.hiveworkshop.com/model_viewer/images/grass.png");
  gl.newTexture("water", "http://www.hiveworkshop.com/model_viewer/images/water.png");
  gl.newTexture("bedrock", "http://www.hiveworkshop.com/model_viewer/images/bedrock.png");
  gl.newTexture("sky", url.mpqFile("Environment/Sky/LordaeronSummerSky/LordaeronSummerSky.blp"));
  //gl.newTexture("Light", "../images/Light.png");
    
  grass_water = gl.newRectangle(0, 0, -3, 300, 300, 6);
  bedrock = gl.newRectangle(0, 0, -35, 300, 300, 6);
  sky = gl.newSphere(0, 0, 0, 5, 10, 2E4);
  //light = gl.newSphere(0, 0, 0, 10, 10, 0.05);
  
  function update() {
    if (model) {
      model.update();
    }
  }
  
  function transformCamera() {
    if (modelCameraId === -1) {
      var inverseCamera = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      var z = math.toRad(camera.r[1]);
      var x = math.toRad(camera.r[0]);

      math.mat4.translate(inverseCamera, camera.m[0], camera.m[1], -camera.m[2]);
      math.mat4.rotate(inverseCamera, x, 1, 0, 0);
      math.mat4.rotate(inverseCamera, z, 0, 0, 1);

      math.mat4.multVec3(inverseCamera, [0, 0, 1], cameraPosition);
      
      gl.loadIdentity();
      gl.multMat(inverseCamera);
    } else {
      cameraPosition = modelCamera.position;
      
      gl.lookAt(cameraPosition, modelCamera.targetPosition, upDir);
    }
  }
  
  function renderGround(isWater) {
    if (shouldRenderWorld > 1 && worldShader) {
      gl.bindShader("world");
      
      ctx.disable(ctx.CULL_FACE);
      
      gl.pushMatrix();
      
      if (format == 2) {
        gl.scale(0.0125, 0.0125, 0.0125)
      }
        
      gl.bindMVP("u_mvp");
      
      gl.popMatrix();
      
      if (isWater) {
        uvOffset[0] += uvSpeed[0];
        uvOffset[1] += uvSpeed[1];
        
        gl.setParameter("u_uv_offset", uvOffset);
        gl.setParameter("u_a", 0.6);
      } else {
        gl.setParameter("u_uv_offset", [0, 0]);
        gl.setParameter("u_a", 1);
      }
      
      
      
      if (shouldRenderWorld > 2) {
        if (isWater) {
          ctx.enable(ctx.BLEND);
          ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
          
          gl.bindTexture("water", 0);
          grass_water.render();
          
          ctx.disable(ctx.BLEND);
        } else {
          gl.bindTexture("bedrock", 0);
          bedrock.render();
        }
      } else {
        gl.bindTexture("grass", 0);
        grass_water.render();
      }
    }
  }
  
  function renderSky() {
    if (shouldRenderWorld > 0 && worldShader) {
      gl.bindShader("world");
      
      gl.setParameter("u_uv_offset", [0, 0]);
      gl.setParameter("u_a", 1);
      
      gl.pushMatrix();
      gl.loadIdentity();
      
      gl.bindMVP("u_mvp");
      
      gl.bindTexture("sky");
      sky.render();
      
      gl.popMatrix();
    }
  }

  /*
  function renderLights() {
    if (shouldRenderLights && worldShader) {
      gl.pushMatrix();
      
      gl.translate(lightPosition[0], lightPosition[1], lightPosition[2]);
      
      gl.bindShader("world");
      
      gl.bindMVP("u_mvp");
      
      gl.setParameter("u_diffuseMap", 0);
      gl.bindTexture("Light");
      
      light.render();
      
      gl.popMatrix();
    }
  }
  */
  function render() {
    transformCamera();
    renderSky();
    renderGround();
    //renderLights();
    
    if (model) {
      model.render();
    }
    
    if (shouldRenderWorld > 2) {
      renderGround(true);
    }
  }
  
  function getCameras() {
    if (model && model.cameras) {
      return model.cameras;
    }
    
    return [];
  }
  
  function getCamera() {
    return modelCameraId;
  }
  
  function setCamera(index) {
    if (model) {
      modelCameraId = index;
      
      if (model.cameras && index > -1 && index < model.cameras.length) {
        modelCamera = model.cameras[index];
      }
    }
  }
  
  function resetCamera() {
    camera.m[0] = 0;
    camera.m[1] = 0;
    
    if (format === 1) {
      camera.m[2] = model.extent * 3;
      camera.r = [315, 225];
    } else {
      camera.m[2] = model.extent * 6;
      camera.r = [315, 315];
    }
  }
  
  function getAnimations() {
    if (model && model.sequences) {
      return model.sequences;
    }
    
    return [];
  }
  
  function playAnimation(index) {
    if (model) {
      model.setAnimation(index);
    }
  }
  
  function stopAnimation() {
    if (model) {
      model.setAnimation(0);
    }
  }
  
  function setAnimationSpeed(speed) {
    ANIMATION_SCALE = speed;
  }
  
  function setLoopingMode(mode) {
    if (model) {
      model.setAnimationLooping(mode);
    }
  }
  
  function setTeamColor(index) {
    if (model) {
      model.setTeamColor(index);
      
      return teamColors[index];
    }
    
    return [0, 0, 0]
  }
  
  function setWorld(mode) {
    shouldRenderWorld = mode;
  }
  
  function showLights(b) {
    shouldRenderLights = b;
  }
  
  function showShapes(b) {
    shouldRenderShapes = b;
  }
  
  function resize(width, height) {
    gl.viewSize(width, height);
    gl.setPerspective(45, width / height, 0.1, 5E4);
  }
  
  function move(x, y) {
    if (modelCameraId === -1) {
      if (format === 2) {
        x *= 0.01;
        y *= 0.01;
      }
      
      camera.m[0] += x;
      camera.m[1] -= y;
    }
  }
  
  function zoom(x) {
    if (modelCameraId === -1) {
      camera.m[2] = math.clamp(camera.m[2] * x, camera.range[0], camera.range[1]);
    }
  }
  
  function rotate(x, y) {
    if (modelCameraId === -1) {
      camera.r[0] += x;
      camera.r[1] += y;
    }
  }
  
  var shouldRun = true;
  
  function run() {
    requestAnimationFrame(run);
    
    if (shouldRun) {
      update();
      render();
    }
  }

  run();
  
  function onVisibilityChange() {
    shouldRun = !isHidden();
  }
  
  addVisibilityListener(onVisibilityChange);
  
  return {
    getCameras: getCameras,
    getCamera: getCamera,
    setCamera: setCamera,
    resetCamera: resetCamera,
    getAnimations: getAnimations,
    playAnimation: playAnimation,
    stopAnimation: stopAnimation,
    setAnimationSpeed: setAnimationSpeed,
    setLoopingMode: setLoopingMode,
    setTeamColor: setTeamColor,
    setWorld: setWorld,
    showLights: showLights,
    showShapes: showShapes,
    resize: resize,
    move: move,
    zoom: zoom,
    rotate: rotate
  };
};