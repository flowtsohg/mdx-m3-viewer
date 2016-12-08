function MdxCamera(camera, model) {
    this.name = camera.name;
    this.position = camera.position;
    this.fieldOfView = camera.fieldOfView;
    this.farClippingPlane = camera.farClippingPlane;
    this.nearClippingPlane = camera.nearClippingPlane;
    this.targetPosition = camera.targetPosition;
    this.sd = new MdxSdContainer(camera.tracks, model);
}

MdxCamera.prototype = {
    getPositionTranslation(instance) {
        return this.sd.getKCTRValue(instance, this.position);
    },

    getTargetTranslation(instance) {
        return this.sd.getKTTRValue(instance, this.targetPosition);
    },

    getRotation(instance) {
        return this.sd.getKCRLValue(instance, 0);
    }
};
