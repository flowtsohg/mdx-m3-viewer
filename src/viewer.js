/**
 * @class The main model viewer object.
 * @name ModelViewer
 * @param {HTMLCanvasElement} canvas A canvas element.
 * @param {object} urls An object with the necessary methods to get urls from the server.
 * @param {boolean} debugMode If true, the viewer will log the loaded models and their parser to the console.
 */
window["ModelViewer"] = function (canvas) {
    var viewerObject = new EventDispatcher();
    var gl = GL(canvas);
    var ctx = gl.ctx;

    var context = {
        canvas: canvas,
        gl: gl,
        objectsNotReady: 0,
        frameTimeMS: 1000 / 60,
        frameTimeS: 1 / 60,
        camera: new Camera([0, 0, canvas.clientWidth, canvas.clientHeight]),
        skyMode: 1,
        groundMode: 1,
        groundSize: 256,
        emittersMode: true,
        polygonMode: 1,
        teamColorsMode: true,
        boundingShapesMode: false,
        texturesMode: true,
        shader: 0,
        teamColors: [[255, 3, 3], [0, 66, 255], [28, 230, 185], [84, 0, 129], [255, 252, 1], [254, 138, 14], [32, 192, 0], [229, 91, 176], [149, 150, 151], [126, 191, 241], [16, 98, 70], [78, 42, 4], [40, 40, 40], [0, 0, 0]],
        shaders: ["standard", "diffuse", "normals", "uvs", "normalmap", "specular", "specular_normalmap", "emissive", "unshaded", "unshaded_normalmap", "decal", "white"],
        lightPosition: [0, 0, 10000],
        loadInternalResource: loadInternalResource,
        loadTexture: loadTexture,
        uvOffset: [0, 0],
        uvSpeed: [Math.randomRange(-0.004, 0.004), Math.randomRange(-0.004, 0.004)],
        ground: gl.createRect(0, 0, -1, 256, 256, 6),
        sky: gl.createSphere(0, 0, 0, 5, 40, 50000),
        modelArray: [],
        instanceArray: [],
        textureArray: [],
        modelMap: new Map(),
        instanceMap: new Map(),
        textureMap: new Map(),
        handlers: {
            supported: new Map(),
            model: new Map(),
            instance: new Map(),
            texture: new Map()
        },
        worldTextures: {
            ground: null,
            sky: null,
            water: null
        }
    };

    function dispatchEvent(e) {
        if (e.type === "loadstart") {
            context.objectsNotReady += 1;
        } else if (e.type === "loadend") {
            context.objectsNotReady -= 1;
        }

        viewerObject.dispatchEvent(e);
    }
    
    //function saveContext() {
    //    var camera = context.camera,
    //        translation = Array.setFloatPrecision(camera[0], 0),
    //        rotation = Array.setFloatPrecision(Array.toDeg(camera[1]), 0);

    //    return [
    //        context.frameTime / 1000 * 60,
    //        [translation, rotation],
    //        context.instanceCamera,
    //        context.worldMode,
    //        context.groundSize,
    //        context.polygonMode,
    //        context.teamColorsMode & 1,
    //        context.boundingShapesMode & 1,
    //        context.texturesMode & 1,
    //        context.shader
    //    ];
    //}
  
    //function loadContext(object) {
    //    var camera = object[1],
    //        translation = camera[0],
    //        rotation = Array.toRad(camera[1]);

    //    context.frameTime = object[0] / 60 * 1000;
    //    context.camera = [translation, rotation],
    //    context.instanceCamera = object[2];
    //    context.worldMode = object[3];
    //    setGroundSize(object[4] * 2);
    //    context.polygonMode = object[6];
    //    context.teamColorsMode = !!object[7];
    //    context.boundingShapesMode = !!object[8];
    //    context.texturesMode = !!object[9];
    //    context.shader = object[10];
    //}
  
    function resetViewport() {
        var width = canvas.clientWidth,
            height = canvas.clientHeight;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.viewport(0, 0, width, height);
        
        context.camera.setViewport([0, 0, width, height]);
    }
    
    window.addEventListener("resize", resetViewport);
    resetViewport();
      
    gl.createShader("world", SHADERS.vsworld, SHADERS.psworld);
    gl.createShader("white", SHADERS.vswhite, SHADERS.pswhite);
    gl.createShader("texture", SHADERS.vstexture, SHADERS.pstexture);
    
    function setupColorFramebuffer(width, height) {
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
  
    var colorFramebufferSize = 256;
    var colorFramebuffer = setupColorFramebuffer(colorFramebufferSize, colorFramebufferSize);
    var colorPixel = new Uint8Array(4);
    
    function update() {
        var instances = context.instanceArray;
        
        for (var i = 0, l = instances.length; i < l; i++) {
            instances[i].update();
        }
        
        var camera = context.camera;

        camera.update();

        gl.setProjectionMatrix(camera.projectionMatrix);
        gl.setViewMatrix(camera.viewMatrix);
    }

    function renderGround(mode) {
        if (gl.shaderStatus("world")) {
            var shader = gl.bindShader("world");

            ctx.disable(ctx.CULL_FACE);

            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());

            if (mode === 1) {
                if (context.worldTextures.ground) {
                    ctx.uniform2fv(shader.variables.u_uv_offset, [0, 0]);
                    ctx.uniform1f(shader.variables.u_a, 1);

                    gl.bindTexture(context.worldTextures.ground, 0);
                    context.ground.render(shader);
                }
            } else {
                if (context.worldTextures.water) {
                    context.uvOffset[0] += context.uvSpeed[0];
                    context.uvOffset[1] += context.uvSpeed[1];

                    ctx.uniform2fv(shader.variables.u_uv_offset, context.uvOffset);
                    ctx.uniform1f(shader.variables.u_a, 0.6);

                    ctx.enable(ctx.BLEND);
                    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);

                    gl.bindTexture(context.worldTextures.water, 0);
                    context.ground.render(shader);

                    ctx.disable(ctx.BLEND);
                }
            }
        }
    }
  
    function renderSky() {
        if (gl.shaderStatus("world") && context.worldTextures.sky) {
            var shader = gl.bindShader("world");

            ctx.uniform2fv(shader.variables.u_uv_offset, [0, 0]);
            ctx.uniform1f(shader.variables.u_a, 1);
            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getProjectionMatrix());

            gl.bindTexture(context.worldTextures.sky, 0);
            context.sky.render(shader);
        }
    }

    function render() {
        var instances = context.instanceArray,
            i,
            l = instances.length;

        // https://www.opengl.org/wiki/FAQ#Masking
        ctx.depthMask(1);
        
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
        
        if (context.skyMode) {
            renderSky();
        }
        
        if (context.groundMode === 1) {
            renderGround(context.groundMode);
        }

        // Render geometry
        if (context.polygonMode > 0) {
            for (i = 0; i < l; i++) {
                instances[i].render();
            }
        }

        // Render particles
        if (context.emittersMode) {
            for (i = 0; i < l; i++) {
                instances[i].renderEmitters();
            }
        }

        // Render bounding shapes
        if (context.boundingShapesMode) {
            for (i = 0; i < l; i++) {
                instances[i].renderBoundingShapes();
            }
        }

        if (context.groundMode > 1) {
            renderGround(context.groundMode);
        }
        
        viewerObject.dispatchEvent("render");
    }
  
    function renderColor() {
        var instances = context.instanceArray;

        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
        ctx.disable(ctx.CULL_FACE);

        for (var i = 0, l = instances.length; i < l; i++) {
            instances[i].renderColor();
        }

        ctx.enable(ctx.CULL_FACE);
    }
    
    var textureRect = gl.createRect(0, 0, 0, 1, 1, 2);
    function renderTexture(texture, location, scale, isScreen) {
        var shader = gl.bindShader("texture");
        
        if (isScreen) {
            gl.setOrtho(0, canvas.width, 0, canvas.height, -10000, 10000);
        } else {
            gl.setProjectionMatrix(camera.projection);
            gl.setViewMatrix(camera.view);
        }
        
        gl.pushMatrix();
        
         if (isScreen) {
            gl.loadIdentity();
         }
         
        gl.translate(location);
        gl.scale(scale);
        ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
        gl.popMatrix();
        
        gl.bindTexture(texture, 0);
        
        ctx.depthMask(0);
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.ONE, ctx.ONE);
        
        textureRect.render(shader);
        
        ctx.depthMask(1);
        ctx.disable(ctx.BLEND);
    }
    
    function loadModel(src, fileType, pathSolver, isFromMemory) {
        var modelMap = context.modelMap;

        if (!modelMap.has(src)) {
            var model = new AsyncModel(src, fileType, pathSolver, isFromMemory, context);

            modelMap.set(src, model);
            context.modelArray.push(model);

            model.addEventListener("loadstart", dispatchEvent);
            model.addEventListener("load", dispatchEvent);
            model.addEventListener("loadend", dispatchEvent);
            model.addEventListener("error", dispatchEvent);
            model.addEventListener("progress", dispatchEvent);
            model.addEventListener("abort", dispatchEvent);
            model.addEventListener("remove", dispatchEvent);

            model.loadstart();
        }

        return modelMap.get(src);
    }
  
    function loadInstance(src, isInternal) {
        var instance = new AsyncModelInstance(context.modelMap.get(src), isInternal);

        context.instanceArray.push(instance);
        context.instanceMap.set(instance.id, instance);

        instance.addEventListener("loadstart", dispatchEvent);
        instance.addEventListener("load", dispatchEvent);
        instance.addEventListener("loadend", dispatchEvent);
        instance.addEventListener("error", dispatchEvent);
        instance.addEventListener("remove", dispatchEvent);

        instance.loadstart();

        return instance;
    }

    function loadTexture(src, fileType, isFromMemory, options) {
        var textureMap = context.textureMap;

        if (!textureMap.has(src)) {
            var texture = gl.loadTexture(src, fileType, context.handlers.texture.get(fileType), isFromMemory, options);

            textureMap.set(src, texture);
            context.textureArray.push(texture);

            texture.addEventListener("loadstart", dispatchEvent);
            texture.addEventListener("load", dispatchEvent);
            texture.addEventListener("loadend", dispatchEvent);
            texture.addEventListener("error", dispatchEvent);
            texture.addEventListener("progress", dispatchEvent);
            texture.addEventListener("abort", dispatchEvent);
            texture.addEventListener("remove", dispatchEvent);

            texture.loadstart();
        }

        return textureMap.get(src);
    }
  
    // Load a model or texture from an absolute url, with an optional texture map, and an optional hidden parameter
    function loadResource(source, pathSolver, fileType, isFromMemory, isInternal) {
        if (context.handlers.supported.has(fileType)) {
            if (context.handlers.model.has(fileType)) {
                loadModel(source, fileType, pathSolver, isFromMemory);

                return loadInstance(source, isInternal);
            } else {
                return loadTexture(source, fileType, isFromMemory, {});
            }
        } else {
            viewerObject.dispatchEvent({type: "error", error: "MissingHandler" + fileType})
        }
    }

    // Used by Mdx.ParticleEmitter since they don't need to be automatically updated and rendered
    function loadInternalResource(source, pathSolver) {
        return loadResource(source, pathSolver, ".mdx", false, true);
    }
  
    function removeInstance(instance, removingModel) {
        var instanceArray = context.instanceArray,
            i,
            l;

        // Remove from the instance array
        for (i = 0, l = instanceArray.length; i < l; i++) {
            if (instanceArray[i] === instance) {
                instanceArray.splice(i, 1);
                break;
            }
        }

        // Remove from the model-instance map
        context.instanceMap.delete(instance.id);

        // Don't remove from the model if the model itself is removeed
        if (!removingModel) {
            var instances = instance.asyncModel.instances;

            // Remove from the instances list of the owning model
            for (i = 0, l = instances.length; i < l; i++) {
                if (instances[i] === instance) {
                    instances.splice(i, 1);
                }
            }
        }

        instance.dispatchEvent("remove");
    }
  
    function removeModel(model) {
        var modelArray = context.modelArray,
            instances = model.instances,
            i,
            l;

        // If the model was still in the middle of loading, abort the XHR request.
        model.abort();
        
        // Remove all instances owned by this model
        for (i = 0, l = instances.length; i < l; i++) {
            removeInstance(instances[i], true);
        }

        // Remove from the model array
        for (i = 0, l = modelArray.length; i < l; i++) {
            if (modelArray[i] === model) {
                modelArray.splice(i, 1);
                break;
            }
        }

        // Remove from the model-instance map
        context.modelMap.delete(model.source);
        
        model.dispatchEvent("remove");
    }

    function removeTexture(texture) {
        var textureArray = context.textureArray;

        for (var i = 0, l = textureArray.length; i < l; i++) {
            if (textureArray[i] === texture) {
                textureArray.splice(i, 1);
                break;
            }
        }

        context.textureMap.delete(texture.source);

        gl.removeTexture(texture);  
    }
  
    function identityPaths(path) {
        return path;
    }

  // ---------------------
  // Model loading API
  // ---------------------
  
    function loadSingle(src, pathSolver, type) {
        var fileType;

        if (typeof src === "string" && !type) {
            src = pathSolver(src);
        }

        var isFromMemory;

        if (src.type === "model" || src.type === "instance") {
            pathSolver = src.pathSolver;
            fileType = src.fileType;
            isFromMemory = src.isFromMemory;
            src = src.source;
        }

        // If using a JS object as a texture source, it is always an in-memory load with the type being png, and the path solver isn't required
        if (src instanceof HTMLImageElement || src instanceof HTMLVideoElement || src instanceof HTMLCanvasElement || src instanceof ImageData) {
            return loadResource(src, null, ".png", true);
        }

        if (typeof type === "string") {
            fileType = type;
            isFromMemory = true;
        } else if (typeof src === "string") {
            fileType = fileTypeFromPath(src);
        }

        return loadResource(src, pathSolver, fileType, isFromMemory);
    }

    function load(src, pathSolver, type) {
        if (typeof pathSolver !== "function") {
            pathSolver = identityPaths;
        }

        if (Array.isArray(src)) {
            var resources = [];

            if (Array.isArray(type)) {
                for (var i = 0, l = src.length; i < l; i++) {
                    resources[i] = loadSingle(src[i], pathSolver, type[i]);
                }
            } else {
                for (var i = 0, l = src.length; i < l; i++) {
                    resources[i] = loadSingle(src[i], pathSolver, type);
                }
            }
            
            return resources;
        } else {
            return loadSingle(src, pathSolver, type);
        }
    }

    // src must be one of AsyncModel or AsyncModelInstance or AsyncTexture.
    function remove(src) {
        if (src && src.type) {
            var type = src.type;
            
            if (type === "model") {
                removeModel(src);
            } else if (type === "instance") {
                removeInstance(src);
            } else if (type === "texture") {
                removeTexture(src);
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
        var modelArray = context.modelArray,
            textureArray = context.textureArray,
            i,
            l;
        
        for (i = 0, l = modelArray.length; i < l; i++) {
            removeModel(modelArray[0]);
        }

        for (i = 0, l = textureArray.length; i < l; i++) {
            removeTexture(textureArray[0]);
        }
        
        Array.clear(modelArray);
        Array.clear(context.instanceArray);
        Array.clear(textureArray);
        context.modelMap.clear();
        context.instanceMap.clear();
        context.textureMap.clear();
    }
    
    function loadingEnded() {
        return context.objectsNotReady === 0;
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
                mixin(object.model.getTextureMap(), textureMap);
            }
            
            mixin(object.getTextureMap(), textureMap);
            
            keys = Object.keys(textureMap);
            total = keys.length;
            
            // If this object has no dependencies, just return 1.
            // See DNC models. They have no geosets, textures, nodes, particle emitters, ...
            // Not sure what their use is.
            if (total === 0) {
                return 1;
            }
            
            for (i = 0, l = total; i < l; i++) {
                if (gl.textureLoaded(textureMap[keys[i]])) {
                    loaded += 1;
                }
            }
            
            return loaded / total;
        }
    }
    
    function getContext() {
        return context;
    }
    
  // -------------------
  // General settings
  // -------------------
  
    function setWorldTextures(ground, sky, water) {
        context.worldTextures.ground = ground;
        context.worldTextures.sky = sky;
        context.worldTextures.water = water;
    }

  /**
    * Sets the animation speed.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} ratio The speed.
    */
    function setAnimationSpeed(speed) {
        speed = Math.max(speed, 0);

        context.frameTimeS = speed / 60;
        context.frameTimeMS = context.frameTimeS * 1000;
    }
  
  /**
    * Gets the animation speed.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {number} The speed.
    */
    function getAnimationSpeed() {
        return context.frameTimeS * 60;
    }

    function setSkyMode(mode) {
        context.skyMode = mode;
    }
    
    function getSkyMode() {
        return context.skyMode;
    }
    
    function setGroundMode(mode) {
        context.groundMode = mode;
    }
    
    function getGroundMode() {
        return context.groundMode;
    }
    
  /**
    * Sets the ground size.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} size The ground size.
    */
    function setGroundSize(size) {
        context.groundSize = size;
        context.ground.resize(size, size);
    }
  
  /**
    * Gets the ground size.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {number} The ground size.
    */
    function getGroundSize() {
        return context.groundSize;
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
    function selectInstance(coordinate) {
        var x = Math.floor(coordinate[0] / (canvas.clientWidth / colorFramebufferSize)),
            y = Math.floor((canvas.clientHeight - coordinate[1]) / (canvas.clientHeight / colorFramebufferSize));
        
        ctx.viewport(0, 0, colorFramebufferSize, colorFramebufferSize);
        
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, colorFramebuffer);
        
        renderColor();
        ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, colorPixel);

        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        
        ctx.viewport(0, 0, canvas.width, canvas.height);
        
        var id = encodeFloat3(colorPixel[0], colorPixel[1], colorPixel[2]);

        return context.instanceMap[id];
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
    function registerModelHandler(fileType, modelHandler, modelInstanceHandler, isAscii) {
        context.handlers.model.set(fileType, [modelHandler, !isAscii]);
        context.handlers.instance.set(fileType, modelInstanceHandler);
        context.handlers.supported.set(fileType, true);
    }
  
  /**
    * Registers an external handler for an unsupported texture type.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} fileType The file format the handler handles.
    * @param {function} textureHandler
    */
    function registerTextureHandler(fileType, textureHandler, isAscii) {
        context.handlers.texture.set(fileType, [textureHandler, !isAscii]);
        context.handlers.supported.set(fileType, true);
    }

    // Register by default native browser supported image types
    registerTextureHandler(".png", NativeTexture);
    registerTextureHandler(".jpg", NativeTexture);
    registerTextureHandler(".gif", NativeTexture);

    var API = {
        // Resource API
        load: load,
        remove: remove,
        clear: clear,
        loadingEnded: loadingEnded,
        dependenciesLoaded: dependenciesLoaded,
        // General settings
        setWorldTextures: setWorldTextures,
        setAnimationSpeed: setAnimationSpeed,
        getAnimationSpeed: getAnimationSpeed,
        setSkyMode: setSkyMode,
        getSkyMode: getSkyMode,
        setGroundMode: setGroundMode,
        getGroundMode: getGroundMode,
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
        // Misc
        selectInstance: selectInstance,
        resetViewport: resetViewport,
        //saveScene: saveScene,
        //loadScene: loadScene,
        getContext: getContext,
        // Extending
        registerModelHandler: registerModelHandler,
        registerTextureHandler: registerTextureHandler,
        // Experiemental
        renderTexture: renderTexture
    };

    // The main loop of the viewer
    (function step() {
        update();
        render();

        requestAnimationFrame(step);
    }());
        
    return mixin(API, viewerObject);
};
