mdx-m3-viewer
=============

Originally a simple model viewer used to render MDX and M3 models, used by the games Warcraft 3 and Starcraft 2 respectively. 
Nowadays it is more of a general model viewer, that can handle any format the client can supply a handler for.
Built-in handlers exist for the following formats:
* MDX (Warcraft 3 model): extensive support, almost everything should work.
* M3 (Starcraft 2 model): partial support, file format not quite reverse engineered yet.
* W3M/W3X (Warcraft 3 map): partial support, will grow in future.
* BLP1 (Warcraft 3 texture): extensive support, almost everything should work.
* MPQ1 (Warcraft 3 archive): partial support, only libzip support.
* TGA (image): partial support, only simple 24bit images.
* SLK (table data): partial support, but will probably keep working.
* DDS (compressed texture, used by Starcraft 2): partial support, should work for every Starcraft 2 texture.
* PNG/JPG/GIF: supported as a wrapper around native Image objects.
* GEO (my own simple geometry format used for simple shapes): supported, note that this is solely a run-time handler.

------------------------

Every model resource is actually composed of 4 different types of objects:
* Model - this is the main object, here the file is parsed, and all of the heavy weight data exists (vertices, animation data, etc.).
* Model View - this is a very light weight object that is used to have multiple "views" of the same model. This allows to override specific things in the model, per view. For example, overriding textures, to have two versions of the same model.
* Model Instance - this is an instance of the model, and thus an actual entity in the scene. You can have any amount of instances of a single model (or rather, a single model view).
* Bucket - model instances are put into buckets, and this is where shared instance data exists (e.g. a shared bone texture). Buckets are mainly used for instanced rendering.

Model View, Model Instance, and Bucket, are all optional, and have generic implementations, if you don't specify anything.

Finally, beside models, there are also:
* Texture - a texture.
* GenericFile - if a handler supports some generic file that isn't a model or a texture (e.g. SLK).

------------------------

#### Usage

```javascript
let viewer = new ModelViewer(canvas)
```

If the client doesn't have the requierments to run the viewer, an exception will be thrown.

------------------------

Resources (including the viewer) can send events in their life span, very similar to those of native JavaScript objects.
Use the EventTarget API:

```
resource.addEventListener(type, listener)
resource.removeEventListener(type, listener)
resource.dispatchEvent(event)
```

Note that attaching a "loadstart" listener to a resource that is not the viewer is pointless, since the listener is registered after the resource started loading.
To properly catch loadstart events, attach a listener to the viewer.

The type can be one of:
* `render` - called every frame after rendering is done.
* `loadstart` - a resource started loading.
* `progress` - progress updates for loads. The relevant progress properties will be set (loaded, total, lengthComputable).
* `load` - a resource finished loading.
* `error` - an error occured when loading a resource. In this case, the `error` value will contain a short string that will tell what the error is.
* `loadend` - sent when a resource finishes loading, either because of an error, or because it loaded successfully.
* `delete` - a resource was deleted.

The target property is set to the object that the event is related to. In the case of the render event, this is the viewer itself.

------------------------

#### Adding Handlers

A handler is a simple JavaScript object, with some properties that define what file format(s) it supports, whether it's a binary file or ASCII, and the implementation objects  that will be used.

Upon creation, the model viewer object supports no handlers.
The client can choose which handlers it cares about, and register only those (and thus only include them in the final source).
For example, to support Warcraft 3 models, the client must include all of the source code of the Mdx handler, and register it at run-time:

`viewer.addHandler(Mdx);`

Also, in this specific case, note that the Mdx handler itself adds the Blp handler, meaning you also need all of the Blp handler source code.

------------------------

#### Getting started

The examples directory has an example with partially working OBJ model and BMP texture handlers, I highly suggest looking at it first.

Probably the easiest way to get it running is by downloading Python.
Once you have it, run its built-in HTTP server from the main viewer directory.

Python 2.x: python -m SimpleHTTPServer 80
Python 3.x: python -m http.server 80

Next, open your browser, and go to `127.0.0.1` (aka localhost).
