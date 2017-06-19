/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserCamera} camera
 */
function MdxCamera(model, camera) {
    mix(this, camera);

    this.sd = new MdxSdContainer(model, camera.tracks);
}

MdxCamera.prototype = {
    getPositionTranslation(instance) {
        return this.sd.getValue("KCTR", instance, this.position);
    },

    getTargetTranslation(instance) {
        return this.sd.getValue("KTTR", instance, this.targetPosition);
    },

    getRotation(instance) {
        return this.sd.getValue("KCRL", instance, 0);
    }
};
