/**
 * @class The main model viewer object.
 * @name ModelViewer
 * @param {HTMLCanvasElement} canvas A canvas element.
 * @param {object} urls An object with the necessary methods to get urls from the viewer.
 * @param {function} onmessage A callback function, which the viewer will call with messages.
 * @param {boolean} debugMode If true, the viewer will log the loaded models and their parser to the console.
 */
window["ModelViewer"] = function (canvas, urls, debugMode) {
    var objectsNotReady = 0;
    
    var listeners = {}
    var viewerObject = {};
    
    function onabort(object) {
        //objectsNotReady -= 1;
        
        dispatchEvent({type: "abort", target: object});
    }
  
    function onloadstart(object) {
        objectsNotReady += 1;
        
        dispatchEvent({type: "loadstart", target: object});
    }
    
    function onloadend(object) {
        objectsNotReady -= 1;
        
        dispatchEvent({type: "loadend", target: object});
    }
    
    function onload(object) {
        // If this model isn't in the cache yet, add it
        if (object.type === "model" && !modelCache[object.source]) {
            modelCache[object.source] = object;
        }
        
        dispatchEvent({type: "load", target: object});
        
        onloadend(object);
    }

    function onerror(object, error) {
        if (typeof error !== "string") {
            error = "" + error.target.status;
        }

        dispatchEvent({type: "error", error: error, target: object});
        
        onloadend(object);
    }
    
    function onprogress(object, e) {
        if (e.target.status === 200) {
            dispatchEvent({type: "progress", target: object, loaded: e.loaded, total: e.total, lengthComputable: e.lengthComputable});
        }
    }
  
    function onunload(object) {
        dispatchEvent({type: "unload", target: object});
    }
  
    var gl = GL(canvas, onload, onerror, onprogress, onloadstart, onunload);
    
    var grassPath = urls.localFile("grass.png"),
        waterPath = urls.localFile("water.png"),
        bedrockPath = urls.localFile("bedrock.png"),
        skyPath = urls.localFile("sky.png");

    var ctx = gl.ctx;
    var cameraMatrix = mat4.create();
    var inverseCamera = mat4.create();
    var inverseCameraRotation = mat4.create();
    var lightPosition = [0, 0, 10000];
    var cameraPosition = vec3.create();
    var grass_water;
    var bedrock;
    var sky;
    var uvOffset = [0, 0];
    var uvSpeed = [Math.randomRange(-0.004, 0.004), Math.randomRange(-0.004, 0.004)];

    var idFactory = -1;
    var modelArray = []; // All models
    var instanceArray = []; // All instances
    var modelInstanceMap = {}; // Referebce by ID. This is a map to support deletions.
    var modelMap = {}; // Reference by source
    var instanceMap = {}; // Reference by color
    // Much like modelMap, but isn't cleared when something is unloaded.
    // It is used to make loading faster if a model was unloaded, or clear was called, and then the model is requested to load again.
    var modelCache = {}; 

    var supportedFileTypes = {"png":1, "gif":1, "jpg":1};
    var supportedModelFileTypes = {};
    var supportedTextureFileTypes = {"png":1, "gif":1, "jpg":1};
  
    var teamColors = [
        [255, 3, 3],
        [0, 66, 255],
        [28, 230, 185],
        [84, 0, 129],
        [255, 252, 1],
        [254, 138, 14],
        [32, 192, 0],
        [229, 91, 176],
        [149, 150, 151],
        [126, 191, 241],
        [16, 98, 70],
        [78, 42, 4],
        [40, 40, 40],
        [0, 0, 0]
    ];

    var shaders = [
        "standard",
        "diffuse",
        "normals",
        "uvs",
        "normalmap",
        "specular",
        "specular_normalmap",
        "emissive",
        "unshaded",
        "unshaded_normalmap",
        "decal",
        "white"
    ];
  
    var context = {
        frameTime: 1000 / 60,
        camera: [[0, 0, 0], [0, 0]],
        instanceCamera: [-1, -1],
        worldMode: 2,
        groundSize: 256,
        emittersMode: true,
        polygonMode: 1,
        teamColorsMode: true,
        boundingShapesMode: false,
        texturesMode: true,
        shader: 0,
        particleRect: [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)],
        particleBillboardedRect: [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()],
        gl: gl,
        debugMode: debugMode,
        teamColors: teamColors,
        shaders: shaders,
        cameraPosition: cameraPosition,
        lightPosition: lightPosition,
        loadInternalResource: loadInternalResource
    };
  
    function saveContext() {
        var camera = context.camera,
            translation = Array.setFloatPrecision(camera[0], 0),
            rotation = Array.setFloatPrecision(Array.toDeg(camera[1]), 0);

        return [
            context.frameTime / 1000 * 60,
            [translation, rotation],
            context.instanceCamera,
            context.worldMode,
            context.groundSize,
            context.polygonMode,
            context.teamColorsMode & 1,
            context.boundingShapesMode & 1,
            context.texturesMode & 1,
            context.shader
        ];
    }
  
    function loadContext(object) {
        var camera = object[1],
            translation = camera[0],
            rotation = Array.toRad(camera[1]);

        context.frameTime = object[0] / 60 * 1000;
        context.camera = [translation, rotation],
        context.instanceCamera = object[2];
        context.worldMode = object[3];
        setGroundSize(object[4] * 2);
        context.polygonMode = object[6];
        context.teamColorsMode = !!object[7];
        context.boundingShapesMode = !!object[8];
        context.texturesMode = !!object[9];
        context.shader = object[10];
    }
  
    function setupColor(width, height) {
        // Color texture
        var color = ctx.createTexture();
        ctx.bindTexture(ctx.TEXTURE_2D, color);
        gl.textureOptions(ctx.REPEAT, ctx.REPEAT, ctx.NEAREST, ctx.NEAREST);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, width, height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);

        // Depth render buffer
        var depth = ctx.createRenderbuffer();
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, depth);
        ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH_COMPONENT16, width, height);

        // FBO
        var fbo = ctx.createFramebuffer();
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo);
        ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, color, 0);
        ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_ATTACHMENT, ctx.RENDERBUFFER, depth);

        ctx.bindTexture(ctx.TEXTURE_2D, null);
        ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);

        return fbo;
    }
  
  // Used for color picking
  //var colorFBO = setupColor(512, 512);

    function resetViewport() {
        var width = canvas.clientWidth,
            height = canvas.clientHeight;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.viewport(0, 0, width, height);
        gl.setPerspective(45, width / height, 0.1, 5E4);
    }
  
    resetViewport();

    addEvent(window, "resize", resetViewport);

    resetCamera();
      
    gl.createShader("world", SHADERS.vsworld, SHADERS.psworld);
    gl.createShader("white", SHADERS.vswhite, SHADERS.pswhite);

    gl.loadTexture(grassPath);
    gl.loadTexture(waterPath);
    gl.loadTexture(bedrockPath);
    gl.loadTexture(skyPath);

    grass_water = gl.createRect(0, 0, -3, context.groundSize, context.groundSize, 6);
    bedrock = gl.createRect(0, 0, -35, context.groundSize, context.groundSize, 6);
    sky = gl.createSphere(0, 0, 0, 5, 40, 2E3);
  
    function updateParticleRect() {
        var i;
        
        for (i = 0; i < 7; i++) {
            vec3.transformMat4(context.particleBillboardedRect[i], context.particleRect[i], inverseCameraRotation);
        }
    }

    function transformCamera() {
        mat4.identity(cameraMatrix);
        mat4.identity(inverseCameraRotation);

        if (context.instanceCamera[1] === -1) {
            var z = context.camera[1][1],
                x = context.camera[1][0];

            mat4.translate(cameraMatrix, cameraMatrix, context.camera[0]);
            mat4.rotate(cameraMatrix, cameraMatrix, x, vec3.UNIT_X);
            mat4.rotate(cameraMatrix, cameraMatrix, z, vec3.UNIT_Z);

            mat4.rotate(inverseCameraRotation, inverseCameraRotation, -z, vec3.UNIT_Z);
            mat4.rotate(inverseCameraRotation, inverseCameraRotation, -x, vec3.UNIT_X);

            mat4.invert(inverseCamera, cameraMatrix);
            vec3.transformMat4(cameraPosition, vec3.UNIT_Z, inverseCamera);
        } else {
            var instance = modelInstanceMap[context.instanceCamera[0]];

            if (instance) {
                var cam = instance.getCamera(context.instanceCamera[1]);

                if (cam) {
                    var targetPosition = cam.targetPosition;

                    mat4.lookAt(cameraMatrix, cam.position, targetPosition, upDir);
                    mat4.toRotationMat4(inverseCameraRotation, cameraMatrix);

                    cameraPosition[0] = targetPosition[0];
                    cameraPosition[1] = targetPosition[1];
                    cameraPosition[2] = targetPosition[2];
                }
            }
        }

        gl.loadIdentity();
        gl.multMat(cameraMatrix);
    }

    function update() {
        var i,
            l;
        
        for (i = 0, l = instanceArray.length; i < l; i++) {
            instanceArray[i].update(context);
        }

        transformCamera();

        updateParticleRect();
    }

    function renderGround(isWater) {
        if (context.worldMode > 1 && gl.shaderStatus("world")) {
            var shader = gl.bindShader("world");

            ctx.disable(ctx.CULL_FACE);

            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());

            if (isWater) {
                uvOffset[0] += uvSpeed[0];
                uvOffset[1] += uvSpeed[1];

                ctx.uniform2fv(shader.variables.u_uv_offset, uvOffset);
                ctx.uniform1f(shader.variables.u_a, 0.6);
            } else {
                ctx.uniform2fv(shader.variables.u_uv_offset, [0, 0]);
                ctx.uniform1f(shader.variables.u_a, 1);
            }

            if (context.worldMode > 2) {
                if (isWater) {
                    ctx.enable(ctx.BLEND);
                    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);

                    gl.bindTexture(waterPath, 0);
                    grass_water.render(shader);

                    ctx.disable(ctx.BLEND);
                } else {
                    gl.bindTexture(bedrockPath, 0);
                    bedrock.render(shader);
                }
            } else {
                gl.bindTexture(grassPath, 0);
                grass_water.render(shader);
            }
        }
    }
  
    function renderSky() {
        if (context.worldMode > 0 && gl.shaderStatus("world")) {
            var shader = gl.bindShader("world");

            ctx.uniform2fv(shader.variables.u_uv_offset, [0, 0]);
            ctx.uniform1f(shader.variables.u_a, 1);
            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getProjectionMatrix());

            gl.bindTexture(skyPath, 0);
            sky.render(shader);
        }
    }
  
    function render() {
        var i,
            l = instanceArray.length;

        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

        renderSky();
        renderGround();

        // Render geometry
        if (context.polygonMode > 0) {
            for (i = 0; i < l; i++) {
                instanceArray[i].render(context);
            }
        }

        // Render particles
        if (context.emittersMode) {
            for (i = 0; i < l; i++) {
                instanceArray[i].renderEmitters(context);
            }
        }

        // Render bounding shapes
        if (context.boundingShapesMode) {
            for (i = 0; i < l; i++) {
                instanceArray[i].renderBoundingShapes(context);
            }
        }

        if (context.worldMode > 2) {
            renderGround(true);
        }
        
        dispatchEvent("render");
    }
  
    function renderColor() {
        var i,
            l;
        
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

        ctx.disable(ctx.CULL_FACE);

        for (i = 0, l = instanceArray.length; i < l; i++) {
            instanceArray[i].renderColor(context);
        }

        ctx.enable(ctx.CULL_FACE);
    }
  
    function loadModel(source, originalSource, textureMap) {
        
        // If the model is cached, but not in the model map, add it to the model map
        if (modelCache[source]) {
            if (!modelMap[source]) {
                modelMap[source] = modelCache[source];
                
                //onloadstart(modelMap[source]);
                //onload(modelMap[source]);
            }
        // If the model isn't in the cache, it's also likely not in the model map, so do a real load
        } else {
            var object;

            idFactory += 1;
            object = new AsyncModel(source, originalSource, idFactory, textureMap, context, onloadstart, onerror, onprogress, onload);

            modelMap[source] = object;
            modelArray.push(object);
            modelInstanceMap[idFactory] = object;
        }

        return modelMap[source];
    }
  
    function loadInstance(source, hidden) {
        var object,
            color = generateColor();

        idFactory += 1;
        object = new AsyncModelInstance(modelMap[source], idFactory, color, {}, context, onload, onloadstart);

        if (hidden) {
            object.setVisibility(false);
        }

        modelInstanceMap[idFactory] = object;
        instanceArray.push(object);
        instanceMap[colorString(color)] = object;

        if (object.delayOnload) {
            onload(object);
        }

        return object;
    }
  
    // Used by Mdx.ParticleEmitter since they don't need to be automatically updated and rendered
    function loadInternalResource(source) {
        if (!modelMap[source]) {
            modelMap[source] = new AsyncModel(source, source, -1, {}, context, onloadstart, onerror, onprogress, onload);
        }

        var instance = new AsyncModelInstance(modelMap[source], -1, generateColor(), {}, context, onload, onloadstart, true);

        // Avoid reporting this instance since it's internal
        instance.delayOnload = true;

        return instance;
    }
  
    // Load a model or texture from an absolute url, with an optional texture map, and an optional hidden parameter
    function loadResourceImpl(source, originalSource, textureMap, hidden) {
        var fileType = fileTypeFromPath(source);

        if (supportedModelFileTypes[fileType]) {
            loadModel(source, originalSource, textureMap);
            loadInstance(source, hidden);
        } else {
            gl.loadTexture(source);
        }
    }

    function loadResourceFromHeader(e) {
        var status = e.target.status;

        if (status === 200) {
            onload(this);

            var i, l;
            var object = JSON.parse(e.target.responseText);
            var keys = Object.keys(object.textures);
            var textureMap = {};
            var key, texture;
                
            if (context.debugMode) {
                console.log(object);
            }

            for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                texture = object.textures[key];

                textureMap[key] = texture.url;

                gl.loadTexture(textureMap[key]);
            }

            var models = object.models;

            for (i = 0, l = object.models.length; i < l; i++) {
                loadResourceImpl(models[i].url, models[i].url, textureMap, models[i].hidden);
            }
        } else {
            onerror(this, e);
        }
    }
  
    function unloadInstance(instance, unloadingModel) {
        var i,
            l,
            instances = instance.asyncModel.instances;

        // Remove from the instance array
        for (i = 0, l = instanceArray.length; i < l; i++) {
            if (instanceArray[i] === instance) {
                instanceArray.splice(i, 1);
            }
        }

        // Remove from the instance map
        delete instanceMap[colorString(instance.color)];

        // Remove from the model-instance map
        delete modelInstanceMap[instance.id];

        // Don't remove from the model if the model itself is unloaded
        if (!unloadingModel) {
            // Remove from the instances list of the owning model
            for (i = 0, l = instances.length; i < l; i++) {
                if (instances[i] === instance) {
                    instances.splice(i, 1);
                }
            }
        }

        onunload(instance);
    }
  
    function unloadModel(model) {
        var instances = model.instances,
            i,
            l;

        // If the model was still in the middle of loading, abort the XHR request.
        if (model.abort()) {
            onabort(model);
        }
        
        // Remove all instances owned by this model
        for (i = 0, l = instances.length; i < l; i++) {
            unloadInstance(instances[i], true);
        }

        // Remove from the model array
        for (i = 0, l = modelArray.length; i < l; i++) {
            if (modelArray[i] === model) {
                modelArray.splice(i, 1);
            }
        }

        // Remove from the model-instance map
        delete modelInstanceMap[model.id];
        
        onunload(model);
    }
  
  // ---------------------
  // Model loading API
  // ---------------------
  
  /**
    * Loads a resource.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} source The source to load from. Can be an absolute url, a path to a file in the MPQ files of Warcraft 3 and Starcraft 2, or a form of identifier to be used for headers.
    */
    function load(source) {
        var isSupported = supportedFileTypes[fileTypeFromPath(source)];

        if (source.startsWith("http://") && isSupported) {
            loadResourceImpl(source);
        } else if (isSupported) {
            loadResourceImpl(urls.mpqFile(source), source);
        } else {
            var object = {isHeader: 1, source: source};

            onloadstart(object);

            getRequest(urls.header(source), false, loadResourceFromHeader.bind(object), onerror.bind(undefined, object), onprogress.bind(undefined, object));
        }
    }
  
  /**
    * Unloads a resource.
    *
    * @memberof ModelViewer
    * @instance
    * @param {(string|number)} source The source to unload from. Can be the source of a previously loaded resource, or a valid model or instance ID.
    */
    function unload(source) {
        var object;

        if (typeof source === "number") {
            object = modelInstanceMap[source];

            if (object) {
                if (object.isModel) {
                    unloadModel(object);
                } else {
                    unloadInstance(object);
                }
            }
        } else {
            object = modelMap[source];

            if (object) {
                unloadModel(object);
            } else {
                gl.unloadTexture(source);
            }
        }
    }
  
    /**
       * Clears all of the model and instance maps.
      *
      * @memberof ModelViewer
      * @instance
      */
    function clear() {
        var keys = Object.keys(modelMap),
            i,
            l;
        
        for (i = 0, l = keys.length; i < l; i++) {
            unloadModel(modelMap[keys[i]]);
        }
        
        modelArray = [];
        instanceArray = [];
        modelInstanceMap = {};
        modelMap = {};
        instanceMap = {};
    }
    
    function clearCache() {
        modelCache = {};
    }
    
    function loadingEnded() {
        return objectsNotReady === 0;
    }
    
    // TODO: Add a way to check for internal instances/models and their textures too.
    function dependenciesLoaded(object) {
        if (object) {
            var textureMap = {},
                keys,
                loaded = 0,
                total,
                i,
                l;
            
            if (object.type === "instance") {
                overrideMap(object.asyncModel.getTextureMap(), textureMap);
                overrideMap(object.getTextureMap(), textureMap);
            }
            
            if (object.type === "model") {
                overrideMap(object.getTextureMap(), textureMap);
            }
            
            keys = Object.keys(textureMap);
            total = keys.length;
            
            for (i = 0, l = total; i < l; i++) {
                if (gl.textureLoaded(textureMap[keys[i]])) {
                    loaded += 1;
                }
            }
            
            return loaded / total;
        }
    }
  
  // -------------------
  // General settings
  // -------------------
  
  /**
    * Sets the animation speed.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} ratio The speed.
    */
    function setAnimationSpeed(ratio) {
        context.frameTime = ratio / 60 * 1000;
    }
  
  /**
    * Gets the animation speed.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {number} The speed.
    */
    function getAnimationSpeed() {
        return context.frameTime / 1000 * 60;
    }
  
  /**
    * Sets the world mode.
    * Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} mode The world mode.
    */
    function setWorldMode(mode) {
        context.worldMode = mode;
    }
  
  /**
    * Gets the world mode.
    * Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} The world mode.
    */
    function getWorldMode() {
        return context.worldMode;
    }
  
  /**
    * Sets the ground size.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} size The ground size.
    */
    function setGroundSize(size) {
        size /= 2;

        context.groundSize = size;

        grass_water.resize(size, size);
        bedrock.resize(size, size);
    }
  
  /**
    * Gets the ground size.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {number} The ground size.
    */
    function getGroundSize() {
        return context.groundSize * 2;
    }
  
  /**
    * Sets the particle emitters mode. If false, no particle emitters will be shown.
    *
    * @memberof ModelViewer
    * @instance
    * @param {boolean} mode The mode.
    */
    function setEmittersMode(b) {
        context.emittersMode = b;
    }

  /**
    * Gets the particle emitters mode.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {boolean} The mode.
    */
    function getEmittersMode() {
        return context.emittersMode;
    }
  
  /**
    * Sets the bounding shapes mode. If false, no bounding shapes will be shown.
    *
    * @memberof ModelViewer
    * @instance
    * @param {boolean} mode The mode.
    */
    function setBoundingShapesMode(b) {
        context.boundingShapesMode = b;
    }
  
  /**
    * Gets the bounding shapes mode.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {boolean} The mode.
    */
    function getBoundingShapesMode() {
        return context.boundingShapesMode;
    }
  
  /**
    * Sets the team colors mode. If false, no team colors will be shown.
    *
    * @memberof ModelViewer
    * @instance
    * @param {boolean} mode The mode.
    */
    function setTeamColorsMode(b) {
        context.teamColorsMode = b;
    }
  
  /**
    * Gets the team colors mode.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {boolean} The mode.
    */
    function getTeamColorsMode() {
        return context.teamColorsMode;
    }
  
  /**
    * Sets the polygon mode. 0 for none, 1 for normal, 2 for wireframe, 3 for both.
    *
    * @memberof ModelViewer
    * @instance
    * @param {boolean} mode The mode.
    */
    function setPolygonMode(mode) {
        context.polygonMode = mode;
    }
  
  /**
    * Gets the polygon mode.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {boolean} The mode.
    */
    function getPolygonMode() {
        return context.polygonMode;
    }
  
  /**
    * Sets the shader.
    * Possible values are 0 for `standard`, 1 for `diffuse`, 2 for `normals`, 3 for `uvs`, 4 for `normal map`, 5 for `specular map`, 6 for `specular map + normal map`, 7 for `emissive`, 8 for `unshaded`, 9 for `unshaded + normal map`, 10 for `decal`, and finally 11 for `white`.
    * Note: only the normals, uvs, and white shaders affect Warcraft 3 models, the rest only affect Starcraft 2 models.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} id The shader.
    */
    function setShader(id) {
        context.shader = id;
    }
  
  /**
    * Gets the shader.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {number} The shader.
    */
    function getShader() {
        return context.shader;
    }
  
  // -------------------
  // Camera settings
  // -------------------
  
  /**
    * Sets the camera.
    * If either of the arguments is -1, the normal free form camera is used.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} cameraId The camera.
    */
    function setCamera(objectId, cameraId) {
        context.instanceCamera[0] = objectId;
        context.instanceCamera[1] = cameraId;
    }
  
  /**
    * Gets the camera.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {array} The model instance ID and camera. If the free form camera is used, both will be -1.
    */
    function getCamera() {
        return [context.instanceCamera[0], context.instanceCamera[1]];
    }
  
    function getCameraPosition() {
        return cameraPosition;
    }
    
  /**
    * Pans the camera on the x and y axes.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} x Amount to pan on the X axis.
    * @param {number} y Amount to pan on the Y axis.
    */
    function panCamera(x, y) {
        context.instanceCamera[1] = -1;
        context.camera[0][0] += x;
        context.camera[0][1] -= y;
    }
  
  /**
    * Rotates the camera on the x and y axes.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} x Amount to rotate on the X axis.
    * @param {number} y Amount to rotate on the Y axis.
    */
    function rotateCamera(x, y) {
        context.instanceCamera[1] = -1;
        context.camera[1][0] += Math.toRad(x);
        context.camera[1][1] += Math.toRad(y);
    }
  
  /**
    * Zooms the camera by a factor.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} n Zoom factor.
    */
    function zoomCamera(n) {
        context.instanceCamera[1] = -1;
        context.camera[0][2] = Math.floor(context.camera[0][2] * n);
    }
  
  /**
    * Resets the camera to the initial state.
    *
    * @memberof ModelViewer
    * @instance
    */
    function resetCamera() {
        context.instanceCamera[1] = -1;
        context.camera[0][0] = 0;
        context.camera[0][1] = 0;
        context.camera[0][2] = -300;
        context.camera[1] = [Math.toRad(315), Math.toRad(225)];
    }
  
  // ------
  // Misc
  // ------
  
  /**
    * Selects a model instance given a screen-space position.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} x X coordinate.
    * @param {number} y Y coordinate.
    * @returns {number} The ID of the selected model instance, or -1 if no model instance was selected.
    */
    function selectInstance(x, y) {
        //var date = new Date();
        var pixel = new Uint8Array(4);

        //var dx = canvas.clientWidth / 512;
        //var dy = canvas.clientHeight / 512;

        //console.log(x, y);
        //x = Math.round(x / dx);
        //y = canvas.height - y;
        //y = Math.round(y / dy);
        //console.log(x, y);

        //ctx.bindFramebuffer(ctx.FRAMEBUFFER, colorFBO);

        //ctx.viewport(0, 0, 512, 512);
        //gl.setPerspective(45, 1, 0.1, 5E4);

        renderColor();

        // The Y axis of the WebGL viewport is inverted compared to screen space
        y = canvas.clientHeight - y;

        ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, pixel);

        //ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);

        //ctx.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
        //gl.setPerspective(45, canvas.clientWidth / canvas.clientHeight, 0.1, 5E4);

        //console.log(pixel);
        
        var color = webGLPixelToColor(pixel).join("");
        var instance = instanceMap[color];

        //console.log("selectInstance", new Date() - date);

        if (instance) {
            return instance;
        }
    }
  
  /**
    * Saves the scene as a JSON string.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {string} The JSON string.
    */
    function saveScene() {
        var models = [],
            instances = [],
            object,
            i,
            l;

        for (i = 0, l = modelArray.length; i < l; i++) {
            object = modelArray[i];

            if (object.ready) {
                models.push(object);
            }
        }

        for (i = 0, l = instanceArray.length; i < l; i++) {
            object = instanceArray[i];

            if (object.ready) {
                instances.push(object);
            }
        }

        return JSON.stringify([saveContext(), models, instances]);
    }
  
  /**
    * Loads a scene from JSON string.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} scene The JSON string.
    */
    function loadScene(scene) {
        var idMap = [], // Map from object IDs in the scene to actual indices in the object array.
            id,
            models,
            instances,
            object,
            owningModel,
            instance,
            i,
            l;

        scene = JSON.parse(scene);

        loadContext(scene[0]);

        models = scene[1];
        instances = scene[2];

        // Load all the models
        for (i = 0, l = models.length; i < l; i++) {
            // object[0] = id
            // object[1] = source
            // object[2] = texture map
            object = models[i];

            loadModel(object[1], object[2]);

            idMap[object[0]] = idFactory;
        }

        // Load all the instances
        for (i = 0, l = instances.length; i < l; i++) {
            // object[0] = id
            // object[1] = model id
            // ...
            object = instances[i];

            owningModel = modelInstanceMap[idMap[object[1]]];

            instance = loadInstance(owningModel.getSource());
            instance.fromJSON(object);

            idMap[object[0]] = idFactory;
        }

        // The parenting must be applied after all instances are loaded
        for (i = 0, l = instances.length; i < l; i++) {
            // object[0] = id
            // object[8] = parent
            object = instances[i];
            parent = object[8];

            setParent(idMap[object[0]], idMap[parent[0]], parent[1]);
        }
    }
  
  /**
    * Registers external handlers for an unspported model type.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} fileType The file format the handlers handle.
    * @param {BaseModel} modelHandler A BaseModel-like object.
    * @param {BaseModelInstance} modelInstanceHandler A BaseModelInstance-like object.
    * @param {boolean} binary Determines what type of input the model handler will get - a string, or an ArrayBuffer.
    */
    function registerModelHandler(fileType, modelHandler, modelInstanceHandler, binary) {
        AsyncModel.handlers[fileType] = [modelHandler, !!binary];
        AsyncModelInstance.handlers[fileType] = modelInstanceHandler;

        supportedModelFileTypes[fileType] = 1;
        supportedFileTypes[fileType] = 1;
    }
  
  /**
    * Registers an external handler for an unsupported texture type.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} fileType The file format the handler handles.
    * @param {function} textureHandler
    */
    function registerTextureHandler(fileType, textureHandler) {
        gl.registerTextureHandler(fileType, textureHandler);

        supportedTextureFileTypes[fileType] = 1;
        supportedFileTypes[fileType] = 1;
    }
    
    function addEventListener(type, listener) {
        if (listeners[type] === undefined){
            listeners[type] = [];
        }

        listeners[type].push(listener);
    }
    
    function removeEventListener(type, listener) {
        if (listeners[type] !== undefined){
            var _listeners = listeners[type],
                i,
                l;
            
            for (i = 0, l = _listeners.length; i < l; i++){
                if (_listeners[i] === listener){
                    _listeners.splice(i, 1);
                    return;
                }
            }
        }
    }
    
    function dispatchEvent(event) {
        if (typeof event === "string") {
            event = {type: event};
        }
        
        if (!event.target) {
            event.target = viewerObject;
        }
        
        if (!event.type) {
            return;
        }
        
        if (listeners[event.type] !== undefined) {
            var _listeners = listeners[event.type],
                i,
                l;
            
            for (i = 0, l = _listeners.length; i < l; i++){
                _listeners[i].call(viewerObject, event);
            }
        }
    }
  
    function getWebGLContext() {
        return ctx;
    }
    
    // The main loop of the viewer
    function step() {
        update();
        render();

        requestAnimationFrame(step);
    }

    step();
    

    var API = {
        // Resource API
        load: load,
        unload: unload,
        clear: clear,
        clearCache: clearCache,
        loadingEnded: loadingEnded,
        dependenciesLoaded: dependenciesLoaded,
        // General settings
        setAnimationSpeed: setAnimationSpeed,
        getAnimationSpeed: getAnimationSpeed,
        setWorldMode: setWorldMode,
        getWorldMode: getWorldMode,
        setGroundSize: setGroundSize,
        getGroundSize: getGroundSize,
        setEmittersMode: setEmittersMode,
        getEmittersMode: getEmittersMode,
        setBoundingShapesMode: setBoundingShapesMode,
        getBoundingShapesMode: getBoundingShapesMode,
        setTeamColorsMode: setTeamColorsMode,
        getTeamColorsMode: getTeamColorsMode,
        setPolygonMode: setPolygonMode,
        getPolygonMode: getPolygonMode,
        setShader: setShader,
        getShader: getShader,
        // Camera settings
        setCamera: setCamera,
        getCamera: getCamera,
        getCameraPosition: getCameraPosition,
        panCamera: panCamera,
        rotateCamera: rotateCamera,
        zoomCamera: zoomCamera,
        resetCamera: resetCamera,
        // Misc
        selectInstance: selectInstance,
        //saveScene: saveScene,
        //loadScene: loadScene,
        // Extending
        registerModelHandler: registerModelHandler,
        registerTextureHandler: registerTextureHandler,
        // Experiemental
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        getWebGLContext: getWebGLContext
    };
    
    mixin(API, viewerObject);
        
    return viewerObject;
};