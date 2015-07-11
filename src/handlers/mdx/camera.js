Mdx.Camera = function (camera, model) {
    this.name = camera.name;
    this.position = camera.position;
    this.fieldOfView = camera.fieldOfView;
    this.farClippingPlane = camera.farClippingPlane;
    this.nearClippingPlane = camera.nearClippingPlane;
    this.targetPosition = camera.targetPosition;
    this.sd = new Mdx.SDContainer(camera.tracks, model);
};

Mdx.Camera.prototype = {
    getPositionTranslation: function (sequence, frame, counter) {
        return this.sd.getKCTR(sequence, frame, counter, this.position);
    },

    getTargetTranslation: function (sequence, frame, counter) {
        return this.sd.getKTTR(sequence, frame, counter, this.targetPosition);
    },

    getRotation: function (sequence, frame, counter) {
        return this.sd.getKCRL(sequence, frame, counter, 0);
    }
};
