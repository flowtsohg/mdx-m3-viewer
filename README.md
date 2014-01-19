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
* [Starcraft 2's Baneling](http://www.hiveworkshop.com/model_viewer/?mpq=Assets/buildings/zerg/baneling/baneling.m3)

------------------------

#### Usage

`new Viewer(args)`

args is an Object with the following properties:

* `canvas` - A \<canvas> element. Required.
* `onprogress` - A function callback. Progress messages will be sent to it. Optional.
* `onload` - A function callback. Called if everything went ok, and the model was loaded successfully. Optional.
* `onerror` - A function callback. Called if there was an error somewhere. Optional.
* `modelId` - The model ID. Used by the Hiveworkshop.
* `modelPath` - A path to a MDX or M3 file to use.
* `mpqPath` - A path to a MDX or M3 file in the Warcraft 3 / Starcraft 2 MPQs. Used by the Hiveworkshop.
* `debugMode` - If true, the viewer will log the Parser and Model structures. Optional.
  
One of modelId / modelPath / mpqPath has to be defined.
If more than one is defined, the order of preference is modelPath > mpqPath > modelId.

The API of the viewer is as follows:

* `getCameras()` - Returns the cameras the object owns, or an empty array if there are no cameras.
* `getCamera()` - Returns the index of the currently selected camera, or -1 if there is no selected camera.
* `setCamera(index)` - Sets the selected camera to index. -1 to have no camera selected.
* `resetCamera()` - Resets the selected camera to -1 and the rotation, zoom and movement.
* `getAnimations()` - Returns a list of the model animations, or an empty array if there are no animations.
* `playAnimation(index)` - Selects the index'th animation to play.
* `stopAnimation()` - Same as playAnimation(0).
* `setAnimationSpeed(speed)` - Selects the animation speed. 1 for default, 2 for double, 0.5 for half, and so on.
* `setLoopingMode(mode)` - Sets the animation looping mode. 0 for default, 1 for never, 2 for always.
* `setTeamColor(index)` - Sets the team color of the index'th player using Warcraft 3 team colors.
* `setWorld(mode)` - Sets the world mode. 0 for none, 1 for sky, 2 for ground, 3 for water.
* `showLights(mode)` - Sets the light mode. Not implemented yet.
* `showShapes(mode)` - Sets the collision shapes mode. True to show them, false to not.
* `resize(x, y)` - Resize the context viewport.
* `move(x, y)` - Move the model around.
* `zoom(x)` - Zoom by x. 1 does nothing, 2 makes everything twice the size, and so on.
* `rotate(x, y)` - Rotate by x and y on their respective axes.

Note that the API functions don't do anything until the model is loaded. For setup, use the onload callback.

To show in-game textures (or models with mpqPath) properly, you must provide a link that can access the files of the Warcraft 3 and Starcraft 2 MPQ.
Simply change the url of the mpqFile function in [url.js](https://github.com/flowtsohg/mdx-m3-viewer/blob/master/src/url.js).
