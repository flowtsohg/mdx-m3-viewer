import BinaryStream from '../../../common/binarystream';

/**
 * A camera.
 */
export default class Camera {
  targetLocation: Float32Array = new Float32Array(3);
  rotation: number = 0;
  angleOfAttack: number = 0;
  distance: number = 0;
  roll: number = 0;
  fieldOfView: number = 0;
  farClippingPlane: number = 0;
  nearClippingPlane: number = 0;
  cinematicName: string = '';

  load(stream: BinaryStream) {
    stream.readFloat32Array(this.targetLocation);
    this.rotation = stream.readFloat32(); // in degrees
    this.angleOfAttack = stream.readFloat32(); // in degrees
    this.distance = stream.readFloat32();
    this.roll = stream.readFloat32();
    this.fieldOfView = stream.readFloat32(); // in degrees
    this.farClippingPlane = stream.readFloat32();
    this.nearClippingPlane = stream.readFloat32(); // probably near clipping plane
    this.cinematicName = stream.readUntilNull();
  }

  save(stream: BinaryStream) {
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

  getByteLength() {
    return 41 + this.cinematicName.length;
  }
}
