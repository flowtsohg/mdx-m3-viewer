function OBJModelInstance() {
    
}

OBJModelInstance.prototype = Object.create(BaseModelInstance.prototype);

OBJModelInstance.prototype.loadstart = function (asyncInstance, reportError, reportLoad) {
    BaseModelInstance.call(this, asyncInstance.asyncModel.model, {});

    reportLoad();
};