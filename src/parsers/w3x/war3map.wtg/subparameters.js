import Parameter from './parameter';

export default class SubParameters {
  constructor() {
    this.type = 0;
    this.name = '';
    this.parameters = [];
  }

  load(stream, version, functions) {
    this.type = stream.readInt32();
    this.name = stream.readUntilNull();
    this.beginParameters = stream.readInt32();

    if (this.beginParameters) {
      let name = this.name.toLowerCase();
      let args = functions.triggerData[name];

      if (!args) {
        args = functions.external[name];

        if (!args) {
          throw new Error(`Unknown SubParameters "${this.name}"`);
        }
      }

      for (let i = 0, l = args.length; i < l; i++) {
        let parameter = new Parameter();

        parameter.load(stream, version, functions);

        this.parameters[i] = parameter;
      }
    }
  }

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
};
