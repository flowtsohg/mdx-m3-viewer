/**
 * @class This isn't an actual class, but rather something you must implement if you want to use cameras from custom models.
 * @name Camera
 * @property {vec3} position
 * @property {vec3} targetPosition
 */
function DocCamera() {
  
}

/**
 * A texture.
 * 
 * @class This isn't an actual class, but rather something you must implement if you want to implement custom textures.
 * @name Texture
 * @param {ArrayBuffer} arrayBuffer The raw texture data.
 * @param {object} options An object containing options.
 * @param {WebGLRenderingContext} ctx A WebGL context.
 * @param {function} onerror A function that allows to report errors.
 * @param {function} onload A function that allows to manually report a success at parsing.
 * @property {WebGLTexture} id
 * @property {boolean} ready
 */
function DocTexture() {
  
}