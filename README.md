mdx-m3-viewer
=============

A WebGL model viewer. Meant to view MDX and M3 models used by the games Warcraft 3 and Starcraft 2 respectively, but it can be [extended](#extending).

Running compiler.rb creates a standalone minified JavaScript file that can be included to any HTML page.
To minify the GLSL shaders, use [glsl-minifier](https://github.com/flowtsohg/glsl-minifier).
To minify the resulting JavaScript, use the [Google Closure compiler](https://developers.google.com/closure/compiler/).
Both options can be disabled or enabled in compiler.rb.

A live version can be seen on [Hiveworkshop](http://www.hiveworkshop.com) for which this viewer was made, here are two examples:
* [Warcraft 3's Azura Dragon](http://viewer.hiveworkshop.com?q=Units/Creeps/AzureDragon/AzureDragon.mdx)
* [Starcraft 2's Baneling](http://viewer.hiveworkshop.com?q=Assets/units/zerg/baneling/baneling.m3)

------------------------

#### Usage

```javascript
viewer = ModelViewer(canvas, urls, onmessage, debugMode)
```
| Parameter | Description |
| ------------- | ------------- |
| canvas | A \<canvas> element |
| urls | An object containing methods that return proper urls to download files from. More on this below |
| onmessage | A function callback. Gets messages from the viewer. **Optional** |
| debugMode | If true, the viewer will log the Parser and Model structures. **Optional** |

`urls` is an object that is used to retrieve urls for certain types of model and texture paths. It should have the following methods:

| Function | Description |
| ------------- | ------------- |
| `header(id)` | Returns the path for a metadata header about a custom resource. More on this [below](#custom-models) |
| `mpqFile(path)` | Returns a path for a file in any of the Warcraft 3 or Starcraft 2 MPQs |
| `localFile(path)` | Returns a path for a local file. This should point to a directory with the following images: `grass.png`, `water.png`, `bedrock.png`, and `sky.png` |

If the client has the requierments to run the viewer, the API will be returned, otherwise, null will be returned, and an error message will be dispatched to `onmessage` if it exists.

------------------------

Terminology:

| Term | Description |
| ------------- | ------------- |
| Model | Heavy weight object that contains all the vertices, polygon indices, animation data, skeletal structure, and so on |
| Model Instance | Light weight object that contains a shallow skeleton, particle emitters, animation timers, and so on |

You can have many instances per model.
Most of the API doesn't deal with models directly, but rather with instances.

------------------------

#### API

| Function | Description |
| ------------- | ------------- |
| **Resources** | |
| `loadResource(source)` | Load a resource from a given source. The source can be an absolute path to a supported file type, a path to a MDX/M3/BLP/DDS/TGA file in any of the Warcraft 3 and Starcraft 2 MPQs, or a header. If loading from a header, every model and texture in the header will be loaded. |
| `unloadResource(source)` | Unloads a resource. The source can be a string, or a number. If it is a string, it can be the source of a model or a texture. If it is a number, it must be a valid model or instance ID. If a model is removed, all the instances owned by it will be removed too. |
| **Visibility** | |
| `setVisibility(objectId, b)` | Shows or hides an instance. |
| `getVisibility(objectId)` | Get the visibility status of an instance. |
| `setMeshVisibility(objectId, meshId, b)` | Set the visibility of a mesh in an instance. |
| `getMeshVisibility(objectId, meshId)` | Get the visibility of a mesh in an instance. |
| **Transformations** | |
| `setLocation(objectId, v)` | Set the location of an instance. |
| `move(objectId, v)` | Move an instance. |
| `getLocation(objectId)` | Get the location of an instance. |
| `setRotationQuat(objectId, q)` | Set the rotation of an instance to a quaternion. |
| `rotateQuat(objectId, q)` | Rotate an instance with a quaternion. |
| `getRotationQuat(objectId)` | Get the rotation of an instance as a quaternion. |
| `setRotation(objectId, v)` | Set the rotation of an instance with a yaw-pitch-roll vector. |
| `rotate(objectId, v)` | Rotate an instance with a yaw-pitch-roll vector. |
| `getRotation(objectId)` | Get the rotation of an instance as a yaw-pitch-roll vector. |
| `setScale(objectId, n)` | Set the scale of an instance. |
| `scale(objectId, n)` | Scale an instance. |
| `getScale(objectId)` | Get the scale of an instance. |
| `setParent(objectId, parentId, attachmentId)` | Set the parent of an instance to another instance, with an optional attachment point owned by that parent. |
| `getParent(objectId)` | Get the parent of an instance as an array. The first index is the parent ID, the second is the attachment ID. |
| **Textures and team colors** | |
| `setTeamColor(objectId, teamId)` | Set the team color used by an instance. |
| `getTeamColor(objectId)` | Get the team color of an instance. |
| `overrideTexture(objectId, oldPath, newPath)` | Override a texture of an instance or a model with another texture. If objectId is an instance, overrides the texture locally just for that instance. If objectId is a model, it overrides the texture for the model, which affects all instances that don't explicitly override this texture. |
| `getTextureMap(objectId)` | Get the texture map of an instance or model. |
| **Sequences** | |
| `setSequence(objectId, sequenceId)` | Set the sequence of an instance. |
| `stopSequence(objectId)` | Stop the sequence of an instance. Equivalent to setSequence with sequence ID -1. |
| `getSequence(objectId)` | Get the current sequence of an instance. |
| `setSequenceLoopMode(objectId, mode)` | Sets the sequence loop mode of an instance. Possible values are 0 for default, 1 for never, and 2 for always. |
| `getSequenceLoopMode(objectId)` | Get the sequence loop mode of an instance. |
| **Information getters** | |
| `getInfo(objectId)` | Get an object containing all the information of an instance or model. This is equivalent to calling all the different getters together. |
| `getModel(source)` | Return the model ID that an instance or path points to. Returns null if given a path that no model was loaded with. Returns null if given an invalid object ID. Returns source if it is a model object ID. |
| `getSource(objectId)` | Get the source an object was created with. If the object is an instance, returns the source that made the model this instance points to. |
| `getSequences(objectId)` | Get a list of the sequences owned by an object. Proxies to the owning model if the given object is an instance. Returns null if the object ID is invalid, or if the model didn't finish loading. |
| `getAttachments(objectId)` | Get a list of the attachment points owned by an object. Proxies to the owning model if the given object is an instance. Returns null if the object ID is invalid, or if the model didn't finish loading. |
| `getCameras(objectId)` | Get a list of the cameras owned by an object. Proxies to the owning model if the given object is an instance. Returns null if the object ID is invalid, or if the model didn't finish loading. |
| `getBoundingShapes(objectId)` | Get the list of bounding shapes owned by an object. Proxies to the owning model if the given object is an instance. Returns null if the object ID is invalid, or if the model didn't finish loading. |
| `getMeshCount(objectId)` | Get the number of meshes an object has. Proxies to the owning model if the given object is an instance. |
| `getInstances(objectId)` | Get the IDs of all the instances owned by a model. |
| **Global settings** | |
| `setAnimationSpeed(n)` | Set the animation speed. |
| `getAnimationSpeed()` | Get the animation speed. |
| `setWorldMode(mode)` | Set the drawn world. Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water. |
| `getWorldMode(mode)` | Get the world mode. |
| `setGroundSize(size)` | Set the ground size. |
| `getGroundSize()` | Get the ground size. |
| `setMeshesMode(b)` | Shows or hides all of the meshes. |
| `getMeshesMode()` | Get the meshes render mode. |
| `setEmittersMode(b)` | Shows or hides all of the emitters. |
| `getEmittersMode()` | Get the emitters render mode. |
| `setBoundingShapesMode(b)` | Shows or hides the bounding shapes for all instances. |
| `getBoundingShapesMode()` | Get the bounding shapes mode. |
| `setTeamColorsMode(b)` | Shows or hides team colors for all instances. |
| `getTeamColorsMode()` | Get the team colors mode. |
| `setPolygonMode(b)` | Set the polygon render mode. True for filled, false for wireframe. |
| `getPolygonMode()` | Get the polygon render mode. |
| `setShader(id)` | Set the shader to be used. Possible values are 0 for `standard`, 1 for `diffuse`, 2 for `normals`, 3 for `uvs`, 4 for `normal map`, 5 for `specular map`, 6 for `specular map + normal map`, 7 for `emissive`, 8 for `unshaded`, 9 for `unshaded + normal map`, 10 for `decal`, and finally 11 for `white`. Note: only the normals, uvs, and white shaders affect Warcraft 3 models, the rest only affect Starcraft 2 models. |
| `getShader()` | Get the shader used for Starcraft 2 models. |
| `setCamera(objectId, cameraId)` | Set the camera. If either objectId or cameraId is equal to -1, then the free-form camera is used. |
| `getCamera()` | Get the camera. |
| `panCamera(x, y)` | Pan the camera on the x and y axes. |
| `rotateCamera(x, y)` | Rotate the camera on the x and y axes. |
| `zoomCamera(x)` | Zoom the camera by a factor. |
| `resetCamera()` | Reset the camera back to the initial state. |
| `selectInstance(x, y)` | Selects an instance given a screen space coordinate on the canvas. Returns the ID of the selected instance, or -1 if no instance was selected. |
| Scene | |
| `saveScene()` | Save the scene as a string |
| `loadScene(scene)` | Load a scene from a previously saved string. |
| **Extending** | |
| `registerModelHandler(fileType, modelHandler, modelInstanceHandler, binary)` | Used for extending. See the extending section. |
| `registerTextureHandler(fileType, textureHandler)` | Used for extending. See the extending section. |


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
* `unload` - a model, instance, or texture was unloaded.

The `objectType` value can be `model`, `texture`, `header` (for custom models, see below), `instance`, or for WebGL errors, `webgl` and `shader`.
The `source` value is the source string that generated the object (an url or name).

------------------------

#### <a name="custom-models"></a> Loading custom models

The urls.header stub is used to give information about custom models. Given some form of identifier, it should return an url that will point to a JSON object of the following form:

```javascript
{
  "models": [{"url": "url/to/some/model.mdx", "hidden": true/false}, ...],
  "textures": {"path/texture.blp": "real/url/to/texture.blp", ...}
}
```

The `models` object holds objects containing paths to model files, with an optional hidden value. If it is true, the instance created for the model will be hidden by default.

The `textures` object holds a map from texture paths used by the models, to custom textures that the custom models might be using. For example, the Warcraft 3 Azura Dragon uses the path "textures/azuredragon.blp" for its main diffuse texture. If the `textures` object would contain `"textures/azuradragon.blp": "some/other/texture.blp"`, then the path will be overriden for every model in the `models` object before they are loaded.

The original texture paths (the keys in the `textures` object) must all be lower cased, and with forward slashes (Warcraft 3 uses back slashes).

------------------------

#### <a name="extending"></a> Extending

It is possible to extend the viewer with new model and texture formats, also without editing the library itself.
The registerModelHandler, and registerTextureHandler, register a new handler for the given file extension.

The handlers must conform to specific APIs.

##### Model:

| Function | Description |
| -------- | ----------- |
| `Constructor(data, textureMap, context)` | Your constructor |
| `render(instance, context)` | Called for geometry rendering |
| `renderEmitters(instance, context)` | Called for particle emitter rendering |
| `renderBoundingShapes(instance, context)` | Called for bounding shape rendering |
| `renderColor(instance, color, context)` | Called for constant-color rendering. Used for mouse picking |
| `getName()` | Get the model's name |
| `getAttachment(id)` | An attachment node on the model. The attachment must have a getTransformation() method that returns a matrix |
| `getCamera(id)` | Get camera object |
| `overrideTexture(path, override)` | Override a texture defined by the model with another texture |
| `getTextureMap()` | Get the model's texture map |
| `getSequences()` | Get the model's list of sequences |
| `getCameras()` | Get the model's list of cameras |
| `getBoundingShapes()` | Get the model's list of bounding shapes |
| `getAttachments()` | Get the model's list of attachments |
| `getMeshCount()` | Get the number of meshes in the model |
| `ready` | Must be set to true if everything went ok. |

##### ModelInstance:

| Function | Description |
| -------- | ----------- |
| `Constructor(model, textureMap)` | Your constructor |
| `update(worldMatrix, context)` | Called to update the instance. worldMatrix is a matrix transformation that needs to be applied to this instance's root node, if you want it to be transformable by the API |
| `render(context)` | Called to render the instance's geometry |
| `renderEmitters(context)` | Called to render the instance's particle emitters |
| `renderBoundingShapes(context)` | Called to render the instance's bounding shapes |
| `renderColor(color, context)` | Called to render the instance with a constant color |
| `getName()` | Get the name of the instance. Usually proxies to the owning model. |
| `getAttachment(id)` | Get an attachment node on the instance. The attachment must have a getTransformation() method that returns a matrix |
| `overrideTexture(path, override)` | Override a texture in the instance with another texture |
| `getTextureMap()` | Get the instance's texture map |
| `setTeamColor(id)` | Set the instance's team color |
| `setSequence(id)` | Set the instance's sequence |
| `setSequenceLoopMode(id)` | Set the instance's sequence loop mode |
| `getMeshVisibilities()` | Get the instance's mesh visibilities |
| `setMeshVisibility(meshId, b)` | Set the visibility of a mesh for this instance |
| `getMeshVisibility(meshId)` | Get the visibility of a mesh in this instance |

##### Texture:

| Function | Description |
| -------- | ----------- |
| `Constructor(source, data, options, onerror)` | Your constructor. `options` is an object that you can supply when loading a texture |
| `ready` | Must be set to true if everything went ok |
| `id` | A valid WebGL texture ID generated with WebGLRenderingContext.createTexture() |

In addition to the register functions, the viewer also creates global objects that make it easier to setup  the above object-specific APIs.
These objects are `BaseModel`, `BaseModelInstance`.

Since textures have no methods, there is no base object for them.

An example of setting up a new texture handler:
```js
function MyTexture(arrayBuffer, options, onerror, glContext) {
  this.id = glContext.createTexture();
  
  // Parse the buffer and construct the texture...
  
  this.ready = true; // Signal that this texture was parsed successfully. If it isn't set, the texture wont be used.
}

// --------
// Register
// --------

myViewer.registerTextureHandler("myFileType", MyTexture);

```



An example of setting up a new model handler, using BaseModel and BaseModelInstance:
```js

// ------
// Model
// ------

// data can either be a string, or ArrayBuffer, depending on how you registered this handler.
function MyModel(data, textureMap, context) {
  // Sets default values for the default function implementations of BaseModel
  BaseModel.call(textureMap);
  
  this.ready = true; // Signal that this modsel was parsed successfully. If it isn't set, the model wont be used.
}

// Extend BaseModel
MyModel.prototype = Object.create(BaseModel.prototype);

// ---------------
// Model Instance
// ---------------

function MyModelInstance(model, textureMap) {
  // Sets default values for the default function implementations of BaseModelInstance
  BaseModelInstance.call(model, textureMap);
}

// Extend BaseModelInstance
MyModelInstance.prototype = Object.create(BaseModel.BaseModelInstance);

// --------
// Register
// --------

var isBinaryFormat = true/false;
myViewer.registerModelHandler("myFileType", MyModel, MyModelInstance, isBinaryFormat);
```

For a real world example, check the examples folder, where there is a very simple and primitive OBJ handler.
