import Parameter from './parameter';

/**
 * An Event/Condition/Action.
 */
export default class ECA {
  /**
   *
   */
  constructor() {
    this.type = -1;
    this.group = -1;
    this.name = '';
    this.isEnabled = 0;
    this.parameters = [];
    this.ecas = [];
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   * @param {boolean} isChildECA
   * @param {TriggerData} triggerData
   */
  load(stream, version, isChildECA, triggerData) {
    this.type = stream.readInt32();

    if (isChildECA) {
      this.group = stream.readUint32();
    }

    this.name = stream.readUntilNull();
    this.isEnabled = stream.readInt32();

    let args = triggerData.getFunction(this.type, this.name).args;

    for (let i = 0, l = args.length; i < l; i++) {
      let parameter = new Parameter();

      parameter.load(stream, version, triggerData);

      this.parameters[i] = parameter;
    }

    if (version === 7) {
      for (let i = 0, l = stream.readUint32(); i < l; i++) {
        let eca = new ECA();

        eca.load(stream, version, true, triggerData);

        this.ecas[i] = eca;
      }
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  save(stream, version) {
    stream.writeInt32(this.type);

    if (this.group !== -1) {
      stream.writeInt32(this.group);
    }

    stream.write(`${this.name}\0`);
    stream.writeInt32(this.isEnabled);

    for (let parameter of this.parameters) {
      parameter.save(stream, version);
    }

    if (version === 7) {
      stream.writeUint32(this.ecas.length);

      for (let eca of this.ecas) {
        eca.save(stream, version);
      }
    }
  }

  /**
   * @param {number} version
   * @return {number}
   */
  getByteLength(version) {
    let size = 9 + this.name.length;

    if (this.group !== -1) {
      size += 4;
    }

    for (let parameter of this.parameters) {
      size += parameter.getByteLength(version);
    }

    if (version === 7) {
      size += 4;

      for (let eca of this.ecas) {
        size += eca.getByteLength(version);
      }
    }

    return size;
  }
}
