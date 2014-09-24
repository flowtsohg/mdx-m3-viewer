  textureStore["\\1"] = new Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAPSURBVBhXY/gPBmDq/38AU7oL9YH+5D0AAAAASUVORK5CYII=", function(){}, function(){}, function(){});
  
  return {
    setPerspective: setPerspective,
    setOrtho: setOrtho,
    loadIdentity: loadIdentity,
    translate: translate,
    rotate: rotate,
    scale: scale,
    lookAt: lookAt,
    multMat: multMat,
    pushMatrix: pushMatrix,
    popMatrix: popMatrix,
    createShader: createShader,
    shaderStatus: shaderStatus,
    bindShader: bindShader,
    getViewProjectionMatrix: getViewProjectionMatrix,
    getProjectionMatrix: getProjectionMatrix,
    getViewMatrix: getViewMatrix,
    loadTexture: loadTexture,
    textureOptions: textureOptions,
    bindTexture: bindTexture,
    bindWhiteTexture: bindWhiteTexture,
    createRect: createRect,
    createSphere: createSphere,
    createCube: createCube,
    createCylinder: createCylinder,
    ctx: ctx
  };
}