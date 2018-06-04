import Parameter from './parameter';

export default class ECA {
  constructor() {
    this.type = 0;
    this.group = -1;
    this.name = '';
    this.isEnabled = 0;
    this.parameters = [];
    this.ecas = [];
  }

  load(stream, version, isChildECA, functions) {
    this.type = stream.readInt32();

    if (isChildECA) {
      this.group = stream.readUint32();
    }

    this.name = stream.readUntilNull();
    this.isEnabled = stream.readInt32();

    let name = this.name.toLowerCase();
    let args = functions.triggerData[name];

    if (!args) {
      args = functions.external[name];

      if (!args) {
        throw new Error(`Unknown ECA "${this.name}"`);
      }
    }

    for (let i = 0, l = args.length; i < l; i++) {
      let parameter = new Parameter();

      parameter.load(stream, version, functions);

      this.parameters[i] = parameter;
    }

    if (version === 7) {
      for (let i = 0, l = stream.readUint32(); i < l; i++) {
        let eca = new ECA();

        eca.load(stream, version, true, functions);

        this.ecas[i] = eca;
      }
    }
  }

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
};
