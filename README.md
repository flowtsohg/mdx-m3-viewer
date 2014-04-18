mdx-m3-viewer
=============

A WebGL viewer for MDX and M3 files used by the games Warcraft 3 and Starcraft 2 respectively.

Running compiler.rb creates a standalone minified JavaScript file that can be included to any HTML page.
To minify the GLSL shaders, use [glsl-minifier](https://github.com/flowtsohg/glsl-minifier).
To minify the resulting JavaScript, use the [Google Closure compiler](https://developers.google.com/closure/compiler/).
Both options can be disabled or enabled in compiler.rb.

Note: you must run compiler.rb to get a working file, since there are broken files that must be concatenated to form valid JavaScript files (look at before.js and after.js files to understand what I mean).

A live version can be seen on [Hiveworkshop](http://www.hiveworkshop.com) for which this viewer was made, here are two examples:
* [Warcraft 3's Azura Dragon](http://www.hiveworkshop.com/model_viewer/?mpq=Units/Creeps/AzureDragon/AzureDragon.mdx)
* [Starcraft 2's Baneling](http://www.hiveworkshop.com/model_viewer/?mpq=Assets/units/zerg/baneling/baneling.m3)

Note: these examples are still using a very old version of this viewer, I will update the version on the Hiveworkshop soon, hopefully.

------------------------

#### Usage

`new ModelViewer(canvas, urls, onmessage, debugMode)`

* `canvas` - A \<canvas> element. Required.
* `urls` - An object containing methods that return proper urls to download files from. More on this below. Required.
* `onmessage` - A function callback. Gets messages from the viewer. Optional.
* `debugMode` - If true, the viewer will log the Parser and Model structures. Optional.

`urls` is an object that is used to retrieve urls for certain types of model and texture paths. It should have the following methods:

* `header(id)` - Returns the path for a metadata header about a resource thread given its ID. Specific for the Hiveworkshop.
* `mpqFile(path)` - Returns a path for a file in any of the Warcraft 3 or Starcraft 2 MPQs.

If the client has the requierments to run the viewer, the API will be returned, otherwise, null will be returned, and an error message will be dispatched to onmessage.

The API of the viewer is as follows:

* `loadResource(source)` - Load a resource from a given source. The source can be an absolute path to a MDX/M3/BLP/DDS/PNG file, a path to a MDX/M3/BLP/DDS/TGA file in any of the Warcraft 3 and Starcraft 2 MPQs, or a resource thread ID used by the Hiveworkshop. If loading from a resource thread, every model and texture in the resource thread will be loaded.
* `setVisibility(objectId, b)` - Shows or hides an instance.
* `getVisibility(objectId)` - Get the visibility status of an instance.
* `setLocation(objectId, v)` - Set the location of an instance.
* `move(objectId, v)` - Move an instance.
* `getLocation(objectId)` - Get the location of an instance.
* `setRotation(objectId, q)` - Set the rotation of an instance.
* `rotate(objectId, q)` - Rotate an instance.
* `getRotation(objectId)` - Get the rotation of an instance.
* `setScale(objectId, n)` - Set the scale of an instance.
* `scale(objectId, n)` - Scale an instance.
* `getScale(objectId)` - Get the scale of an instance.
* `setParent(objectId, parentId, attachmentId)` - Set the parent of an instance to another instance, with an optional attachment point owned by that parent.
* `getParent(objectId)` - Get the parent of an instance as an array. The first index is the parent ID, the second is the attachment ID.
* `setTeamColor(objectId, teamId)` - Set the team color used by an instance.
* `getTeamColor(objectId)` - Get the team color of an instance.
* `overrideTexture(objectId, oldPath, newPath)` - Override a texture of an instance or a model with another texture. If objectId is an instance, overrides the texture locally just for that instance. If objectId is a model, it overrides the texture for the model, which affects all instances that don't explicitly override this texture.
* `getTextureMap(objectId)` - Get the texture map of an instance or model.
* `setSequence(objectId, sequenceId)` - Set the sequence of an instance.
* `stopSequence(objectId)` - Stop the sequence of an instance. Equivalent to setSequence with sequence ID -1.
* `getSequence(objectId)` - Get the current sequence of an instance.
* `setSequenceLoopMode(objectId, mode)` - Sets the sequence loop mode of an instance. Possible values are 0 for default, 1 for never, and 2 for always.
* `getSequenceLoopMode(objectId)` - Get the sequence loop mode of an instance.
* `getInfo(objectId)` - Get an object containing all the information of an instance or model. This is equivalent to calling all the different getters together.
* `getModel(source)` - Return the model ID that an instance or path points to. Returns null if given a path that no model was loaded with. Returns null if given an invalid object ID. Returns source if it is a model object ID.
* `getSource(objectId)` - Get the source an object was created with. If the object is an instance, returns the source that made the model this instance points to.
* `getSequences(objectId)` - Get a list of the sequences owned by an object. Proxies to the owning model if the given object is an instance. Returns null if the object ID is invalid, or if the model didn't finish loading.
* `getAttachments(objectId)` - Get a list of the attachment points owned by an object. Proxies to the owning model if the given object is an instance. Returns null if the object ID is invalid, or if the model didn't finish loading.
* `getCameras(objectId)` - Get a list of the cameras owned by an object. Proxies to the owning model if the given object is an instance. Returns null if the object ID is invalid, or if the model didn't finish loading.
* `setWorldMode(mode)` - Set the drawn world. Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water.
* `getWorldMode(mode)` - Get the world mode.
* `setBoundingShapesMode(b)` - Shows or hides the bounding shapes for all instances.
* `getBoundingShapesMode()` - Get the bounding shapes mode.
* `setTeamColorsMode(b)` - Shows or hides team colors for all instances.
* `getTeamColorsMode()` - Get the team colors mode.
* `setShader(id)` - Set the shader to be used for Starcraft 2 models. Possible values are 0 for `standard`, 1 for `diffuse`, 2 for `normals`, 3 for `normal map`, 4 for `specular map`, 5 for `specular map + normal map`, 6 for `emissive`, 7 for `unshaded`, 8 for `unshaded + normal map`, and finally 9 for `decal`.
* `getShader()` - Get the shader used for Starcraft 2 models.
* `panCamera(x, y)` - Pan the camera on the x and y axes.
* `rotateCamera(x, y)` - Rotate the camera on the x and y axes.
* `zoomCamera(x)` - Zoom the camera by a factor.
* `resetCamera()` - Reset the camera back to the initial state.
* `resetCamera()` - Reset the camera back to the initial state.
* `saveScene()` - Save the scene as a string
* `loadScene(scene)` - Load a scene from a previously saved string.

------------------------

Models and textures can send multiple messages in their life span - one when they begin to load, possibly multiple messages as their loading progresses, one if they loaded successfuly, and one if an error occured.
Instances send a single event when they get loaded.
Use the `onmessage` callback to keep track of everything.
The messages are JavaScript objects of the form:

`{type: type, objectType: objectType, source: source [, id: id, error: error, progress: progress])`.

The type can be one of:
* `loadstart` - a model or a texture started loading.
* `progress` - to keep track of the loading progress of a model or texture. In this case the `progress` value will be a value in the range `[0, 1]`.
* `load` - a model, texture, or instance loaded successfully. If the object is a model or instance, the `id` value will be set.
* `error` - an error occured when loading a texture or a model, or an error occured with the WebGL context. In this case, the `error` value will contain a short string that will tell what the error is.

The `objectType` value can be `model`, `texture`, `instance`, or for WebGL errors, `webglcontext` and `shader`.
The `source` value is the source string that generated the object (an url or name).
