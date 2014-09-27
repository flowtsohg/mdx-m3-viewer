// If you don't want to implement custom logic, simply extending from BaseModelInstance is enough.
function OBJModelInstance(model, textureMap) {
    BaseModelInstance.call(this, model, textureMap);
}

OBJModelInstance.prototype = Object.create(BaseModelInstance.prototype);