mdx-m3-viewer
=============

Originally a simple model viewer used to render MDX and M3 models, used by the games Warcraft 3 and Starcraft 2 respectively. 
Nowadays it is more of a general model viewer, that can handle any format the client can supply a handler for.
Built-in handlers exist for the following formats:
* MDX (Warcraft 3 model): extensive support, almost everything should work.
* M3 (Starcraft 2 model): partial support, file format not quite reverse engineered yet.
* W3M/W3X (Warcraft 3 map): partial support, will grow in future.
* BLP1 (Warcraft 3 texture): extensive support, almost everything should work.
* MPQ1 (Warcraft 3 archive): partial support, only inflate support.
* TGA (image): partial support, only simple 24bit images.
* SLK (table data): partial support, but will probably keep working for Warcraft 3 files.
* DDS (compressed texture, used by Starcraft 2): partial support, should work for every Starcraft 2 texture, and probably for most DDS files in existence (DXT1/3/5).
* PNG/JPG/GIF: supported as a wrapper around Image.
* GEO (my own simple JS format used for simple geometric shapes): supported, note that this is solely a run-time handler.

You can include all of the viewer files in the right order, which is seen in the examples folder.
Another option is to run the given Ruby script `compiler.rb`. This script gives you compilation options if you open it with a text editor, and will result in `viewer.min.js` getting generated, if you tell it to minify. Running it without changes will generate the minified version including all built-in handlers.

------------------------

Every model resource is actually composed of 4 different types of objects:
* Model - this is the main object, here the file is parsed, and all of the heavy weight data exists (vertices, animation data, etc.).
* ModelView - this is a very light weight object that is used to have multiple views of the same model. This allows to override specific things in the model, per view. For example, overriding textures, to have two versions of the same model.
* ModelInstance - this is an instance of the model, and an actual entity in the scene. You can have any amount of instances of a single model (or rather, a single model view).
* Bucket - model instances are put into buckets, and this is where shared instance data exists. Buckets are mainly used for instanced rendering.

ModelView, ModelInstance, and Bucket, are all optional, and have generic implementations, if you don't specify anything.

Finally, beside models, there are also:
* Texture - a texture.
* GenericFile - a file that isn't a model or a texture (e.g. SLK).

------------------------

#### Usage

```javascript
let viewer = new ModelViewer(canvas)

// Add the Mdx handler, which by itself adds the Blp, Slk, and Tga handlers.
// So in the case you want to use the Mdx handler, you will need to include the source for all of the above.
viewer.addHandler(Mdx);
```

If the client doesn't have the WebGL requierments to run the viewer, an exception will be thrown when trying to create it.

So how do you actually load models and other files?
The model viewer uses a system of path solving functions.
That is, you supply a function that takes a source you want to load, such as an url, and you need to return specific results so the viewer knows what to do.
The load function itself looks like this:

```javascript
let resource = viewer.load(src|src[], pathSolver)
```

In other words, you give it either a source, or an array of sources, and the path solver.
If a single source is given, a single resource (a model, texture, or file object) will be returned.
If an array is given, an array will be returned, with the same ordering.

The source here can be anything - a string, an object, a typed array, whatever - it highly depends on your code, and on the path solver.
Generally speaking though, the source will probably be a string containing an url.

The path solver is a function with this signature: `function(src) => [finalSrc, srcExtension, isServerFetch]`.
The argument is the source (or iteratively an array of sources) you gave the load call.
It returns an array with three indices.
The first index is the actual source to load from. Again, this highly depends on your code.
The second index is the extension of the resource you are loading. Generally speaking, this will probably usually be the extension of the source, in the case of urls.
The extension is given in a ".ext" format. That is, a string that contains a dot, followed by the extension.
Finally, isServerFetch is a boolean, and will determine if this is an in-memory load, or an actual server fetch. This will usually be true.

So let's use an example.

Suppose we have the following directory structure for your website:

```
index.html
main.js
Resources
	model.mdx
	texture.blp
```

And suppose we know that `model.mdx` uses the texture `texture.blp`.

Now, let's see how a possible path solver will look (again, there are endless ways to write solvers, it totally depends on you).
I'll make it assume it's getting urls, and automatically append "Resources/" to sources, just so I'll have to type less in load calls.

```javascript
function myPathSolver(path) {
	return ["Resources/" + path, SomeFunctionThatGetsFileExtensions(path), true];
}
```

Now let's try to load it.

```javascript
let model = viewer.load("model.mdx", myPathSolver);
```

This function call results in the following chain of events:

1. myPathSolver is called with `"model.mdx"` and returns `["Resources/model.mdx", ".mdx", true]`.
2. The viewer chooses the correct handler based on the extension - in this case the MDX handler - sees this is a server fetch, and uses the source for the fetch.
3. A new MDX model is created and starts loading (at this point the viewer gets a `loadstart` event from the model).
4. The model is returned.
5. ...time passes until the model finishes loading...
6. The model is parsed and populated. In the case of MDX, this will also cause it to load its textures, in this case `texture.blp`.
7. The model loads `texture.blp` by using its path solver, which returns `["Resources/texture.blp", ".blp", true]`, the viewer gets a `loadstart` event, etc.

