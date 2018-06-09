/**
 * A camera.
 */
export default class Camera {
  /**
   *
   */
  constructor() {
    /** @member {Float32Array} */
    this.targetLocation = new Float32Array(3);
    /** @member {number} */
    this.rotation = 0;
    /** @member {number} */
    this.angleOfAttack = 0;
    /** @member {number} */
    this.distance = 0;
    /** @member {number} */
    this.roll = 0;
    /** @member {number} */
    this.fieldOfView = 0;
    /** @member {number} */
    this.farClippingPlane = 0;
    /** @member {number} */
    this.nearClippingPlane = 0;
    /** @member {string} */
    this.cinematicName = '';
  }

  /**
   * @param {BinaryStream} stream
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
  }

  /**
   * @param {BinaryStream} stream
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
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 41 + this.cinematicName.length;
  }
}
