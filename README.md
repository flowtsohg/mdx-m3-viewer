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

------------------------

#### Usage

`new ModelViewer(canvas, urls, onmessage, debugMode)`

* `canvas` - A \<canvas> element. Required.
* `urls` - An object containing methods that return proper urls to download files form. More on this below. Required.
* `onmessage` - A function callback. Gets messages from the viewer. Optional.
* `debugMode` - If true, the viewer will log the Parser and Model structures. Optional.

`urls` is an object that is used to retreive urls for certain types of model and texture paths. It should have the following methods, unless specified that they are specific to the Hiveworkshop:

* `header(id)` - Returns the path for a metadata header about a model given its ID. Specific for the Hiveworkshop.
* `mpqFile(path)` - Returns a path for a file in any of the Warcraft 3 or Starcraft 2 MPQs.
* `customTexture(id)` - Returns a path for a texture given its ID. Specific for the Hiveworkshop.
* `customModel(id)` - Returns a path for a model given its ID. Specific for the Hiveworkshop.
* `customFile(path)` - Returns an absolute path given a relative path to a model or texture.
Note that the above urls API is going to change in the future to be less cumbersome.

If the client has the requierments to run the viewer, the API will be returned, otherwise, null will be returned, and an error message will be dispatched to onmessage.

The API of the viewer is as follows:

* `loadModel(source)` - Load a model. Source can be an absolute path to a MDX/M3 file, a path to a MDX/M3 file in any of the Warcraft 3 and Starcraft 2 MPQs, or a model ID used by the Hiveworkshop. Returns the ID of the loaded model. Note: if a model was already loaded from the given source, its ID will be returned.
* `loadInstance(source)` - Create a new instance from an existing model or instance, or a path that will be used to load also the model if needed. If source is a string, it can be an absolute path to a MDX/M3 file, a path to a MDX/M3 file in any of the Warcraft 3 and Starcraft 2 MPQs, or a model ID used by the Hiveworkshop. If source is a number, it can be an ID of a model or an instance. Returns null if given an invalid ID, otherwise returns the ID of the created instance. Note: if the source is a string, and a model was already loaded from that string, only a new instance will be created.
* `getModelFromInstance(objectId)` - Return the model ID that an instance points to.
* `getModelFromPath(path)` - Return the model ID that was loaded with the given path.
* `setPosition(objectId, v)` - Set the position of an instance.
* `move(objectId, v)` - Move an instance.
* `setRotation(objectId, v)` - Set the rotation of an instance.
* `rotate(objectId, v)` - Rotate an instance.
* `setScale(objectId, n)` - Set the scale of an instance.
* `scale(objectId, n)` - Scale an instance.
* `setParent(objectId, parentId, attachmentId)` - Set the parent of an instance to another instance, with an optional attachment point owned by that parent.
* `setTeamColor(objectId, teamId)` - Set the team color used by an instance.
* `overrideTexture(objectId, oldPath, newPath)` - Override a texture of an instance or a model with another texture. If objectId is an instance, overrides the texture locally just for that instance. If objectId is a model, it overrides the texture for the model, which affects all instances that don't explicitly override this texture.
* `playAnimation(objectId, sequenceId)` - Set the animation of an instance.
* `stopAnimation(objectId)` - Stop the animation of an instance. Equivalent to playAnimation with animation ID -1.
* `setAnimationLoop(objectId, mode)` - Sets the animation loop mode of an instance. Possible values are 0 for default, 1 for never, and 2 for always.
* `getSequences(objectId)` - Get a list of the sequences owned by a model. Returns null if the object ID is invalid or not a model, or if the model didn't finish loading.
* `getAttachments(objectId)` - Get a list of the attachments owned by a model. Returns null if the object ID is invalid or not a model, or if the model didn't finish loading.
* `setScene(mode)` - Set the drawn scene. Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water.
* `showBoundingShapes(b)` - Shows or hides the bounding shapes on all the instances.
* `panCamera(x, y)` - Pan the camera on the x and y axes.
* `rotateCamera(x, y)` - Rotate the camera on the x and y axes.
* `zoomCamera(x)` - Zoom the camera by a factor.
* `resetCamera()` - Reset the camera back to the initial state.

Note that the Model getter functions  (getSequences, getAttachments) don't do anything until the model is loaded. Use the onmessage callback to track the loading progress of models (and textures).
All of the instance methods work in a synchronious manner from the client's perspective, meaning you can use all of them without waiting for anything to load.

To show in-game textures or models properly, you must provide a link that can access the files of the Warcraft 3 and Starcraft 2 MPQ.
Check out [url.js](https://github.com/flowtsohg/mdx-m3-viewer/blob/master/src/url.js).

When the viewer asks for any image format that is not DDS, the expected response is a PNG image. For DDS, return them as-is.