The path solver did two jobs here. First of all, it made the load calls shorter by avoiding to type "Resources/". But the real deal, is that it allowes to selectively override sources, and change them in interesting ways.
Generally speaking an identity solver is what you'll need (as in, it returns the source assuming its an url, its extesnion, and true for server fetch), but there are cases where this is not the case, such as loading custom user-made models, handling both in-memory and server-fetches in the same solver (used by the W3X handler), etc.

So, we now have a model, but a model isn't something you can see. What you see in a scene are instances of a model.
Creating instances is as simple as this:

```javascript
let instance = model.addInstance();
```

This instance can be rendered, moved, rotated, scaled, parented to other instances or nodes, play animations, and so on.

A big design part of this viewer is that it tries to allow you to write as linear code as you can.
That is, even though this code heavily relies on asyncronous actions (and not only in server fetches, you'd be surprised), it tries to hide this fact, and make the code feel syncronous to the user.
For example, let's say we want the instance above to play an animation, assuming its model has any.

```javascript
instance.setSequence(0); // first animation, -1 == no animation.
```

This should work, right? You have an instance, and you call its method, nothing special.
Except, this method needs to get animation data from the model, which, if all of this code is put together, is not loaded yet! (even if you run locally, the file fetch will finish after this line).
That isn't to say this line of code will not work - it does! But that's because there's code behind the scenes that handles asyncronous actions.
Generally speaking, whenever you want to set/change something, you will be able to do it with straightforward code that looks syncronous, whether it really is or not behind the scenes.

If you want to get any information from the model, like a list of animations, or textures, then the model obviously needs to exist before.
For this reason, there are two ways to do things when a model finishes loading.
First of all, as the next section explains, every resource uses event dispatching, much like regular asyncronous JS objects (e.g. Image, XMLHttpRequest, and so on).
In addition, every resource has a `whenLoaded(callback)` method that gets `callback` called when it loads, or immediatelty if it was already loaded.
The viewer itself has `whenAllLoaded(resources, callback)`, which is the same, but waits for multiple resources in an array to load.

------------------------

#### Events

Resources (including the viewer) can send events in their life span, very similar to those of native JS objects:

```
resource.addEventListener(type, listener)
resource.removeEventListener(type, listener)
resource.dispatchEvent(event)
```

Note that attaching a `loadstart` listener to a resource that is not the viewer is pointless, since the listener is registered after the resource started loading.
To properly catch loadstart events, attach a listener to the viewer.

The type can be one of:
* `render` - called every frame after rendering is done (this event is only dispatched by the viewer).
* `loadstart` - a resource started loading.
* `progress` - progress updates for loads. The `loaded`, `total`, and `lengthComputable` properties will be set.
* `load` - a resource finished loading.
* `error` - an error occured when loading a resource. The `error` property will be set.
* `loadend` - sent when a resource finishes loading, either because of an error, or because it loaded successfully.
* `delete` - a resource was deleted.

The target property is set to the object that the event is related to. In the case of the render event, this is the viewer itself.

Errors might occur, most of the time because your path solvers aren't correct, but there are other causes.
When a resource gets loaded, the handler can choose to send errors if something goes wrong.
The built-in handlers try to do this in a consistent way.
There are four types of errors:
* UnsupportedFileType - sent by the viewer itself, if you try to load some resource with an unknown extension (did you forget to register the handler?).
* InvalidSource - sent by handlers when they think your source is not valid, such as trying to load a file as Mdx, but it's not really an Mdx file.
* UnsupportedFeature - sent by handlers when the source is valid, but a feature in the format isn't supported, such as DDS textures not supporting encodings that are not DXT1/3/5.
* HttpError - sent by handlers when a server fetch failed.

Together with these error strings (in the `error` property naturally), the handlers can choose to add more information in the `extra` property.
For example, when you get an UnsupportedFileType error because you tried loading an unknown extension, the `extra` property will hold an array, with the first index being the extension you tried to use, and the second one being the source.
Another example - in the formats that have some form of magic number for validation, and upon the handlers getting wrong numbers, the InvalidSource error will be sent, and `extra` will contain "WrongMagicNumber".
For the final example - when an HttpError occurs, `extra` will contain the XMLHttpRequest object of the fetch.
There are only a few errors, and you can choose to respond to them however you want.

------------------------

#### Adding Handlers

A handler is a simple JS object, with some properties that define what file format(s) it supports, whether it's a binary format or ASCII - in case you make server fetches - and the implementation objects that will be used.

Upon creation, the model viewer object supports no handlers.
The client can choose which handlers it cares about, and register only those (and thus only include them in the final source).
For example, to support Warcraft 3 models, the client must include all of the source code of the Mdx handler, and register it at run-time:

`viewer.addHandler(Mdx);`

Also, in this specific case, note that the Mdx handler itself adds the Blp, Slk, and Tga handlers, meaning you need also their source code for Mdx to function.

------------------------

#### Getting started

The examples directory has an example with partially working OBJ model and BMP texture handlers, I highly suggest looking at it first.

Probably the easiest way to get it running is by downloading Python.
Once you have it, run its built-in HTTP server from the main viewer directory.

Python 2.x: python -m SimpleHTTPServer 80

Python 3.x: python -m http.server 80

Next, open your browser, and go to `127.0.0.1/examples/`.
