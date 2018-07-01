import Parameter from './parameter';

/**
 * A function call in an expression.
 */
export default class SubParameters {
  /**
   *
   */
  constructor() {
    this.type = 0;
    this.name = '';
    this.beginParameters = 0;
    this.parameters = [];
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   * @param {TriggerData} triggerData
   */
  load(stream, version, triggerData) {
    this.type = stream.readInt32();
    this.name = stream.readUntilNull();
    this.beginParameters = stream.readInt32();

    if (this.beginParameters) {
      let args = triggerData.getFunction(this.type, this.name).args;

      for (let i = 0, l = args.length; i < l; i++) {
        let parameter = new Parameter();

        parameter.load(stream, version, triggerData);

        this.parameters[i] = parameter;
      }
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  save(stream, version) {
    stream.writeInt32(this.type);
    stream.write(`${this.name}\0`);
    stream.writeInt32(this.beginParameters);

    for (let parameter of this.parameters) {
      parameter.save(stream, version);
    }
  }

  /**
   * @param {number} version
   * @return {number}
   */
  getByteLength(version) {
    let size = 9 + this.name.length;

    if (this.parameters.length) {
      for (let parameter of this.parameters) {
        size += parameter.getByteLength(version);
      }
    }

    return size;
  }
}
