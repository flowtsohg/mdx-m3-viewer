/**
 * @constructor
 * @param {?BinaryStream} stream 
 */
function Camera(stream) {
    this.targetLocation = new Float32Array(3);
    this.rotation = 0;
    this.angleOfAttack = 0;
    this.distance = 0;
    this.roll = 0;
    this.fieldOfView = 0;
    this.farClippingPlane = 0;
    this.nearClippingPlane = 0;
    this.cinematicName = '';

    if (stream) {
        this.load(stream);
    }
}

Camera.prototype = {
    /**
     * @param {?BinaryStream} stream 
     */
    load(stream) {
        this.targetLocation = stream.readFloat32Array(3);
        this.rotation = stream.readFloat32(); // in degrees
        this.angleOfAttack = stream.readFloat32(); // in degrees
        this.distance = stream.readFloat32();
        this.roll = stream.readFloat32();
        this.fieldOfView = stream.readFloat32(); // in degrees
        this.farClippingPlane = stream.readFloat32();
        this.nearClippingPlane = stream.readFloat32(); // probably near clipping plane
        this.cinematicName = stream.readUntilNull();
    },

    /**
     * 
     */
    save(stream) {
        stream.writeFloat32Array(this.targetLocation);
        stream.writeFloat32(this.rotation);
        stream.writeFloat32(this.angleOfAttack);
        stream.writeFloat32(this.distance);
        stream.writeFloat32(this.roll);
        stream.writeFloat32(this.fieldOfView);
        stream.writeFloat32(this.farClippingPlane);
        stream.writeFloat32(this.nearClippingPlane);
        stream.write(`${this.cinematicName}\0`);
    },

    /**
     * @returns {number}
     */
    calcSize() {
        return 41 + this.cinematicName.length;
    }
};

export default Camera;
