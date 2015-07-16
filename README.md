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

Terminology:

| Term | Description |
| ------------- | ------------- |
| Model | Heavy weight object that contains all the vertices, polygon indices, animation data, skeletal structure, and so on |
| Model Instance | Light weight object that contains a shallow skeleton, particle emitters, animation timers, and so on |
| Async <Something> | An object that wraps an actual object implementation, and takes care of the asynchronous job that is loading files |

------------------------

#### Usage

The API can be seen [here](http://htmlpreview.github.io/?https://raw.githubusercontent.com/flowtsohg/mdx-m3-viewer/master/docs/ModelViewer.html).

```javascript
viewer = ModelViewer(canvas, worldPaths)
```

The `worldPaths` argument is a function that takes a single string as an argument. This argument is the local path of a world texture (one of "grass.png", "water.png", and "sky.png"). The function must return the proper path where these images can be found.

If the client has the requierments to run the viewer, the API will be returned, otherwise, an exception will be thrown, describing the error.

------------------------

Objects can send events in their life span, very similar to those of native JavaScript objects.
Use the EventTarget API to register events:

```
viewer.addEventListener(type, listener)
viewer.removeEventListener(type, listener)
```

The type can be one of:
* `render` - called every frame after rendering is done.
* `loadstart` - an object started loading.
* `progress` - progress updates for loads. The relevant progress properties will be set (loaded, total, lengthComputable).
* `load` - an object finished loading.
* `error` - an error occured when loading an object. In this case, the `error` value will contain a short string that will tell what the error is.
* `loadend` - sent when an object finishes loading, either because of an error, or because it loaded successfully.
* `unload` - an object was unloaded.
* `abort` - an object was aborted before finishing to load. This happens if an object is unloaded before its internal HTTP request finished, in which case it is aborted.

The target property is set to the object that the event is related to. In the case of the render event, this is the viewer itself.

------------------------

#### <a name="extending"></a> Extending

It is possible to extend the viewer with new model and texture formats, also without editing the library itself.
The registerModelHandler, and registerTextureHandler, register a new handler for the given file extension.

The handlers must conform to specific APIs.

##### Model:
The same API as [BaseModel](http://htmlpreview.github.io/?https://raw.githubusercontent.com/flowtsohg/mdx-m3-viewer/master/docs/BaseModel.html).

##### ModelInstance:
The same API as [BaseModelInstance](http://htmlpreview.github.io/?https://raw.githubusercontent.com/flowtsohg/mdx-m3-viewer/master/docs/BaseModelInstance.html).

##### Texture:
The same API as [Texture](http://htmlpreview.github.io/?https://raw.githubusercontent.com/flowtsohg/mdx-m3-viewer/master/docs/Texture
.html).

BaseModel and BaseModelInstance are exported as global objects. They can be extended to ease the creation of making handlers.

An example of setting up a new texture handler:
```js
function MyTexture(arrayBuffer, options, ctx, onerror, onload, compressedTextures) {
  this.id = ctx.createTexture();
  
  // Parse the buffer and construct the texture...
  
  this.ready = true; // Signal that this texture was parsed successfully. If it isn't set, the texture wont be used.
  
  onload();
}

// --------
// Register
// --------

myViewer.registerTextureHandler(".myFileType", MyTexture);

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

function MyModelInstance(model, textureMap, context) {
  // Sets default values for the default function implementations of BaseModelInstance
  BaseModelInstance.call(model, textureMap);
}

// Extend BaseModelInstance
MyModelInstance.prototype = Object.create(BaseModel.BaseModelInstance);

// --------
// Register
// --------

var isBinaryFormat = true/false;
myViewer.registerModelHandler(".myFileType", MyModel, MyModelInstance, isBinaryFormat);
```

The examples folder has an example with partially working OBJ model and BMP texture handlers.
