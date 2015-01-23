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

------------------------

#### Usage

The API can be seen [here](http://htmlpreview.github.io/?https://raw.githubusercontent.com/flowtsohg/mdx-m3-viewer/master/docs/ModelViewer.html).
Note that the constructor isn't called with the `new` operator.

```javascript
viewer = ModelViewer(canvas, urls, onmessage, debugMode)
```

The `urls` argument must have the following functions in it:

| Function | Description |
| ------------- | ------------- |
| `header(id)` | Returns the path for a metadata header about a custom resource. More on this in the [custom models section](#custom-models) |
| `mpqFile(path)` | Returns a path for a file in any of the Warcraft 3 or Starcraft 2 MPQs |
| `localFile(path)` | Returns a path for a local file. This should point to a directory with the following images: `grass.png`, `water.png`, `bedrock.png`, and `sky.png` |

If the client has the requierments to run the viewer, the API will be returned, otherwise, null will be returned, and an error message will be dispatched to `onmessage` if it exists.

------------------------

Objects can send events in their life span, very similar to those of native JavaScript objects.
Use the `onmessage` callback to keep track of everything.
The messages are JavaScript objects of the form:

`{type: type, target: target [, loaded: loaded, total: total, lengthComputable: lengthComputable, error: error])`.

The type can be one of:
* `loadstart` - an object started loading.
* `progress` - progress updates for loads. The relevant progress properties will be set.
* `load` - an object finished loading.
* `error` - an error occured when loading an object, or an error occured with the WebGL context. In this case, the `error` value will contain a short string that will tell what the error is.
* `loadend` - sent when an object finishes loading, either because of an error, or because it loaded successfully.
* `unload` - an object was unloaded.

The target property is set to the object that the event is related to.

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
  this.id = glContext.createTexture();
  
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
