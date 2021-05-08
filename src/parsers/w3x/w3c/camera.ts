import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

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
  /**
   * @since Game version 1.32
   */
  localPitch: number = 0;
  /**
   * @since Game version 1.32
   */
  localYaw: number = 0;
  /**
   * @since Game version 1.32
   */
  localRoll: number = 0;

  load(stream: BinaryStream, buildVersion: number) {
    stream.readFloat32Array(this.targetLocation);
    this.rotation = stream.readFloat32(); // in degrees
    this.angleOfAttack = stream.readFloat32(); // in degrees
    this.distance = stream.readFloat32();
    this.roll = stream.readFloat32();
    this.fieldOfView = stream.readFloat32(); // in degrees
    this.farClippingPlane = stream.readFloat32();
    this.nearClippingPlane = stream.readFloat32();
    this.cinematicName = stream.readNull();

    if (buildVersion > 131) {
      this.localPitch = stream.readFloat32();
      this.localYaw = stream.readFloat32();
      this.localRoll = stream.readFloat32();
    }
  }

  save(stream: BinaryStream, buildVersion: number) {
    stream.writeFloat32Array(this.targetLocation);
    stream.writeFloat32(this.rotation);
    stream.writeFloat32(this.angleOfAttack);
    stream.writeFloat32(this.distance);
    stream.writeFloat32(this.roll);
    stream.writeFloat32(this.fieldOfView);
    stream.writeFloat32(this.farClippingPlane);
    stream.writeFloat32(this.nearClippingPlane);
    stream.writeNull(this.cinematicName);

    if (buildVersion > 131) {
      stream.writeFloat32(this.localPitch);
      stream.writeFloat32(this.localYaw);
      stream.writeFloat32(this.localRoll);
    }
  }

  getByteLength(buildVersion: number) {
    let size = 41 + byteLengthUtf8(this.cinematicName);

    if (buildVersion > 131) {
      size += 12;
    }

    return size;
  }
}
