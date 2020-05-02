import BinaryStream from '../../../common/binarystream';
import Parameter from './parameter';
import TriggerData from './triggerdata';

/**
 * A function call in an expression.
 */
export default class SubParameters {
  type: number = 0;
  name: string = '';
  beginParameters: number = 0;
  parameters: Parameter[] = [];

  load(stream: BinaryStream, version: number, triggerData: TriggerData) {
    this.type = stream.readInt32();
    this.name = stream.readUntilNull();
    this.beginParameters = stream.readInt32();

    if (this.beginParameters) {
      let signature = triggerData.getFunction(this.type, this.name);

      if (!signature) {
        throw new Error(`SubParameters ${this.name}'s signature is unknown`);
      }

      let args = signature.args;

      for (let i = 0, l = args.length; i < l; i++) {
        let parameter = new Parameter();

        try {
          parameter.load(stream, version, triggerData);
        } catch (e) {
          throw new Error(`SubParameters "${this.name}": Parameter ${i}: ${e}`);
        }

        this.parameters[i] = parameter;
      }
    }
  }

  save(stream: BinaryStream, version: number) {
    stream.writeInt32(this.type);
    stream.write(`${this.name}\0`);
    stream.writeInt32(this.beginParameters);

    for (let parameter of this.parameters) {
      parameter.save(stream, version);
    }
  }

  getByteLength(version: number) {
    let size = 9 + this.name.length;

    if (this.parameters.length) {
      for (let parameter of this.parameters) {
        size += parameter.getByteLength(version);
      }
    }

    return size;
  }
}
